class WebContentGetter {
    constructor(webContentStructureId = '68307208') {
        this.endpointPrefix = `/o/headless-delivery/v1.0/content-structures/${webContentStructureId}/structured-contents`;
    }
  
    async _fetch(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "x-csrf-token": Liferay.authToken,
                    ...(options.headers || {}),
                },
            });
  
            if (!response.ok) {
                console.error(`HTTP Error: ${response.status} ${response.statusText}`);
                return null;
            }
  
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Fetch Error: ${error}`);
            return null;
        }
    }
  
    async getContents(parameters = {}) {
        const {
            page = 1,
            pageSize = 10,
            search = '',
            filters = {},
            fields = [],
            contentFieldsFiltersComparisonLogic = 'or',
        } = parameters;
  
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('pageSize', pageSize);
  
        if(fields.length > 0) {
          queryParams.append('fields', fields.join(','));
        }
  
        if (search) {
            queryParams.append('search', search);
        }
  
        const filterConditions = [];
        const {
            publishDateFrom,
            publishDateTo,
            contentFields = [],
            category = [],
        } = filters;
  
        if (publishDateFrom) {
            filterConditions.push(`datePublished ge ${publishDateFrom}T00:00:00Z`);
        }
  
        if (publishDateTo) {
            filterConditions.push(`datePublished le ${publishDateTo}T23:59:59Z`);
        }
  
  
        if (Array.isArray(contentFields) && contentFields.length > 0) {
            const contentFieldConditions = contentFields.filter((condition) => {
              return condition.value.trim().length > 0
            }).map(
                ({ field, rule, value }) => {

                    if(rule === 'eq') {
                        return `contentFields/${field} eq '${value}'`
                    } else if(rule === 'contains') {
                        return `contains(contentFields/${field},'${value}') `
                    }

                }
            )
            
            filterConditions.push(['(' + contentFieldConditions.join(` ${contentFieldsFiltersComparisonLogic} `) + ')']);

        }
  
        const categories = Array.isArray(category) ? category : [category];
        if (categories.length > 0) {
            const categoryConditions = categories.map(
                (categoryId) => `taxonomyCategoryIds/any(t:t eq ${categoryId})`
            );
            filterConditions.push(...categoryConditions);
        }
  
        if (filterConditions.length > 0) {
            queryParams.append('filter', filterConditions.join(` and `));
        }
  
        const requestUrl = `${this.endpointPrefix}?${queryParams.toString()}`;
        console.log(`Request URL: ${requestUrl}`);
        return await this._fetch(requestUrl, { method: 'GET' });
    }
    
}


// export default WebContentGetter;
// // Usage
const testValue = 'rondonópolis';
const handler = new WebContentGetter('10083813');

const contents = await handler.getContents({
    page: 1,
    pageSize: 200,
    contentFieldsFiltersComparisonLogic: 'or',
    filters: {
        publishDateFrom: '2000-01-01',
        publishDateTo: '2024-12-31',
        contentFields: [
            { field: 'Cidade', rule: 'eq', value: testValue },
            { field: 'Cidade', rule: 'eq', value: testValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '') },
        ],
    },
});

if (contents) {
    console.log(contents);
} else {
    console.error('Failed to fetch contents.');
}


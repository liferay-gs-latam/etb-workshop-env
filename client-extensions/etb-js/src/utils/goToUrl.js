const goToUrl = (url) => {
    if(Liferay && Liferay.util && Liferay.util.navigate) {
        Liferay.util.navigate(url)
    } else {
        document.location.href = url;
    }
}

export default goToUrl;
import 'babel-polyfill';
import Swiper from 'swiper/bundle';
import normalizeString from './utils/normalizeString.js';
import LocalStoragePersistanceUtil from './utils/LocalStoragePersistanceUtil.js';
import goToUrl from './utils/goToUrl.js';


(function (window) {

	if (!window.ETB) {
		window.ETB = {
			vendors: {
				Swiper
			},
			utils: {
				normalizeString,
				LocalStoragePersistanceUtil,
				goToUrl,
			},
			modules: {
				
			}
		};
	}
})(window);

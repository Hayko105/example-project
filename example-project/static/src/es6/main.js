import { polyfillsCheck } from './_polyfillsCheck';

import 'promise-polyfill/src/polyfill';
import './_themeFilters';

const bootstrap = () => {
    //here will be your JS/ES code
    console.log('Test!');
}

polyfillsCheck(bootstrap);

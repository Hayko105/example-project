export function getUrlVars() {
    var vars = {};
    var url = new URL(window.location.href);
    var parts = window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        // let valueNew = value.replace(/\+|%20/gi, ' ');//replacing '+' and '%20'
        // let decodeValue = decodeURI(value);
        // let valueCapitalized = decodeValue.charAt(0).toUpperCase() + decodeValue.slice(1);
        let param = url.searchParams.get(key);
        let paramCapitalized = param.charAt(0).toUpperCase() + param.slice(1);
        vars[key.toLowerCase()] = paramCapitalized;
    });
    return vars;
}

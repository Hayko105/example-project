export const getCookie = (cname) => {
    /*!
    * Copyright (c) 2012-2014 Roman Shtylman <shtylman@gmail.com>
    * Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>
    * Released under the MIT license.
    * https://github.com/jshttp/cookie
    */

    var obj = {};
    var pairSplitRegExp = /; */;
    var pairs = document.cookie.split(pairSplitRegExp);

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var eq_idx = pair.indexOf('=');

        // skip things that don't look like key=value
        if (eq_idx < 0) {
            continue;
        }

        var key = pair.substr(0, eq_idx).trim();
        var val = pair.substr(++eq_idx, pair.length).trim();

        // quoted values
        if ('"' === val[0]) {
            val = val.slice(1, -1);
        }

        // only assign once
        if (undefined === obj[key]) {
            try {
                obj[key] = decodeURIComponent(val);
            } catch (e) {
                obj[key] = val;
            }
        }
    }

    return obj[cname] || '';
};

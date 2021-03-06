export const once = (fn, context) => {
    var result;
    return () => {
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
        return result;
    };
};

export function getVisibleEl(selector) {
    return Array.from(document.querySelectorAll(selector)).find(step => !isHidden(step));
}

export  function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}

export const scrollToPage = (element, duration) => {
    const getElementY = (query) => {
        return window.pageYOffset + document.querySelector(query).getBoundingClientRect().top;
    };

    const doScrolling = (element, duration) => {
        var startingY = window.pageYOffset;
        var elementY = getElementY(element);
        // If element is close to page's bottom then window will scroll only to some position above the element.
        var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY;
        var diff = targetY - startingY;
        var easing = function (t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };
        var start;

        if (!diff) return;

        // Bootstrap our animation - it will get called right before next frame shall be rendered.
        window.requestAnimationFrame(function step(timestamp) {
            if (!start) start = timestamp;
            // Elapsed miliseconds since start of scrolling.
            var time = timestamp - start;
            // Get percent of completion in range [0, 1].
            var percent = Math.min(time / duration, 1);
            // Apply the easing.
            // It can cause bad-looking slow frames in browser performance tool, so be careful.
            percent = easing(percent);

            window.scrollTo(0, startingY + diff * percent);

            // Proceed with animation as long as we wanted it to.
            if (time < duration) {
                window.requestAnimationFrame(step);
            }
        })
    };
    doScrolling(element, duration);
};

export class Storage {
    static setValue(key, val) {
        window.localStorage.setItem(key, val);
    }
    static set(key, json) {
        Storage.setValue(key, JSON.stringify(json));
    }
    static get(key) {
        var value = JSON.parse(Storage.getValue(key));
        return value;
    }
}
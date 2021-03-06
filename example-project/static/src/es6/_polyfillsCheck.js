export const polyfillsCheck = bootstrap => {
    if (
        // OTHERS
        'Symbol' in window &&
        'fetch' in window &&
        // ARRAYS
        'entries' in Array.prototype &&
        'from' in Array &&
        'find' in Array.prototype &&
        'findIndex' in Array.prototype &&
        'includes' in Array.prototype &&
        'keys' in Array.prototype &&
        'values' in Array.prototype &&
        // OBJECTS
        'assign' in Object &&
        'entries' in Object &&
        'values' in Object &&
        // STRINGS
        'endsWith' in String.prototype &&
        'includes' in String.prototype &&
        'startsWith' in String.prototype
    ) {
        document.addEventListener('DOMContentLoaded', bootstrap)
    } else {
        import(/* webpackChunkName: "polyfills" */ './_polyfills')
            .then(() => bootstrap());
    }
}
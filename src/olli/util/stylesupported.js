/*
 * isStyleSupported
 * Detect support for CSS properties and their assignable values
 * @param {String} prop
 * @param {String} value (optional)
 * @return {Boolean}
 * adapted from https://github.com/ryanmorr/is-style-supported
 */
import {VENDOR_PREFIXES,DOC} from "../const.js";
import {isUndefined} from "../helper.js";

export default (function () {
    var style,
        camelRe = /-([a-z]|[0-9])/ig,
        cache = {};

    // Convert CSS notation (kebab-case) to DOM notation (camelCase)
    function toCamelCase(prop) {
        return prop.replace(camelRe, function replaceChar(all, char) {
            return (char + '').toUpperCase();
        });
    }
    function getPrefixed(prop) {
        if (isUndefined(cache[prop])) {
            var res = null
                ,camel = toCamelCase(prop)
                ,capitalized = camel.charAt(0).toUpperCase() + camel.slice(1)
                ,support = false;
            if (camel in style) {
                res = {css:prop,dom:camel};
            }
            for (var i = 0,length = VENDOR_PREFIXES.length - 1; res===null && i < length; i++) {
                camel = VENDOR_PREFIXES[i] + capitalized;
                if (camel in style) {
                    res = {css:'-' + VENDOR_PREFIXES[i].toLowerCase() + '-' + prop,dom:camel};
                }
            }
            cache[prop] = res;
        }
        return cache[prop];
    }
    return function isStyleSupported(prop, value) {
        style = style || DOC.createElement('div').style;
        var prefixed = getPrefixed(prop);
        if (prefixed === null || isUndefined(value))
            return (prefixed !== null);
        style.cssText = prefixed.css + ':' + value;
        return (style[prefixed.dom]!=='');
    };
})();

/**
 * Created by darkwolf on 19.12.2015.
 */
import {isArray,isNumber,isString,isStringEmpty,isUndefined,insertCSS,insertElement,dePrefix} from "../util.js";
import {$StyleRule} from "../cssom/types.js";
/*
Object.defineProperty($StyleRule.fn, 'selectorText', {get: function() {
    if (!this[0]) return "";
    return dePrefix(this[0].selectorText);
}});

$StyleRule.fn.selector = function() {
    if (!this[0]) return [];
    return this.selectorText.split(new RegExp("\\s*,\\s*"));
};
*/

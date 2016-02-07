/**
 * Created by darkwolf on 20.12.2015.
 */
import {isArray,isNumber,isString,isStringEmpty,isUndefined,insertCSS,insertElement,dePrefix} from "../util.js";
import {$MediaRule} from "../cssom/types.js";
/*
Object.defineProperty($MediaRule.fn, 'selectorText', {get: function() {
    if (!this[0]) return "";
    return "@media";
}});

$MediaRule.fn.selector = function() {
    if (!this[0]) return [];
    return ["@media"];
};
*/
Object.defineProperty($MediaRule.fn, 'conditionText', {get: function() {
    if (!this[0]) return "";
    return dePrefix(this[0].conditionText);
}});

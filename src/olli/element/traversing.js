/**
 * Created by darkwolf on 10.01.2016.
 */
import {register,OlliError,isString,map} from "../helper.js";
import {$Element,$NullElement} from "../types/base.js";
import SelectorMatcher from "../util/selectormatcher.js";

register($Element,{
    next: "nextSibling",

    prev: "previousSibling",

    nextAll: "nextSibling",

    prevAll: "previousSibling",

    closest: "parentNode"

}, function(methodName, propertyName)  {return function(selector) {

    if (selector && !isString(selector)) throw new OlliError(methodName, arguments);

    var all = methodName.slice(-3) === "All",
        matcher = SelectorMatcher(selector),
        nodes = all ? [] : null,
        it = this[0];
    // method closest starts traversing from the element itself
    // except no selector was specified where it returns parent
    if (!matcher || methodName !== "closest") {
        it = it[propertyName];
    }

    for (; it; it = it[propertyName]) {
        if (it.nodeType === 1 && (!matcher || matcher(it))) {
            if (!all) break;

            nodes.push(it);
        }
    }

    return all ? map.call(nodes, $Element) : $Element(it);
}}, function(methodName)  {return function()  {return methodName.slice(-3) === "All" ? [] : new $NullElement()}});

$Element.fn.parent = function() {return this.closest();};
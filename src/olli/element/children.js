/**
 * Created by darkwolf on 10.01.2016.
 */
import {register,OlliError,isUndefined,isString,isNumber,map,filter} from "../helper.js";
import {$Element,$NullElement} from "../types/base.js";
import SelectorMatcher from "../util/selectormatcher.js";

register($Element,{
    child: false,

    children: true

}, function(methodName, all)  {return function(selector) {
    if (all) {
        if (selector && !isString(selector)) throw new OlliError(methodName, arguments);
    } else {
        if (isUndefined(selector))
            selector = 0;
        else if (!isNumber(selector)) throw new OlliError(methodName, arguments);
    }

    var node = this[0],
        matcher = SelectorMatcher(selector),
        children = node.children;

    if (all) {
        if (matcher) children = filter.call(children, matcher);

        return map.call(children, $Element);
    } else {
        if (selector < 0)
            selector = children.length + selector;

        return $Element(children[selector]);
    }
}}, function(methodName, all)  {return function()  {return all ? [] : new $NullElement()}});

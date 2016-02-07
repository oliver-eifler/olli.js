/**
 * Created by darkwolf on 10.01.2016.
 */
import {register,every,isUndefined,isFunction,isArray,isString} from "../helper.js";
import {$Element} from "../types/base.js";

register($Element,{value: function(content) {
    var $this = this,
        node = $this[0],
        name;

    if (isUndefined(content)) {
        switch (node.tagName) {
            case "SELECT":
                return ~node.selectedIndex ? node.options[node.selectedIndex].value : "";

            case "OPTION":
                name = node.hasAttribute("value") ? "value" : "text";
                break;

            default:
                name = node.type && "value" in node ? "value" : "innerHTML";
        }

        return node[name];
    } else if ((content instanceof $Element) || isArray(content)) {
        return $this.set("").append(content);
    }

    if (isFunction(content)) {
        content = content($this);
    }

    if (!isString(content)) {
        content = content == null ? "" : String(content);
    }

    switch (node.tagName) {
        case "INPUT":
        case "OPTION":
        case "TEXTAREA":
            name = "value";
            break;

        case "SELECT":
            // selectbox has special case
            if (every.call(node.options, function (o) {
                    return !(o.selected = o.value === content)
                })) {
                node.selectedIndex = -1;
            }
            // return earlier
            return $this;

        default:
            name = "innerHTML";
    }

    return $this.set(name, content);
}},null,function() {return function(){if (arguments.length) return this;}}
);

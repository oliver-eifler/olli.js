/**
 * Created by darkwolf on 08.11.2015.
 */
import {every,isFunction,isArray,isString} from "../helper.js";
import {$Element} from "../types/base.js";

export default function ($element, content) {
    var node = $element[0], name;

    if (content === void 0) {
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
        return $element.set("").append(content);
    }

    if (isFunction(content)) {
        content = content($element);
    }

    if (!isString(content)) {
        content = content == null ? "" : String(content);
    }

    switch (node.tagName) {
        case "INPUT":
        case "OPTION":
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
            return $element;

        case "TEXTAREA":
            // for IE use innerText for textareabecause it doesn't trigger onpropertychange
            name = "value";
            break;

        default:
            name = "innerHTML";
    }

    return $element.set(name, content);
}

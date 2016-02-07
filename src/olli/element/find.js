import {map,register} from "../helper.js";
import {$Element} from "../types/base.js";

var rescape = /'|\\/g;
/* $Element.matches */
register($Element, {
        find: false,
        findAll: true
    }, function (methodName, all) {
        return function (selector) {
            var node = this[0], fn = node["querySelector" + (all ? "All" : "")], result, nid, old = true;
            if (!fn)
                return all ? [] : $Element();
            if (node !== node.ownerDocument.documentElement) {
                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                if ((old = node.getAttribute("id"))) {
                    nid = old.replace(rescape, "\\$&");
                } else {
                    nid = "<%= prop('DOM') %>";
                    node.setAttribute("id", nid);
                }
                nid = "[id='" + nid + "'] ";
                selector = nid + selector.split(",").join("," + nid);
            }
            result = fn.call(node, selector);
            if (!old) node.removeAttribute("id");
            return all ? map.call(result, $Element) : $Element(result);
            //return all?$NodeList(result):$Element(result);
        }
    }, function () {
        return function () {
            return all ? [] : this;
        }
    }
);

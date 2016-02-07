/**
 * Created by darkwolf on 08.11.2015.
 */
import {$Element} from "../types/base.js";
import {Lib} from "../core.js";
import {register,isFunction,isArray,isString,isStringEmpty,slice,OlliError} from "../helper.js";
import "../document/create.js";

register($Element, {
    after: [true, function (node, relatedNode) {
        node.parentNode.insertBefore(relatedNode, node.nextSibling);
    }],

    before: [true, function (node, relatedNode) {
        node.parentNode.insertBefore(relatedNode, node);
    }],

    prepend: [false, function (node, relatedNode) {
        node.insertBefore(relatedNode, node.firstChild);
    }],

    append: [false, function (node, relatedNode) {
        node.appendChild(relatedNode);
    }],

    replace: [true, function (node, relatedNode) {
        node.parentNode.replaceChild(relatedNode, node);
    }],

    remove: [true, function (node) {
        node.parentNode.removeChild(node);
    }]
}, function (methodName, requiresParent, strategy) {
    return function () {
        var contents = slice.call(arguments, 0),
            $this = this,
            node = $this[0];

        if (requiresParent && !node.parentNode) return $this;

        // the idea of the algorithm is to use document fragment to
        // invoke manipulation using a single method call
        var fragment = node.ownerDocument.createDocumentFragment();

        contents.forEach(function (content) {
            if (isFunction(content)) {
                content = content($this);
            }

            if (isString(content)) {
                content = Lib.createAll(content);
            } else if (content instanceof $Element) {
                content = [content];
            }

            if (isArray(content)) {
                content.forEach(function (el) {
                    fragment.appendChild(el[0]);
                });
            }
        });

        strategy(node, fragment);

        return $this;
    }
}, function () {return function () {return this;}}
);

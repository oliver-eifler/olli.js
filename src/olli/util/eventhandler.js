/**
 * Olli Lib
 * This file is part of the Olli-Framework
 * Copyright (c) 2012-2015 Oliver Jean Eifler
 *
 * @version 0.0.1
 * @link http://www.oliver-eifler.info/
 * @author Oliver Jean Eifler <oliver.eifler@gmx.de>
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 *
 * EventHandler;)
 */
import {WIN} from "../const.js";
import {isString} from "../helper.js";
import {$Element} from "../types/base.js";
import SelectorMatcher from "../util/selectormatcher.js";
import EventHooks from "../util/eventhooks.js";

function getProperty(name, e, type, node, target, currentTarget) {
    if (typeof name === "number") {
        var args = e["<%= prop() %>"];
        return args ? args[name] : void 0;
    }
    if (isString(name)) {
        switch (name) {
            case "type":
                return type;
            case "event":
                return e;
            case "defaultPrevented":
                // IE8 and Android 2.3 use returnValue instead of defaultPrevented
                return "defaultPrevented" in e ? e.defaultPrevented : e.returnValue === false;
            case "target":
                return $Element(target);
            case "currentTarget":
                return $Element(currentTarget);
            case "relatedTarget":
                return $Element(e.relatedTarget || e[(e.toElement === node ? "from" : "to") + "Element"]);
        }

        var value = e[name] || name;
        if (typeof value === "function") {
            return function () {
                return value.apply(e, arguments)
            };
        }
        return value;
    }
    return name;
}

function handler(element, type, selector, props, callback, once) {
    var node = element[0]
        , hook = EventHooks[type]
        , matcher = SelectorMatcher(selector, node);

    var handler = function (e) {
        e = e || WIN.event;
        if (handler.skip === type) return;

        // srcElement can be null in legacy IE when target is document
        var target = e.target || e.srcElement || node.ownerDocument.documentElement,
            currentTarget = matcher ? matcher(target) : node,
            args = props || [];

        if (!currentTarget)
            return;
        // off callback even if it throws an exception later
        if (once) el.off(type, callback);

        if (props) {
            args = args.map(function (name) {
                return getProperty(
                    name, e, type, node, target, currentTarget)
            });
        }
        /*else {
         args = slice.call(e["<%= prop() %>"] || [0], 1);
         }*/

        if (callback.apply(element, args) === false) {
            e.preventDefault();
        }
    };
    if (hook) handler = hook(handler, type) || handler;

    handler.type = type;
    handler.callback = callback;
    handler.selector = selector;

    return handler;
}
handler.skip = null;

export default handler;
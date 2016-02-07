import {isString,isFunction,OlliError,safeCall,register} from "../helper.js";
import {$BaseElement} from "../types/base.js";
import EventHooks from "../util/eventhooks.js";
import EventHandler from "../util/eventhandler.js";
import EventCreators from "../util/eventcreators.js";

register($BaseElement, {
        on: false,
        once: true
    }, function (methodName, once) {
        return function (type, selector, args, callback) {
            var $this = this
                , node = $this[0]
                , creator = EventCreators[type] || false;
            /*check arguments*/
            if (!isString(type))
                throw new OlliError(methodName, arguments);
            if (isFunction(args)) {
                callback = args;
                if (isString(selector)) {
                    args = null;
                } else {
                    args = selector;
                    selector = null;
                }
            }
            if (isFunction(selector)) {
                callback = selector;
                selector = null;
                args = null;
            }

            if (!isFunction(callback)) {
                throw new OlliError(methodName, arguments);
            }
            /*!Create Stuff for Custom Event,if available*/
            if (isFunction(creator) && !creator($this)) {
                return $this;
            }
            var handler = EventHandler($this, type, selector, args, callback, once);

            node.addEventListener(handler._type || type, handler, !!handler.capturing);
            // store event entry
            $this._["<%= prop('handler') %>"].push(handler);


            return $this;
        }
    }, function () {
        return function () {
            return this;
        }
    }
);

register($BaseElement, {
    off: function (type, selector, callback) {
        if (!isString(type)) throw new OlliError("off", arguments);

        if (callback === undefined) {
            if (isString(selector)) {
                callback = undefined;
            }
            else if (isFunction(selector)) {
                callback = selector;
                selector = undefined;
            }
            else {
                callback = undefined;
                selector = undefined;
            }
        }

        var $this = this, node = $this[0];

        $this._["<%= prop('handler') %>"] = this._["<%= prop('handler') %>"].filter(function (handler) {
            var skip = type !== handler.type;

            skip = skip || selector && selector !== handler.selector;
            skip = skip || callback && callback !== handler.callback;

            if (skip) return true;

            type = handler._type || handler.type;
            node.removeEventListener(type, handler, !!handler.capturing);
        });

        return $this;
    }
}, null, function () {
    return function () {
        return this;
    }
});


register($BaseElement, {
    fire: function (type) {
        var node = this[0],
            e, eventType, canContinue;

        if (isString(type)) {
            var hook = EventHooks[type],
                handler = {};

            if (hook) handler = hook(handler) || handler;

            eventType = handler._type || type;
        } else {
            throw new OlliError("fire", arguments);
        }
        //e = node.ownerDocument.createEvent("HTMLEvents");
        //e = (node.window && node.window === node)?node.document.createEvent("HTMLEvents"):node.ownerDocument.createEvent("HTMLEvents");
        e = ((node.window && node.window === node) ? node.document : node.ownerDocument)["createEvent"]("HTMLEvents");
        e["<%= prop() %>"] = arguments;
        e.initEvent(eventType, true, true);
        canContinue = node.dispatchEvent(e);
        // call native function to trigger default behavior
        if (canContinue && node[type]) {
            // prevent re-triggering of the current event
            handler.skip = type;

            safeCall(node, type);

            handler.skip = null;
        }

        return this;
    }
}, null, function () {
    return function () {
        return this;
    }
});


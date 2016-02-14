import {DOC,HTML} from "../const.js";
import {isFunction} from "../helper.js";
import {sandboxBody} from "../util/sandbox.js";
import {$Element} from "../types/base.js";
import {Lib} from "../core.js";
import EventHooks from "../util/eventhooks.js";
import EventCreators from "../util/eventcreators.js";

var type = "resize:font";
var fontNode = (function() {
    var node;
    function createNode() {
        node = DOC.createElement('div');
        node.id="<%= prop('fontsize') %>";
        $Element(node).css({
            "display":"inline-block"
            ,"position":"absolute"
            ,"width":"1em"
            ,"height":"1em"
            ,"transition":"font-size 1ms linear"
        });
        sandboxBody().appendChild(node);
        return node;
    }
    return function() {
        return node || createNode();
    }
})();
var fontNodeEvent = (function() {
    var enabled;
    function eventHandler() {
        var event = DOC.createEvent('HTMLEvents');
        event.initEvent(type,true,true);
        event.fontHeight = this[0].clientHeight;
        HTML.dispatchEvent(event);
    }
    return function() {
        if (!enabled) {
            $Element(fontNode()).on("transitionend",eventHandler);
            enabled = true;
        }
        return enabled;
    }
})();


Lib.baseFontHeight = function() {
    return fontNode().clientHeight;
};
/*!add custom event creator*/
EventCreators[type] = function(node) {
    var el = node[0];
    /*!only for window and <html> if event is supported*/
    if (isFunction(EventHooks["transitionend"]) && ((el.window && el.window === el) || el.ownerDocument.documentElement===el)) {
        return fontNodeEvent();
    }
    return false;
};

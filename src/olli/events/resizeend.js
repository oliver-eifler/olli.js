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
 * window.onresize fix and resize:end event
 */
import {WIN,DOC,HTML} from "../const.js";
import EventCreators from "../util/eventcreators.js";

var width = 0,
    height = 0,
    type = "resize:end",
    event = function () {
        var event = DOC.createEvent('Event');
        event.initEvent(type, true, true);
        return event;
    }(),
    orientation = getOrientation(),
    timeoutid = null;

function dispatch() {
    event.width = width;
    event.height = height;
    return HTML.dispatchEvent(event);
}
function getOrientation() {
    return (WIN.orientation && WIN.orientation !== undefined) ? Math.abs(+WIN.orientation) % 180 : 0;
}


function handler(event) {
    var curWidth = WIN.innerWidth,
        curHeight = WIN.innerHeight;
    if (curWidth == width && curHeight == height) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
    }
    width = curWidth;
    height = curHeight;
    var curOrientation = getOrientation();
    if (curOrientation !== orientation) {
        dispatch();
        return orientation = curOrientation;
    }
    clearTimeout(timeoutid);
    return timeoutid = setTimeout(dispatch, 100);
}
WIN.addEventListener("resize", handler, false);

/*!add custom event creator*/
EventCreators[type] = function (node) {
    var el = node[0];
    /*!only for window and <html>*/
    return ((el.window && el.window === el) || el.ownerDocument.documentElement===el);
};

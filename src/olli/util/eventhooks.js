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
 * Event Hooks
 */
import {HTML,DOC} from "../const.js";

var hooks = {};
if ("onfocusin" in HTML) {
    hooks.focus = function (handler) {
        handler._type = "focusin"
    }
    hooks.blur = function (handler) {
        handler._type = "focusout"
    }
} else {
    // firefox doesn't support focusin/focusout events
    hooks.focus = hooks.blur = function (handler) {
        handler.capturing = true
    }
}
if (DOC.createElement("input").validity) {
    hooks.invalid = function (handler) {
        handler.capturing = true
    }
}
hooks.blubber = function (handler) {
    handler._type = "click"
}
//!hook for transition end;

var transitions = {
    'transition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'otransitionend'
};
for (var t in transitions) {
    if (HTML.style[t] !== undefined) {
        hooks.transitionend = function (handler) {
            handler._type = transitions[t]
        };
        break;
    }
}

export default hooks;
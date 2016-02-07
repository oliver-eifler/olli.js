/**
 * Olli Lib
 * This file is part of the Olli-Framework
 * Copyright (c) 2012-2015 Oliver Jean Eifler
 *
 * This function listens for specified event type on a specified object and
 * triggers yet another throttled event with the specified name.
 * This helps with performance of rapidly firing events like `resize`.
 * Taken from MDN: https://developer.mozilla.org/en-US/docs/Web/Events/resize
 *
 * @param {string} type
 * @param {string} name
 * @param {undefined|object} [obj=window]
 */
export default function throttleEvent (type, name, obj) {
    obj = (obj || window);
    var running = false;
    var func = function () {
        if (running) {
            return;
        }
        running = true;
        requestAnimationFrame(function () {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    obj.addEventListener(type, func);
}

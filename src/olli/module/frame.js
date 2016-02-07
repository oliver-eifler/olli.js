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
 * RequestAnimationFrame & Polyfill
 */
import {WIN,VENDOR_PREFIXES} from "../const.js";
import {Lib} from "../core.js";

    var raf = WIN.requestAnimationFrame,
        caf = WIN.cancelAnimationFrame,
        fastRaf= false,
        lastTime = 0;
    if (!(raf && caf))
    {
        VENDOR_PREFIXES.forEach(function(prefix) {
            prefix = prefix.toLowerCase();

            raf = raf || WIN[prefix + "RequestAnimationFrame"];
            caf = caf || WIN[prefix + "CancelAnimationFrame"] || WIN[prefix + "CancelRequestAnimationFrame"];
        });
    }
    fastRaf = raf;
    if (!raf || !caf) {
      raf = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var lastTime = currTime + timeToCall;
        return WIN.setTimeout(function() {callback(currTime + timeToCall);}, timeToCall);
      };
      caf = function(id) {
        WIN.clearTimeout(id);
      };
    }
    fastRaf = fastRaf || raf;


    if (fastRaf == raf)
        Lib.requestFrame = raf;
    else
        Lib.requestFrame = function(callback,cancelable) {
            return (cancelable === false)?fastRaf(callback):raf(callback);
        };

    Lib.cancelFrame = caf;


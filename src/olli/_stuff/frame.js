/*@exclude*/
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
 _.define("frame",function(global,undefined) {
eval(_.include(["consts","util","core"]));
/*@endexclude*/

    var frame$raf = WIN.requestAnimationFrame,
        frame$caf = WIN.cancelAnimationFrame,
        frame$fastRaf= false,
        frame$lastTime = 0;
    if (!(frame$raf && frame$caf))
    {
        VENDOR_PREFIXES.forEach(function(prefix) {
            prefix = prefix.toLowerCase();

            frame$raf = frame$raf || WIN[prefix + "RequestAnimationFrame"];
            frame$caf = frame$caf || WIN[prefix + "CancelAnimationFrame"] || WIN[prefix + "CancelRequestAnimationFrame"];
        });
    }
    frame$fastRaf = frame$raf;
    if (!frame$raf || !frame$caf) {
      frame$raf = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id =
        frame$lastTime = currTime + timeToCall;
        return WIN.setTimeout(function() {callback(currTime + timeToCall);}, timeToCall);
      };
      cancelAnimationFrame = function(id) {
        WIN.clearTimeout(id);
      };
    }
    frame$fastRaf = frame$fastRaf || frame$raf;


    if (frame$fastRaf == frame$raf)
        $Lib.requestFrame = frame$raf;
    else
        $Lib.requestFrame = function(callback,cancelable) {
            return (cancelable === false)?frame$fastRaf(callback):frame$raf(callback);
        };

    $Lib.cancelFrame = frame$caf;

/*@exclude*/
});
/*@endexclude*/
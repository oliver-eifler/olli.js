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
 * window.onresize fix and resize:end event
 */
_.define("resizeend",function(global,undefined) {
eval(_.include(["consts","util","event"]));
/*@endexclude*/

    var resizeend$width = 0,
        resizeend$height = 0,
        resizeend$type = "resize:end",
        resizeend$event = function() {
            var event = DOC.createEvent('Event');
            event.initEvent(resizeend$type,true,true);
            return event;
        }(),
        resizeend$orientation = resizeend$getOrientation(),
        resizeend$timeout = null;

    function resizeend$dispatch() {
        return HTML.dispatchEvent(resizeend$event);
    }
    function resizeend$getOrientation() {
      return (WIN.orientation && WIN.orientation !== undefined) ? Math.abs(+WIN.orientation) % 180 : 0;
    }


    function resizeend$handler(event) {
        var width = WIN.innerWidth,
            height = WIN.innerHeight;
        if (width == resizeend$width && height == resizeend$height) {
            event.preventDefault();
			event.stopImmediatePropagation();
            return;
        }
        resizeend$width = width;
        resizeend$height = height;
        var orientation = resizeend$getOrientation;
        if (orientation !== resizeend$orientation)
        {
            resizeend$dispatch();
            return resizeend$orientation = orientation;
        }
        clearTimeout(resizeend$timeout);
        return resizeend$timeout = setTimeout(resizeend$dispatch, 100);
    }
    WIN.addEventListener("resize",resizeend$handler,false);

/*!add custom event creator*/
event$creators[resizeend$type] = function(node) {
    var el = node[0];
    /*!only for window and <html>*/
    return ((el.window && el.window === el) || el.nodeType===1);
};

/*@exclude*/
});
/*@endexclude*/
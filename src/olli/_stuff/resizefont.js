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
 * get BaseFontSize and resize:font event
 */
 _.define("resizefont",function(global,undefined) {
eval(_.include(["consts","util","core","css","event"]));
/*@endexclude*/

var resizefont$element = null
    ,resizefont$event$type = "resize:font";
function resizefont$element$create() {
    if (!resizefont$element)
    {
        var e = DOC.createElement('div');
        e.id="<%= prop('bfs') %>";
        $Element(e).css({
            "display":"inline-block",
            "visibility":"hidden",
            "position":"absolute",
            "z-index":"-1",
            "width":"1em",
            "height":"1em",
            "transition":"font-size 1ms linear"
        })._["<%= prop('fontresize') %>"] = false;
        DOC.body.appendChild(e);
        resizefont$element = e;
    };
    return resizefont$element;
}
function resizefont$transitionend() {
    var event = DOC.createEvent('HTMLEvents');
    event.initEvent(resizefont$event$type,true,true);
    event.fontHeight = this[0].clientHeight;
    HTML.dispatchEvent(event);
}

$Lib.baseFontHeight = function() {
    return resizefont$element$create().clientHeight;
}
/*!add custom event creator*/
event$creators[resizefont$event$type] = function(node) {
    var el = node[0];
    /*!only for window and <html> if event is supported*/
    if ($isFunction(event$hooks["transitionend"]) && ((el.window && el.window === el) || el.nodeType===1)) {
        var e = $Element(resizefont$element$create());
        if (!$isFunction(e._["<%= prop('fontresize') %>"])) {
            e._["<%= prop('fontresize') %>"] = resizefont$transitionend;
            e.on("transitionend",resizefont$transitionend);
        }
        return true;
    }
    return false;
};
/*@exclude*/
});
/*@endexclude*/
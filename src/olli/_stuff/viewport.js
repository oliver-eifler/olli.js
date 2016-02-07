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
 * class functions for $Element;)
 */
_.define("viewport",function(global,undefined) {
eval(_.include(["consts","util","core"]));
/*@endexclude*/

var $viewport$scrollbar$element = null;
function $viewport$scrollbarSize() {
    var e = $viewport$scrollbar$element || createlement();
    return {
      height:100 - e.clientHeight,
      width:100 - e.clientWidth
    }
    function createlement() {
        var e = DOC.createElement('div');
        e.id="<%= prop('sbs') %>";
        e.style.cssText = 'position:absolute;overflow:scroll;top:-100px;left:-100px;width:100px;height:100px;';
        DOC.body.appendChild(e);
        $viewport$scrollbarElement = e;
        return e;
    }
}
function $viewport$scrollbarVisible(node) {
    var y = node.scrollHeight > node.clientHeight,
        x = node.scrollWidth > node.clientWidth,
        styles = $getComputedStyle(node),
        overflow = styles["overflow"] || "",
        overflowx = styles["overflowX"] || "",
        overflowy = styles["overflowY"] || "",
        scroll = new RegExp('^(scroll)$'),
        hidden = (node.ownerDocument.documentElement === node || node.ownerDocument.body === node)?new RegExp('^(hidden)$'):new RegExp('^(visible|hidden)$');
    //html,body => visible = auto //
    if (styles["display"]==="none") {return {x:null,y:null}}
    if (hidden.test(overflow)) {y=x=false;}
    else if (scroll.test(overflow)) {y=x=true;}

    if (hidden.test(overflowy)) {y=false;}
    else if (scroll.test(overflowy)) {y=true;}

    if (hidden.test(overflowx)) {x=false;}
    else if (/^(scroll)$/.test(overflowx)) {x=true;}

    return {
        y: y,
        x: x
    }
}
function $viewport$size(node)
{
    var sbsize = $viewport$scrollbarSize(),
        sbvisible = $viewport$scrollbarVisible(node),
        minwidth = width = maxwidth = node.clientWidth,
        minheight = height = maxheight = node.clientHeight;
        //calculate widths
        if (sbvisible.y)
            maxwidth+=sbsize.width;
        else
            minwidth-=sbsize.width;

        //calculate height
        if (sbvisible.x)
            maxheight+=sbsize.height;
        else
            minheight-=sbsize.height;

        return {
            width: width,
            height: height,
            minWidth: minwidth,
            minHeight: minheight,
            maxWidth: maxwidth,
            maxHeight: maxheight,
        }
}
$Lib.scrollbarSize = $viewport$scrollbarSize;

$Lib$register($Element,{scrollbar: function() {
        return $viewport$scrollbarVisible(this[0]);
    }
},null, function() {return function() {return {x:null,y:null};}});

$Lib$register($Element,{viewport: function() {
        return $viewport$size(this[0]);
    }
},null, function() {return function() {return {width:0,height:0,minWidth:0,minHeight:0,maxWidth:0,maxHeight:0};}});

/*@exclude*/
});
/*@endexclude*/
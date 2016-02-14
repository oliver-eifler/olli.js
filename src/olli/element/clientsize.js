import {DOC} from "../const.js";
import {getComputedStyle,register} from "../helper.js";
import {sandboxBody} from "../util/sandbox.js";
import {$Element} from "../types/base.js";
import {Lib} from "../core.js";

var scrollbarSize = (function() {
    var node;
    function createNode() {
        node = DOC.createElement('div');
        node.id="<%= prop('sbs') %>";
        node.style.cssText = 'position:absolute;overflow:scroll;width:100px;height:100px;';
        sandboxBody().appendChild(node);
        return node;
    }
    return function() {
        var e = node || createNode();
        return {
            height:100 - e.clientHeight,
            width:100 - e.clientWidth
        };
    }
})();
function scrollbarVisible(node) {
    var y = node.scrollHeight > node.clientHeight,
        x = node.scrollWidth > node.clientWidth,
        styles = getComputedStyle(node),
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
    else if (scroll.test(overflowx)) {x=true;}

    return {
        y: y,
        x: x
    }
}
function vpsize(node)
{
    var sbsize = scrollbarSize(),
        sbvisible = scrollbarVisible(node),
        minwidth,width,maxwidth,
        minheight,height,maxheight;
        minwidth = width = maxwidth = node.clientWidth;
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
            maxHeight: maxheight
        }
}
Lib.scrollbarSize = scrollbarSize;

register($Element,{scrollbar: function() {
        return scrollbarVisible(this[0]);
    }
},null, function() {return function() {return {x:null,y:null};}});

register($Element,{clientSize: function() {
        return vpsize(this[0]);
    }
},null, function() {return function() {return {width:0,height:0,minWidth:0,minHeight:0,maxWidth:0,maxHeight:0};}});

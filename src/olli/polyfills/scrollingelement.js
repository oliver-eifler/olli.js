/*! https://mths.be/scrollingelement v1.5.1 by @diegoperini & @mathias | MIT license */
import {WIN,DOC,HTML} from "../const.js";
import {getComputedStyle} from "../helper.js"

export default (function() {
    var element;
    function getScrollingElement(){
        var iframe = DOC.createElement('iframe');
        iframe.style.display = "none";
        iframe.style.height = '1px';
        (DOC.body || HTML || DOC).appendChild(iframe);
        var doc = iframe.contentWindow.document;
        doc.write('<!DOCTYPE html><body style="margin:1em"><div style="height:9999em">x</div></body>');
        doc.close();
        doc.body.scrollTop = 100;
        doc.documentElement.scrollTop = 100;
        if (doc.body.scrollTop == 100)
            element = DOC.body;
        else
            element = HTML;
        iframe.parentNode.removeChild(iframe);
        return element;
    }
    return function() {
        return element||getScrollingElement();
    }
}());

/**
 * Created by darkwolf on 08.11.2015.
 */
import {WIN,DOC} from "../const.js";
import {insertElement} from "../helper.js";
import {sandboxFrame} from "../util/sandbox.js";

function createSandboxStyle(doc) {
    var node = doc.createElement("style");
    node.setAttribute("data-olli","sandboxCSS");
    return insertElement(node);
}
export var sandboxRules = (function(){
    var node;
    return function(force) {
        if (force === false)
            return node?node.sheet:null;
        node = node || createSandboxStyle(sandboxFrame());
        return node.sheet;
    }
})();
export var sandboxSheet = (function(){
    var node;
    return function(cssText) {
        var doc = sandboxFrame();
        node = node || createSandboxStyle(doc);
        while (node.lastChild)
            node.removeChild(node.lastChild);
        node.appendChild(doc.createTextNode(cssText));
        return node.sheet;
    }
})();


/* RUle Types */
/*
interface CSSRule {
    const unsigned short STYLE_RULE = 1;
    const unsigned short CHARSET_RULE = 2;
    const unsigned short IMPORT_RULE = 3;
    const unsigned short MEDIA_RULE = 4;
    const unsigned short FONT_FACE_RULE = 5;
    const unsigned short PAGE_RULE = 6;
    const unsigned short KEYFRAMES_RULE = 7;
    const unsigned short KEYFRAME_RULE = 8;
    const unsigned short NAMESPACE_RULE = 10;
    const unsigned short COUNTER_STYLE_RULE = 11;
    const unsigned short SUPPORTS_RULE = 12;
    const unsigned short DOCUMENT_RULE = 13;
    const unsigned short FONT_FEATURE_VALUES_RULE = 14;
    const unsigned short VIEWPORT_RULE = 15;
    const unsigned short REGION_STYLE_RULE = 16;
    readonly attribute unsigned short type;
    attribute DOMString cssText;
    readonly attribute CSSRule? parentRule;
    readonly attribute CSSStyleSheet? parentStyleSheet;
};
*/
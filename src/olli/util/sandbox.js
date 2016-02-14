/**
 * Created by darkwolf on 07.02.2016.
 */
import {WIN,DOC} from "../const.js";

export var sandboxBody = (function(){
    var node;
    function createNode() {
        node = DOC.createElement("div");
        node.id = "<%= prop('olli-sandbox') %>";
        node.setAttribute("aria-hidden","true");
        node.style.cssText="display:block;position:absolute;width:100%;height:100%;z-index:-1;overflow:hidden;left:-100%;top:0";
        DOC.body.appendChild(node);
        return node;
    }
    return function() {
        return node||createNode();
    }
})();
export var sandboxFrame =(function() {
    var node;
    function createNode() {
        node = DOC.createElement("iframe");
        node.style.display = "none";
        node.style.height = '1px';
        sandboxBody().appendChild(node);
        node.src = "javascript:document.open();document.write('<!DOCTYPE html><head></head><body style=\"margin:1em\"><div style=\"height:9999em\">x</div></body>');document.close();";
        //sandboxBody().appendChild(node);
        return node;
    }
    return function() {
        return (node||createNode()).contentWindow.document;
    }
})();

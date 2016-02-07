/**
 * Created by darkwolf on 08.11.2015.
 */
import {WIN,DOC} from "../const.js";
import {insertElement} from "../helper.js";
var sandbox =(function() {
    var node;
    function createNode() {
        node = DOC.createElement("iframe");
        node.id = "<%= prop('sandbox') %>";
        node.style.display = "none";
        DOC.getElementsByTagName("body")[0].appendChild(node);
        node.src = "javascript:document.open();document.write('<head></head><body></body>');document.close();";
        return node;
    }
    return function() {
        return (node||createNode()).contentWindow.document;
    }
})();
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
        node = node || createSandboxStyle(sandbox());
        return node.sheet;
    }
})();
export var sandboxSheet = (function(){
    var node;
    return function(cssText) {
        var doc = sandbox();
        node = node || createSandboxStyle(doc);
        while (node.lastChild)
            node.removeChild(node.lastChild);
        node.appendChild(doc.createTextNode(cssText));
        return node.sheet;
    }
})();

/*
function sandbox() {
    var node = sandbox.node;
    if (!node) {
        node = DOC.createElement("iframe");
        node.id = "<%= prop('sandbox') %>";
        node.style.display = "none";
        DOC.getElementsByTagName("body")[0].appendChild(node);
        node.src = "javascript:document.open();document.write('<head></head><body></body>');document.close();";
        sandbox.node = node;
    }
    return node.contentWindow.document;
}

export function sandboxRules(force) {
    if (force === false) {
        return sandboxRules.node?sandboxRules.node.sheet:null;
    }
    var doc = sandbox(),node = sandboxRules.node;
    if (!node) {
        node = doc.createElement("style");
        node.setAttribute("data-olli","sandboxCSS");
        insertElement(node);
        sandboxRules.node = node;
    }
    return node.sheet;
}
export function sandboxSheet(cssText) {
    var doc = sandbox(),node = sandboxSheet.node;
    if (!node) {
        node = doc.createElement("style");
        node.setAttribute("data-olli","sandboxCSS");
        insertElement(node);
        sandboxSheet.node = node;
    }
    while (node.lastChild)
        node.removeChild(node.lastChild);
    node.appendChild(doc.createTextNode(cssText));
    return node.sheet;
}
*/
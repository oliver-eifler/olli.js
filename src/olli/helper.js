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
 * utilities
 */
import {VENDOR_PREFIXES,WIN} from "./const.js";
import {$NullElement} from "./types/base.js";

var arrayproto = Array.prototype;
export var push = arrayproto.push;
export var splice = arrayproto.splice;
export var slice = arrayproto.slice;
export var join = arrayproto.join;
export var map  = arrayproto.map;
export var indexof  = arrayproto.indexOf;
export var every = arrayproto.every;
export var filter = arrayproto.filter;

export var keys = Object.keys;
export var property = Object.defineProperty;
export var object = Object.create;

export var isArray = Array.isArray;
export function isFunction(obj) {return (typeof obj === "function");};
export function isString(obj) {return (typeof obj === "string");};
export function isNumber(obj) {return (typeof obj === "number");};
export function isObject(obj) {return (typeof obj === "object");};
export function isUndefined(obj) {return (typeof obj === "undefined");};
export function trim() {return this.replace(/^\s+|\s+$/g, "");};
export function isStringEmpty(obj) {return (isString(obj) && trim.apply(obj) != "")?false:true};

export function extend(target,source) {
    for (var i in source) {
        if (source.hasOwnProperty(i)) {
            extendProperty(target,source,i);
        }
    }
    return target;
};
export function extendProperty(to,from,property) {
// To copy gettters/setters, preserve flags etc
    var descriptor = Object.getOwnPropertyDescriptor(from, property);
    if (descriptor && (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable || descriptor.get || descriptor.set)) {
        delete to[property];
        Object.defineProperty(to, property, descriptor);
    }
    else {
        to[property] = from[property];
    }
};

export function register(target, mixins, factory, defaultFactory) {
    var proto = target.prototype;

    if (factory == null) {
        factory = function (methodName, strategy) {
            return strategy
        };
    }

    keys(mixins).forEach(function (methodName) {
        var args = [methodName].concat(mixins[methodName]);

        proto[methodName] = factory.apply(null, args);

        if (defaultFactory) {
            $NullElement.prototype[methodName] = defaultFactory.apply(null, args);
            /*Add to NodeList
             $NodeList.prototype[methodName] = function () {
             for (var n = this.length, i = 0; i < n; i++) {
             var el = this[i], ret = proto[methodName].apply(el, arguments);
             if (ret != el)
             return ret;
             }
             return this;
             }
             */
        }
    });
};
export function registerEx(target, mixins) {
    keys(mixins).forEach(function (methodName) {
        var descriptor = mixins[methodName];
        if (!isUndefined(descriptor.value) || !isUndefined(descriptor.get)) {
            /*Its a propertie descriptor*/
            descriptor.enumerable = descriptor.enumerable||true;
            delete target[methodName];
            Object.defineProperty(target,methodName,descriptor);
        }
        else {
            /* function or Object */
            target[methodName] = descriptor;
        }
    });
};

export function getComputedStyle(node) {
    return node.currentStyle || node.ownerDocument.defaultView.getComputedStyle(node,'');
}
export var prefix = (function () {
    if (!window.getComputedStyle)
        return {};
    var styles = getComputedStyle(document.documentElement),
        pre = (slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
       //dom = ("Webkit|Moz|ms|O").match(new RegExp('(' + pre + ')', 'i'))[1],
       //js = ('webkit|moz|ms|o').match(new RegExp('(' + pre + ')', 'i'))[1];
       dom = (VENDOR_PREFIXES.join('|')).match(new RegExp('(' + pre + ')', 'i'))[1],
       js = dom.toLowerCase(),//(VENDOR_PREFIXES.join('|').toLowerCase()).match(regex)[1],
       pos = VENDOR_PREFIXES.indexOf(dom);

    if (pos > 0) {
       VENDOR_PREFIXES[pos] = VENDOR_PREFIXES[0];
       VENDOR_PREFIXES[0] = dom;
    }
    return {
        dom: dom,
        lowercase: pre,
        css: pre!=''?'-' + pre + '-':'',
        js: js
    };
})();
export var dePrefix = (function() {
    var regexp = new RegExp("-("+VENDOR_PREFIXES.join('|')+")-","gi");
    return function(cssText) {
        if (!isString(cssText) || isStringEmpty(cssText))
            return "";
        return cssText.replace(regexp,"");
    };
})();
export function safeCall(context, fn, arg1, arg2) {
        if (typeof fn === "string") fn = context[fn];
        try {
            return fn.call(context, arg1, arg2);
        } catch (err) {
            WIN.setTimeout(function()  { throw err }, 1);
            return false;
        }
    }
export function OlliError(methodName, args) {
        var line = "invalid call `" + methodName + "(";
        line += map.call(args, String).join(", ") + ")`. ";
        this.message = line;
    }
    OlliError.prototype = new TypeError();

export function insertElement(node) {
        if (node && node.nodeType === 1) {
            return node.ownerDocument.getElementsByTagName("head")[0].appendChild(node);
        }
    }
export function removeElement(node) {
        if (node && node.nodeType === 1) {
            return node.parentNode.removeChild(node);
        }
    }
export function insertScript(node,text,url) {
        var doc = node.ownerDocument,
            script = doc.createElement("script");
        script.setAttribute("type","text/javascript");
        !isStringEmpty(url) && script.setAttribute("data-src",url);
        script.text = text;
        return insertElement(script);
    }
//var insertCSSstyle = false;
var insertCSSdefaults = {
    "media":"all",
    "type":"text/css",
    "data-src": ""
};
export function insertCSS(node,text,options) {
    options=options||{};
    for (var j in insertCSSdefaults) {
        if (!options.hasOwnProperty(j)) {
            options[j] = insertCSSdefaults[j];
        }
    }

    var doc = node.ownerDocument,
        style = doc.createElement('style');
    /*
    style.setAttribute("type","text/css");
    style.setAttribute("media","all");
    !isStringEmpty(url) && style.setAttribute('data-src',url);
    */
    for (var attr in options) {
        options.hasOwnProperty(attr) && !isStringEmpty(options[attr]) && style.setAttribute(attr,options[attr]);
    }

    style.appendChild(doc.createTextNode(text));
    //style.textContent = text;
    return insertElement(style);
    }

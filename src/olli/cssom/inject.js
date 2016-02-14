/**
 *  vein.js - version 0.3
 *
 *  by Danny Povolotski (dannypovolotski@gmail.com)
 **/

import {extend,registerEx,keys,isArray,isNumber,isString,isStringEmpty,isUndefined,isFunction,dePrefix} from "../helper.js";
import prefixCSS from "../util/prefixfree.js";
import HOOK from "../util/stylehooks.js"
import {Lib} from "../core.js";

import {$Stylesheet,$NullStylesheet} from "../cssom/types.js";

var trimSelector = (function() {
    var regexp = new RegExp("\\s","g");
    return function(selector) {
        return selector.replace(regexp,'');
        //selector.replace(/\s/g, '')
    }

})();
var ignoreSelector = (function() {
    var regexp = new RegExp("@(charset|font-face|import|namespace)","gi");
    return function(selector) {
        return (selector.search(regexp) !== -1);
    }
})();
var findOrDeleteBySelector = function (selector, stylesheet, css) {
    var matches = [], removes = [],
        rules = getRulesFromStylesheet(stylesheet)||[],
        selectorCompare = trimSelector(selector),
        atselector = (selectorCompare.charAt(0) === '@'),
        type = stylesheet.type||0;

    // Since there could theoretically be multiple versions of the same rule,
    // we will first iterate
    Array.prototype.forEach.call(rules,function(rule,index) {
        var same = false;
        if (!isStringEmpty(rule.selectorText)) {
            same = (selectorCompare === trimSelector(dePrefix(rule.selectorText)));
        } else if (!isStringEmpty(rule.keyText)) {
            same = (selectorCompare === trimSelector(dePrefix(rule.keyText)));
        } else if (atselector && !isStringEmpty(rule.cssText)) {
            //Must be @Rule
            same = (trimSelector(dePrefix(rule.cssText)).substring(0, selectorCompare.length) === selectorCompare);
        }

        if (same) {
            if (css === null) {
                // If we set css to null, let's delete that ruleset altogether
                if (rule.type === 8) //rules inside @keyframes are removed by keyText
                    index = rule.keyText;

                removes.unshift(index); //Adds to the head of the removes array
            } else {
                // Otherwise - we push it into the matches array
                matches.push(rules[index]);
            }
        }
    });

    removes.forEach(function (rule) {
        stylesheet.deleteRule(rule);
    });
    return matches;
};
var inject = function(rules,stylesheet,prefix) {
    if (!stylesheet.cssRules)
        return;
    /* we have a rulelist */
    if (isArray(rules)) {
        rules.forEach(function(rule) {inject(rule,stylesheet,prefix)});
        return;
    }
    if (isString(rules)) {
        if (ignoreSelector(rules)) {
            //console.log("ignoring "+rules);
            return;
        }
        findOrDeleteBySelector(rules, stylesheet, null);
        return;
    }
    /* we have a rule object */
    keys(rules).forEach(function (selector) {
        if (ignoreSelector(selector)) {
            //console.log("ignoring "+selector);
            return;
        }
        var css = rules[selector]; //Obj,array or NULL
        if (!isStringEmpty(prefix))
            selector = prefix + " "+selector;

        if (selector.trim().charAt(0) !== '@' && isArray(css)) {
            css.forEach(function(rule) {inject(rule,stylesheet,selector)});
            return;
        }
        var matches = findOrDeleteBySelector(selector, stylesheet, css),
            cssText = "";
        if (css === null)
            return;
        if (matches.length === 0) {
            //nothing found inject rule
            if (isArray(css)) {
                css.forEach(function(rule){
                    cssText+=cssObjToString(rule);
                });
            } else {
                cssText = cssToString(css);
            }
            insertRule(selector,cssText,stylesheet);
            return;
        }
        //Rule exists => modify rule
        matches.forEach(function (rule){
            if (isArray(css)) {
                //handle subrules
                inject(css,rule);
            } else if (rule.style) {
                //modify styles
                keys(css).forEach(function(property) {
                    setCSS(rule, property, css[property]);
                });
            }
        });
    });
};
var cssObjToString= function(cssObj) {
    var cssArray = [];
    keys(cssObj).forEach(function (selector) {
        var css = cssObj[selector];
        cssArray.push(selector+'{'+cssToString(css)+'}');
    });
    return cssArray.join(' ');
};


var cssToString = function (css) {
    var cssArray = [];

    for (var property in css) {
        if (css.hasOwnProperty(property)) {
            cssArray.push(property + ': ' + css[property]);
        }
    }
    return cssArray.join(';');
};
var setCSS = function (rule, name, value) {
    var style=rule.style,
        setter = HOOK.set[name] || HOOK.find(name, style);

    if (isFunction(value)) {
        value = value(rule);
    }

    if (value == null) value = "";

    if (isFunction(setter)) {
        setter(value, style);
    } else {
        style[setter] = isNumber(value) ? value + "px" : value.toString();
    }
};
var getRulesFromStylesheet = function (stylesheet) {
    return stylesheet.cssRules;
};

var insertRule = function (selector,cssText, stylesheet) {
    var rules = getRulesFromStylesheet(stylesheet),
        length = rules.length || 0;
    if (stylesheet.insertRule)
        stylesheet.insertRule(prefixCSS(selector+' {'+cssText+'}'), length);
    else if (stylesheet.appendRule)
        stylesheet.appendRule(prefixCSS(selector+' {'+cssText+'}'), length);
};
/*
 cssRule: create,modify or remove Rule(s) from stylesheet
 cssRule('selector',styleObject || Array[ruleObject0,ruleObject1,...]);
 cssRule(ruleObject || Array[ruleObject0,ruleObject1,...]);

 styleObject = {property1:value,property2:value,...} || null => rule(s) will be removed;
 ruleObject = {'selector':styleObject || Array[ruleObject0,ruleObject1,...] || null};
 ruleObject = 'selector' => rule(s) will be removed;
*/
registerEx($Stylesheet.fn, {
    cssRule: function (name,css) {
        var $this = this,
            sheet = $this[0];
        if (isString(name)) {
            var obj = {};
            if (isUndefined(css))
                css = null;
            obj[name] = css;
            inject(obj,sheet);
        } else if (!isUndefinded(name)) {
            inject(name,sheet);
        }
        return $this;
    }
});
registerEx($NullStylesheet.fn, {
    cssRule: function () {
        return this;
    }
});
// define shortcuts
["media","keyframes","document","page","support"].forEach(function (rule) {
    $Stylesheet.fn[rule+"Rule"] = function (condition,css) {
        var len = arguments.length,$this = this;
        if (len === 1) {
            return $this.cssRule("@"+rule,condition);
        }
        else if (len === 2)
            return $this.cssRule("@"+rule+" "+condition,css);
        return $this;
    };
    $NullStylesheet.fn[rule+"Rule"] = $NullStylesheet.fn.cssRule;
});

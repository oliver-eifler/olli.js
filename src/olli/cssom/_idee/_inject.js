/**
 *  vein.js - version 0.3
 *
 *  by Danny Povolotski (dannypovolotski@gmail.com)
 **/

import {extend,registerEx,keys,isArray,isNumber,isString,isStringEmpty,isUndefined,isFunction,dePrefix} from "../util.js";
import prefixCSS from "../util/prefixfree.js";
import HOOK from "../util/stylehooks.js"
import {Lib} from "../core.js";

import {$Stylesheet,$NullStylesheet} from "../cssom/types.js";

var findOrDeleteBySelector = function (selector, stylesheet, css) {
    var matches = [], removes = [],
        rules = stylesheet.cssRules||[],
        selectorCompare = selector.replace(/\s/g, ''),
        index, length;

    // Since there could theoretically be multiple versions of the same rule,
    // we will first iterate
    for (index = 0, length = rules.length; index < length; index++) {
        var rule = rules[index], same = false;
        if (!isStringEmpty(rule.selectorText)) {
            same = (selectorCompare === dePrefix(rule.selectorText).replace(/\s/g, ''));
        } else if (!isStringEmpty(rule.keyText)) {
            same = (selectorCompare === dePrefix(rule.keyText).replace(/\s/g, ''));
        } else if (!isStringEmpty(rule.cssText)) {
            //Must be @Rule
            same = (dePrefix(rule.cssText).replace(/\s/g, '').substring(0, selectorCompare.length) === selectorCompare);
        }

        if (same) {
            if (css === null) {
                // If we set css to null, let's delete that ruleset altogether
                removes.unshift(index); //Adds to the head of the removes array
            }
            else {
                // Otherwise - we push it into the matches array
                matches.push(rules[index]);
            }
        }
    }
    for (index = 0, length = removes.length; index < length; index++) {
        stylesheet.deleteRule(removes[index]);
    }

    return matches;
};
var astToRule= function(ast,level) {
    var cssArray = [];
    if (isArray(ast)) {
        ast.forEach(function(rule) {cssArray.push(astToRule(rule))});

    } else {
        keys(ast).forEach(function (selector) {
            var value = ast[selector];
            var css = selector+ " {";
            if (isArray(value))
                css+='\n'+astToRule(value);
            else
                css+=cssToString(value);
            css+="}";
            cssArray.push(css);
       });
    }
    return cssArray.join('\n');
};

Lib.ast = astToRule;

var cssToString = function (css) {
    var cssArray = [];

    for (var property in css) {
        if (css.hasOwnProperty(property)) {
            cssArray.push(property + ': ' + css[property]);
        }
    }
    return cssArray.join(';');
};
var setCSS = function (style, name, value) {
    var setter = HOOK.set[name] || HOOK.find(name, style);

    if (isFunction(value)) {
        value = value(this);
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

var insertRule = function (selector, cssText, stylesheet) {
    var rules = getRulesFromStylesheet(stylesheet),
        length = rules.length || 0;
    stylesheet.insertRule(prefixCSS(selector + '{' + cssText + '}'), length);
};

// Let's inject some CSS. We can supply an array (or string) of selectors, and an object
// with CSS value and property pairs.
registerEx($Stylesheet.fn, {
    inject: function (selectors, css, options) {

        options = extend({}, options);

        var $this = this,
            stylesheet = options.stylesheet || $this[0],
            rules = getRulesFromStylesheet(stylesheet),
            si, sl, query, matches, cssText, property, mi, ml, qi, ql;

        if (isString(selectors)) {
            selectors = [selectors];
        }

        for (si = 0, sl = selectors.length; si < sl; si++) {
            if (typeof selectors[si] === 'object' && stylesheet.insertRule) {
                for (query in selectors[si]) {
                    matches = findOrDeleteBySelector(query, stylesheet, css);

                    if (matches.length === 0) {
                        cssText = cssToString(css);
                        for (qi = 0, ql = selectors[si][query].length; qi < ql; qi++) {
                            insertRule(query, selectors[si][query][qi] + '{' + cssText + '}', stylesheet);
                        }
                    } else {
                        for (mi = 0, ml = matches.length; mi < ml; mi++) {
                            $this.inject(selectors[si][query], css, {stylesheet: matches[mi]});
                        }
                    }
                }
            } else {
                matches = findOrDeleteBySelector(selectors[si], stylesheet, css);

                // If all we wanted is to delete that ruleset, we're done here
                if (css !== null) {

                    // If no rulesets have been found for the selector, we will create it below
                    if (matches.length === 0) {
                        cssText = cssToString(css);
                        insertRule(selectors[si], cssText, stylesheet);
                    } else {
                        // Otherwise, we're just going to modify the property of the last found rule;
                        for (mi = 0, ml = matches.length; mi < ml; mi++) {
                            for (property in css) {
                                if (css.hasOwnProperty(property)) {
                                    // TODO: Implement priority
                                    setCSS(matches[mi].style,property, css[property]);
                                }
                            }
                        }
                    }
                }

            }
        }
        return $this;
    }
});
registerEx($NullStylesheet.fn, {
    inject: function () {
        return this;
    }
});
/*
    'selector': 'css' null|{...}
    oder
    [
        'selector0':'css' null|{...},
        'selector1':'css' null|{...},
        'selector2':'css' null|{...}
    ]

 rule({'.header':{'color':'#f00'});
 rulelist([
        {'.header':{'color':'#f00'},
        {'.test':{'color':'#f00'},
     ]);

 @rule({'@media':[
 {'.header':{'color':'#f00'},
 {'.test':{'color':'#f00'},
 ]});




 */
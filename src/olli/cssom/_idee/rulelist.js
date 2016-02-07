/**
 * Created by darkwolf on 13.12.2015.
 */
import {registerEx,splice,isArray,isNumber,isString,isStringEmpty,isUndefined,insertCSS,insertElement} from "../util.js";
import prefixCSS from "../util/prefixfree.js";

import {getCSSO} from "../cssom/util.js";
import {$Stylesheet,$NullStylesheet,$Rule,$NullRule} from "../cssom/types.js";
import {sandboxRules,sandboxSheet} from "../cssom/sandbox.js";

function insertRule(parent,cssText,position) {
    if (!parent.insertRule || isStringEmpty(cssText))
        return -1;
    var rules = parent.cssRules,length = rules.length;
    if (isUndefined(position))
        position = length;
    else if (position < 0)
        position = 0;
    else if (position > length)
        position = length;
    position = parent.insertRule(cssText,position);
    return position;
}
function removeRule(parent,position) {
    if (!parent.deleteRule)
        return false;
    var rules = parent.cssRules,length = rules.length;
    if (isUndefined(position))
        position = 0;
    if (position >= 0 && position < length) {
        if (rules[position]["<%= prop() %>"]) {
            rules[position]["<%= prop() %>"][0] =
            rules[position]["<%= prop() %>"] = void 0;
        }
        parent.deleteRule(position);
        return rules.length;
    }
    return -1;
}
function moveRule(destSheet,destPos) {

    var $this = this,rule = getCSSO($this);
    if (!destSheet.cssRules)
        return $this;
    var cssText = rule.cssText;
    var pos = insertRule(destSheet, cssText, destPos), tempRule = destSheet.cssRules[pos];
    removeRule(rule.parentRule || rule.parentStyleSheet, $this.index());
    $this[0] = tempRule;
    tempRule["<%= prop() %>"] = $this;
    return $this;
}

/* RuleList Pseudoclass
 only for inherit to other $classes
*/
export default function $RuleList() {}

registerEx($RuleList, {
    hasRules: {
        get: function () {
            return !!(getCSSO(this).insertRule);
        }
    },
    rulesLength: {
        get: function () {
            var rules = getCSSO(this).cssRules;
            return rules?rules.length:0;
        }
    },
    insertRule: function (styleRule, position) {
        var $this = this, $this0 = getCSSO($this), rules = $this0.cssRules;
        if (rules) {
            if (!isStringEmpty(styleRule)) {
                return $Rule(rules[insertRule($this0, prefixCSS(styleRule), position)]);
            }
            if (styleRule.isRule) {
                return moveRule.call(styleRule, $this0, position);
            }
        }
        return $Rule();
    },
    removeRule: function (position) {
        var rules = getCSSO(this).cssRules;
        if (!rules)
            return $Rule();
        if (isUndefined(position))
            position = rules.length-1;
        var $rule = this.rule(position);
        if ($rule.enabled) {
            moveRule.call($rule, sandboxRules());
        }
        return $rule;
    },
    rule: function (position) {
        if (isUndefined(position))
            position = 0;
        var $this = this, rules = getCSSO($this).cssRules;
        return $Rule(rules?rules[position]:null);
    },
    rules: function () {
        var $this=this,length = $this.rulesLength, list = [];
        for (var position = 0; position < length; position++) {
            list.push($this.rule(position));
        }
        return list;
    },
    ruleFirst: function () {
        return this.rule(0);
    },
    ruleLast: function () {
        return this.rule(this.rulesLength - 1);
    },
    find: function (selector) {
        var $this = this, rules = getCSSO($this).cssRules,found=[];

        if (rules && !isStringEmpty(selector)) {
            var length = rules.length;
            selector = selector.split(new RegExp("\\s*,\\s*")).join(", ");
            for (var position = 0; position < length; position++) {
                var rule = rules[position];
                if (selector == rule.selector.join(", "))
                    found.push($Rule(rule));
            }
        }
        return found;
    }
});
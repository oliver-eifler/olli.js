/**
 * Created by darkwolf on 13.12.2015.
 */
import {WIN,DOC} from "../const.js";
import {Lib} from "../core.js";
import {registerEx,isArray,isNumber,isString,isStringEmpty,isUndefined,dePrefix} from "../util.js";
import prefixCSS from "../util/prefixfree.js";

import {getCSSO} from "../cssom/util.js";
import {$Stylesheet,$Rule} from "../cssom/types.js";
import $RuleList from "../cssom/rulelist.js";

import {sandboxRules,sandboxSheet} from "../cssom/sandbox.js";

Lib.styleRule = function(cssText) {
    var sheet=$Stylesheet(sandboxRules());
    if (!isStringEmpty(cssText))
        return sheet.insertRule(cssText);

    return $Rule();
};

function parent(rule) {
    if (rule.parentRule)
        return $Rule(rule.parentRule);
    if  (rule.parentStyleSheet)
        return $Stylesheet(rule.parentStyleSheet);
    return $Stylesheet();
}

registerEx($Rule.fn, {
    isRule: {
        get: function () {
            return !isStringEmpty(getCSSO(this).cssText);
        }
    },
    selectorText: {
        get: function () {
            var $this0 = getCSSO(this),
                selector = "";

            if (!isStringEmpty($this0.selectorText)) {
                selector = dePrefix($this0.selectorText);
            } else if (!isStringEmpty($this0.keyText)) {
                //Must be KeyFrameRule
                selector = $this0.keyText;
            } else if (!isStringEmpty($this0.cssText)) {
                //Must be @Rule
                selector = dePrefix($this0.cssText.split(" ")[0]);
            }
            return selector;
        }
    },
    selector: function () {
        return this.selectorText.split(new RegExp("\\s*,\\s*"));
    },
    enabled: {
        get: function () {
            var $this0 = getCSSO(this),
                sheet = $this0.parentStyleSheet;
            return !(sheet === sandboxRules(false) || isStringEmpty($this0.cssText));
        }
    },
    ruleText: {
        get: function () {
            var $this0 = getCSSO(this);
            return dePrefix($this0.cssText);
        }
    },
    toString: function () {
        return this.ruleText;
    },
    parent: function () {
        var $this0 = getCSSO(this);
        if ($this0.parentRule)
            return $Rule($this0.parentRule);
        if ($this0.parentStyleSheet) {
            var sheet = $this0.parentStyleSheet;
            if (sheet !== sandboxRules(false))
                return $Stylesheet(sheet);
        }
        return $Stylesheet();
    },
    index: function () {
        var $this = this,
            rules = getCSSO(parent(getCSSO($this))).cssRules,
            length = rules ? rules.length : 0;
        for (var i = 0; i < length; i++) {
            if (rules[i]["<%= prop() %>"] == $this)
                return i;
        }
        return false;
    },
    remove: function () {
        var $this = this,
            list = parent(getCSSO($this));
        $RuleList.removeRule.call(list, $this.index());
        return $this;
    },
    append: function (styleRule) {
        var $this = this,
            list = parent(getCSSO($this));
        return $RuleList.insertRule.call(list, styleRule, $this.index() + 1);
    },
    prepend: function (styleRule) {
        var $this = this,
            list = parent(getCSSO($this));
        return $RuleList.insertRule.call(list, styleRule, $this.index());
    }
});

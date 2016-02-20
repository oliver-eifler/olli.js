/**
 * Created by darkwolf on 13.12.2015.
 */
import {WIN,DOC} from "../const.js";
import {$Document,$Element} from "../types/base.js";
import {registerEx,isArray,isNumber,isString,isStringEmpty,isUndefined,insertCSS,insertElement,dePrefix} from "../helper.js";
import prefixCSS from "../util/prefixfree.js";

import {$Stylesheet,$NullStylesheet} from "../cssom/types.js";
import {sandboxSheet} from "../cssom/util.js";
import Promise from "../polyfills/promise.js";
import assetLoader from "../util/loader.js";

/*$Stylesheet constructor*/
$Document.fn.styleSheet = function(content,options) {
    var $this = this,node = $this[0],doc = node.ownerDocument;
    if (isUndefined(content))
        content = "";
    if (isString(content)) {
        /*create new dynamic style */
        var elem = insertCSS(node, prefixCSS(content),options);
        return $Stylesheet(elem.sheet);
    } else if (isNumber(content)) {
        return $Stylesheet(doc.styleSheets[content]);
    }
    else if (content instanceof $Element) {
        return $Stylesheet(content[0].sheet);
    }
    //try as DOM-Node
    return $Stylesheet((content && content.sheet)?content.sheet:null);
};

registerEx($Stylesheet.fn, {
    disabled: {
        get: function () {
            return this[0].disabled;
        },
        set: function (value) {
            this[0].disabled = value;
        }
    },
    cssText: {
        get: function () {
            return this.toString();
        },
        set: function (value) {
            this.setCSS(value);
        }
    },
    toString: function () {
        var $this = this
            , sheet = $this[0]
            , rules = sheet.cssRules
            , rulesLen = rules.length
            , str = "";
        for (var i = 0; i < rulesLen; i++)
            str += dePrefix(rules[i].cssText);
        return str;
    },
    setCSS: function (content) {
        var $this = this, sheet = $this[0];
        //Clear $Stylesheet
        while (sheet.cssRules.length)
            sheet.deleteRule(sheet.cssRules.length - 1);

        return $this.appendCSS(content);
    },
    appendCSS: function (content) {
        var $this = this, sheet = $this[0]
            , dummy = sandboxSheet(prefixCSS(content))
            , dummyRules = dummy.cssRules
            , dummyRulesLength = dummyRules.length;
        //Add dummy Rules
        for (var i = 0; i < dummyRulesLength; i++)
            sheet.insertRule(dummyRules[i].cssText, sheet.cssRules.length);
        return $this;
    },
    loadCSS: function(url,append) {
        var $this = this;
        return assetLoader(url,false,function(url,response){
            if (append === true)
                $this.appendCSS(response);
            else
                $this.setCSS(response);
        });
    },
    ownerNode: function () {
        return $Element(this[0].ownerNode);
    }
});

registerEx($NullStylesheet.fn, {
    disabled: {value: true},
    cssText: {value: ""},
    toString: function () {
        return "";
    },
    setCSS: function () {
        return this;
    },
    appendCSS: function () {
        return this;
    },
    loadCSS: function() {
        return Promise.reject(new Error("$NullStylesheet"));
    },
    ownerNode: function () {
        return $Element();
    }
});














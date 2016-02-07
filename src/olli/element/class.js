import {$Element,$NullElement} from "../types/base.js";
import {registerEx} from "../helper.js";
import $TokenList from "../types/tokenlist.js";

registerEx($Element.fn, {
    getClass: function () {
        return $TokenList(this[0].className || "");
    },
    setClass: function (string) {
        this[0].className = $TokenList(string || "").toString();
        return this;
    },
    hasClass: function (string) {
        var classes = $TokenList(this[0].className || ""),
            tokens = $TokenList(string);
        for (var i = 0, n = tokens.length; i < n; i++) {
            if (!classes.contains(tokens[i]))
                return false;
        }
        return true;
    },
    addClass: function (string) {
        var classes = $TokenList(this[0].className || "");
        $TokenList(string).forEach(function (token) {
            classes.add(token);
        });
        this[0].className = classes.toString();
        return this;
    },
    removeClass: function (string) {
        var classes = $TokenList(this[0].className || "");
        $TokenList(string).forEach(function (token) {
            classes.remove(token);
        });
        this[0].className = classes.toString();
        return this;
    },
    toggleClass: function (string) {
        var classes = $TokenList(this[0].className || "");
        $TokenList(string).forEach(function (token) {
            classes.toggle(token);
        });
        this[0].className = classes.toString();
        return this;
    }
});

registerEx($NullElement.fn, {
    getClass: function () {
        return $TokenList();
    },
    hasClass: function () {
        return false;
    },
    setClass: function () {
        return this;
    },
    addClass: function () {
        return this;
    },
    removeClass: function () {
        return this;
    },
    toggleClass: function () {
        return this;
    }
});
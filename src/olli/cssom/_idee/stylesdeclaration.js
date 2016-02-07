/**
 * Created by darkwolf on 19.12.2015.
 */
import {registerEx,isArray,keys,isNumber,isString,isFunction,isObject,OlliError,dePrefix} from "../util.js";

import {getCSSO} from "../cssom/util.js";

import HOOK from "../util/stylehooks.js"
import prefixCSS from "../util/prefixfree.js";

/* $StylesDeclaration Pseudoclass
 only for inherit to other $classes
 */
export default function $StylesDeclaration() {}

registerEx($StylesDeclaration, {
    hasStyle: {
        get: function () {
            return !!(getCSSO(this).style);
        }
    },
    cssText: {
        get: function () {
            var style = getCSSO(this).style;
            return style ? dePrefix(style.cssText) : "";
        },
        set: function (cssText) {
            var style = getCSSO(this).style;
            if (style && isString(cssText)) {
                (style.cssText = prefixCSS(cssText));
            }
        }
    },
    css: function (name, value) {
        var $this = this,
            len = arguments.length,
            style = getCSSO($this).style;

        if (!style) {
            if (len === 1 && isArray(name)) {
                return {};
            }
            if (len !== 1 || !isString(name)) {
                return $this;
            }
            return void 0;
        }

        if (len === 1 && (isString(name) || isArray(name))) {
            var strategy = function (name) {
                var getter = HOOK.get[name] || HOOK.find(name, style),
                    value = isFunction(getter) ? getter(style) : style[getter];
                return value;
            };

            if (isString(name)) {
                return strategy(name);
            } else {
                return name.map(strategy).reduce(function (memo, value, index) {
                    memo[name[index]] = value;
                    return memo;
                }, {});
            }
        }

        if (len === 2 && isString(name)) {
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
        } else if (len === 1 && name && isObject(name)) {
            keys(name).forEach(function (key) {
                $this.css(key, name[key])
            });
        } else {
            throw new OlliError("$Rule.css", arguments);
        }
        return $this;
    }
});

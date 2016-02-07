import {isArray,isString,isObject,isFunction,isNumber,keys,OlliError,getComputedStyle,register} from "../helper.js"
import {$Element} from "../types/base.js"
import HOOK from "../util/stylehooks.js"

register($Element, {
    css: function (name, value) {
        var this$0 = this,
            len = arguments.length,
            node = this[0],
            style = node.style,
            computed;

        if (len === 1 && (isString(name) || isArray(name))) {
            var strategy = function (name) {
                var getter = HOOK.get[name] || HOOK.find(name, style),
                    value = typeof getter === "function" ? getter(style) : style[getter];

                if (!value) {
                    if (!computed) computed = getComputedStyle(node);

                    value = isFunction(getter) ? getter(computed) : computed[getter];
                }

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
                this$0.css(key, name[key])
            });
        } else {
            throw new OlliError("css", arguments);
        }

        return this;
    }
}, null, function () {
    return function (name, value) {
        if (arguments.length === 1 && isArray(name)) {
            return {};
        }
        if (arguments.length !== 1 || isString(name)) {
            return this;
        }
    }
});


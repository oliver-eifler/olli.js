/**
 * Created by darkwolf on 08.11.2015.
 */
import {register,keys,every,isUndefined,isObject,isFunction,isArray,isString,OlliError} from "../helper.js";
import {$Element} from "../types/base.js";
import PROPS from "../util/accessorhooks.js"
import "../element/value.js";


var reUpper = /[A-Z]/g,
    readPrivateProperty = function (node, key) {
        // convert from camel case to dash-separated value
        key = key.replace(reUpper, function (l) {
            return "-" + l.toLowerCase()
        });

        var value = node.getAttribute("data-" + key);

        if (value != null) {
            // try to recognize and parse  object notation syntax
            if (value[0] === "{" && value[value.length - 1] === "}") {
                try {
                    value = JSON.parse(value);
                } catch (err) {
                    // just return the value itself
                }
            }
        }

        return value;
    };

register($Element, {
    get: function (name) {
        var $this = this,
            node = $this[0],
            hook = PROPS.get[name];

        if (hook) return hook(node, name);

        if (isString(name)) {
            if (name in node) {
                return node[name];
            } else if (name[0] !== "_") {
                return node.getAttribute(name);
            } else {
                var key = name.slice(1),
                    data = $this._;

                if (!(key in data)) {
                    data[key] = readPrivateProperty(node, key);
                }

                return data[key];
            }
        } else if (isArray(name)) {
            return name.reduce(function (memo, key) {
                return (memo[key] = $this.get(key), memo);
            }, {});
        } else {
            throw new OlliError("get", arguments);
        }
    }
}, null, function () {
    return function () {
    }
});

register($Element, {
    set: function (name, value) {
        var $this = this,
            node = $this[0],
            hook = PROPS.set[name];
        /*
         var watchers = $this._["watcher2001004"][name],
         oldValue;
         if (watchers) {
         oldValue = this.get(name);
         }
         */
        if (isString(name)) {
            if (name[0] === "_") {
                this._[name.slice(1)] = value;
            } else {
                if (isFunction(value)) {
                    value = value($this);
                }

                if (hook) {
                    hook(node, value);
                } else if (value == null) {
                    node.removeAttribute(name);
                } else if (name in node) {
                    node[name] = value;
                } else {
                    node.setAttribute(name, value);
                }
                /*
                 if (JSCRIPT_VERSION < 9 || LEGACY_ANDROID) {
                 // always trigger reflow manually for IE8 and legacy Android
                 node.className = node.className;
                 }
                 */
            }
        } else if (isArray(name)) {
            name.forEach(function (key) {
                $this.set(key, value)
            });
        } else if (isObject(name)) {
            keys(name).forEach(function (key) {
                $this.set(key, name[key])
            });
        } else {
            throw new OlliError("set", arguments);
        }
        /*
         if (watchers && oldValue !== value) {
         watchers.forEach(function(w)  {
         safeCall($this, w, value, oldValue);
         });
         }
         */
        return this;
    }
}, null, function () {
    return function () {
        return this;
    }
});

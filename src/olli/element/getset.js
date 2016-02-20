/**
 * Created by darkwolf on 08.11.2015.
 */
import {register,keys,every,isUndefined,isObject,isFunction,isArray,isString,OlliError,safeCall} from "../helper.js";
import {$Element} from "../types/base.js";
import PROPS from "../util/accessorhooks.js"

register($Element, {
    get: function (name, defaultValue) {
        var $this = this,
            node = $this[0],
            hook = PROPS.get[name],
            value;

        if (hook) {
            value = hook(node, name);
        } else if (isString(name)) {
            if (name in node) {
                value = node[name];
            } else {
                value = node.getAttribute(name);
            }
        } else if (isArray(name)) {
            value = name.reduce(function (memo, key) {
                return (memo[key] = $this.get(key), memo);
            }, {});
        } else {
            throw new OlliError("get", arguments);
        }

        return value != null ? value : defaultValue;
    }
}, null, function () {
    return function () {
    }
});

register($Element, {
    set: function (name, value) {
        var $this = this,
            node = $this[0],
            hook = PROPS.set[name],
            watchers = this._["<%= prop('watcher') %>"][name],
            oldValue;

        if (watchers) {
            oldValue = this.get(name);
        }

        if (isString(name)) {
            if (isFunction(value)) {
                value = value(this);
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
        } else if (isArray(name)) {
            name.forEach(function (key) {
                $this.set(key, value)
            });
        } else if (isObject(name) === "object") {
            keys(name).forEach(function (key) {
                $this.set(key, name[key])
            });
        } else {
            throw new OlliError("set", arguments);
        }

        if (watchers && oldValue !== value) {
            watchers.forEach(function (w) {
                safeCall($this, w, value, oldValue);
            });
        }

        return this;
    }
}, null, function () {
    return function () {
        return this;
    }
});

var reUpper = /[A-Z]/g,
    readPrivateProperty = function (node, key) {
        // convert from camel case to dash-separated value
        key = key.replace(reUpper, function (l) {
            return "-" + l.toLowerCase()
        });

        var value = node.getAttribute("data-" + key);

        if (value != null) {
            // try to recognize and parse  object notation syntax
            if (value[0] === "{" && value[value.length - 1] === "}" || value[0] === "[" && value[value.length - 1] === "]") {
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
    data: function (name, value) {
        var $this = this,
            node = $this[0],
            data = $this._;

        if (isString(name)) {
            if (arguments.length === 1) {
                if (!(name in data)) {
                    data[name] = readPrivateProperty(node, name);
                }

                return data[name];
            } else {
                data[name] = value;
            }
        } else if (isArray(name)) {
            return name.reduce(function (memo, key) {
                return (memo[key] = $this.data(key), memo);
            }, {});
        } else if (name && isObject(name)) {
            keys(name).forEach(function (key) {
                $this.data(key, name[key])
            });
        } else {
            throw new OlliError("data", arguments);
        }

        return this;
    }
}, null, function () {
    return function (name) {
        if (arguments.length === 1 && isArray(name)) {
            return {};
        }

        if (arguments.length !== 1 || !isString(name)) {
            return this;
        }
    }
});

register($Element, {
    watch: function (name, callback) {
        var watchers = this._["<%= prop('watcher') %>"];

        if (!watchers[name]) watchers[name] = [];

        watchers[name].push(callback);

        return this;
    },

    unwatch: function (name, callback) {
        var watchers = this._["<%= prop('watcher') %>"];

        if (watchers[name]) {
            watchers[name] = watchers[name].filter(function (w) {
                return w !== callback
            });
        }

        return this;
    }
}, null, function () {
    return function () {
        return this;
    }
});


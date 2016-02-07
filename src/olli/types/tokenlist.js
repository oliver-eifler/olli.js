import {registerEx,isUndefined,isArray,isString,isStringEmpty,trim} from "../helper.js";
import {Lib} from "../core.js";

export default function $TokenList(tokenText) {
    if (this instanceof $TokenList) {
        this.tokenText = tokenText;
    }
    else {
        return new $TokenList(tokenText);
    }
}
$TokenList.prototype = [];
$TokenList.fn = $TokenList.prototype;

registerEx($TokenList.fn, {
    toString: function () {
        return this.tokenText;
    },
    tokenText: {
        get: function () {
            return this.join(" ");
        },
        set: function (value) {
            var $this = this;
            /*
            while ($this.length)
                $this.pop();
            */
            $this.length = 0;

            if (!isUndefined(value)) {
                var values = [];
                if (isArray(value))
                    values = [].concat(value);
                else if (!isString(value))
                    value = value.toString();

                if (!isStringEmpty(value))
                    values = value.split(" ");

                values.forEach(function(value) {$this.add(value);});
                /*
                 var length = values.length||0,
                 i=0;
                 for (;i < length; i++) {
                 this.add(values[i]);
                 }
                 */
            }
        }
    },
    contains: function (value) {
        return (this.indexOf(value) !== -1)
    },

    add: function (value) {
        if (!isStringEmpty(value)) {
            value = trim.call(value);
            if (this.indexOf(value) === -1) {
                this.push(value);
            }
        }
        return this;
    },
    remove: function (value) {
        if (!isStringEmpty(value)) {
            value = trim.call(value);
            var index = this.indexOf(value);
            if (index !== -1) {
                this.splice(index, 1);
            }
        }
        return this;
    },
    toggle: function (value) {
        if (!isStringEmpty(value)) {
            value = trim.call(value);
            var index = this.indexOf(value);
            if (index !== -1) {
                this.splice(index, 1);
            } else {
                this.push(value);
            }
        }
        return this;
    }
});
//constructor
Lib.tokenList = function (tokenText) {
    return $TokenList(tokenText);
};

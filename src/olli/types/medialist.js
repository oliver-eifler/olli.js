/**
 * Created by darkwolf on 20.12.2015.
 */
import {isUndefined,isArray,isString,isStringEmpty,trim} from "../helper.js";
import {Lib} from "../core.js";

export default function $MediaList(mediaText) {
    if (this instanceof $MediaList) {
        this.mediaText = mediaText;
    }
    else {
        return new $MediaList(mediaText);
    }
}
$MediaList.prototype = [];
$MediaList.fn = $MediaList.prototype;

$MediaList.fn.toString = function () {
    return this.mediaText;
};
Object.defineProperty($MediaList.fn, 'mediaText', {
    get: function() {
        return this.join(", ");
    },
    set: function(value) {
        while (this.length)
            this.pop();
        if (!isUndefined(value)) {
            if (isArray(value))
                value = value.join(",");
            else if (!isString(value))
                value = value.toString();
            var values = value.split(","),
            length = values.length,
            i=0;
            for (;i < length; i++) {
                this.add(trim.call(values[i]));
            }
        }
    }
});
$MediaList.fn.contains = function(value) {
    return (this.indexOf(value) !== -1)
};

$MediaList.fn.add = function(value) {
    if (!isStringEmpty(value)) {
        value = trim.call(value);
        if (this.indexOf(value) === -1) {
            this.push(value);
        }
    }
    return this;
};
$MediaList.fn.remove = function(value) {
    if (!isStringEmpty(value)) {
        value = trim.call(value);
        var index = this.indexOf(value);
        if (index !== -1) {
            this.splice(index, 1);
        }
    }
    return this;
};
$MediaList.fn.toggle = function(value) {
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
};
//constructor
Lib.mediaList = function(mediaText) {
    return $MediaList(mediaText);
};

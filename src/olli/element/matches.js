import {OlliError,register,isString} from "../helper.js";
import {$Element} from "../types/base.js";
import SelectorMatcher from "../util/selectormatcher.js";

register($Element, {
        matches: function (selector) {
            if (!selector || !isString(selector))
                throw new OlliError("matches", arguments);
            var matcher = SelectorMatcher(selector);
            return !!matcher(this[0]);
        }
    }, null, function () {
        return function () {
            return false;
        }
    }
);

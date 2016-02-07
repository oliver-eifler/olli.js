import { register} from "../helper.js";
import { $Element } from "../types/base.js";

function fn1(value) {return value;}
function fn2(value) {return parseInt(value,10);}

register($Element, {
    /**
     * Calculates offset of the current element
     * @memberof! $Element#
     * @alias $Element#offset
     * @return {Object} object with left, top, bottom, right, width and height properties
     * @example
     * el.offset(); // => {left: 1, top: 2, right: 3, bottom: 4, width: 2, height: 2}
     */
    offset: function(intvalue) {
        var $this0 = this[0],
            doc = $this0.ownerDocument.documentElement,
            win = $this0.ownerDocument.defaultView,
            clientTop = doc.clientTop,
            clientLeft = doc.clientLeft,
            scrollTop = win.pageYOffset || doc.scrollTop,
            scrollLeft = win.pageXOffset || doc.scrollLeft,
            rect = $this0.getBoundingClientRect(),
            fn = (intvalue===true)?fn2:fn1;

        return {
            top: fn(rect.top) + scrollTop - clientTop,
            left: fn(rect.left) + scrollLeft - clientLeft,
            right: fn(rect.right) + scrollLeft - clientLeft,
            bottom: fn(rect.bottom) + scrollTop - clientTop,
            width: fn(rect.right - rect.left),
            height: fn(rect.bottom - rect.top)
        };
    }
}, null, function () {
    return function () {
        return {top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0};
    }
});

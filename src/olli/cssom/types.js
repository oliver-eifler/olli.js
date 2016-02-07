/**
 * Created by darkwolf on 13.12.2015.
 */
import {registerEx} from "../helper.js";

export function $NullStylesheet() {
    this.length = 0;
}
export function $Stylesheet(sheet) {
    if (this instanceof $Stylesheet) {
        if (sheet) {
            sheet["<%= prop() %>"] = this;
            sheet.ownerNode.setAttribute("data-olli","dynamicCSS");
            this[0] = sheet;
        }
    } else if (sheet) {
        // create a wrapper only once for each native sheet
        return sheet["<%= prop() %>"] || new $Stylesheet(sheet);
    } else {
        return new $NullStylesheet();
    }
}
$Stylesheet.fn = $Stylesheet.prototype;

registerEx($Stylesheet.fn, {
    isStylesheet: {get: function() {return !!this[0]}},
    version: {value: "<%= pkg.version %>"}
});

$NullStylesheet.prototype = new $Stylesheet();
$NullStylesheet.fn = $NullStylesheet.prototype;

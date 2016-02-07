/**
 * Olli LIB
 * This file is part of the Olli-Framework
 * Copyright (c) 2012-2015 Oliver Jean Eifler
 *
 * @version 0.0.1
 * @link http://www.oliver-eifler.info/
 * @author Oliver Jean Eifler <oliver.eifler@gmx.de>
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 *
 * Core Module
 */
import {DOC} from "./const.js";
import {slice,keys,prefix,isArray,trim,register} from "./helper.js";
import {$Element,$NullElement,$Document,$Window} from "./types/base.js";

/* create OLLI */
var Lib = new $Document(DOC);
Lib.constructor = function (node) {
    if (node.window && node.window === node)
        return $Window(node);
    var nodeType = node && node.nodeType,
        ctr = nodeType === 9 ? $Document : $Element;
    // filter non elements like text nodes, comments etc.
    return ctr(nodeType === 1 || nodeType === 9 ? node : null);
};
Lib.getVendorPrefix = function () {
    return prefix;
};

register($Element, {
    getWindow: function () {
        return $Window(this[0].ownerDocument.defaultView);
    }
}, null, function () {
    return function () {
        return $Window();
    }
});
DEBUG && register($Element, {
    debug: function () {
        console.log("errorfunction");
        errorfunction();
    }
}, null
);

export {Lib};

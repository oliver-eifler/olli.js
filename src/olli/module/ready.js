/**
 * Olli Lib
 * This file is part of the Olli-Framework
 * Copyright (c) 2012-2015 Oliver Jean Eifler
 *
 * @version 0.0.1
 * @link http://www.oliver-eifler.info/
 * @author Oliver Jean Eifler <oliver.eifler@gmx.de>
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 *
 * olli.ready;)
 */
import {isFunction} from "../helper.js";
import Promise from "../polyfills/promise.js";
import {Lib} from "../core.js";

/*
 Lib.ready = function(callback) {
 if (!isFunction(callback)) throw new OlliError("Olli.ready", arguments);
 var doc=this[0].ownerDocument;
 if (doc.readyState != 'loading'){
 callback(null);
 } else {
 doc.addEventListener('DOMContentLoaded', callback);
 }
 };
 */
Lib.ready = (function () {
    var promise;
    return function () {
        var $this = this,
            doc = $this[0].ownerDocument;
        promise = promise || new Promise(function (resolve, reject) {
                console.log("created ready promise");
                if (doc.readyState != 'loading') {
                    ready();
                } else {
                    doc.addEventListener('DOMContentLoaded', ready);
                }
                function ready() {
                    resolve($this);
                }
            });
        return promise;
    }
})();

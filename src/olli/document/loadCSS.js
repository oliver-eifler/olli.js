/*@exclude*/
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
 * async load CSS
 */
import {isArray,insertCSS} from "../helper.js";
import {$Document} from "../types/base.js";
/*
import Promise from "../polyfills/promise.js";
import Loader from "../util/loader.js";

$Document.fn.loadCSS = function (url, cacheBurst) {
    var $this = this;

    if (isArray(url)) {
        var prom = [];
        url.forEach(function (item) {
            prom.push($this.loadCSS(item, cacheBurst));
        });
        return Promise.all(prom);
    }
    return new Promise(function (resolve, reject) {
        Loader(url, cacheBurst).then(
            function (response) {
                DEBUG && console.log("css " + url + " loaded");
                if (!$this[0].querySelector("style[data-src='"+url+"']"))
                    insertCSS($this[0], response, url);
                resolve(url);
            },
            function (error) {
                DEBUG && console.log("css " + url + " " + error.message || error.description);
                reject(url);
            });
    });
};
*/
import assetLoader from "../util/loader.js";
$Document.fn.loadCSS = function (url, cacheBurst) {
    var node = this[0];
    return assetLoader(url,cacheBurst,function(url,response,options){
        options["data-src"] = url;
        if (!cacheBurst && node.querySelector("style[data-src='"+url+"']"))
            insertCSS(node, response, options);
    });
};

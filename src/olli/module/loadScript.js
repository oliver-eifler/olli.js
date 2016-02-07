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
 * async load script
 */
import {isArray,insertScript} from "../helper.js";
import {$Document} from "../types/base.js";
/*
import Promise from "../polyfills/promise.js";
import Loader from "../util/loader.js";

$Document.fn.loadScript = function (url, cacheBurst) {
    var $this = this;

    if (isArray(url)) {
        var prom = [];
        url.forEach(function (item) {
            prom.push($this.loadScript(item, cacheBurst));
        });
        return Promise.all(prom);
    }
    return new Promise(function (resolve, reject) {
        Loader(url,cacheBurst).then(
            function (response) {
                DEBUG && console.log("script " + url + " loaded");
                if (!$this[0].querySelector("script[data-src='"+url+"']"))
                    insertScript($this[0], response, url);
                resolve(url);
            },
            function (error) {
                DEBUG && console.log("script " + url + " " + error.message || error.description);
                reject(url);
            });
    });
};

*/
import assetLoader from "../util/loader.js";
$Document.fn.loadScript = function (url, cacheBurst) {
    var $this = this;
    return assetLoader(url,cacheBurst,function(url,response){
        if (!$this[0].querySelector("script[data-src='"+url+"']"))
            insertScript($this[0], response, url);
    });
};

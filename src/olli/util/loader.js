/**
 * Created by darkwolf on 06.01.2016.
 */
import {isStringEmpty,isArray,isFunction} from "../helper.js";
import XHR from "../util/better-xhr.js";
import Promise from "../polyfills/promise.js";
var loadpromise = [];

function loader(url,cacheBurst) {
    if (isStringEmpty(url)) {
        return Promise.reject(new Error("Empty URL"));
    }
    loadpromise[url] = loadpromise[url]|| XHR.get(url, {cacheBurst: cacheBurst ? "t" : false});
    return loadpromise[url];
}
export default function assetLoader(url, cacheBurst,callback) {
    if (isArray(url)) {
        var prom = [];
        url.forEach(function (item) {
            prom.push(assetLoader(item, cacheBurst,callback));
        });
        return Promise.all(prom);
    }
    return new Promise(function (resolve, reject) {
        loader(url,cacheBurst).then(
            function (response) {
                DEBUG && console.log("asset: " + url + " loaded");
                if (isFunction(callback))
                    callback(url,response);
                resolve(url);
            },
            function (error) {
                DEBUG && console.log("asset: " + url + " " + error.message || error.description);
                reject(url);
            });
    });
};

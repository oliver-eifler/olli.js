/**
 * Created by darkwolf on 06.01.2016.
 */
import {isStringEmpty,isString,isArray,isFunction} from "../helper.js";
import XHR from "../util/better-xhr.js";
import Promise from "../polyfills/promise.js";
var loadpromise = [];

function loader(url,cacheBurst) {
    if (isStringEmpty(url)) {
        return Promise.reject(new Error("Empty URL"));
    }
    if (cacheBurst && loadpromise[url])
        loadpromise[url] = false;
    loadpromise[url] = loadpromise[url]|| XHR.get(url, {cacheBurst: cacheBurst ? "t" : false,headers:{"X-Requested-With": null}});
    return loadpromise[url];
}
function loaderPromise(url,cacheBurst) {
    var src,options={};
    if (isString(url))
        src = url;
    else {
        src = url.src;
        url.src = void 0;
        for (var j in url) {
            options[j] = url[j];
        }
    }
    return new Promise(function (resolve, reject) {
        loader(src,cacheBurst).then(
            function (response) {
                DEBUG && console.log("asset: " + src + " loaded");
                resolve({"src":src,"response":response,"options":options});
            },function (error) {
                DEBUG && console.log("asset: " + src + " " + error.message || error.description);
                reject(src);
            });
    });
}
export default function assetLoader(url, cacheBurst,callback) {
        if (!isArray(url))
            url =[url];

        var prom = [];
        url.forEach(function (item) {
            prom.push(loaderPromise(item, cacheBurst));
        });
        return Promise.all(prom).then(function(assets) {
            var src = [];
            assets.forEach(function(data){
                src.push(data.src);
                if (isFunction(callback))
                    callback(data.src,data.response,data.options);
            });
            return Promise.resolve(src);
        }).catch(function(src) {return Promise.reject(src);});
}

/*
export default function assetLoader(url, cacheBurst,callback) {
    if (isArray(url)) {
        var prom = [];
        url.forEach(function (item) {
            prom.push(assetLoader(item, cacheBurst,callback));
        });
        return Promise.all(prom);
    }
    var src,options={};
    if (isString(url))
        src = url;
    else {
        src = url.src;
        url.src = void 0;
        for (var j in url) {
            options[j] = url[j];
        }
    }
    return new Promise(function (resolve, reject) {
        loader(src,cacheBurst).then(
            function (response) {
                DEBUG && console.log("asset: " + src + " loaded");
                if (isFunction(callback))
                    callback(src,response,options);
                resolve(src);
            },
            function (error) {
                DEBUG && console.log("asset: " + src + " " + error.message || error.description);
                reject(src);
            });
    });
};
*/
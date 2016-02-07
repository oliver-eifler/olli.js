//polyfills
//import "./polyfills/promise.js";

// olli.js - ES6
import "./document/create.js";

import "./element/manipulation.js";
import "./element/empty.js";
import "./element/find.js";
import "./element/matches.js";
import "./element/class.js";
import "./element/css.js";
import "./element/clientsize.js";
import "./element/getset.js";
import "./element/offset.js";
import "./element/children.js";
import "./element/traversing.js";
import "./element/clone.js";

import "./events/event.js";
import "./events/resizeend.js";
import "./events/resizefont.js";

import "./module/frame.js";
import "./module/ready.js";
import "./module/xhr.js";
import "./module/loadScript.js";
import "./module/loadCSS.js";
import "./module/isstylesupported.js";
import "./module/feature.js";
import "./module/fontloaded.js";
import "./module/scrollingelement.js";

import "./cssom/cssom.js";

import {Lib} from "./core.js";

window["olli"] = Lib;

olli.ready().then(function () {
    console.log("olli ready: " + olli.version);

    window._loadScripts = function (urls) {
        olli.loadScript(urls).then(function (url) {
            console.log(url);
            console.log("loaded");
        }, function (url) {
            console.log(url);
            console.log("not loaded");
        });
    };
    var resizeend = function(width,height) {
        console.log("ResizeEnd: "+width+" x "+height);
    };
    olli.on("resize:end",["width","height"],resizeend);

    olli.fontLoaded("Roboto").then(function(res) {console.log(res)}).catch(function(res){console.log(res)});
    olli.fontLoaded("Playfair Display",{weight:700}).then(function(res) {console.log(res)}).catch(function(res){console.log(res)});
    olli.fontLoaded("Playfair Display",{style:'italic'}).then(function(res) {console.log(res)}).catch(function(res){console.log(res)});

    olli.fontLoaded("Roboto").then(function(res) {console.log(res)}).catch(function(res){console.log(res)});
    olli.fontLoaded("Playfair Display",{weight:700}).then(function(res) {console.log(res)}).catch(function(res){console.log(res)});
    olli.fontLoaded("Playfair Display",{style:'italic'}).then(function(res) {console.log(res)}).catch(function(res){console.log(res)});
});

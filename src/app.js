//polyfills
//import "./olli/polyfills/promise.js";

// olli.js - ES6
import "./olli/document/create.js";
import "./olli/document/loadScript.js";
import "./olli/document/loadCSS.js";

import "./olli/element/manipulation.js";
import "./olli/element/empty.js";
import "./olli/element/find.js";
import "./olli/element/matches.js";
import "./olli/element/class.js";
import "./olli/element/css.js";
import "./olli/element/clientsize.js";
import "./olli/element/getset.js";
import "./olli/element/offset.js";
import "./olli/element/children.js";
import "./olli/element/traversing.js";
import "./olli/element/clone.js";

import "./olli/events/event.js";
import "./olli/events/resizeend.js";
import "./olli/events/resizefont.js";

import "./olli/module/frame.js";
import "./olli/module/ready.js";
import "./olli/module/xhr.js";
import "./olli/module/isstylesupported.js";
import "./olli/module/feature.js";
import "./olli/module/fontloaded.js";
import "./olli/module/scrollingelement.js";

import "./olli/cssom/cssom.js";

import {Lib} from "./olli/core.js";

window["olli"] = Lib;

olli.ready().then(function () {
    console.log("app:olli ready: " + olli.version);

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
    olli.fontLoaded("Wurstl",{style:'italic'}).then(function(res) {console.log(res)}).catch(function(res){console.log(res)});
});

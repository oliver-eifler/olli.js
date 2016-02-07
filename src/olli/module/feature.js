/**
 * Created by darkwolf on 24.01.2016.
 */
import {Lib} from "../core.js";
import STYLESUPPORTED from "../util/stylesupported.js";
import {WIN,DOC,HTML} from "../const.js";

function create(el) {
    return DOC.createElement(el);
};

function Feature() {}
Feature.prototype = {
    constructor : Feature,
    // Test if CSS 3D transforms are supported
    css3Dtransform : (function() {
        var test = STYLESUPPORTED("perspective");
        return !!test;
    })(),

    // Test if CSS transforms are supported
    cssTransform : (function() {
        var test = STYLESUPPORTED("transformOrigin");
        return !!test;
    })(),

    // Test if CSS transitions are supported
    cssTransition : (function() {
        var test = STYLESUPPORTED("transition");
        return !!test;
    })(),

    // Test if addEventListener is supported
    addEventListener : !!WIN.addEventListener,

    // Test if querySelectorAll is supported
    querySelectorAll : !!DOC.querySelectorAll,

    // Test if matchMedia is supported
    matchMedia : !!WIN.matchMedia,

    // Test if Device Motion is supported
    deviceMotion : ("DeviceMotionEvent" in WIN),

    // Test if Device Orientation is supported
    deviceOrientation : ("DeviceOrientationEvent" in WIN),

    // Test if Context Menu is supported
    contextMenu : ("contextMenu" in HTML && "HTMLMenuItemElement" in WIN),

    // Test if classList API is supported
    classList : ("classList" in HTML),

    // Test if placeholder attribute is supported
    placeholder : ("placeholder" in create("input")),

    // Test if localStorage is supported
    localStorage : (function() {
        var test = "x";
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(err) {
            return false;
        }
    })(),

    // Test if History API is supported
    historyAPI : (WIN.history && "pushState" in WIN.history),

    // Test if ServiceWorkers are supported
    serviceWorker : ("serviceWorker" in navigator),

    // Test if viewport units are supported
    viewportUnit : (function() {
        var test = STYLESUPPORTED("width","1vw");
        return !!test;
    })(),
    // Test if REM units are supported
    remUnit : (function() {
        var test = STYLESUPPORTED("width","1rem");
        return !!test;
    })(),
    flex : (function() {
        var test = STYLESUPPORTED("flex-basis","1px");
        return !!test;
    })(),
    flexLegacy : (function() {
        var test = STYLESUPPORTED('box-direction', 'reverse');
        return !!test;
    })(),
    flexTweener : (function() {
        var test = STYLESUPPORTED('flex-align', 'end');
        return !!test;
    })(),
    flexWrap : (function() {
        var test = STYLESUPPORTED("flex-wrap","wrap");
        return !!test;
    })(),





    // Test if Canvas is supported
    canvas : (function(el) {
        return !!(el.getContext && el.getContext("2d"));
    })(create("canvas")),

    // Test if SVG is supported
    svg : !!DOC.createElementNS && !!DOC.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,

    // Test if WebGL is supported
    webGL : (function(el) {
        try {
            return !!(WIN.WebGLRenderingContext && (el.getContext("webgl") || el.getContext("experimental-webgl")));
        } catch(err) {
            return false;
        }
    })(create("canvas")),

    // Test if cors is supported
    cors : ("XMLHttpRequest" in WIN && "withCredentials" in new XMLHttpRequest()),

    // Tests if touch events are supported, but doesn't necessarily reflect a touchscreen device
    touch : !!(("ontouchstart" in WIN) || WIN.navigator && WIN.navigator.msPointerEnabled && WIN.MSGesture || WIN.DocumentTouch && DOC instanceof DocumentTouch),

    // Test if async attribute is supported
    //async : ("async" in util.create("script")),

    // Test if defer attribute is supported
    //defer : ("defer" in util.create("script")),

    // Test if Geolocation is supported
    geolocation : ("geolocation" in navigator),

    // Test if img srcset attribute is supported
    srcset : ("srcset" in create("img")),

    // Test if img sizes attribute is supported
    sizes : ("sizes" in create("img")),

    // Test if Picture element is supported
    pictureElement : ("HTMLPictureElement" in WIN),

    // Run all the tests and add supported classes
    testAll : function() {
        var classes = " js";
        for (var test in this) {
            if (test !== "testAll" && test !== "constructor") {
                classes += " "+(this[test]?"":"no-") + test;
            }
        }
        HTML.className += classes.toLowerCase();
    }

};
Lib["feature"] = new Feature();


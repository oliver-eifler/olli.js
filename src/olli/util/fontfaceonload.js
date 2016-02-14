import {WIN,DOC} from "../const.js";
import {object} from "../helper.js";
import {sandboxBody} from "../util/sandbox.js";
import Promise from "../polyfills/promise.js";

export default (function (undefined) {
    /* forked from https://github.com/zachleat/fontfaceonload */

    var TEST_STRING = 'AxmTYklsjo190QW',
        SANS_SERIF_FONTS = 'sans-serif',
        SERIF_FONTS = 'serif',

        defaultOptions = {
            tolerance: 2, // px
            delay: 100,
            glyphs: '',
            success: function () {
            },
            error: function () {
            },
            timeout: 5000,
            weight: '400', // normal
            style: 'normal'
        },

    // See https://github.com/typekit/webfontloader/blob/master/src/core/fontruler.js#L41
        style = [
            'display:block',
            'position:absolute',
            'top:-999px',
            'left:-999px',
            'font-size:48px',
            'width:auto',
            'height:auto',
            'line-height:normal',
            'margin:0',
            'padding:0',
            'font-variant:normal',
            'white-space:nowrap'
        ],
        html = '<div style="%s">' + TEST_STRING + '</div>',
        cache = object(null);
    /*Helper*/
    function cleanFamilyName(family) {
        return family.replace(/[\'\"]/g, '').toLowerCase();
    };

    function cleanWeight(weight) {
        // lighter and bolder not supported
        var weightLookup = {
            normal: '400',
            bold: '700'
        };

        return '' + (weightLookup[weight] || weight);
    };

    var FontFaceOnloadInstance = function () {
        this.fontFamily = '';
        this.appended = false;
        this.serif = undefined;
        this.sansSerif = undefined;
        this.parent = undefined;
        this.options = {};
    };

    FontFaceOnloadInstance.prototype = {
        constructor: FontFaceOnloadInstance,

        getMeasurements: function () {
            return {
                sansSerif: {
                    width: this.sansSerif.offsetWidth,
                    height: this.sansSerif.offsetHeight
                },
                serif: {
                    width: this.serif.offsetWidth,
                    height: this.serif.offsetHeight
                }
            };
        },

        load: function () {
            var startTime = new Date(),
                that = this,
                serif = that.serif,
                sansSerif = that.sansSerif,
                parent = that.parent,
                appended = that.appended,
                dimensions,
                options = that.options,
                ref = options.reference;

            function getStyle(family) {
                return style
                    .concat(['font-weight:' + options.weight, 'font-style:' + options.style])
                    .concat("font-family:" + family)
                    .join(";");
            }

            var sansSerifHtml = html.replace(/\%s/, getStyle(SANS_SERIF_FONTS)),
                serifHtml = html.replace(/\%s/, getStyle(SERIF_FONTS));

            if (!parent) {
                parent = that.parent = DOC.createElement("div");
            }

            parent.innerHTML = sansSerifHtml + serifHtml;
            sansSerif = that.sansSerif = parent.firstChild;
            serif = that.serif = sansSerif.nextSibling;

            if (options.glyphs) {
                sansSerif.innerHTML += options.glyphs;
                serif.innerHTML += options.glyphs;
            }

            function hasNewDimensions(dims, el, tolerance) {
                return Math.abs(dims.width - el.offsetWidth) > tolerance ||
                    Math.abs(dims.height - el.offsetHeight) > tolerance;
            }

            function isTimeout() {
                return ( new Date() ).getTime() - startTime.getTime() > options.timeout;
            }

            (function checkDimensions() {
                if (!ref) {
                    //ref = DOC.body;
                    ref = sandboxBody()||DOC.body;
                }
                if (!appended && ref) {
                    ref.appendChild(parent);
                    appended = that.appended = true;

                    dimensions = that.getMeasurements();

                    // Make sure we set the new font-family after we take our initial dimensions:
                    // handles the case where FontFaceOnload is called after the font has already
                    // loaded.
                    sansSerif.style.fontFamily = that.fontFamily + ', ' + SANS_SERIF_FONTS;
                    serif.style.fontFamily = that.fontFamily + ', ' + SERIF_FONTS;
                }

                if (appended && dimensions &&
                    ( hasNewDimensions(dimensions.sansSerif, sansSerif, options.tolerance) ||
                    hasNewDimensions(dimensions.serif, serif, options.tolerance) )) {

                    that.success();
                } else if (isTimeout()) {
                    that.error();
                } else {
                    if (!appended && "requestAnimationFrame" in window) {
                        WIN.requestAnimationFrame(checkDimensions);
                    } else {
                        WIN.setTimeout(checkDimensions, options.delay);
                    }
                }
            })();
        }, // end load()


        checkFontFaces: function (timeout) {
            var _t = this;
            DOC.fonts.forEach(function (font) {
                if (cleanFamilyName(font.family) === cleanFamilyName(_t.fontFamily) &&
                    cleanWeight(font.weight) === cleanWeight(_t.options.weight) &&
                    font.style === _t.options.style) {
                    font.load().then(function () {
                        _t.success();
                        WIN.clearTimeout(timeout);
                    });
                }
            });
        },
        success: function() {
            var _t = this,
                options = _t.options;
            options.success({
                family: _t.fontFamily,
                weight: cleanWeight(options.weight),
                style: options.style,
                timeout:false
            });
        },
        error: function() {
            var _t = this,
                options = _t.options;
            options.error({
                family: _t.fontFamily,
                weight: cleanWeight(options.weight),
                style: options.style,
                timeout:true
            });
        },

        init: function (fontFamily, options) {
            var timeout,
                _t = this;
            /*
            for (var j in defaultOptions) {
                if (!options.hasOwnProperty(j)) {
                    options[j] = defaultOptions[j];
                }
            }
            */
            _t.options = options;
            _t.fontFamily = fontFamily;
            // For some reason this was failing on afontgarde + icon fonts.
            if (!options.glyphs && "fonts" in DOC) {
                if (options.timeout) {
                    timeout = WIN.setTimeout(function () {
                        _t.error();
                    }, options.timeout);
                }
                _t.checkFontFaces(timeout);
            } else {
                _t.load();
            }
        }
    };

    return function fontfaceonload(fontFamily, options) {
        options = options||{};
        for (var j in defaultOptions) {
            if (!options.hasOwnProperty(j)) {
                options[j] = defaultOptions[j];
            }
        }
        var name=cleanFamilyName(fontFamily.replace(' ',''))+':'+options.style+':'+cleanWeight(options.weight);

        return cache[name] = cache[name]||new Promise(function (resolve, reject) {
            options.success = function(res) {
                resolve(res);
            };
            options.error = function(res) {
                reject(res);
            };
            var instance =  new FontFaceOnloadInstance();
            instance.init(fontFamily, options);
        });
    };
})();

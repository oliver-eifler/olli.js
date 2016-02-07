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
 * StyleHooks  ;)
 */

import {VENDOR_PREFIXES,HTML} from "../const.js";
import {keys} from "../helper.js";


   // Helper for CSS properties access
    var reDash = /\-./g,
        hooks = {get: {}, set: {}, find: function(name, style) {
            var propName = name.replace(reDash, function(str)  {return str[1].toUpperCase()});

            if (!(propName in style)) {
                propName = VENDOR_PREFIXES
                    .map(function(prefix)  {return prefix + propName[0].toUpperCase() + propName.slice(1)})
                    .filter(function(prop)  {return prop in style})[0];
            }

            return this.get[name] = this.set[name] =propName;
        }},
        directions = ["Top", "Right", "Bottom", "Left"],
        shortCuts = {
            font: ["fontStyle", "fontSize", "/", "lineHeight", "fontFamily"],
            padding: directions.map(function(dir)  {return "padding" + dir}),
            margin: directions.map(function(dir)  {return "margin" + dir}),
            "border-width": directions.map(function(dir)  {return "border" + dir + "Width"}),
            "border-style": directions.map(function(dir)  {return "border" + dir + "Style"})
        };

    // Exclude the following css properties from adding px
    "float fill-opacity font-weight line-height opacity orphans widows z-index zoom".split(" ").forEach(function(propName)  {
        var stylePropName = propName.replace(reDash, function(str)  {return str[1].toUpperCase()});

        if (propName === "float") {
            stylePropName = "cssFloat" in HTML.style ? "cssFloat" : "styleFloat";
            // normalize float css property
            hooks.get[propName] = hooks.set[propName] = stylePropName;
        } else {
            hooks.get[propName] = stylePropName;
            hooks.set[propName] = function(value, style)  {
                style[stylePropName] = value.toString();
            };
        }
    });

    // normalize property shortcuts
    keys(shortCuts).forEach(function(key)  {
        var props = shortCuts[key];

        hooks.get[key] = function(style)  {
            var result = [],
                hasEmptyStyleValue = function(prop, index)  {
                    result.push(prop === "/" ? prop : style[prop]);

                    return !result[index];
                };

            return props.some(hasEmptyStyleValue) ? "" : result.join(" ");
        };

        hooks.set[key] = function(value, style)  {
            if (value && "cssText" in style) {
                // normalize setting complex property across browsers
                style.cssText += ";" + key + ":" + value;
            } else {
                props.forEach(function(name)  {return style[name] = typeof value === "number" ? value + "px" : value.toString()});
            }
        };
    });

export default hooks;
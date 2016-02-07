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
 * css - set/get $Element Styles  ;)
 */
_.define("css",function(global,undefined) {
eval(_.include(["consts","util","core"]));

/*@endexclude*/
    // Helper for CSS properties access
    var css$stylehooks$$reDash = /\-./g,
        css$stylehooks$$hooks = {get: {}, set: {}, find: function(name, style) {
            var propName = name.replace(css$stylehooks$$reDash, function(str)  {return str[1].toUpperCase()});

            if (!(propName in style)) {
                propName = VENDOR_PREFIXES
                    .map(function(prefix)  {return prefix + propName[0].toUpperCase() + propName.slice(1)})
                    .filter(function(prop)  {return prop in style})[0];
            }

            return this.get[name] = this.set[name] = propName;
        }},
        css$stylehooks$$directions = ["Top", "Right", "Bottom", "Left"],
        css$stylehooks$$shortCuts = {
            font: ["fontStyle", "fontSize", "/", "lineHeight", "fontFamily"],
            padding: css$stylehooks$$directions.map(function(dir)  {return "padding" + dir}),
            margin: css$stylehooks$$directions.map(function(dir)  {return "margin" + dir}),
            "border-width": css$stylehooks$$directions.map(function(dir)  {return "border" + dir + "Width"}),
            "border-style": css$stylehooks$$directions.map(function(dir)  {return "border" + dir + "Style"})
        };

    // Exclude the following css properties from adding px
    "float fill-opacity font-weight line-height opacity orphans widows z-index zoom".split(" ").forEach(function(propName)  {
        var stylePropName = propName.replace(css$stylehooks$$reDash, function(str)  {return str[1].toUpperCase()});

        if (propName === "float") {
            stylePropName = "cssFloat" in window.document.documentElement.style ? "cssFloat" : "styleFloat";
            // normalize float css property
            css$stylehooks$$hooks.get[propName] = css$stylehooks$$hooks.set[propName] = stylePropName;
        } else {
            css$stylehooks$$hooks.get[propName] = stylePropName;
            css$stylehooks$$hooks.set[propName] = function(value, style)  {
                style[stylePropName] = value.toString();
            };
        }
    });

    // normalize property shortcuts
    $object$keys(css$stylehooks$$shortCuts).forEach(function(key)  {
        var props = css$stylehooks$$shortCuts[key];

        css$stylehooks$$hooks.get[key] = function(style)  {
            var result = [],
                hasEmptyStyleValue = function(prop, index)  {
                    result.push(prop === "/" ? prop : style[prop]);

                    return !result[index];
                };

            return props.some(hasEmptyStyleValue) ? "" : result.join(" ");
        };

        css$stylehooks$$hooks.set[key] = function(value, style)  {
            if (value && "cssText" in style) {
                // normalize setting complex property across browsers
                style.cssText += ";" + key + ":" + value;
            } else {
                props.forEach(function(name)  {return style[name] = typeof value === "number" ? value + "px" : value.toString()});
            }
        };
    });

    var css$stylehooks$$default = css$stylehooks$$hooks;

    $Lib$register($Element,{css: function(name, value) {
            var this$0 = this,
                len = arguments.length,
                node = this[0],
                style = node.style,
                computed;

            if (len === 1 && (typeof name === "string" || $isArray(name))) {
                var strategy = function(name)  {
                    var getter = css$stylehooks$$default.get[name] || css$stylehooks$$default.find(name, style),
                        value = typeof getter === "function" ? getter(style) : style[getter];

                    if (!value) {
                        if (!computed) computed = $getComputedStyle(node);

                        value = typeof getter === "function" ? getter(computed) : computed[getter];
                    }

                    return value;
                };

                if (typeof name === "string") {
                    return strategy(name);
                } else {
                    return name.map(strategy).reduce(function(memo, value, index)  {
                        memo[name[index]] = value;

                        return memo;
                    }, {});
                }
            }

            if (len === 2 && typeof name === "string") {
                var setter = css$stylehooks$$default.set[name] || css$stylehooks$$default.find(name, style);

                if (typeof value === "function") {
                    value = value(this);
                }

                if (value == null) value = "";

                if (typeof setter === "function") {
                    setter(value, style);
                } else {
                    style[setter] = typeof value === "number" ? value + "px" : value.toString();
                }
            } else if (len === 1 && name && typeof name === "object") {
                $object$keys(name).forEach(function(key)  { this$0.css(key, name[key]) });
            } else {
                throw new OlliError("css", arguments);
            }

            return this;
        }},null,function() {return function(name,value) {
          if (arguments.length === 1 && $isArray(name)) {
              return {};
          }
          if (arguments.length !== 1 || typeof name !== "string") {
            return this;
          }
        }});
/*@exclude*/
});
/*@endexclude*/
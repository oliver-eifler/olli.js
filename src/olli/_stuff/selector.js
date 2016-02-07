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
 * selector engine ;)
 */
_.define("selector",function(global,undefined) {
eval(_.include(["consts","util","core"]));
/*@endexclude*/

    var $selector$matcher$isquick = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
        $selector$matcher$fn = (("matches" in HTML)?"matches":null) || VENDOR_PREFIXES.concat(null)
            .map(function(p)  {return (p ? p.toLowerCase() + "M" : "m") + "atchesSelector"})
            .reduceRight(function(propName, p)  {return propName || p in HTML && p}, null);

    var $selector$matcher = function(selector, context) {
        if (typeof selector !== "string") return null;

        var quick = $selector$matcher$isquick.exec(selector);

        if (quick) {
            // Quick matching is inspired by jQuery:
            //   0  1    2   3          4
            // [ _, tag, id, attribute, class ]
            if (quick[1]) quick[1] = quick[1].toLowerCase();
            if (quick[3]) quick[3] = quick[3].split("=");
            if (quick[4]) quick[4] = " " + quick[4] + " ";
        }

        return function(node) {
            if (node.window && node.window === node)
                return false;
            var result, found;
            if (!quick && !$selector$matcher$fn) {
                found = (context || node.ownerDocument).querySelectorAll(selector);
            }

            for (; node && node.nodeType === 1; node = node.parentNode) {
                if (quick) {
                    result = (
                        (!quick[1] || node.nodeName.toLowerCase() === quick[1]) &&
                        (!quick[2] || node.id === quick[2]) &&
                        (!quick[3] || (quick[3][1] ? node.getAttribute(quick[3][0]) === quick[3][1] : node.hasAttribute(quick[3][0]))) &&
                        (!quick[4] || (" " + node.className + " ").indexOf(quick[4]) >= 0)
                    );
                } else {
                    if ($selector$matcher$fn) {
                        result = node[$selector$matcher$fn](selector);
                    } else {
                        var index = 0,
                            len = found.length;
                        for (var n ;index < len;){
                            n = (found[index++]);
                            if (n === node) return n;
                        };
                        index = len = void 0;
                    }
                }

                if (result || !context || node === context) break;
            }

            return result && node;
        };
    };

  var $selector$rescape = /'|\\/g;
  $Lib$register($BaseElement,{
      find: false,
      findAll: true
      },function(methodName, all)  {return function(selector) {
            var node=this[0],fn = node["querySelector"+(all?"All":"")],result,nid,old = true;
            if (!fn)
                return all?[]:$Element();
            if (node !== node.ownerDocument.documentElement) {
                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                if ( (old = node.getAttribute("id")) ) {
                    nid = old.replace($selector$rescape, "\\$&");
                } else {
                    nid = "<%= prop('DOM') %>";
                    node.setAttribute("id", nid);
                }
                nid = "[id='" + nid + "'] ";
                selector = nid + selector.split(",").join("," + nid);
            }
            result = fn.call(node,selector);
            if (!old) node.removeAttribute("id");
            return all?$array$map.call(result,$Element):$Element(result);
            //return all?$NodeList(result):$Element(result);
        }},function() {return function() {return all?[]:this;}}
   );

  $Lib$register($BaseElement,{
    matches: function(selector) {
        if (!selector || typeof selector !== "string")
            throw new OlliError("matches", arguments);
        var matcher = $selector$matcher(selector);
        return !!matcher(this[0]);
    }},null,function() {return function() {return false;}}
  );

/*@exclude*/
 return {
   $selector$matcher : $selector$matcher
 }
});
/*@endexclude*/
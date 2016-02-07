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
 * selectormatcher ;)
 */
import {HTML,VENDOR_PREFIXES} from "../const.js";

    var isquick = /^(\w*)(?:#([\w\-]+))?(?:\[([\w\-\=]+)\])?(?:\.([\w\-]+))?$/,
        matchfn = (("matches" in HTML)?"matches":null) || VENDOR_PREFIXES.concat(null)
            .map(function(p)  {return (p ? p.toLowerCase() + "M" : "m") + "atchesSelector"})
            .reduceRight(function(propName, p)  {return propName || p in HTML && p}, null);

    export default function(selector, context) {
        if (typeof selector !== "string") return null;

        var quick = isquick.exec(selector);

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
            if (!quick && !matchfn) {
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
                    if (fn) {
                        result = node[matchfn](selector);
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

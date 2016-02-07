/**
 * Created by darkwolf on 08.11.2015.
 */
import {$Document,$Element} from "../types/base.js";
import {register,isString,isStringEmpty,OlliError} from "../helper.js";

/*tagName.match(/[^a-zA-Z0-9]/)*/
var prop = "<%= prop('sandbox') %>";
register($Document,{
    create: "",
    createAll: "All"

}, function(methodName, all)  {return function(value) {
    var doc = this[0].ownerDocument,
        sandbox = this._[prop];

    if (!isString(value) || isStringEmpty(value)) {
        throw new OlliError(methodName,arguments);
    }

    if (!sandbox) {
        sandbox = doc.createElement("div");
        this._[prop] = sandbox;
    }

    var nodes, el;
    value = value.trim();

    if (!value.match(/[^a-zA-Z0-9]/)) {
        nodes = doc.createElement(value.toLowerCase());
        if (all) nodes = [ new $Element(nodes) ];
    } else {
        value = value.trim();
/*
        if (value[0] !== "<" && value[value.length - 1] === ">") {
            value = "<"+value;
        }
        if (value[value.length - 1] !== ">") {
            value = value+">";
        }
*/
        sandbox.innerHTML = value; // parse input HTML string

        for (nodes = all ? [] : null; el = sandbox.firstChild; ) {
            sandbox.removeChild(el); // detach element from the sandbox

            if (el.nodeType === 1) {
                if (all) {
                    nodes.push(new $Element(el));
                } else {
                    nodes = el;

                    break; // stop early, because need only the first element
                }
            }
        }
    }

    return all ? nodes : $Element(nodes);
}});

/**
 * Created by darkwolf on 10.01.2016.
 */
import {register} from "../helper.js";
import {$Element,$NullElement} from "../types/base.js";
import {Lib} from "../core.js";



register($Element,{
    clone: function(deep) {
        if (deep !== false)
            deep = true;

        var node = this[0], result;
        if (!node.cloneNode) {
            result = Lib.create(node.outerHTML);
            if (!deep)
                result.set("");
        } else {
            result = new $Element(node.cloneNode(deep));
        }

        return result;
    }
}, null, function()  {return function()  {return new $NullElement()}});

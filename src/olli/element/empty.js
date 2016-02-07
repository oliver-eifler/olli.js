/**
 * Created by darkwolf on 10.01.2016.
 */
import {$Element} from "../types/base.js";
import {register} from "../helper.js";
import "../element/value.js";

register($Element,{
        empty: function() {
            return this.value("");
        }
    }, null, function() {return function () {return this;}}
);

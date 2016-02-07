/**
 * Created by darkwolf on 06.02.2016.
 */
import {Lib} from "../core.js";
import {$Element} from "../types/base.js";
import getse from "../polyfills/scrollingelement.js";
Lib["scrollingElement"] = function() {return $Element(getse());};
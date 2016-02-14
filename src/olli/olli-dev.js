//rollup -f umd -n olli -i web-html/_assets/es6/olli/olli.js -o web-html/js/bundle.js
//polyfills
//import "./polyfills/promise.js";
// olli.js - ES6
import "./document/create.js";

import "./element/manipulation.js";
import "./element/find.js";
import "./element/matches.js";
import "./element/class.js";
import "./element/css.js";
import "./element/clientsize.js";
import "./element/getset.js";

import "./events/event.js";
import "./events/resizeend.js";
import "./events/resizefont.js";

import "./module/frame.js";
import "./module/ready.js";
import "./module/xhr.js";
import "./document/loadScript.js";
import "./document/loadCSS.js";

import {Lib} from "./core.js";
export default Lib;

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
 * class functions for $Element;)
 */
_.define("event",function(global,undefined) {
eval(_.include(["consts","util","core","selector"]));
/*@endexclude*/

    var event$hooks = {};
    if ("onfocusin" in HTML) {
        event$hooks.focus = function(handler) { handler._type = "focusin" };
        event$hooks.blur = function(handler) { handler._type = "focusout" };
    } else {
        // firefox doesn't support focusin/focusout events
        event$hooks.focus = event$hooks.blur = function(handler) { handler.capturing = true };
    }
    if (DOC.createElement("input").validity) {
        event$hooks.invalid = function(handler) { handler.capturing = true };
    }
    event$hooks.blubber = function(handler) { handler._type = "click" };
//!hook for transition end;
  (function () {
    var transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'otransitionend'
    };
    for(var t in transitions){
      if(HTML.style[t] !== undefined){
        event$hooks.transitionend = function(handler) { handler._type = transitions[t] };
        break;
      }
    }
  })();
//!Special Olli Events create & remove hooks - i.e. font:resize
    var event$creators = {};
    var event$removers = {};


  function event$getProperty(name, e, type, node, target, currentTarget) {

      if (typeof name === "number") {
          var args = e["<%= prop() %>"];

          return args ? args[name] : void 0;
      }
      if ($isString(name))
      {
        switch (name) {
        case "type":
            return type;
        case "event":
            return e;
        case "defaultPrevented":
            // IE8 and Android 2.3 use returnValue instead of defaultPrevented
            return "defaultPrevented" in e ? e.defaultPrevented : e.returnValue === false;
        case "target":
            return $Element(target);
        case "currentTarget":
            return $Element(currentTarget);
        case "relatedTarget":
            return $Element(e.relatedTarget || e[(e.toElement === node ? "from" : "to") + "Element"]);
        }

        var value = e[name] || name;
        if (typeof value === "function") {
            return function()  {return value.apply(e, arguments)};
        }
        return value;
      }
      return name;
  }





    function event$handler($element,type,selector,props,callback,once) {
        var node = $element[0]
            ,hook = event$hooks[type]
            ,matcher = $selector$matcher(selector,node)

        var handler = function(e) {
            e = e || WIN.event;
            if (event$handler.skip === type) return;

            // srcElement can be null in legacy IE when target is document
            var target = e.target || e.srcElement || node.ownerDocument.documentElement,
                currentTarget = matcher ? matcher(target) : node,
                args = props || [];

            if (!currentTarget)
                return;
            // off callback even if it throws an exception later
            if (once) el.off(type, callback);

            if (props) {
                    args = args.map(function(name)  {return event$getProperty(
                        name, e, type, node, target, currentTarget)});
            } /*else {
                args = slice.call(e["<%= prop() %>"] || [0], 1);
            }*/

            if (callback.apply($element,args) === false) {
                e.preventDefault();
            }
        };
        if (hook) handler = hook(handler, type) || handler;

        handler.type = type;
        handler.callback = callback;
        handler.selector = selector;

        return handler;
    }
    event$handler.skip = null;

    $Lib$register($BaseElement,{
      on: false,
      once: true
      },function(methodName, once)  {return function(type,selector,args,callback) {
            var $this = this
                ,node = $this[0]
                ,creator = event$creators[type] || false;
            /*check arguments*/
            if (!$isString(type))
                throw new OlliError(methodName, arguments);
            if ($isFunction(args)) {
                callback = args;
                if ($isString(selector)) {
                    args = null;
                } else {
                    args = selector;
                    selector = null;
                }
            }
            if ($isFunction(selector)) {
                callback = selector;
                selector = null;
                args = null;
            }

            if (!$isFunction(callback)) {
                throw new OlliError(method, arguments);
            }
            /*!Create Stuff for Custom Event,if available*/
            if ($isFunction(creator) && !creator($this)) {
                    return $this;
            }
            var handler = event$handler($this,type,selector,args,callback,once);

            node.addEventListener(handler._type || type,handler,!!handler.capturing);
            // store event entry
            $this._["<%= prop('handler') %>"].push(handler);


           return $this;
      }},function() {return function() {return this;}}
    );

    $Lib$register($BaseElement,{off: function(type,selector,callback) {
        if (!$isString(type)) throw new OlliError("off", arguments);

        if (callback === undefined) {
            if ($isString(selector)) {
                callback = undefined;
            }
            else if ($isFunction(selector)) {
                callback = selector;
                selector = undefined;
            }
            else {
                callback = undefined;
                selector = undefined;
            }
        }

        var $this = this,node = $this[0];

        $this._["<%= prop('handler') %>"] = this._["<%= prop('handler') %>"].filter(function(handler) {
            var skip = type !== handler.type;

            skip = skip || selector && selector !== handler.selector;
            skip = skip || callback && callback !== handler.callback;

            if (skip) return true;

            type = handler._type || handler.type;
            node.removeEventListener(type, handler, !!handler.capturing);
        });

        return $this;
      }
    },null, function() {return function() {return this;}});


    $Lib$register($BaseElement,{fire: function(type) {
        var node = this[0],
            e, eventType, canContinue,doc;

        if ($isString(type)) {
            var hook = event$hooks[type],
                handler = {};

            if (hook) handler = hook(handler) || handler;

            eventType = handler._type || type;
        } else {
            throw new OlliError("fire", arguments);
        }
        //e = node.ownerDocument.createEvent("HTMLEvents");
        //e = (node.window && node.window === node)?node.document.createEvent("HTMLEvents"):node.ownerDocument.createEvent("HTMLEvents");
        e = ((node.window && node.window === node)?node.document:node.ownerDocument)["createEvent"]("HTMLEvents");
        e["<%= prop() %>"] = arguments;
        e.initEvent(eventType, true, true);
        canContinue = node.dispatchEvent(e);
        // call native function to trigger default behavior
        if (canContinue && node[type]) {
            // prevent re-triggering of the current event
            event$handler.skip = type;

            $safeCall(node, type);

            event$handler.skip = null;
        }

        return this;
    }
}, null, function() {return function() {return this;}});

$Lib.ready = function(callback) {
    if (!$isFunction(callback)) throw new OlliError("Olli.ready", arguments);
    var doc=this[0].ownerDocument;
    if (doc.readyState != 'loading'){
        callback(null);
    } else {
        doc.addEventListener('DOMContentLoaded', callback);
    }
}

/*@exclude*/
    return {
        event$hooks: event$hooks,
        event$creators: event$creators
    }
});
/*@endexclude*/

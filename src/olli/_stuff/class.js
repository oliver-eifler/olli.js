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
_.define("class",function(global,undefined) {
eval(_.include(["consts","util","core"]));
/*@endexclude*/

   $Element.fn.getClass = function() {
     return $TokenList(this[0].className || "");
   }
   $Element.fn.setClass = function(string) {
     this[0].className = $TokenList(string||"").toString();
     return this;
   }
   $Element.fn.hasClass = function(string) {
     var classes = $TokenList(this[0].className || ""),
     tokens = $TokenList(string)
     for (var i=0,n=tokens.length;i < n;i++) {
        if (!classes.contains(tokens[i]))
            return false;
     }
     return true;
   }
   $Element.fn.addClass = function(string) {
     var classes = $TokenList(this[0].className || "");
     $TokenList(string).forEach(function(token) {
        classes.add(token);
     });
     if (classes.updated)
        this[0].className = classes.toString();
     return this;
   }
   $Element.fn.removeClass = function(string) {
     var classes = $TokenList(this[0].className || "");
     $TokenList(string).forEach(function(token) {
        classes.remove(token);
     });
     if (classes.updated)
        this[0].className = classes.toString();
     return this;
   }
   $Element.fn.toggleClass = function(string) {
     var classes = $TokenList(this[0].className || "");
     $TokenList(string).forEach(function(token) {
        classes.toggle(token);
     });
     if (classes.updated)
        this[0].className = classes.toString();
     return this;
   }
  $NullElement.fn.getClass = function() {return $TokenList();};
  $NullElement.fn.hasClass = function() {return false;};
  $NullElement.fn.setClass = function() {return this;};
  $NullElement.fn.addClass = function() {return this;};
  $NullElement.fn.removeClass = function() {return this;};
  $NullElement.fn.toggleClass = function() {return this;};

/*@exclude*/
});
/*@endexclude*/
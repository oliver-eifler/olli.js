var hooks = {get: {}, set: {}};

// fix camel cased attributes
"tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap frameBorder contentEditable".split(" ").forEach(function(key)  {
    hooks.get[ key.toLowerCase() ] = function(node)  {return node[key]};
});

// style hook
hooks.get.style = function(node)  {return node.style.cssText};
hooks.set.style = function(node, value)  { node.style.cssText = value };

// title hook for DOM
hooks.get.title = function(node)  {
    var doc = node.ownerDocument;

    return (node === doc.documentElement ? doc : node).title;
};

hooks.set.title = function(node, value)  {
    var doc = node.ownerDocument;

    (node === doc.documentElement ? doc : node).title = value;
};

// some browsers don't recognize input[type=email] etc.
hooks.get.type = function(node)  {return node.getAttribute("type") || node.type};

export default hooks;
    /*
     $BaseElement => $Element => $Document
     => $Window
     */
    function $BaseElement(node) {
        if (this instanceof $BaseElement) {
            if (node) {
                node["<%= prop() %>"] = this;
                this[0] = node;
                this._ = {
                    "<%= prop('handler') %>": [],
                    "<%= prop('watcher') %>": [],
                    "<%= prop('throttle') %>": []
                };
            }
        } else if (node) {
            var fn = (node.window && node.window === node) ? $Window : (node.nodeType === 9) ? $Document : $Element;
            // create a wrapper only once for each native element
            return node["<%= prop() %>"] || new fn(node);
        } else {
            return new $NullElement();
        }
    }

    Object.defineProperty($BaseElement.prototype, 'version', {value: "<%= pkg.version %>"});

    function $Window(node) {
        node = node || window;
        return $BaseElement.call(this, node);
    }

    $Window.prototype = new $BaseElement();

    function $Element(node) {
        return $BaseElement.call(this, node);
    }
    /**
     * Used to represent an element in olli.js
     * @class $Element
     */

    $Element.prototype = new $BaseElement();

    function $NullElement() {
        this.length = 0;
    }
    $NullElement.prototype = new $Element();

    function $Document(node) {
        // use documentElement <html> for a $Document wrapper
        return $Element.call(this, node.documentElement);
    }

    $Document.prototype = new $Element();

    $BaseElement.fn = $BaseElement.prototype;
    $Window.fn = $Window.prototype;
    $NullElement.fn = $NullElement.prototype;
    $Element.fn = $Element.prototype;
    $Document.fn = $Document.prototype;

    $Window.fn.toString = function () {
        return "$Window"
    };
    $Element.fn.toString = function () {
        return "$Element <" + this[0].nodeName.toLowerCase() + ">"
    };
    $NullElement.fn.toString = function () {
        return "$NullElement"
    };
    $Document.fn.toString = function () {
        return "$Document"
    };
/*
    function $NodeList(nodes) {
        if (this instanceof $NodeList) {
            for (var i = 0; nodes && i < nodes.length; i++) {
                this.push($Element(nodes[i]));
            }
        } else {
            return new $NodeList(nodes);
        }
    }

    $NodeList.prototype = [];
    Object.defineProperty($NodeList.prototype, 'version', {value: "<%= pkg.version %>"});
*/
export {
    $BaseElement
        , $NullElement
        , $Element
        , $Document
        , $Window
};

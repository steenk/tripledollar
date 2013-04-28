/*
 * Copyright (C) 2013 Steen Klingberg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
(function () {
  var VERSION = '0.53';
/*
 * The tripple dollar function creates a DOM object.
 */
  window.$$$ = function () {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] !== 'string') {
      if (Array.isArray(args[0])) {
        return window.$$$.apply(this, args[0]);
      } else {
        return null;
      }
    }
    var ident = args.shift()
      , id = ident.split('#')[1]
      , cl = (ident.split('#')[0]).split('.')
      , type = cl.shift()
      , clazz = cl.join(' ').trim()
      , e = document.createElement(type);
    if (clazz) {
      e.className = clazz;
    };
    if (id) {
      e.setAttribute('id', id);
    };
            
    function allArgs (args) {
      for (var i=0; i<args.length; i++) {
        var param = args[i];
        if (param && param.nodeType) {
          e.appendChild(param);
        } else if (typeof param === 'object') {
          if (Array.isArray(param)) {
            e.appendChild(window.$$$.apply(this, param));
          } else {
            for (var a in param) {
              if (a.match(/^data./)) {
                var atr = a.substr(4).toLowerCase();
                e.setAttribute('data-' + atr, param[a]);
              } else {
                e.setAttribute(a, param[a]);
              }
            }
          }
        } else {
          e.appendChild(document.createTextNode(String(param)));
        }
      }
    };
    allArgs(args);
    /*
     * Add CSS to the element.
     */
    e.css = function (obj) {
      for (var k in obj) {
        this.style[k] = obj[k];
      };
      return this;
    };
    e.set = function (key, val) {
      this[key] = val;
      return this;
    };
    e.fun = function (func, args) {
      this[func].apply(this, args);
      return this;
    };
    /*
     * Add event listener
     */
    e.evt = function (ev, func) {
      if (arguments.length > 2) {
        var args = Array.prototype.slice.call(arguments, 2);
        this.addEventListener(ev, function (e) {var a = [e].concat(args); func.apply(this, a)});
      } else {
        this.addEventListener(ev, func);
      }
      return this;
    };
    e.ins = function () {
      var args = Array.prototype.slice.call(arguments);
      allArgs(args);
    };
    e.$ = e.querySelectorAll;
    e.prototype = e;
    return e;
  };

  window.$$$.version = VERSION;

  /*
   * Structify an element node
   */
  window.$$$.structify = function (elem) {
    if (elem.nodeType === 1) {
      function dig (c) {
        var l = [];
        var name = c.localName;
        var cname = c.className.replace(' ', '.');
        if (cname) {
          name += '.'+cname;
        };
        if (c.id) {
          name += '#'+c.id;
        };
        l.push(name);
        if (c.hasAttributes()) {
          var attrs = c.attributes;
          var attr = {};
          for (var i=0; i<attrs.length; i++) {
            if (!attrs[i].name.match(/id|class|contenteditable/)) {
              attr[attrs[i].name] = attrs[i].value;
              l.push(attr);
            }
          }
        }
        c.normalize();
        var ch = c.childNodes;
        for (var i=0; i<ch.length; i++) {
          if(ch[i].nodeType === 3) {
            var s = ch[i].data.replace(/\s\s*/,' ');
            if (s.length > 0) {
              l.push(s);
            }
          } else if (ch[i].nodeType === 1) {
            l.push(dig(ch[i]));
          }
        }
        return l;
      }
    }
    var td = dig(elem);
    return td;
  }

  /*
   * In case a $ function is not initialized.
   */
  if (! window.$ && document.querySelectorAll) {window.$ = function (sel) { return document.querySelectorAll(sel);}};

})();  

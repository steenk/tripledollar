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
  /**
   * @version
   */
  var VERSION = '0.7.3';

  /**
   * Namespaces
   */
   var ns = {
    svg: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink',
    xhtml: 'http://www.w3.org/1999/xhtml'
   }
/**
 * The triple dollar function creates a DOM object.
 */
  var $$$ = function () {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] !== 'string') {
      if (Object.prototype.toString.call(args[0]) === '[object Array]') {
        return $$$.apply(this, args[0]);
      }
    }

    /**
     * Splitting up the ident parameter into element type, id, and class names. 
     */
    var ident = args.shift()
     ,  n = ident.split(/[\.#]/)
     ,  t = ident.split(/[^\.#]+/)
     ,  e;
    if (t[0] == '') {
      t.shift();
    }
    for (var i=0; i<n.length; i++) {
      if (i === 0) {
        var m = n[0].split(':');
        if (Object.keys(ns).indexOf(m[0]) > -1) {
		   e = document.createElementNS(ns[m[0]], m[1] || m[0]);
		} else {
          e = document.createElement(m[1] || m[0]);
		}
      } else {
        if (t[i-1] === '.') {
          e.classList.add(n[i]);
        } else if (t[i-1] === '#') {
          e.setAttribute('id', n[i]);
        }
      }
    };

    function allArgs (args) {
      for (var i=0; i<args.length; i++) {
        var param = args[i];
        if (param && param.nodeType) {
          e.appendChild(param);
        } else if (typeof param === 'object') {
          if (Object.prototype.toString.call(param) === '[object Array]') {
            e.appendChild($$$.apply(this, param));
          } else {
            for (var a in param) {
              if (a.match(/^data./)) {
                var atr = a.substr(4).toLowerCase();
                e.setAttribute('data-' + atr, param[a]);
              } else {
				var m = a.split(':');
				if (m.length === 2 && Object.keys(ns).indexOf(m[0]) > -1) {
                  e.setAttributeNS(ns[m[0]], m[1], param[a]);
				} else {
				  e.setAttribute(a, param[a]);
				}
              }
            }
          }
        } else {
          e.appendChild(document.createTextNode(String(param)));
        }
      }
    };
    allArgs(args);
    /**
     * Add CSS to the element.
     */
    e.css = function (obj) {
      for (var k in obj) {
        this.style[k] = obj[k];
      };
      return this;
    };
    /**
     * Set a property.
     */
    e.set = function (key, val) {
      this[key] = val;
      return this;
    };
    /**
     * Run a function.
     */
    e.fun = function (func) {
      var args = Array.prototype.slice.call(arguments, 1);
      this[func].apply(this, args);
      return this;
    };
    /**
     * Add event listener
     */
    e.evt = function (ev, func) {
      if (arguments.length > 2) {
        var args = Array.prototype.slice.call(arguments, 2);
        if (this.addEventListener) {
          this.addEventListener(ev, function (e) {var a = [e].concat(args); func.apply(this, a)}, false);
        } else {
          this.attachEvent('on'+ev, function (e) {var a = [e].concat(args); func.apply(this, a)});
        }
      } else {
        if (this.addEventListener) {
          this.addEventListener(ev, func, false);
        } else {
          this.attachEvent('on'+ev, func);
        }
      }
      return this;
    };
    /**
     * Insert more things to this element
     */
    e.ins = function () {
      var args = Array.prototype.slice.call(arguments);
      allArgs(args);
	  return this;
    };
    /**
     * Add aliases for a CSS selectors
     */
	e.query = e.querySelector;
    e.queryAll = e.querySelectorAll;
    e.prototype = e;
    return e;
  };

  $$$.version = VERSION;

  /**
   * Structify an element node
   */
  $$$.structify = function (elem) {
    var td = null;
    if (elem.nodeType === 1) {
      function dig (c) {
        var l = []
         ,  name = c.localName
         ,  cname = String(c.className).replace(' ', '.');
        if (cname) {
          name += '.'+cname;
        };
        if (c.id) {
          name += '#'+c.id;
        };
        l.push(name);
        if (c.hasAttributes()) {
          var attrs = c.attributes
           ,  attr = {};
          for (var i=0; i<attrs.length; i++) {
            if (!attrs[i].name.match(/id|class|contenteditable/)) {
              attr[attrs[i].name] = attrs[i].value;              
            }
          }
          if (Object.keys(attr).length > 0) {
            l.push(attr);
          }
        }
        c.normalize();
        var ch = c.childNodes;
        for (var i=0; i<ch.length; i++) {
          if(ch[i].nodeType === 3) {
            var s = ch[i].data.replace(/\s\s*/,' ').trim();
            if (s.length > 0) {
              l.push(s);
            }
          } else if (ch[i].nodeType === 1) {
            l.push(dig(ch[i]));
          }
        }
        return l;
      }
      td = dig(elem);
    }
    return td;
  }

  /**
   * Check if DOM content is loaded.
   */
  $$$.onReady = function (func) {
    if (document.readyState === 'complete') {
      func();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', func, false);
    } else {
      document.attachEvent('onreadystatechange', func);
    }
  }

  /**
   * setImmediate substitute
   */
  var doNext;
  if (window.setImmediate) {
     doNext = window.setImmediate;
  } else {
    var q = []
    ,   id = 'doNext' + (Math.random()*67108864|0).toString(16)
    ,   react = function (evt) {
          if (evt.source === window &&
            typeof evt.data === "string" &&
            evt.data.indexOf(id) === 0) {
              var f = q.shift();
              f.length > 0 && f[0].apply(null, f.splice(1));
          }
    }
    if (window.postMessage) {
      if (window.addEventListener) {
        window.addEventListener('message', react, false);
      } else {
        window.attachEvent('message', react);
      }
    }
    doNext = function () {
	   var args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === 'function') {
        q.push(args);
        window.postMessage(id, '*');
      }
    }
  } 
  $$$.setImmediate = doNext;

  /**
   * A shortcut for placing the content on the web page.
   */
  $$$.appendToDoc = function () {
    var args = Array.prototype.slice.call(arguments)
  , me = this;
  me.follow = [];
  me.emit = function () {
    me.follow.forEach(function (f) {
      doNext(f);
    })
  }
  me.then = function (what) {
    if (typeof what === 'function') {
      me.follow.push(what);
    } else {
      console.log('$$$: Only functions can be passed to "then()"!');
    }
    return me;
  }
    $$$.onReady(function () {
      for (var i=0; i<args.length; i++) {
        if (Object.prototype.toString.call(args[i]) === '[object Array]') {
          document.body.appendChild($$$(args[i]));
        } else if (args[i] instanceof HTMLElement || args[i] instanceof SVGSVGElement) {
          document.body.appendChild(args[i]);
        } else if (typeof args[i] === 'function') {
            args[i]();
        }
      }
      doNext(me.emit);
    })
  return me;
  }

  /**
   * Use AMD if a module loader is in place.
   */
  if (typeof define === 'function') {
    define(function (require) {
      return $$$;
    }) 
  } else {
    window.$$$ = $$$;
    window.tripledollar = $$$.appendToDoc;
  }

  /**
   * In case a $ function is not initialized.
   * Using $ is DEPRECATED, adding shortcuts to $$$ instead.
   */
  $$$.query = function (sel) { return document.querySelector(sel);};
  $$$.queryAll = function (sel) { return document.querySelectorAll(sel);};

})();

/*
 * Copyright (C) 2013-2015 Steen Klingberg
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
(function (window) {
    "use strict";
    /**
     * @version
     */
    var VERSION = '0.9.6',

        /**
         * Namespaces
         */
        ns = {
            svg: 'http://www.w3.org/2000/svg',
            xlink: 'http://www.w3.org/1999/xlink',
            xhtml: 'http://www.w3.org/1999/xhtml'
        },
        /**
         * The triple dollar function creates a DOM object.
         * @method $$$ the DOM constructor
         */
        $$$ = function () {
            /**
             * Splitting up the ident parameter into element type, id, and class names. 
             */
            var args = Array.prototype.slice.call(arguments),
                ident,
                n,
                t,
                e,
                i,
                m,
                c,
				a,
                re = /^[A-Za-z][A-Za-z0-9-_\.:#]*$/;
            if (typeof args[0] !== 'string') {
                if (Object.prototype.toString.call(args[0]) === '[object Array]') {
                    return $$$.apply(this, args[0]);
                }
                return;
            }
            ident = args.shift();
            n = ident.split(/[\.#]/);
            t = ident.split(/[^\.#]+/);
            if (t[0] === '') {
                t.shift();
            }
            for (i = 0; i < n.length; i++) {
                if (n[i] && !n[i].match(re)) {
                    return;
                }
                if (i === 0) {
                    m = n[0].split(':');
                    if (Object.keys(ns).indexOf(m[0]) > -1) {
                        e = document.createElementNS(ns[m[0]], m[1] || m[0]);
                    } else {
                        e = document.createElement(m[1] || m[0]);
                    }
                } else {
                    if (e && t[i - 1] === '.') {
                        a = e.getAttribute('class');
						c = a ? a.split(' ') : [];
                        if (n[i] && c.indexOf(n[i]) === -1) {
                            c.push(n[i]);
                            e.setAttribute('class', c.join(' '));
						}
                    } else if (t[i - 1] === '#') {
                        e.setAttribute('id', n[i]);
                    }
                }
            }

            function allArgs(args) {
                var param,
                    j,
                    r,
                    a,
                    atr;
                for (j = 0; j < args.length; j++) {
                    param = args[j];
                    if (param && param.nodeType) {
                        e.appendChild(param);
                    } else if (typeof param === 'object') {
                        if (Object.prototype.toString.call(param) === '[object Array]') {
                            e.appendChild($$$.apply(this, param));
                        } else {
                            for (a in param) {
                                if (param.hasOwnProperty(a)) {
                                    if (a.match(/^data./)) {
                                        atr = a.substr(4).toLowerCase();
                                        e.setAttribute('data-' + atr, param[a]);
                                    } else {
                                        r = a.split(':');
                                        if (r.length === 2 && Object.keys(ns).indexOf(r[0]) > -1) {
                                            e.setAttributeNS(ns[r[0]], r[1], param[a]);
                                        } else {
                                            e.setAttribute(a, param[a]);
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        e.appendChild(document.createTextNode(String(param)));
                    }
                }
            }
            allArgs(args);
            /**
             * Add CSS to the element.
             * @method css
             * @param {Object} obj A property object with CSS.
             */
            function css (obj) {
                var k, o, i;
                for (k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        if (typeof obj[k] !== 'object') {
                            this.style[k] = obj[k];
                        } else {
                            o = this.querySelectorAll(k);
                            for (i = 0; i < o.length; i++) {
                                css.call(o[i], obj[k]);
                            }
                        }
                    }
                }
                return this;
            };
            e.css = css;
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
                var args2 = Array.prototype.slice.call(arguments, 1);
                this[func].apply(this, args2);
                return this;
            };
            /**
             * Add event listener
             */
            e.evt = function (ev, func) {
                if (arguments.length > 2) {
                    var args3 = Array.prototype.slice.call(arguments, 2);
                    if (this.addEventListener) {
                        this.addEventListener(ev, function (e) {
                            var a = [e].concat(args3);
                            func.apply(this, a);
                        }, false);
                    } else {
                        this.attachEvent('on' + ev, function (e) {var a = [e].concat(args3); func.apply(this, a); });
                    }
                } else {
                    if (this.addEventListener) {
                        this.addEventListener(ev, func, false);
                    } else {
                        this.attachEvent('on' + ev, func);
                    }
                }
                return this;
            };
            /**
             * Insert more things to this element
             */
            e.ins = function () {
                allArgs(Array.prototype.slice.call(arguments));
                return this;
            };
            /**
             * Add aliases for a CSS selectors
             */
            e.query = e.querySelector;
            e.queryAll = e.querySelectorAll;
            e.prototype = e;
            return e;
        },
        doNext,
        react,
        q,
        id;

    $$$.version = VERSION;

    /**
     * Structify an element node
     */
    $$$.structify = function (elem) {
        var td = null,
            dig;
        if (elem.nodeType === 1) {
            dig = function (c) {
                var l = [],
                    attr,
                    attrs,
                    ch,
                    s,
                    i,
                    re2 = /id|class|contenteditable/,
                    name = c.localName,
                    cname = String(c.className).replace(' ', '.');
                if (cname) {
                    name += '.' + cname;
                }
                if (c.id) {
                    name += '#' + c.id;
                }
                l.push(name);
                if (c.hasAttributes()) {
                    attrs = c.attributes;
                    attr = {};
                    for (i = 0; i < attrs.length; i++) {
                        if (!attrs[i].name.match(re2)) {
                            attr[attrs[i].name] = attrs[i].value;
                        }
                    }
                    if (Object.keys(attr).length > 0) {
                        l.push(attr);
                    }
                }
                c.normalize();
                ch = c.childNodes;
                for (i = 0; i < ch.length; i++) {
                    if (ch[i].nodeType === 3) {
                        s = ch[i].data.replace(/\s\s*/, ' ').trim();
                        if (s.length > 0) {
                            l.push(s);
                        }
                    } else if (ch[i].nodeType === 1) {
                        l.push(dig(ch[i]));
                    }
                }
                return l;
            };
            td = dig(elem);
        }
        return td;
    };

    /**
     * Check if DOM content is loaded.
     */
    $$$.onReady = function (func) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            doNext(func);
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', func, false);
        } else {
            document.attachEvent('onreadystatechange', func);
        }
    };

    /**
     * setImmediate substitute
     */
    if (window.setImmediate) {
        doNext = window.setImmediate;
    } else {
        q = [];
        id = 'doNext' + ((Math.random() * 67108864) | 0).toString(16);
        react = function (evt) {
            var r,t;
            if (evt.source === window &&
                    typeof evt.data === "string" &&
                    evt.data.indexOf(id) === 0) {
                var f = q.shift();
                if (f.length > 0) {
                    r = f[0].apply(undefined, f.splice(1), true);
                    if (q[0] && q[0].length === 1) { q[0].push(r); }
                }
            }
        };
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
        };
    }
    $$$.setImmediate = doNext;

    /**
     * A shortcut for placing the content on the web page.
     * Returns a Promise if there is one, otherwise just a fake "then" method.
     */
    $$$.appendToDoc = function me() {
        var args = Array.prototype.slice.call(arguments),
            i,
            follow = [];
        // "then" and "catch" is for environments without native Promise
        me.then = function (what) {
			var p;
            if (me === what) {
                throw new TypeError('Circular reference.');
            }
            if (typeof what === 'function') {
                follow.push(what);
			} else {
                console.log('$$$: Only functions can be passed to "then()"!');
            }
            return me;
        };
		me.catch = function (reason) {
			console.log('$$$: Error occured.', reason);
			return me;
		};
        function append (resolve) {
           $$$.onReady(function () {
                for (i = 0; i < args.length; i++) {
                    if (Object.prototype.toString.call(args[i]) === '[object Array]') {
                        document.body.appendChild($$$(args[i]));
                    } else if (args[i] instanceof window.HTMLElement || args[i] instanceof window.SVGSVGElement) {
                        document.body.appendChild(args[i]);
                    } else if (typeof args[i] === 'function') {
                        args[i]();
                    }
                }
                resolve();
            });            
        }
        if (typeof Promise !== 'undefined') {
            return new Promise (function (resolve, reject) {
                try {
                    append(resolve);
                } catch (e) {
                    reject(e);
                }
            });
        } else {
            append(function () {
                var x;
                follow.forEach(function (f) {
                    doNext(function () {
                        if (x && x.then) {
                            x.then(function (y) {
                                f(y);
                            })
                        } else {
                            x = f(x);
                        }
                    });
                });
            });
            return me;
        }
    };

    /**
     * Aliases for built-in selector methods.
     */
    $$$.query = function (sel) { return document.querySelector(sel); };
    $$$.queryAll = function (sel) { return document.querySelectorAll(sel); };

    /**
     * Use AMD if a module loader is in place.
     */
    if (typeof window.define === 'function') {
        window.define(function () {
            return $$$;
        });
    } else if (typeof module === 'object') {
        module.exports = $$$;
    } else {
        window.$$$ = $$$;
        window.tripledollar = $$$.appendToDoc;
    }

}(this));

/*
 * Copyright (C) 2013-2020 Steen Klingberg
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
(function (global) {
  'use strict';

    /**
     * @version
     */   
    var VERSION = '1.7.7';

    var tripledollar = function (window) {

        /**
         * Standard namespaces
         */
        var ns = {
                svg: 'http://www.w3.org/2000/svg',
                xlink: 'http://www.w3.org/1999/xlink',
                xhtml: 'http://www.w3.org/1999/xhtml'
            },

            /**
             * The triple dollar function creates a DOM object.
             * @method $$$ the DOM constructor
             */
            $$$ = function (ident) {
                //console.log(1, performance.now());
                /**
                 * Splitting up the ident parameter into element type, id, and class names. 
                 */
                var args = Array.prototype.slice.call(arguments, 1),
                    identparts,
                    elem,
                    i,
                    nsparts,
                    classlist = [],
                    re = /^[A-Za-z][A-Za-z0-9-_\.:#]*$/;
                if (typeof ident !== 'string') {
                    if (Object.prototype.toString.call(ident) === '[object Array]') {
                        return $$$.apply(this, ident);
                    }
                    if (ident instanceof window.HTMLElement || ident instanceof window.SVGElement) {
                        ident.evt = evt;
                        ident.set = set;
                        ident.fun = fun;
                        ident.ins = ins;
                        ident.css = css;
                        ident.query = ident.querySelector;
                        ident.queryAll = ident.querySelectorAll;
                        ident.prototype = ident;
                        return ident;
                    }
                    return;
                }
                if (ident && !re.test(ident)) {
                    console.log('$$$: not a valid ident parameter "' + ident + '".');
                    return;
                }
                identparts = ident.split(/([\.#])/);
                for (i = 0; i < identparts.length; i++) {
                    if (i === 0) {
                        nsparts = identparts[0].split(':');
                        if (ns[nsparts[0]]) {
                            elem = window.document.createElementNS(ns[nsparts[0]], nsparts[1] || nsparts[0]);
                        } else {
                            elem = window.document.createElement(nsparts[1] || nsparts[0]);
                        }
                    } else {
                        if (elem && identparts[i - 1] === '.') {
                            classlist.push(identparts[i]);
                        } else if (identparts[i - 1] === '#') {
                            elem.setAttribute('id', identparts[i]);
                        }
                    }
                }
                if (classlist.length > 0) {
                    elem.setAttribute('class', classlist.join(' '));
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
                            this.appendChild(param);
                        } else if (typeof param === 'object') {
                            if (Object.prototype.toString.call(param) === '[object Array]') {
                                this.appendChild($$$.apply(this, param));
                            } else {
                                for (a in param) {
                                    if (param.hasOwnProperty(a)) {
                                        if (/^data[A-Z]/.test(a)) {
                                            atr = a.substr(4).toLowerCase();
                                            this.setAttribute('data-' + atr, param[a]);
                                        } else {
                                            r = a.split(':');
                                            if (r.length === 2 && Object.keys(ns).indexOf(r[0]) > -1) {
                                                this.setAttributeNS(ns[r[0]], r[1], param[a]);
                                            } else {
                                                this.setAttribute(a, param[a]);
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            this.appendChild(window.document.createTextNode(String(param)));
                        }
                    }
                }
                allArgs.call(elem, args);

                /**
                 * Add CSS to the element.
                 * @method css
                 * @param {Object} obj A property object with CSS.
                 */
                function css (obj) {
                    var k, o, j;
                    for (k in obj) {
                        if (obj.hasOwnProperty(k)) {
                            if (typeof obj[k] !== 'object') {
                                this.style[k] = obj[k];
                            } else {
                                o = this.querySelectorAll(k);
                                for (j = 0; j < o.length; j++) {
                                    css.call(o[j], obj[k]);
                                }
                            }
                        }
                    }
                    return this;
                }
                elem.css = css;

                /**
                 * Set a property.
                 */
                function set (key, val) {
                    this[key] = val;
                    return this;
                }
                elem.set = set;

                /**
                 * Run a function.
                 */
                function fun (func) {
                    var args2 = Array.prototype.slice.call(arguments, 1);
                    this[func].apply(this, args2);
                    return this;
                }
                elem.fun = fun;

                /**
                 * Add event listener
                 */
                function evt (ev, func) {
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
                }
                elem.evt = evt;

                /**
                 * Insert more things to this element
                 */
                function ins () {
                    if (Object.prototype.toString.call(arguments[0]) === '[object Array]' &&
                            (Object.prototype.toString.call(arguments[0][0]) === '[object Array]') /*||
                                (arguments[0][0] && arguments[0][0].nodeType)*/) {
                        for (var part of arguments[0]) {
                            if (part.nodeType) {
                                this.appendChild(part);
                            } else {
                                this.appendChild($$$.apply(this, part));
                            }
                        }
                    } else {
                        allArgs.call(this, Array.prototype.slice.call(arguments));
                    }
                    return this;
                }
                elem.ins = ins;

                /**
                 * Add aliases for a CSS selector
                 */
                elem.query = elem.querySelector;
                elem.queryAll = elem.querySelectorAll;
                elem.prototype = elem;
                return elem;
            },
            doNext,
            react,
            q,
            id;

        $$$.version = VERSION;

        /**
         * Structify an element node
         */
        $$$.structify = function (elem, trim) {
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
                        cname = String(c.getAttribute('class')||'').replace(/\s/g, '.');
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
                            if (!re2.test(attrs[i].name)) {
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
                            if (trim) {
                                s=ch[i].data.replace(/\s\s*/," ").trim();
                            } else {
                                s=ch[i].data;
                            }
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
        }

        /**
         * Check if DOM content is loaded.
         */
        $$$.onReady = function (func) {
            if (window.document.readyState === 'complete' || window.document.readyState === 'interactive') {
                doNext(func);
            } else if (window.document.addEventListener) {
                window.document.addEventListener('DOMContentLoaded', func, false);
            } else {
                window.document.attachEvent('onreadystatechange', func);
            }
        }

        /**
         * setImmediate substitute
         */
        if (typeof setImmediate === 'function') {
            doNext = setImmediate;
        } else if (window.setImmediate) {
            doNext = window.setImmediate;
        } else {
            q = [];
            id = 'doNext' + ((Math.random() * 67108864) | 0).toString(16);
            react = function (evt) {
                var r,f;
                if (evt.source === window &&
                        typeof evt.data === "string" &&
                        evt.data.indexOf(id) === 0) {
                    f = q.shift();
                    if (f.length > 0) {
                        r = f[0].apply(undefined, f.splice(1), true);
                        if (q[0] && q[0].length === 1) { q[0].push(r); }
                    }
                }
            }
            if (window.postMessage) {
                if (window.addEventListener) {
                    window.addEventListener('message', react, false);
                } else {
                    window.attachEvent('message', react);
                }
            } else {
                window.postMessage = function (message) {
                    window.setTimeout(function () {
                        react({source: window, data: message});
                    }, 0);
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
                var elem;
                $$$.onReady(function () {    
                    for (i = 0; i < args.length; i++) {
                        if (Object.prototype.toString.call(args[i]) === '[object Array]') {
                            elem = $$$.apply(this, args[i]);
                            if (elem) {
                                window.document.body.appendChild(elem);
                            }
                        } else if (args[i] instanceof window.Element) {
                            window.document.body.appendChild(args[i]);
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
        }

        /**
         * Aliases for built-in selector methods.
         */
        $$$.query = function (sel) { return window.document.querySelector(sel); };
        $$$.queryAll = function (sel) { return window.document.querySelectorAll(sel); };

        /**
         * Wind off elements so they can  be taken care of by the garbage collector.
         */
        $$$.destroy = function destroy (div) {
            if (div) {
                while (div.hasChildNodes()) {
                    destroy(div.firstChild);
                    div.removeChild(div.firstChild);
                }
            }
        }

        /**
         * Read and add namespaces.
         */
        $$$.namespace = function (name, uri) {
            if (uri) {
                ns[name] = uri;
            }
            return ns[name];
        }

        return $$$;
    }

    tripledollar.version = VERSION;

    /**
     * Use AMD if a module loader is in place.
     */
    if (global && typeof global.define === 'function') {
        global.define('tripledollar', function () {
            return tripledollar(global);
        });
    } else if (typeof module === 'object') {
        module.exports = tripledollar(global);
    } else {
        global.$$$ = tripledollar(global);
    }


}(window));

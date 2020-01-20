/* tripledollar v.1.6.0 (c) 2019 Steen Klingberg. License MIT. */
!function(t){"use strict";var e=function(t){var e,n,r,o,i={svg:"http://www.w3.org/2000/svg",xlink:"http://www.w3.org/1999/xlink",xhtml:"http://www.w3.org/1999/xhtml"},s=function(e){function n(e){var n,r,o,a,c;for(r=0;r<e.length;r++)if((n=e[r])&&n.nodeType)this.appendChild(n);else if("object"==typeof n)if("[object Array]"===Object.prototype.toString.call(n))this.appendChild(s.apply(this,n));else for(a in n)n.hasOwnProperty(a)&&(/^data[A-Z]/.test(a)?(c=a.substr(4).toLowerCase(),this.setAttribute("data-"+c,n[a])):(o=a.split(":"),2===o.length&&Object.keys(i).indexOf(o[0])>-1?this.setAttributeNS(i[o[0]],o[1],n[a]):this.setAttribute(a,n[a])));else this.appendChild(t.document.createTextNode(String(n)))}function r(t){var e,n,o;for(e in t)if(t.hasOwnProperty(e))if("object"!=typeof t[e])this.style[e]=t[e];else for(n=this.querySelectorAll(e),o=0;o<n.length;o++)r.call(n[o],t[e]);return this}function o(t,e){return this[t]=e,this}function a(t){var e=Array.prototype.slice.call(arguments,1);return this[t].apply(this,e),this}function c(t,e){if(arguments.length>2){var n=Array.prototype.slice.call(arguments,2);this.addEventListener?this.addEventListener(t,function(t){var r=[t].concat(n);e.apply(this,r)},!1):this.attachEvent("on"+t,function(t){var r=[t].concat(n);e.apply(this,r)})}else this.addEventListener?this.addEventListener(t,e,!1):this.attachEvent("on"+t,e);return this}function l(){return n.call(this,Array.prototype.slice.call(arguments)),this}var u,d,p,f,h=Array.prototype.slice.call(arguments,1),y=[],m=/^[A-Za-z][A-Za-z0-9-_\.:#]*$/;if("string"==typeof e){if(e&&!m.test(e))return void console.log('$$$: not a valid ident parameter "'+e+'".');for(u=e.split(/([\.#])/),p=0;p<u.length;p++)0===p?(f=u[0].split(":"),d=i[f[0]]?t.document.createElementNS(i[f[0]],f[1]||f[0]):t.document.createElement(f[1]||f[0])):d&&"."===u[p-1]?y.push(u[p]):"#"===u[p-1]&&d.setAttribute("id",u[p]);return y.length>0&&d.setAttribute("class",y.join(" ")),n.call(d,h),d.css=r,d.set=o,d.fun=a,d.evt=c,d.ins=l,d.query=d.querySelector,d.queryAll=d.querySelectorAll,d.prototype=d,d}if("[object Array]"===Object.prototype.toString.call(e))return s.apply(this,e);if(e instanceof t.HTMLElement||e instanceof t.SVGElement)return e.evt=c,e.set=o,e.fun=a,e.ins=l,e.css=r,e.query=e.querySelector,e.queryAll=e.querySelectorAll,e.prototype=e,e};return s.version="1.5.7",s.structify=function(t,e){var n,r=null;return 1===t.nodeType&&(n=function(t){var r,o,i,s,a,c=[],l=/id|class|contenteditable/,u=t.localName,d=String(t.getAttribute("class")||"").replace(/\s/g,".");if(d&&(u+="."+d),t.id&&(u+="#"+t.id),c.push(u),t.hasAttributes()){for(o=t.attributes,r={},a=0;a<o.length;a++)l.test(o[a].name)||(r[o[a].name]=o[a].value);Object.keys(r).length>0&&c.push(r)}for(t.normalize(),i=t.childNodes,a=0;a<i.length;a++)3===i[a].nodeType?(s=e?i[a].data.replace(/\s\s*/," ").trim():i[a].data,s.length>0&&c.push(s)):1===i[a].nodeType&&c.push(n(i[a]));return c},r=n(t)),r},s.onReady=function(n){"complete"===t.document.readyState||"interactive"===t.document.readyState?e(n):t.document.addEventListener?t.document.addEventListener("DOMContentLoaded",n,!1):t.document.attachEvent("onreadystatechange",n)},"function"==typeof setImmediate?e=setImmediate:t.setImmediate?e=t.setImmediate:(r=[],o="doNext"+(67108864*Math.random()|0).toString(16),n=function(e){var n,i;e.source===t&&"string"==typeof e.data&&0===e.data.indexOf(o)&&(i=r.shift(),i.length>0&&(n=i[0].apply(void 0,i.splice(1),!0),r[0]&&1===r[0].length&&r[0].push(n)))},t.postMessage?t.addEventListener?t.addEventListener("message",n,!1):t.attachEvent("message",n):t.postMessage=function(e){t.setTimeout(function(){n({source:t,data:e})},0)},e=function(){var e=Array.prototype.slice.call(arguments);"function"==typeof e[0]&&(r.push(e),t.postMessage(o,"*"))}),s.setImmediate=e,s.appendToDoc=function n(){function r(e){var n;s.onReady(function(){for(o=0;o<i.length;o++)"[object Array]"===Object.prototype.toString.call(i[o])?(n=s.apply(this,i[o]))&&t.document.body.appendChild(n):i[o]instanceof t.Element?t.document.body.appendChild(i[o]):"function"==typeof i[o]&&i[o]();e()})}var o,i=Array.prototype.slice.call(arguments),a=[];return n.then=function(t){if(n===t)throw new TypeError("Circular reference.");return"function"==typeof t?a.push(t):console.log('$$$: Only functions can be passed to "then()"!'),n},n.catch=function(t){return console.log("$$$: Error occured.",t),n},"undefined"!=typeof Promise?new Promise(function(t,e){try{r(t)}catch(t){e(t)}}):(r(function(){var t;a.forEach(function(n){e(function(){t&&t.then?t.then(function(t){n(t)}):t=n(t)})})}),n)},s.query=function(e){return t.document.querySelector(e)},s.queryAll=function(e){return t.document.querySelectorAll(e)},s.destroy=function t(e){if(e)for(;e.hasChildNodes();)t(e.firstChild),e.removeChild(e.firstChild)},s.namespace=function(t,e){return e&&(i[t]=e),i[t]},s};e.version="1.6.0",t&&"function"==typeof t.define?t.define("tripledollar",function(){return e(t)}):"object"==typeof module?module.exports=e(t):t.$$$=e(t)}(window);

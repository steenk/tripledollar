(function(){var t="0.4";window.$$$=function(){var t=Array.prototype.slice.call(arguments);if(typeof t[0]!=="string"){if(Array.isArray(t[0])){return window.$$$.apply(this,t[0])}else{return null}}var e=t.shift(),r=e.split("#")[1],i=e.split("#")[0].split("."),n=i.shift(),s=i.join(" ").trim(),a=document.createElement(n);if(s){a.className=s}if(r){a.setAttribute("id",r)}function o(t){for(var e=0;e<t.length;e++){var r=t[e];if(r&&r.nodeType){a.appendChild(r)}else if(typeof r==="object"){if(Array.isArray(r)){a.appendChild(window.$$$.apply(this,r))}else{for(var i in r){if(i.match(/^data/)){var n=i.substr(4).toLowerCase();a.setAttribute("data-"+n,r[i])}else{a.setAttribute(i,r[i])}}}}else{a.appendChild(document.createTextNode(String(r)))}}}o(t);a.css=function(t){for(var e in t){this.style[e]=t[e]}return this};a.set=function(t,e){this[t]=e;return this};a.fun=function(t,e){this[t].apply(this,e);return this};a.evt=function(t,e){if(arguments.length>2){var r=Array.prototype.slice.call(arguments).slice(2);this.addEventListener(t,function(){e.apply(this,r)})}this.addEventListener(t,e);return this};a.ins=function(){var t=Array.prototype.slice.call(arguments);o(t)};a.prototype=a;return a};window.$$$.version=t;if(!window.$&&document.querySelectorAll){window.$=function(t){return document.querySelectorAll(t)}}})();
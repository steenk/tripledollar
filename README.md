# Tripledollar

![](images/logo.png)

When you create a lot of DOM elements from JavaScript and want a minimalistic approach, __tripledollar__ is it. It's not a framework, it's a small helper library for creating DOM elements with JavaScript, and no more. It is actually __about 5kB!__ So this tutorial is larger than the library itself.

What you want to do is something like this (just a silly example):
```html
    <div id="d001" class="simple" style="display:inline; background-color:blue;">
        <strong class="bold">Tripledollar</strong>
        <button name="but001" onclick="alert('hello')">OK</button>
    </div>
```

but you want to create it with JavaScript, and with plain JavaScript it can be like this:

```javascript
    var div = document.createElement('div');
    div.id = 'd001';
    div.className = 'simple';
    div.style.display = 'inline';
    div.style.backgroundColor = 'blue';
    var strong = document.createElement('strong');
    strong.className = 'bold';
    strong.appendChild(document.createTextNode('Tripledollar'));
    div.appendChild(strong);
    var button = document.createElement('button');
    button.addEventListener('click', function () {alert('hello')});
    button.setAttribute('name', 'but001');
    button.appendChild(document.createTextNode('OK'));
    div.appendChild(button);
    document.body.appendChild(div);
```

With __tripledollar__ you can do the same thing more compact:

```javascript
    var div = $$$('div.simple#d001',
            $$$('strong.bold', 'Tripledollar'),
            $$$('button', {name: 'but001'}, 'OK')
            .evt('click', function () {alert('hello')})
        ).css({display:'inline',backgroundColor:'blue'});
    $$$.appendToDoc(div);
```

Tripledollar has been tested on the most common, modern web browsers, but it is made for JavaScript development, so web browsers with old JavaScript engines is not the target.

## Installation

You can load tripledollar in your script from [steenk.github.io](http://steenk.github.io/tripledollar.js), or you can download the library from [tripledollar.net](http://tripledollar.net) and save it locally, but if you want a file structure to start with, you can use the simple command line tool __td__ that you get by installing with __npm__.

```sh
npm install tripledollar -g
mkdir myproject
cd myproject
td --init
```

After installation you have to install all dependencies and build the project.

```sh
npm install
npm run build
npm run start
```

### Typescript

For Typescript users, the type TDElement is exported, which is an extension of HTMLElement with the help methods described below (from version 1.10.0).

### Node.js

The tripledollar library can also be used in Node.js if a DOM library is present.

```javascript
// Node.js code
var jsdom = require("jsdom");

jsdom.env(
    // an empty string to start with
    '',
    function (err, window) {
        // a window object has to be passed as a parameter
         var $$$ = require('tripledollar')(window);
         $$$.appendToDoc(['div',
           ['h2', 'Tripledollar']
         ])
         .then(function () {
            var div = $$$.query('div');
            div.ins(['p', 'Now even in ', ['b', 'Node'], '!']);
            // see how it looks in a markup language
            console.log(window.document.body.innerHTML);
         });
    }
);
```

## API  

### Constructor

__Function__ $$$(identity, [attribute-object, content, DOM-Element, ...]) -> DOM-Element

### Methods and Property

__String__ \$\$\$.version -> __String__  
__Function__ \$\$\$.structify(DOM-Element, [__Boolean__]) -> TDStruct  
__Function__ \$\$\$.onReady(__Function__) -> undefined  
__Function__ \$\$\$.setImmediate(__Function__) -> undefined  
__Function__ \$\$\$.appendToDoc(DOM-Element | TDStruct) -> self-reference  
__Function__ \$\$\$.appendToDoc().then(__Function__) -> __Promise__ | appendToDoc-reference  
__Function__ \$\$\$.appendToDoc().catch(__Function__) -> __Promise__ | appendToDoc-reference  
__Function__ \$\$\$.destroy(DOM-Element) -> undefined  
__Function__ \$\$\$.parse(JSON) -> DOM-ELEMENT  
__Function__ \$\$\$.stringify(DOM-Element) -> JSON  

### DOM-Element Extentions

__Function__ element.ins(DOM-Element | TDStruct | attribute-object) -> element-reference  
__Function__ element.set(__String__, __Function__) -> element-reference  
__Function__ element.evt(__String__, __Function__) -> element-reference  
__Function__ element.css(property-object) -> element-reference  
__Function__ element.fun(__String__) -> element-reference  
__Function__ element.query(__String__, [__String__, ...]) -> DOM-Element | undefined  
__Function__ element.queryAll(__String__, [__String__, ...]) -> __Array__[DOM-Element]

## Just a few help functions

Tripledollar adds a few three letters help functions to the DOM element, making it easy to apply most things that you want to do to your DOM element. The functions can be chained together. These are:

* css - for adding css
* set - for setting properties
* fun - for calling a function within the DOM element
* evt - for adding an event listener
* ins - for inserting things into the DOM element

Together with the $$$ function, there is everything for creating DOM elements from JavaScript.

## Create a DOM element

A simple div element is created like this:

```javascript
    var div = $$$('div');
```

Adding an id to it will be:

```javascript
    var div = $$$('div#d001');
```

Adding one class name:

```javascript
    var div = $$$('div#d001.simpleClass');
```

More then one class name can be added:

```javascript
    var div = $$$('div.class1.class2'):
```

And everything together:

```javascript
    var h1 = $$$('h1.large.blueish#h0001');
```

This first parameter in the \$ function is the "identity" parameter and will always appear as the first parameter. It starts with the element's tag name and is immediately followed by class names and id. The class names are preceded with a '.' and the id is preceded with a '#'. The rest of the parameters in the $$$ function have no special order so they can appear randomly.

### Attributes

Adding attributes to the DOM is done by an object parameter with property names and values that will end up as attributes in the DOM element. The easiest is to add this object as a literal in the function call.

```javascript
    var a = $$$('a', {href: 'http://www.google.com', target: '_blank'}, 'Google');
```

It is the same as doing this:

```javascript
    var attr = new Object();
    attr.href = 'http://www.google.com';
    attr.target = '_blank';
    var a = $$$('a', attr, 'Google');
```

And it is the same as this HTML notation:

```html
    <a href="http://www.google.com" target="_blank">Google</a>
```

### Text

Adding text inside a DOM element is to add it as one of the parameters after the "identity" parameter:

```javascript
    var p = $$$('p', 'This is the text.');
```

Since there are no direct limit on the number of parameters in the $$$ function, it's possible to do this:

```javascript
    var p = $$$('p', 'This is a text. ', 'This is another one.');
```

To sum up, arguments to the $$$ function (except the first one) are either DOM elements themselves, or objects with properties, or plain values that will end up as text inside the DOM element.

### Nested DOM elements

If a parameter to the $$$ function is a DOM element, it will be appended to the DOM element that $$$ creates. By this, it's easy to create the structure that you want, but be sure to indent right, so you don't get lost in the structure.

```javascript
    var tab = $$$('table',
                $$$('tr',
                    $$$('td', 'A'),
                    $$$('td', '1')),
                $$$('tr',
                    $$$('td', 'B'),
                    $$$('td', '2')),
                $$$('tr',
                    $$$('td', 'C'),
                    $$$('td', '3')
                )
            );
```

## Using the help functions

The help functions are used to apply more advanced features to the DOM element, in the same statement where you create it. This is done by chaining the functions to each other.

## css

CSS can be applied directly to the DOM element with JavaScript. This is not always the preferred way, it's often better to put CSS in an CSS file, but sometimes it makes sense to use one of the many features in CSS directly in JavaScript. CSS code has its own syntax, and it's when used in JavaScript, some terms have to be translated into JavaScript names. One thing you can't do is have property names like 'background-color', because the dash is not allowed in property names. So in JavaScript, the 'background-color' is used like this:

```javascript
    elem.style.backgroundColor = 'yellow';
```

The CSS name is translated to camel case, and the dash is removed. Tripledollar is using this camel case names for CSS.

    var div = $$$('div').css({backgroundColor: 'red', fontSize: '16pt', border: 'solid black 2pt'});

From version 0.9.2 the __css__ method is recursive, meaning that you can style sub-elements with the same property object. If a property is an object instead of a string, number, or boolean, then the __css__ method will use the property key as a CSS selector and applies the style to the sub-elements it finds. To clarify, here is an example.

```javascript
var chess = $$$('div');
var row;
for (var r=0; r++ < 8;) {
    row = $$$('div.row');
    chess.ins(row);
    for (var c=0; c++ < 8;) {
        row.ins($$$('div.cell.' + ((r + c) % 2 === 0 ? 'white' : 'black')));
    }
}
chess.css({
    width: '200px',
    height: '200px',
    border: 'solid black 1px',
    '.row': {
        height: '25px'
    },
    '.cell': {
        display: 'inline-block',
        margin: 0,
        width: '25px',
        height: '25px'
    },
    '.black': {
        backgroundColor: 'black'
    }
});
$$$.appendToDoc (chess);
```

![](images/chess.png)


## set

DOM elements are JavaScript objects that can have any property applied to them, so setting properties with arbitrary names is useful for us. A property can be a string, an object, or a function.

```javascript
    var div = $$$('div')
                .set('private', true)
                .set('tenTimes', function (val) { return 10 * val; })
                .set('props', {version: 0.1, year: 2013});
```

## fun

There are not so many functions that you can call on a DOM object during the creation phase, so this is an example where we first place a function with __set__ and then call it with __fun__.

```javascript
    var fun1 = function (delim) {this.textContent = this.textContent.split('').join(delim);};
    document.body.appendChild($$$('h2','tripledollar').set('dash',fun1).fun('dash', '-').css({color:'red'}));
```

The fun function will be a function call within the chain of help functions, which is its purpose. Arguments to the function can be added after the function's name (from version 0.6.0).

## evt

An event listener can be applied to the DOM object. The name of the event, and a function to handle the event should be the parameters.

```javascript
    var func = function () { alert('Tripledollar, version ' + $$$.version);};
    var butt = $$$('button', 'Version').evt('click', func);
    document.body.appendChild(butt);
```

The function that receives the event always gets the event object as an argument. That can be used to find out which element the event came from. Sometimes you want to send more arguments with the event, and you can do that with the __evt__ function.

```javascript
    var func = function (evt, msg) {
        alert('Got this messages from a ' + evt.target.tagName + ': ' + msg);
    }
    var butt = $$$('button', 'Click here').evt('click', func, 'You clicked at me!');
    document.body.appendChild(butt);
```

## ins

Sometimes you need to insert more things into an element that you created earlier. That can be done with the __ins__ function.

```javascript
    var div = $$$('div#d002');
    div.ins($$$('label', 'Date:')); // insert an element
    div.ins($$$('span', Date().toString())); // insert a date string
    div.ins(['p', 'A sentence.']); // insert a tdstruct
    div.ins([['div', 'One'], ['div', 'Two'], $$$('div', 'Three')]); // insert a list of structs or elements
```

# But what is it good for?

The philosophy behind __tripledollar__ is __DON'T WRITE HTML!__ You can avoid the tag mess by doing everything programmatically and creating modularized and reusable code instead. By using __tripledollar,__ this can be done very compactly. To convince you, here is a simple example. Consider an HTML page with a table in it. Like this:

```html
    <!doctype html>
    <html lang="en">
        <head>
            <title>Example 1</title>
            <meta charset="utf8" />
        </head>
        <body>
            <table>
                <tbody>
                    <tr>
                        <td>Apples</td>
                        <td>1.90</td>
                        <td>green</td>
                    </tr>
                    <tr>
                        <td>Oranges</td>
                        <td>2.95</td>
                        <td>sweet</td>
                    </tr>
                </tbody>
            </table>
        </body>
    </html>
```

Compare it with this code, that does the same:

```html
    <!doctype html>
    <html lang="en">
        <head>
            <title>Example 2</title>
            <meta charset="utf8" />
            <script src="tripledollar.js"></script>
        </head>
        <body>
            <script>
                var fruitData = [
                    ['Apples', '1.90', 'green'],
                    ['Oranges', 2.95, 'sweet']
                ];
                function table (data) {
                    var tbody = $$$('tbody');
                    data.forEach(function (row) {
                        var tr = $$$('tr');
                        tbody.ins(tr);
                        row.forEach(function(val){
                            tr.ins($$$('td', val));
                        })
                    });
                    return $$$('table', tbody);
                };
                document.body.appendChild(table(fruitData));
            </script>
        </body>
    </html>
```

The second example may look a little more complicated, but it has several advantages over the first one. In the example of pure HTML, data, and layout are mixed together. It is also fixed in its form. The second example is different. First, it has the data separate in the variable fruitData. Then the table is created with a table function that can handle every size, not just the two rows with three columns for this example. Finally, the table will be added dynamically, by code, on the page. In this example, everything is placed together on the same HTML page, but it is now possible to get the data from a web service instead and to move the table function into a JavaScript library with other reusable pieces of code, and it is also possible to wait for some event before the table is actually placed on the page. In a more complex project, it will become clear that HTML is not the best tool for the developer.

# Selector

One thing that is nice to have when programming for the web is a selector function. In prototype.js the $() function is used to get elements by id out of a web page, and in jQuery you can use $() as a selector also. Now CSS selectors are used in modern browsers, with the functions `document.querySelector()` and `document.querySelectorAll()`, giving built-in CSS searching. So as a little extra feature, tripledollar sets $$$.query() as an alias for `document.querySelector()`, and $$$.queryAll() as an alias for `document.querySelectorAll()`. (Earlier versions of tripledollar, < 0.7, used $ as an alias for querySelectorAll, but we want to stay away from what is used by other common libraries.)

```javascript
    var body = $$$.query('body');
    body.appendChild($$$('div.a-class-name'));
    // get it back
    var div = $$$.queryAll('.a-class-name')[0];
```

A CSS selection can also be made from an element, `element.querySelectorAll`, instead of searching the whole document, searching just a portion of the page, so the shortcuts `query` and `queryAll` can also be used in this way.

```javascript
    var div = $$$('div', $$$('div#d1'), $$$('div#d2'));
    var d1 = div.query('#d1');
    var d2 = div.query('#d2');
```

# The tdstruct

A tdstruct is a plain JavaScript structure consisting of nested arrays in a way that follows the structure that can be created with tripledollar. Since it is just JavaScript, it can be transformed to JSON, and be stored in CouchDB or MongoDB, and easily be fed to the $$$(), for generating the DOM structure. There are some rules for a tdstruct. First, it is always an array. The elements in the array can be other arrays, strings, numbers, booleans, and of course, the two special tripledollar types, the tag describing string "identity" and the object with attributes. The "identity" string must always be placed first in an array.

```javascript
    var tdstruct = ['table#t1', {border: 1},
        ['tbody',
            ['tr', ['td', 'one'], ['td', 'two'], ['td', 'three']]]];
```

A tdstuct is not a DOM element, it is just the array it seems to be. To use it it has to be fed to the $$$() function.

```javascript
    var table = $$$(tdstruct);
    document.body.appendChild(table);
```

A tdstruct can be generated backwards, from an element on a web page. This is done with the $$$.structify() function.

```javascript
    var dom = $$$(['div#div1', ['h1'], ['p', 'It was a ', ['b', 'cloudy'], ' day.']]);
    document.body.appendChild(dom);

    // get the DOM element by id, and structify it
    var div1 = $$$.query('#div1');
    var tdstruct = $$$.structify(div1);

    alert(JSON.stringify(tdstruct));
```

# Append To Doc

To place the elements on a page, there is a more convenient way, than to use "document.body.appendChild()". There is a wrapper function called "$$$.appendToDoc()" that can take many arguments, of both tdstruct and element, and place them on the page.

```javascript
    $$$.appendToDoc(
        $$$('h1', '$$$'),
        ['p', 'Using ', ['strong', 'tripledollar'], ' is a habit I can\'t get rid of.'],
        document.createElement('hr')
    )
```

The function appendToDoc waits for the DOM content to get loaded, before it adds any content. This is something that can be necessary for other pieces of code also, so there is a function for that also.

```javascript
    // a function to be used later
    function start () {
        $$$.query('#i01').ins('h1', 'Started');
    }
    // placing things on the page
    $$$.appendToDoc(['div#i01']);
    // when ready call the "start" function
    $$$.onReady(start);
```

# Using $$$ as a module

Building your code in a modular structure is most desirable, and Tripledollar is prepared to be used as a module with the Require.js library.

```javascript
    require(['http://steenk.github.io/tripledollar.js'], function ($$$) {
        return $$$('div.my-module',
            ['p', 'This is my module.']
        )
    })
```

Since version 1.5.0 Tripledollar has supported ECMA Script 6 modules, a separate library is used for this, called "tripledollar.mjs". While the library "tripledollar.js" still exists for AMD modules (Require.js), the ES6 module style is used in the "td --init" command from version 1.5.0.

```javascript
    import $$$ from  "./lib/tripledollar.mjs";

    $$$.appendToDoc(
        ['h1', {style: 'text-shadow: 2pt 2pt 4pt gray; color:gold;'}, 'Tripledollar'],
        ['p', 'Version ', $$$.version],
        ['h2', 'Just DOM scripting']
    );
```

# The correct order of events

When creating modules and using an asynchronous module loader as Require.js, you must start thinking about when things happen. What if you place something on the page and want some other things to happen after that is completed? Like this:

```javascript
    $$$.appendToDoc(['div'], ['div'])
    .then(function () {
        var n = $$$.queryAll('div');
        alert('I found ' + n.length + ' divs!')
    });
```

The "then" method on "appendToDoc" takes a function and executes it after it's done. Several "then" can be chained together to make a sequence of things happen. If you have some experience in programming in Node.js, you know that it is all about managing asynchronous events and using callbacks to place what should happen in the correct order. This is a similar case. The function we pass to "then" is a callback, and it is not executed immediately but later on.

To implement the "then" method, we needed something that is commonly used in Node.js but doesn't exist in most browsers today, the "setImmediate" function. This function breaks sequential thread holding code and places a callback in the event queue, to be executed immediately when the thread gets free. So now we have it in Tripledollar, "$$$.setImmediate", which takes a function and maybe some arguments to be executed asynchronously. It is used internally by Tripledollar, and if you like, you can also use it for your code.

Since version 0.9.0 __appendToDoc__ delivers a Promise if that is implemented in the JavaScript environment. Most modern browsers have it. A promise library loaded before tripledollar will also work. In case there is no Promise class at all, the "then" method will work as a simple chaining method, and it will also work with "thenables", objects with their own "then" method, even if they are not fully Promise compliant.

# SVG

SVG elements have their own namespace, so to create embedded SVG, all SVG elements have to be written "svg:element", where "element" here is one of the allowed SVG elements, like "rect", "circle", "g", and so on. SVG has a lot of attributes, and they will be written with an object of properties, as usual. Some of these attributes need another namespace than SVG, like the "href" attribute in the "a" element. That is handled by using the attribute name "xlink:href" in quotes. 

```javascript
    var svg = $$$('svg', {width:300, height:250},
      ['svg:a', {'xlink:href': 'http://tripledollar.net'},
        ['svg:text', {
          x:110,
          y: 120,
          'font-size': 60,
          fill: 'gold',
          stroke: 'black',
          'stroke-width': 1
        },
        '$$$',
        ['svg:animateTransform', {
          attributeName: 'transform',
          begin: '0s',
          dur: '10s',
          type: 'rotate',
          from: '0 120 120',
          to: '360 120 120',
          repeatCount: 'indefinite'
        }]
      ]
      ]
    );

    $$$.appendToDoc (
      ['h1', 'SVG Lab'], svg
    )
```

# Namespaces

The default namespace HTML and the namespaces for SVG and XLINK are built in, but there is also a way to add your own namespace. Use `$$$.namespace(name, [uri])` to handle namespaces. With just the name as a parameter, the function returns the URI if the namespace exists. By passing both name and a URI a new namespace is added. Here is an example.

```
$$$.namespace('td', 'http://tripledollar.net');
var td = $$$('td:box.td-box');
$$$.appendToDoc(td);
```

# Command Line Interface

Installed with __npm__ tripledollar has a simple CLI. Tripledollar itself needs to run in a browser, but the Node.js environment can be convenient when developing. The __td__ command with option --init creates a structure where you can directly start developing modularly. Many client-side libraries are published in __npm__, the module loader for Node.js, but adding a whole npm project to your web application is not what you want. It is often enough with just one JavaScript file to add to your lib folder. The __td__ command has a --get option for doing this. From your lib folder, you can type `td --get chart.js`, and you get the chart.js file from the npm project chart.js. Convenient.

```
Tripledollar - a JavaScript library for DOM scripting.
Usage: td [options]
Options:
  -i  --init    create initial structure
  -n  --name    optional name of the project
  -v  --version version of tripledollar
  -o  --open    open browser [optionally provide a subpath]
  -s  --start   start the server
  -q  --public  use public ip addresses, not just the default 127.0.0.1
  -p  --port    port for server, default is 3000
  -k  --kill    kill the server on the given port
  -r  --status  check if server is running
  -h  --help    this help text
```

Some browsers don't like when you open files and scripts directly from the file system. There can be "security" reasons, and caching stops your code changes from getting through. Starting a local web server is better, and you have to reload the page in the browser to see the changes you have made. Tripledollar comes with a simple HTTP server that you can use during development. Go to the root of your project (if you just did a `td --init`, that is the place) and type the command `td --start --open`. The start command will restart the server if one is already started. Stop it with a `td --kill`. The default network port is 3000, but it can be changed by the --port option or by exporting the environment variable TD_PORT.

# Finally

It was quite a bit of information for this relatively small library. Here is a code you can use as a starting point, and try this for yourself. Just copy it and save it as an HTML file.

```html
    <!doctype html>
    <html lang="en">
        <head>
            <title>tripledollar</title>
            <meta charset="utf-8" />
            <script src="http://steenk.github.io/tripledollar.js"></script>
        </head>
        <body>
            <script>
                $$$.appendToDoc(['div', {style:'color:pink;font-size:100pt'}, "Don't write HTML!"]);
            </script>
        </body>
    </html>
```

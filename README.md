# Trippledollar

When you're gonna create a lot of DOM elements from Javascript, and you don't want to use a framework like jQuery (jQuery is a very good framework, but sometimes it's not your preferred toolbox), and you want a minimalistic approach; __trippledollar__ is it. It's not a framework, it's a small help library for creating DOM objects with Javascript, and no more. It is actually __under 1kB!__ So this tutorial is bigger than the library itself.

What you want to do is something like this (just a silly example):

	<div id="d001" class="simple" style="display:inline; background-color:blue;">
		<strong class="bold">Trippledollar</strong>
		<button name="but001" onclick="alert('hello')">OK</button>
	</div>

but you want to create it with Javascript, and with plain Javascript it can be like this:

	var div = document.createElement('div');
	div.id = 'd001';
	div.className = 'simple';
	div.style.display = 'inline';
	div.style.backgroundColor = 'blue';
	var strong = document.createElement('strong');
	strong.className = 'bold';
	strong.appendChild(document.createTextNode('Trippledollar'));
	div.appendChild(strong);
	var button = document.createElement('button');
	button.addEventListener('click', function () {alert('hello')});
	button.setAttribute('name', 'but001');
	button.appendChild(document.createTextNode('OK'));
	div.appendChild(button);
	document.body.appendChild(div);

With __trippledollar__ you can do the same thing more compact:

	var div = $$$('div#d001.simple',
			$$$('strong', 'Trippledollar'),
			$$$('button', {name: 'but001'}, 'OK').evt('click', function () {alert('hello')})
		).css({display:'inline',backgroundColor:'blue'});
	document.body.appendChild(div);

## Just a few help functions

Trippledollar adds a few three letters help functions to the DOM object, making it easy to apply most things that you want to do to your DOM object. The functions can be chained together. These are:

* css - for adding css
* set - for setting parameters
* fun - for calling a function within the DOM object
* evt - for adding an event listener

Together with the $$$ function, there is everything for creating DOM objects from Javascript.

## Create a DOM object

A simple div element is created like this:

	var div = $$$('div');

Adding an id to it will be:

	var div = $$$('div#d001');

Adding one class name:

	var div = $$$('div#d001.simpleClass');

More then one class name can be added:

	var div = $$$('div.class1.class2'):

And everything together:

	var h1 = $$$('h1#h0001.large.blueish');

This first parameter is the "identity" parameter, and it will always appear first in the $$$ function. The rest of the parameters have no order.

### Attributes

Adding attributes to the DOM is done by an object attribute with parameter name and values that will end up as attributes in the DOM object. Easiest is to add this object as a literal in the function call.

	var a = $$$('a', {href: 'http://www.google.com', target: '_blank'}, 'Google');

It is the same as doing this:

	var attr = new Object();
	attr.href = 'http://www.google.com';
	attr.target = '_blank';
	var a = $$$('a', attr, 'Google');

And it will result in this:

	<a href="http://www.google.com" target="_blank">Google</a>

### Text

Adding text inside a DOM object is easy:

	var p = $$$('p', 'This is the text.');

Since there are no direct limit on the number of parameters in the $$$ function, it's possible to do this:

	var p = $$$('p', This is a text. ', 'This is another one.');

### Nested DOM objects

If a parameter to the $$$ function is a DOM object, it will be appended to the DOM object that $$$ creates. By this, it's easy to create the structure that you want, but be sure to indent right, so you don't get lost.

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

## Using the help functions

The help functions are used to apply more advanced features to the DOM object, in the same statement where you create it. This is done by making the functions chain to each other.

## css

CSS can be applied directly to the DOM object with Javascript. This is not always the preferred way, it's often better to put CSS in an CSS file, but sometimes it make sense to use one of the many features in CSS directly in Javascript. CSS code has its own syntax, and it's when used in Javascript some terms have to be translated into Javascript names. One thing you can't do is having property names like 'background-color', because the dash is not allowed in property names. So in Javascript the 'background-color' is used like this:

	elem.style.backgroundColor = 'yellow';

The CSS name is translated to camel case, and the dash is removed. Trippledollar is using this camel case names for CSS.

	var div = $$$('div').css({backgroundColor: 'red', fontSize: '16pt', border: 'solid black 2pt'});

## set

DOM objects are Javascript objects that can have any property applied to it, so setting properties with arbitrary names is useful for us. A property can be a string, an object, or a function.

	var div = $$$('div')
				.set('private', true)
				.set('tenTimes', function (val) { return 10 * val; })
				.set('props', {version: 0.1, year: 2013});

## fun

There are normally not so many functions that you can call on a DOM object during the creation phase, so this an example where we first place a function with __set__ and then call it with __fun__.

	var p = $$$('p','plato').set('f', function () { alert('f');} ).fun('f').css({color:'red'});
	var fun1 = function (delim) {this.textContent = this.textContent.split('').join(delim);};
	document.body.appendChild($$$('h2','trippledollar').set('dash',fun1).fun('dash', ['-']));

The fun function will be a call within the chain of help functions, and that is the purpose of it. Argument to the function are wrapped within an array.

## evt

An event listener can be applied to the DOM object. The name of the event, and a function to handle the event should be the parameters.

	var func = function () { alert('Trippledollar, version ' + $$$.version);};
	var butt = $$$('button', 'Version').evt('click', func);
	document.body.appendChild(butt);



















# Tripledollar

![](logo.png)

When you're going to create a lot of DOM elements from Javascript, and you want a minimalistic approach; __tripledollar__ is it. It's not a framework, it's a small help library for creating
DOM elements with Javascript, and no more. It is actually __around 2kB!__ So this tutorial is bigger than the library itself.

What you want to do is something like this (just a silly example):

	<div id="d001" class="simple" style="display:inline; background-color:blue;">
		<strong class="bold">Tripledollar</strong>
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
	strong.appendChild(document.createTextNode('Tripledollar'));
	div.appendChild(strong);
	var button = document.createElement('button');
	button.addEventListener('click', function () {alert('hello')});
	button.setAttribute('name', 'but001');
	button.appendChild(document.createTextNode('OK'));
	div.appendChild(button);
	document.body.appendChild(div);

With __tripledollar__ you can do the same thing more compact:

	var div = $$$('div.simple#d001',
			$$$('strong', 'Tripledollar'),
			$$$('button', {name: 'but001'}, 'OK').evt('click', function () {alert('hello')})
		).css({display:'inline',backgroundColor:'blue'});
	document.body.appendChild(div);

## Just a few help functions

Tripledollar adds a few three letters help functions to the DOM element, making it easy to apply most things that you want to do to your DOM element. The functions can be chained together. These are:

* css - for adding css
* set - for setting parameters
* fun - for calling a function within the DOM element
* evt - for adding an event listener
* ins - for inserting things into the DOM element

Together with the $$$ function, there is everything for creating
DOM elements from Javascript.

## Create a DOM element

A simple div element is created like this:

	var div = $$$('div');

Adding an id to it will be:

	var div = $$$('div#d001');

Adding one class name:

	var div = $$$('div.simpleClass#d001');

More then one class name can be added:

	var div = $$$('div.class1.class2'):

And everything together:

	var h1 = $$$('h1.large.blueish#h0001');

This first parameter is the "identity" parameter, and it will always appear first in the $$$ function. The rest of the parameters have no order.

### Attributes

Adding attributes to the DOM is done by an object parameter with property names and values that will end up as attributes in the DOM element. Easiest is to add this object as a literal in the function call.

	var a = $$$('a', {href: 'http://www.google.com', target: '_blank'}, 'Google');

It is the same as doing this:

	var attr = new Object();
	attr.href = 'http://www.google.com';
	attr.target = '_blank';
	var a = $$$('a', attr, 'Google');

And it will result in this:

	<a href="http://www.google.com" target="_blank">Google</a>

### Text

Adding text inside a DOM element is easy:

	var p = $$$('p', 'This is the text.');

Since there are no direct limit on the number of parameters in the $$$ function, it's possible to do this:

	var p = $$$('p', This is a text. ', 'This is another one.');

To sum up, arguments to the $$$ function (except the first one) are either DOM elements themselves, or objects with properties, or plain values that will end up as text inside the DOM element.

### Nested DOM elements

If a parameter to the $$$ function is a DOM element, it will be appended to the DOM element that $$$ creates. By this, it's easy to create the structure that you want, but be sure to indent right, so you don't get lost.

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

The help functions are used to apply more advanced features to the DOM element, in the same statement where you create it. This is done by making the functions chain to each other.

## css

CSS can be applied directly to the DOM element with Javascript. This is not always the preferred way, it's often better to put CSS in an CSS file, but sometimes it make sense to use one of the many features in CSS directly in Javascript. CSS code has its own syntax, and it's when used in Javascript some terms have to be translated into Javascript names. One thing you can't do is having property names like 'background-color', because the dash is not allowed in property names. So in Javascript the 'background-color' is used like this:

	elem.style.backgroundColor = 'yellow';

The CSS name is translated to camel case, and the dash is removed. Tripledollar is using this camel case names for CSS.

	var div = $$$('div').css({backgroundColor: 'red', fontSize: '16pt', border: 'solid black 2pt'});

## set

DOM elements are Javascript objects that can have any property applied to it, so setting properties with arbitrary names is useful for us. A property can be a string, an object, or a function.

	var div = $$$('div')
				.set('private', true)
				.set('tenTimes', function (val) { return 10 * val; })
				.set('props', {version: 0.1, year: 2013});

## fun

There are normally not so many functions that you can call on a DOM object during the creation phase, so this an example where we first place a function with __set__ and then call it with __fun__.

	var fun1 = function (delim) {this.textContent = this.textContent.split('').join(delim);};
	document.body.appendChild($$$('h2','tripledollar').set('dash',fun1).fun('dash', ['-']));

The fun function will be a call within the chain of help functions, and that is the purpose of it. Argument to the function are wrapped within an array.

## evt

An event listener can be applied to the DOM object. The name of the event, and a function to handle the event should be the parameters.

	var func = function () { alert('Tripledollar, version ' + $$$.version);};
	var butt = $$$('button', 'Version').evt('click', func);
	document.body.appendChild(butt);

The function that recieves the event, always gets the event object as an argument. That can be used to find out which element the event came from. Sometimes you want to send more arguments with the event, and you can do that with the __evt__ function.

	var func = function (evt, msg) {
		alert('Got this messages from a ' + evt.target.tagName + ': ' + msg);
	}
	var butt = $$$('button', 'Click here').evt('click', func, 'You clicked at me!');
	document.body.appendChild(butt);

## ins

Sometimes you need to insert more things into an element that you created earlier. That can be done with the __ins__ function.

	var div = $$$('div#d002');
	div.ins($$$('label', 'Date:'));
	div.ins($$$('span', Date().toString()));

# But what is it good for?

The philosophy behind __tripledollar__ is __DON'T WRITE HTML!__ By doing everything programmatically, you can avoid the tag mess, and create modularized, and reusable code instead. By using __tripledollar__ this can be done very compact. To convince you, here is a simple example. Consider a HTML page with a table in it. Like this:

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

Compare it with this code, that does the same:

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

The second example may look a little more complicated, but it has several advantage over the first one. In the example made by pure HTML, data and layout is mixed together. It is also fixed in it's form. The second example is different. First it has the data separate, in the variable fruitData. Then the table is created with a table function that can handle every size, not just the two rows with three columns for this example. Finally the table will be added dynamically, by code, on the page. In this example everything is placed together on the same HTML page, but it is now possible to get the data from a web service instead, and to move the table function into a Javascript library with other reusable pieces of code, and it is also possible to wait for some kind of event before the table is actually placed on the page. In a more complex project, it will become clear that HTML is not the the best tool for the developer.

# Selector

One thing that is nice to have when programming for the web, is a selector function. In prototype.js the $() function is used to get elements by id out of a web page, and in jQuery you can use $() as a selector also. Now CSS selectors are used in modern browsers, with the functions `document.querySelector()` and `document.querySelectorAll()`, giving build-in CSS searching. So as a little extra feature, tripledollar sets $() as an alias for `document.querySelectorAll()`, after a check that it is not already taken by another library. That makes the $() to work almost like in jQuery for selections (just selections, not the extra stuff you get with jQuery). Compared to prototype.js it is simular to its $$() function.

	var body = $('body')[0];
	body.appendChild($$$('div.a-class-name'));
	// get it back
	var div = $('.a-class-name')[0];

The $() always gives back an array, so you have to take out the first item with [0], or loop through the array. A CSS selection can also be done from an element, `element.querySelectorAll`, instead of the whole document, searching just a portion of the page, so the $() can be used in this way also.

	var div = $$$('div', $$$('div#d1'), $$$('div#d2'));
	var d1 = div.$('#d1')[0];
	var d2 = div.$('#d2')[0];

# The tdstruct

A tdstruct is a plain javascript structure, consisting of nested arrays in a way that follows the structure that can be created with tripledollar. Since it is just javascript, it can be transformed to JSON, and be stored in CouchDB or MongoDB, and easily be fed to the $$$(), for generating the DOM structure. There are some rules for a tdstruct. First it is always an array. The elements in the array can be other arrays, strings, numbers, booleans, and of course the two special tripledollar types, the tag describing string, and the attribute object. A tag describing string has to always be placed first in an array.

	var tdstruct = ['table#t1', {border: 1},
		['tbody',
			['tr', ['td', 'one'], ['td', 'two'], ['td', 'three']]]];

A tdstuct is not a DOM element, it is just the array it seems to be. To use it it has to be fed to the $$$() function.

	var table = $$$(tdstruct);
	document.body.appendChild(table);

A tdstruct can be generated backwards, from an element on a web page. This is done with the $$$.structify() function.

	var dom = $$$(['div#div1', ['h1'], ['p', 'It was a ', ['b', 'cloudy'], ' day.']]);
	document.body.appendChild(dom);

	// get the DOM element by id, and structify it
	var div1 = $('#div1')[0];
	var tdstruct = $$$.structify(div1);

	alert(JSON.stringify(tdstruct));

# Finally

It was quite a bit of information for this rather small library. Here is a piece of code that you can use as a starting point, and try this for your self. Just copy it and save it as a HTML file.


	<!doctype html>
	<html lang="en">
  		<head>
    		<title>tripledollar</title>
    		<meta charset="utf-8" />
    		<script src="http://raw.github.com/steenk/tripledollar/master/tripledollar.js"></script>
  		</head>
  		<body>
    		<script>
      			tripledollar(['div', {style:'color:pink;font-size:100pt'}, "Don't write HTML!"]);
    		</script>
  		</body>
	</html>














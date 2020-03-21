import $$$ from "tripledollar";
import './style.less';

function render () {

	return $$$(
	  ['div.td-demo',
		  ['h2', 'Just DOM scripting'],
		  ['pre',
`import $$$ from "tripledollar";

$$$.appendToDoc(['div',
   ['h1', 'Tripledollar'],
   ['p', 'Version ', $$$.version]
]);`
		  ]
	 ]
	);
}

render.add = function (note) {
	let demo = $$$.query('.td-demo');
	demo.ins(['p', note]);
}


export default render;

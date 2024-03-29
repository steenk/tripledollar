**v1.10.0**;

  - Declaration file for Typescript added.

**v1.9.0**;

  - New methods __parse__ and __stringify__ for transform back and forth between a JSON string and a DOM element.

**v1.8.1**;

  - Moved source files into "src" directory.
  - Export entry in package.json for "require" and "import".

**v1.8.0**;

  - Changed from log to warn when for warnings.
  - Moved to ECMAScript modules in server.js.
  
**v1.7.8**:

  - Rollup issue with old postcss.

**v1.7.7**:

  - Fixed bug that appeared on some "select" elements.

**v1.7.6**:

  - Version number sync.

**v1.7.5**:

  - Corrected JSON.

**v1.7.4**:

  - Run web server from "server.js" if it exists. Removed "index.html" from root and since build is done to "dist".

**v1.7.3**:

  - Allow mixed content in "ins" array.

**v1.7.2**

  - Adjusted index.html.

**v1.7.1**:

  - Method "ins" can take an array of elements. 

**v1.7.0**:

  - Rollup with postcss.

**v1.6.3**:

  - Resolves modules in node\_modules for rollup builds.

**v1.6.2**:

  - Init for Nodejs, includes a sample package.json. Build script with rollup.

**v1.6.1**:

  - Server can be started with the --public argument.

**v1.5.8**:

  - Removed dependency to npm.

**v1.5.0**:

  - Changed module system to ES6 standard. The file "tripledollar.mjs" is for ES6 modules, while "tripledollar.js" still works for Require.js.

**v1.4.0**:

  - Adjustment for module loader. Updated dependencies.

**v1.3.3**:

  - Multiple setting of the same attributes corrected.

**v1.3.0**:

  - Internal optimization.

**v1.2.0**:

  - Modified for use in Node environments like Electron.

**v1.1.1**:

  - Minor spelling correction.

**v1.1.0**:

  - Add your own namespace.
 
**v1.0.4**:

  - Proper global reference and API doc.

**v1.0.3**:

  - Using "setTimeout" when "postMessage" is not implemented (jsdom).

**v1.0.1**:

  - Added an optional trim parameter in structify method, $$$.structify(elem, trim), that takes away extra spaces.

**v1.0.0**:

  - Took away an unnecessary trim() in structify.

**v1.0.0-rc.6**:

  - Moved out the td server to it's own project.

**v1.0.0-rc.5**:

  - Don't use console.error, it's not supported everywhere.

**v1.0.0-rc.4**:

  - Better error handling.

**v1.0.0-rc.3**:

  - Fixed a bug with data attributes.

**v1.0.0-rc.2**:

  - Fixed bug in structify function where many classnames didn't parse.
  - $$$ works as a wrapper for elements not created by $$$. Adds helper functions.

**v1.0.0-rc.1**:

  - $$$.structify works for SVG.
  - The server port is configurable.

**v0.10.2**:

  - Further optimization of tripledollar.
  - Status check in td tool.
  - Download with npm in td --get.

**v0.10.1**:

  - Reverted a change that didn't work with Internet Explorer.

**v0.10.0**:

  Code optimizations.

**v0.9.11**:

  - Minor fix in package.json.

**v0.9.10**:

  - Fixed spawn process on Windows.

**v0.9.9**:

  - Start and stop a HTTP server with the td command.

**v0.9.8**:

  - Depricated window.tripledollar. Use window.$$$.appendToDoc instead.
  - Improvements on the CLI.

**v0.9.7**:

  - Command line tool.

**v0.9.6**:

  - Publish on npm.

**v0.9.5**:

  - Fixed bug with classnames on SVG.

**v0.9.4**:

  - Fix for IE.

**v0.9.3**:

  - Use className instead of classList for old browsers.

**v0.9.2**:

  - Recursive css method with CSS Selector.

**v0.9.1**:

  - Both AMD and CommonJS module.

**v0.9.0**:

  - Promise.

**v0.8.1**:

  - Optimazations.

**v0.8.0**:

  - Adjusted to jslint.

**v0.7.5**:

  - Check validity of "ident" parameter.

**v0.7.4**:

  - ReadyState can be "interactive".

**v0.7.3**:

  - Namespace attributes.

**v0.7.2**:

  - SVG elements.

**v0.7.1**:

  - Small adjustments for old browsers.

**v0.7.0**:

  - "when" method to execute things after "appenToDoc".
  - $$$.setImmediate, a polyfill for placing callbacks on the event queue.
  - Testing with mocha.

**v0.6.4**:

  - Made it work in IE8.

**v0.6.3**:

  - Fixed a regex bug.

**v0.6.2**:

  - Some error handling.

**v0.6.1**:

  - Improved the parsing of the ident parameter. Now class names and id can be in mixed order.

**v0.6.0**:

  - Got rid of parameters in one array for the `fun` function. Arbitrary numbers of parameters instead.

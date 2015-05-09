**v1.0.0-rc.3**;

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

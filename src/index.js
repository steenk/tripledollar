import { createTripledollar } from './core.js';

/** @typedef {import('./types.js').StyleValue} StyleValue */
/** @typedef {import('./types.js').StyleMap} StyleMap */
/** @typedef {import('./types.js').AttrValue} AttrValue */
/** @typedef {import('./types.js').AttrMap} AttrMap */
/** @typedef {import('./types.js').TDStruct} TDStruct */
/** @typedef {import('./types.js').TDChild} TDChild */
/** @typedef {import('./types.js').StructifyOptions} StructifyOptions */
/** @typedef {import('./types.js').WindowLike} WindowLike */
/**
 * @template {Element} [T=HTMLElement]
 * @typedef {import('./types.js').TDElement<T>} TDElement
 */
/** @typedef {import('./types.js').Tripledollar} Tripledollar */

const $$$ = createTripledollar();

export const {
  version,
  appendToDoc,
  onReady,
  structify,
  parse,
  stringify,
  destroy,
  namespace
} = $$$;

export { createTripledollar };
export default $$$;

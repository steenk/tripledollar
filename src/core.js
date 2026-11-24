import { VERSION } from './version.js';
import { css, set, fun, evt, destroy } from './helpers.js';
import { structifyElement } from './struct.js';

const IDENT_RE = /^[A-Za-z][A-Za-z0-9_-]*(?::[A-Za-z][A-Za-z0-9_-]*)?(?:[.#][A-Za-z0-9_:-]+)*$/;

/**
 * Create a Tripledollar instance bound to a specific window/document (or lazy globalThis).
 *
 * @param {import('./types.js').WindowLike} [win]
 * @returns {import('./types.js').Tripledollar}
 */
export function createTripledollar(win) {
  /** @type {Record<string, string>} */
  const ns = {
    svg: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink',
    xhtml: 'http://www.w3.org/1999/xhtml'
  };

  /**
   * Lazily resolve the active window object.
   * @returns {import('./types.js').WindowLike}
   */
  function getWindow() {
    const w = win ?? (typeof globalThis !== 'undefined' ? /** @type {any} */ (globalThis) : undefined);
    if (!w || !w.document) {
      throw new Error('$$$: No DOM document available. Pass a window object to createTripledollar(window).');
    }
    return w;
  }

  /**
   * Append children and apply attributes to an element.
   *
   * @param {Element} elem
   * @param {import('./types.js').TDChild[]} items
   */
  function applyArgs(elem, items) {
    const doc = getWindow().document;
    for (const param of items) {
      if (param === null || param === undefined || typeof param === 'boolean' || param === '') {
        continue;
      }
      if (typeof param === 'object') {
        if ('nodeType' in param && typeof param.nodeType === 'number') {
          elem.appendChild(/** @type {Node} */ (param));
        } else if (Array.isArray(param)) {
          if (param.length === 0) {
            continue;
          }
          if (typeof param[0] === 'string') {
            const child = $$$(/** @type {string} */ (param[0]), ...param.slice(1));
            if (child) {
              elem.appendChild(child);
            }
          } else {
            applyArgs(elem, param);
          }
        } else {
          for (const [key, val] of Object.entries(param)) {
            if (val === null || val === undefined || val === false) {
              continue;
            }
            if (key === 'class') {
              const extra = String(val).trim();
              if (extra) {
                const existing = elem.getAttribute('class');
                elem.setAttribute('class', existing ? `${existing} ${extra}` : extra);
              }
            } else if (key === 'style' && typeof val === 'object') {
              css.call(elem, /** @type {import('./types.js').StyleMap} */ (val));
            } else if (/^data[A-Z]/.test(key)) {
              const attrName =
                'data-' +
                key
                  .slice(4)
                  .replace(/[A-Z]/g, (m, offset) => (offset > 0 ? '-' : '') + m.toLowerCase());
              elem.setAttribute(attrName, val === true ? '' : String(val));
            } else {
              const attrVal = val === true ? '' : String(val);
              const colon = key.indexOf(':');
              if (colon > 0) {
                const prefix = key.slice(0, colon);
                if (ns[prefix]) {
                  elem.setAttributeNS(ns[prefix], key, attrVal);
                  continue;
                }
              }
              elem.setAttribute(key, attrVal);
            }
          }
        }
      } else {
        elem.appendChild(doc.createTextNode(String(param)));
      }
    }
  }

  /**
   * Insert additional elements, tdstructs, attributes, or text into this element.
   *
   * @template {Element} T
   * @this {T}
   * @param {...import('./types.js').TDChild} items
   * @returns {T}
   */
  function ins(...items) {
    applyArgs(this, items);
    return this;
  }

  /**
   * Attach non-enumerable hoisted helper methods idempotently to an element.
   *
   * @template {Element} T
   * @param {T} elem
   * @returns {import('./types.js').TDElement<T>}
   */
  function attachHelpers(elem) {
    if (/** @type {any} */ (elem).evt === evt && /** @type {any} */ (elem).ins === ins) {
      return /** @type {import('./types.js').TDElement<T>} */ (elem);
    }
    Object.defineProperties(elem, {
      css: { value: css, writable: true, configurable: true },
      set: { value: set, writable: true, configurable: true },
      fun: { value: fun, writable: true, configurable: true },
      evt: { value: evt, writable: true, configurable: true },
      ins: { value: ins, writable: true, configurable: true }
    });
    return /** @type {import('./types.js').TDElement<T>} */ (elem);
  }

  /**
   * Create or enhance a DOM Element.
   *
   * @param {string | import('./types.js').TDStruct | Element} ident
   * @param {...import('./types.js').TDChild} args
   * @returns {import('./types.js').TDElement<Element> | undefined}
   */
  function $$$(ident, ...args) {
    if (typeof ident !== 'string') {
      if (Array.isArray(ident)) {
        if (ident.length === 0 || typeof ident[0] !== 'string') {
          return undefined;
        }
        return $$$(ident[0], ...ident.slice(1));
      }
      if (ident && typeof ident === 'object' && ident.nodeType === 1) {
        return attachHelpers(/** @type {Element} */ (ident));
      }
      return undefined;
    }

    if (!IDENT_RE.test(ident)) {
      console.warn(`$$$: not a valid ident parameter: "${ident}".`);
      return undefined;
    }

    const doc = getWindow().document;
    const parts = ident.split(/([.#])/);
    const tagPart = parts[0];
    const colon = tagPart.indexOf(':');
    /** @type {Element} */
    let elem;

    if (colon > 0) {
      const prefix = tagPart.slice(0, colon);
      const localName = tagPart.slice(colon + 1);
      if (ns[prefix]) {
        elem = doc.createElementNS(ns[prefix], localName);
      } else {
        elem = doc.createElement(localName);
      }
    } else if (ns[tagPart]) {
      elem = doc.createElementNS(ns[tagPart], tagPart);
    } else {
      elem = doc.createElement(tagPart);
    }

    /** @type {string[]} */
    const classList = [];
    for (let i = 1; i < parts.length; i += 2) {
      const sep = parts[i];
      const val = parts[i + 1];
      if (sep === '.') {
        classList.push(val);
      } else if (sep === '#') {
        elem.setAttribute('id', val);
      }
    }
    if (classList.length > 0) {
      elem.setAttribute('class', classList.join(' '));
    }

    if (args.length > 0) {
      applyArgs(elem, args);
    }

    return attachHelpers(elem);
  }

  /**
   * Run a callback once the DOM is ready.
   *
   * @param {() => void} callback
   * @returns {void}
   */
  function onReady(callback) {
    const doc = getWindow().document;
    if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
      queueMicrotask(callback);
    } else {
      doc.addEventListener('DOMContentLoaded', callback, { once: true });
    }
  }

  /**
   * Append elements or tdstructs to document.body once the DOM is ready.
   *
   * @param {...(Node | import('./types.js').TDStruct | (() => void) | null | undefined | boolean)} items
   * @returns {Promise<Node[]>}
   */
  function appendToDoc(...items) {
    return new Promise((resolve, reject) => {
      try {
        onReady(() => {
          try {
            const body = getWindow().document.body;
            /** @type {Node[]} */
            const appended = [];
            for (const item of items) {
              if (item === null || item === undefined || typeof item === 'boolean') {
                continue;
              }
              if (Array.isArray(item)) {
                const elem = $$$(item);
                if (elem) {
                  body.appendChild(elem);
                  appended.push(elem);
                }
              } else if (typeof item === 'object' && typeof item.nodeType === 'number') {
                body.appendChild(item);
                appended.push(item);
              } else if (typeof item === 'function') {
                item();
              }
            }
            resolve(appended);
          } catch (err) {
            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Convert a DOM Element into a TDStruct array.
   *
   * @param {Element} elem
   * @param {boolean | import('./types.js').StructifyOptions} [options]
   * @returns {import('./types.js').TDStruct | null}
   */
  function structify(elem, options) {
    return structifyElement(elem, ns, options);
  }

  /**
   * Parse a JSON-encoded TDStruct string into a DOM Element.
   *
   * @param {string} json
   * @returns {import('./types.js').TDElement<HTMLElement>}
   */
  function parse(json) {
    if (typeof json !== 'string') {
      throw new TypeError('$$$.parse: expected a JSON string');
    }
    const data = JSON.parse(json);
    if (!Array.isArray(data) || typeof data[0] !== 'string') {
      throw new TypeError('$$$.parse: JSON must represent a tdstruct array');
    }
    const elem = $$$(/** @type {import('./types.js').TDStruct} */ (data));
    if (!elem) {
      throw new TypeError(`$$$.parse: invalid tdstruct ident "${data[0]}"`);
    }
    return /** @type {import('./types.js').TDElement<HTMLElement>} */ (elem);
  }

  /**
   * Serialize a DOM Element into a JSON-encoded TDStruct string.
   *
   * @param {Element} dom
   * @param {boolean | import('./types.js').StructifyOptions} [options]
   * @returns {string}
   */
  function stringify(dom, options = { trim: true }) {
    if (!dom || dom.nodeType !== 1) {
      throw new TypeError('$$$.stringify: expected a DOM Element');
    }
    return JSON.stringify(structify(dom, options));
  }

  /**
   * Read or register an XML/SVG namespace URI.
   *
   * @param {string} name
   * @param {string} [uri]
   * @returns {string | undefined}
   */
  function namespace(name, uri) {
    if (uri) {
      ns[name] = uri;
    }
    return ns[name];
  }

  const instance = /** @type {import('./types.js').Tripledollar} */ ($$$);
  instance.version = VERSION;
  instance.create = createTripledollar;
  instance.appendToDoc = appendToDoc;
  instance.onReady = onReady;
  instance.structify = structify;
  instance.parse = parse;
  instance.stringify = stringify;
  instance.destroy = destroy;
  instance.namespace = namespace;

  return instance;
}

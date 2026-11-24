const SKIP_ATTRS = /^(id|class|contenteditable)$/;
const XHTML_NS = 'http://www.w3.org/1999/xhtml';

/**
 * Convert a DOM Element tree into a serializable TDStruct array without mutating the DOM.
 *
 * @param {Element} elem
 * @param {Record<string, string>} ns
 * @param {boolean | import('./types.js').StructifyOptions} [options]
 * @returns {import('./types.js').TDStruct | null}
 */
export function structifyElement(elem, ns, options) {
  if (!elem || elem.nodeType !== 1) {
    return null;
  }

  const trim = typeof options === 'boolean' ? options : Boolean(options?.trim);

  /** @type {Map<string, string>} */
  const uriToPrefix = new Map();
  for (const [prefix, uri] of Object.entries(ns)) {
    if (uri !== XHTML_NS) {
      uriToPrefix.set(uri, prefix);
    }
  }

  /**
   * @param {Element} c
   * @returns {import('./types.js').TDStruct}
   */
  function dig(c) {
    const local = c.localName || c.tagName.toLowerCase();
    let name = local;

    if (c.namespaceURI && c.namespaceURI !== XHTML_NS) {
      const prefix = uriToPrefix.get(c.namespaceURI);
      if (prefix) {
        name = prefix === local ? prefix : `${prefix}:${local}`;
      }
    }

    const rawClass = c.getAttribute('class') || '';
    const classes = rawClass.trim().split(/\s+/).filter(Boolean);
    if (classes.length > 0) {
      name += '.' + classes.join('.');
    }
    if (c.id) {
      name += '#' + c.id;
    }

    /** @type {import('./types.js').TDStruct} */
    const list = [name];

    if (c.hasAttributes()) {
      /** @type {Record<string, string>} */
      const attrs = {};
      let hasAttrs = false;
      for (const attr of c.attributes) {
        if (SKIP_ATTRS.test(attr.name)) {
          continue;
        }
        let attrKey = attr.name;
        if (attr.namespaceURI && !attrKey.includes(':')) {
          const prefix = uriToPrefix.get(attr.namespaceURI);
          if (prefix) {
            attrKey = `${prefix}:${attr.localName || attrKey}`;
          }
        }
        attrs[attrKey] = attr.value;
        hasAttrs = true;
      }
      if (hasAttrs) {
        list.push(attrs);
      }
    }

    let pendingText = '';
    const flushText = () => {
      if (!pendingText) return;
      const text = trim ? pendingText.replace(/\s+/g, ' ').trim() : pendingText;
      if (text.length > 0) {
        list.push(text);
      }
      pendingText = '';
    };

    for (const child of c.childNodes) {
      if (child.nodeType === 3) {
        pendingText += child.nodeValue || '';
      } else if (child.nodeType === 1) {
        flushText();
        list.push(dig(/** @type {Element} */ (child)));
      }
    }
    flushText();

    return list;
  }

  return dig(elem);
}

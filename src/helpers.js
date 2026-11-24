/**
 * Apply inline CSS styles, CSS custom properties, or nested selector rules.
 *
 * @template {Element} T
 * @this {T}
 * @param {import('./types.js').StyleMap} obj
 * @returns {T}
 */
export function css(obj) {
  const style = /** @type {HTMLElement | SVGElement} */ (/** @type {unknown} */ (this)).style;
  for (const [key, val] of Object.entries(obj)) {
    if (val !== null && typeof val === 'object') {
      const targets = this.querySelectorAll(key);
      for (const target of targets) {
        css.call(target, val);
      }
    } else if (style) {
      if (val === null || val === undefined) {
        if (key.startsWith('--') || key.includes('-')) {
          style.removeProperty(key);
        } else {
          /** @type {any} */ (style)[key] = '';
        }
      } else if (key.startsWith('--') || key.includes('-')) {
        style.setProperty(key, String(val));
      } else {
        /** @type {any} */ (style)[key] = String(val);
      }
    }
  }
  return this;
}

/**
 * Set a JavaScript property on the element.
 *
 * @template {Element} T
 * @this {T}
 * @param {string} key
 * @param {unknown} val
 * @returns {T}
 */
export function set(key, val) {
  /** @type {any} */ (this)[key] = val;
  return this;
}

/**
 * Call a method on the element within a fluent chain.
 *
 * @template {Element} T
 * @this {T}
 * @param {string} name
 * @param {...unknown} args
 * @returns {T}
 */
export function fun(name, ...args) {
  /** @type {any} */ (this)[name](...args);
  return this;
}

/**
 * Attach a standard DOM event listener.
 *
 * @template {Element} T
 * @this {T}
 * @param {string} type
 * @param {EventListenerOrEventListenerObject} listener
 * @param {boolean | AddEventListenerOptions} [options]
 * @returns {T}
 */
export function evt(type, listener, options) {
  this.addEventListener(type, listener, options);
  return this;
}

/**
 * Remove all child nodes from an element, and optionally remove the element itself.
 *
 * @param {Element | DocumentFragment | null | undefined} el
 * @param {boolean} [removeSelf=false]
 * @returns {void}
 */
export function destroy(el, removeSelf = false) {
  if (!el) return;
  if (typeof el.replaceChildren === 'function') {
    el.replaceChildren();
  } else {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
  if (removeSelf && 'remove' in el && typeof el.remove === 'function') {
    el.remove();
  }
}

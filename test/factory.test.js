import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { Window } from 'happy-dom';
import $$$, {
  version,
  appendToDoc,
  onReady,
  structify,
  parse,
  stringify,
  destroy,
  namespace,
  createTripledollar
} from '../src/index.js';

describe('Exports, Factory, SSR Safety, and Built Bundles', () => {
  it('exposes a consistent API on both default $$$ and named exports', () => {
    expect(version).toBe($$$.version);
    expect(appendToDoc).toBe($$$.appendToDoc);
    expect(onReady).toBe($$$.onReady);
    expect(structify).toBe($$$.structify);
    expect(parse).toBe($$$.parse);
    expect(stringify).toBe($$$.stringify);
    expect(destroy).toBe($$$.destroy);
    expect(namespace).toBe($$$.namespace);
    expect(createTripledollar).toBe($$$.create);
  });

  it('works with an explicitly passed window via createTripledollar(win)', async () => {
    const win = new Window();
    const td = createTripledollar(/** @type {any} */ (win));

    await td.appendToDoc(['div#isolated', ['span', 'In custom window']]);
    expect(win.document.getElementById('isolated').textContent).toBe('In custom window');
    expect(document.getElementById('isolated')).toBeNull();
  });

  it('throws a clear error if used without any DOM document', () => {
    const td = createTripledollar(/** @type {any} */ ({}));
    expect(() => td('div')).toThrow(/No DOM document available/);
  });

  it('loads the built ESM bundle cleanly', async () => {
    const mod = await import('../dist/tripledollar.js');
    const el = mod.default('section.built', ['p', 'From ESM bundle']);
    expect(el.tagName).toBe('SECTION');
    expect(el.textContent).toBe('From ESM bundle');
    expect(mod.version).toBe($$$.version);
    expect(mod.parse('["b","ok"]').tagName).toBe('B');
  });

  it('loads the minified CDN IIFE bundle and exposes global $$$', () => {
    const code = readFileSync(resolve(process.cwd(), 'dist/tripledollar.min.js'), 'utf8');
    const win = new Window();
    const context = vm.createContext({
      window: win,
      document: win.document,
      console,
      queueMicrotask,
      Promise
    });
    vm.runInContext(code, context);

    expect(typeof context.$$$).toBe('function');
    expect(context.$$$.version).toBe($$$.version);

    const el = context.$$$('div.cdn', 'Hello CDN');
    expect(el.className).toBe('cdn');
    expect(el.textContent).toBe('Hello CDN');
    expect(typeof context.$$$.parse).toBe('function');
    expect(typeof context.$$$.destroy).toBe('function');
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import $$$ from '../src/index.js';

const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));

describe('Core', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it('exposes the matching package version', () => {
    expect($$$.version).toBe(pkg.version);
  });

  it('creates elements with tag, id, and classes in any order', () => {
    const a = $$$('div#a');
    const b = $$$('div.e#b');
    const c = $$$('div#c.f');
    const d = $$$('div.g#d.h.i');
    const custom = $$$('my-widget.active');

    expect(a.tagName).toBe('DIV');
    expect(a.id).toBe('a');
    expect(b.id).toBe('b');
    expect(b.classList.contains('e')).toBe(true);
    expect(c.id).toBe('c');
    expect(c.classList.contains('f')).toBe(true);
    expect([...d.classList]).toEqual(['g', 'h', 'i']);
    expect(custom.tagName).toBe('MY-WIDGET');
    expect(custom.classList.contains('active')).toBe(true);
  });

  it('merges classes from ident and attribute object', () => {
    const el = $$$('div.foo', { class: 'bar baz' });
    expect(el.getAttribute('class')).toBe('foo bar baz');
    expect([...el.classList]).toEqual(['foo', 'bar', 'baz']);
  });

  it('handles boolean, null, undefined, and standard attributes properly', () => {
    const btn = $$$('button', {
      type: 'button',
      disabled: true,
      hidden: false,
      title: null,
      name: undefined,
      tabindex: 0
    }, 'Click');

    expect(btn.getAttribute('type')).toBe('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
    expect(btn.getAttribute('disabled')).toBe('');
    expect(btn.hasAttribute('hidden')).toBe(false);
    expect(btn.hasAttribute('title')).toBe(false);
    expect(btn.hasAttribute('name')).toBe(false);
    expect(btn.getAttribute('tabindex')).toBe('0');
  });

  it('converts camelCase data-* attributes to kebab-case', () => {
    const el = $$$('div', {
      dataId: '42',
      dataUserName: 'steen',
      dataActiveFlag: true,
      dataIgnored: false
    });

    expect(el.getAttribute('data-id')).toBe('42');
    expect(el.getAttribute('data-user-name')).toBe('steen');
    expect(el.getAttribute('data-active-flag')).toBe('');
    expect(el.hasAttribute('data-ignored')).toBe(false);
  });

  it('supports style attribute as string or object', () => {
    const a = $$$('div', { style: 'display: block' });
    expect(a.style.display).toBe('block');

    const b = $$$('div', { style: { color: 'maroon', '--gap': '12px' } });
    expect(b.style.color).toBe('maroon');
    expect(b.style.getPropertyValue('--gap')).toBe('12px');
  });

  it('skips falsy children while rendering 0 and strings', () => {
    const show = false;
    const el = $$$(
      'div',
      null,
      undefined,
      false,
      true,
      '',
      show && ['span', 'hidden'],
      0,
      ' items'
    );
    expect(el.textContent).toBe('0 items');
    expect(el.childNodes.length).toBe(2);
  });

  it('handles nested elements, tdstructs, arrays of children, and DocumentFragment', () => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createElement('hr'));

    const items = ['A', 'B', 'C'];
    const list = $$$(
      'ul',
      items.map((x) => ['li', x]),
      [$$$('li', 'D'), ['li', 'E']],
      frag
    );

    expect(list.children.length).toBe(6);
    expect(list.children[0].textContent).toBe('A');
    expect(list.children[3].textContent).toBe('D');
    expect(list.children[4].textContent).toBe('E');
    expect(list.children[5].tagName).toBe('HR');
  });

  it('wraps existing elements idempotently without double-attaching or enumerable pollution', () => {
    const btn = $$$('button', 'OK');
    const wrappedAgain = $$$(btn);
    expect(wrappedAgain).toBe(btn);
    expect(Object.keys(btn)).not.toContain('evt');
    expect(Object.keys(btn)).not.toContain('ins');

    const other = $$$('button', 'Second');
    expect(btn.evt).toBe(other.evt);
    expect(btn.css).toBe(other.css);
    expect(btn.ins).toBe(other.ins);

    const raw = document.createElement('span');
    expect(raw.evt).toBeUndefined();
    const enhanced = $$$(raw);
    expect(enhanced).toBe(raw);
    expect(typeof enhanced.evt).toBe('function');
  });

  it('rejects invalid ident parameters cleanly', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect($$$({})).toBeUndefined();
    expect($$$('')).toBeUndefined();
    expect($$$('this is wrong')).toBeUndefined();
    expect($$$('123div')).toBeUndefined();
    expect($$$('div.')).toBeUndefined();
    expect($$$('div..a')).toBeUndefined();
    expect($$$('div?foo=bar')).toBeUndefined();
    expect($$$('div[a]')).toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('removes legacy v1 methods and properties', () => {
    const el = $$$('div');
    expect($$$.query).toBeUndefined();
    expect($$$.queryAll).toBeUndefined();
    expect($$$.setImmediate).toBeUndefined();
    expect(el.query).toBeUndefined();
    expect(el.queryAll).toBeUndefined();
    expect(el.prototype).toBeUndefined();
  });

  it('generates 2000 elements quickly', () => {
    const struct = ['div.performance'];
    for (let n = 0; n < 2000; n++) {
      struct.push(['div#id' + n]);
    }
    const start = performance.now();
    const root = $$$(struct);
    const elapsed = performance.now() - start;

    expect(root.children.length).toBe(2000);
    expect(elapsed).toBeLessThan(500);
  });
});

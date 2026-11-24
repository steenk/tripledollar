import { describe, it, expect, vi } from 'vitest';
import $$$, { structify, parse, stringify } from '../src/index.js';

describe('TDStruct, structify, parse, and stringify', () => {
  it('round-trips nested HTML elements via structify', () => {
    const orig = ['div.tdstruct1', ['span'], ['a', { name: 'link1' }], ['div', ['div.d1', ['pre']]]];
    const el = $$$(orig);
    const out = structify(el);

    expect(out).toEqual(orig);
  });

  it('preserves attributes whose names contain "id" or "class" (regression for v1 unanchored regex)', () => {
    const svg = $$$('svg.svgtest', {
      width: '100%',
      height: '50%',
      viewBox: '0 0 18 18',
      'data-id': 'abc',
      hidden: ''
    }, ['svg:rect', { width: '10', height: '10' }]);

    const out = structify(svg);
    expect(out[0]).toBe('svg.svgtest');
    expect(out[1].width).toBe('100%');
    expect(out[1].height).toBe('50%');
    expect(out[1].viewBox).toBe('0 0 18 18');
    expect(out[1]['data-id']).toBe('abc');
    expect(out[1].hidden).toBe('');
    expect(out[2][0]).toBe('svg:rect');
    expect(out[2][1].width).toBe('10');
  });

  it('does not mutate input DOM and merges adjacent text nodes cleanly', () => {
    const el = document.createElement('p');
    el.setAttribute('class', '  one   two  ');
    el.appendChild(document.createTextNode('Hello '));
    el.appendChild(document.createTextNode('   world  '));

    const beforeCount = el.childNodes.length;
    const out = structify(el, { trim: true });

    expect(el.childNodes.length).toBe(beforeCount);
    expect(out).toEqual(['p.one.two', 'Hello world']);
    expect(structify(el, true)).toEqual(['p.one.two', 'Hello world']);
  });

  it('parse() returns a real enhanced DOM element and round-trips with stringify()', () => {
    const orig = $$$('div.card#c1', { 'data-role': 'hero' }, ['h1', 'Hello'], ['p', 'World']);
    const json = stringify(orig);
    expect(json).toBe('["div.card#c1",{"data-role":"hero"},["h1","Hello"],["p","World"]]');

    const rebuilt = parse(json);
    expect(rebuilt.nodeType).toBe(1);
    expect(rebuilt.tagName).toBe('DIV');
    expect(rebuilt.id).toBe('c1');
    expect(rebuilt.className).toBe('card');
    expect(rebuilt.getAttribute('data-role')).toBe('hero');
    expect(rebuilt.querySelector('h1').textContent).toBe('Hello');
    expect(typeof rebuilt.evt).toBe('function');
  });

  it('round-trips SVG namespaces through stringify() and parse()', () => {
    const orig = $$$('svg', { width: 100, height: 100 }, ['svg:circle', { cx: 50, cy: 50, r: 40 }]);
    const rebuilt = parse(stringify(orig));

    expect(rebuilt.namespaceURI).toBe('http://www.w3.org/2000/svg');
    const circle = rebuilt.firstChild;
    expect(circle.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(circle.getAttribute('r')).toBe('40');
  });

  it('throws standard exceptions on invalid input to parse() and stringify()', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => parse(/** @type {any} */ (['div']))).toThrow(TypeError);
    expect(() => parse('{not valid json')).toThrow(SyntaxError);
    expect(() => parse('{"not":"array"}')).toThrow(TypeError);
    expect(() => parse('["invalid ident"]')).toThrow(TypeError);
    expect(() => stringify(/** @type {any} */ (null))).toThrow(TypeError);
    expect(() => stringify(/** @type {any} */ ('<div></div>'))).toThrow(TypeError);
    warn.mockRestore();
  });
});

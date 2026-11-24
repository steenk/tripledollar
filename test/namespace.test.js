import { describe, it, expect } from 'vitest';
import $$$, { namespace, createTripledollar } from '../src/index.js';

describe('Namespaces', () => {
  it('handles built-in SVG and XLink namespaces', () => {
    expect(namespace('svg')).toBe('http://www.w3.org/2000/svg');
    expect(namespace('xlink')).toBe('http://www.w3.org/1999/xlink');

    const svg = $$$(
      'svg:svg.svg-test',
      ['svg:a', { 'xlink:href': 'https://tripledollar.net' }, ['svg:text', '$$$']]
    );

    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(svg.classList.contains('svg-test')).toBe(true);

    const anchor = svg.firstChild;
    expect(anchor.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(anchor.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toBe('https://tripledollar.net');
  });

  it('registers and uses custom namespaces via both $$$.namespace and named export', () => {
    expect($$$.namespace('td', 'https://tripledollar.net')).toBe('https://tripledollar.net');
    expect(namespace('td')).toBe('https://tripledollar.net');

    const el = $$$('td:box.td-box');
    expect(el.namespaceURI).toBe('https://tripledollar.net');
    expect(el.localName).toBe('box');
    expect(el.getAttribute('class')).toBe('td-box');
  });

  it('isolates custom namespaces per createTripledollar() instance', () => {
    const a = createTripledollar(window);
    const b = createTripledollar(window);

    a.namespace('custom', 'https://example.com/ns');
    expect(a.namespace('custom')).toBe('https://example.com/ns');
    expect(b.namespace('custom')).toBeUndefined();
  });
});

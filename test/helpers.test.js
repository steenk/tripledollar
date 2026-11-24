import { describe, it, expect, beforeEach } from 'vitest';
import $$$, { destroy } from '../src/index.js';

describe('Helper Methods', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it('applies camelCase, kebab-case, CSS custom properties, removals, and recursive rules via css()', () => {
    const board = $$$(
      'div.board',
      ['div.row', ['div.cell.black'], ['div.cell.white']]
    ).css({
      color: 'maroon',
      backgroundColor: 'gold',
      'font-size': '14px',
      '--accent': '#ffcc00',
      '.cell': {
        width: '25px',
        height: '25px'
      },
      '.black': {
        backgroundColor: 'black'
      }
    });

    expect(board.style.color).toBe('maroon');
    expect(board.style.backgroundColor).toBe('gold');
    expect(board.style.fontSize).toBe('14px');
    expect(board.style.getPropertyValue('--accent')).toBe('#ffcc00');

    const black = board.querySelector('.black');
    expect(black.style.width).toBe('25px');
    expect(black.style.backgroundColor).toBe('black');

    board.css({ color: null, '--accent': undefined });
    expect(board.style.color).toBe('');
    expect(board.style.getPropertyValue('--accent')).toBe('');
  });

  it('sets JS properties via set() and calls methods via fun()', () => {
    const dash = function (delim) {
      this.textContent = this.textContent.split('').join(delim);
    };
    const el = $$$('div', 'tripledollar').set('dash', dash).fun('dash', '-');
    expect(el.textContent).toBe('t-r-i-p-l-e-d-o-l-l-a-r');
  });

  it('attaches standard event listeners with AddEventListenerOptions via evt()', () => {
    let count = 0;
    const btn = $$$('button', 'Once').evt('click', () => {
      count++;
    }, { once: true });

    btn.dispatchEvent(new Event('click'));
    btn.dispatchEvent(new Event('click'));
    expect(count).toBe(1);

    const controller = new AbortController();
    let abortCount = 0;
    const btn2 = $$$('button', 'Abortable').evt('click', () => {
      abortCount++;
    }, { signal: controller.signal });

    btn2.dispatchEvent(new Event('click'));
    controller.abort();
    btn2.dispatchEvent(new Event('click'));
    expect(abortCount).toBe(1);
  });

  it('inserts elements, tdstructs, mixed arrays, and handles empty ins()', () => {
    const el = $$$('div.ins-test')
      .ins()
      .ins($$$('div.a'))
      .ins(['div.b'])
      .ins([$$$('div.c'), ['div.d'], null, false]);

    expect(el.childElementCount).toBe(4);
    expect([...el.children].map((c) => c.className)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('clears children with destroy() and optionally removes the element itself', () => {
    const parent = $$$('div#parent', ['span', 'a'], ['span', 'b']);
    document.body.appendChild(parent);

    destroy(parent);
    expect(parent.childNodes.length).toBe(0);
    expect(document.body.contains(parent)).toBe(true);

    destroy(parent, true);
    expect(document.body.contains(parent)).toBe(false);

    expect(() => destroy(null)).not.toThrow();
    expect(() => destroy(undefined, true)).not.toThrow();
  });
});

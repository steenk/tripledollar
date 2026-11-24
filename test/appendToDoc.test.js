import { describe, it, expect, beforeEach } from 'vitest';
import $$$, { appendToDoc, onReady } from '../src/index.js';

describe('appendToDoc and onReady', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it('returns a real Promise that resolves to the appended nodes', async () => {
    const e = $$$('div#first', 'first');
    const promise = appendToDoc(e, ['p#second', 'second'], null, false, undefined);

    expect(promise).toBeInstanceOf(Promise);
    const nodes = await promise;

    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toBe(e);
    expect(document.getElementById('first').textContent).toBe('first');
    expect(document.getElementById('second').textContent).toBe('second');
  });

  it('supports standard Promise chaining and value passing', async () => {
    const val = await appendToDoc(['div', 'hello'])
      .then(() => 10)
      .then((n) => Promise.resolve(n * 2));

    expect(val).toBe(20);
  });

  it('invokes function arguments and rejects when a callback throws', async () => {
    let called = false;
    await appendToDoc(() => {
      called = true;
    });
    expect(called).toBe(true);

    await expect(
      appendToDoc(() => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');
  });

  it('schedules onReady asynchronously when document is already interactive/complete', async () => {
    const order = [];
    await new Promise((resolve) => {
      order.push(1);
      onReady(() => {
        order.push(3);
        resolve();
      });
      order.push(2);
    });
    expect(order).toEqual([1, 2, 3]);
  });
});

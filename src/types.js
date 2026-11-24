/**
 * @typedef {string | number | null | undefined} StyleValue
 */

/**
 * @typedef {{ [key: string]: StyleValue | StyleMap }} StyleMap
 */

/**
 * @typedef {string | number | boolean | null | undefined | StyleMap} AttrValue
 */

/**
 * @typedef {Record<string, AttrValue>} AttrMap
 */

/**
 * @typedef {[string, ...TDChild[]]} TDStruct
 */

/**
 * @typedef {Node | TDStruct | AttrMap | string | number | boolean | null | undefined | TDChild[]} TDChild
 */

/**
 * @typedef {{ trim?: boolean }} StructifyOptions
 */

/**
 * @typedef {{
 *   document: Document;
 *   Element?: typeof Element;
 *   HTMLElement?: typeof HTMLElement;
 *   SVGElement?: typeof SVGElement;
 *   Node?: typeof Node;
 * }} WindowLike
 */

/**
 * @template {Element} [T=HTMLElement]
 * @typedef {T & {
 *   css(styles: StyleMap): TDElement<T>;
 *   set(key: string, val: unknown): TDElement<T>;
 *   fun(name: string, ...args: unknown[]): TDElement<T>;
 *   evt(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): TDElement<T>;
 *   ins(...items: TDChild[]): TDElement<T>;
 * }} TDElement
 */

/**
 * @typedef {{
 *   <T extends Element>(elem: T): TDElement<T>;
 *   (ident: string | TDStruct, ...args: TDChild[]): TDElement<HTMLElement> | undefined;
 *   version: string;
 *   create: (win?: WindowLike) => Tripledollar;
 *   appendToDoc: (...items: (Node | TDStruct | (() => void) | null | undefined | boolean)[]) => Promise<Node[]>;
 *   onReady: (callback: () => void) => void;
 *   structify: (elem: Element, options?: boolean | StructifyOptions) => TDStruct | null;
 *   parse: (json: string) => TDElement<HTMLElement>;
 *   stringify: (dom: Element, options?: boolean | StructifyOptions) => string;
 *   destroy: (el: Element | DocumentFragment | null | undefined, removeSelf?: boolean) => void;
 *   namespace: (name: string, uri?: string) => string | undefined;
 * }} Tripledollar
 */

export {};

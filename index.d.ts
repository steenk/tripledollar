declare module 'tripledollar';

export declare interface TDElement extends HTMLElement {
	evt(event: string, callback: any): any;
	set(name: string, value: any): any;
	fun(name: string, ...args: any[]): any;
	ins(...args: any[]): any;
	css(obj: any): any;
	query(selector: string): any;
	queryAll(selector: string): any[];
}

declare function $$$(e: any, ...args: any[]): TDElement;


declare namespace $$$ {
    const version: string;
    function appendToDoc(...args: any[]): Promise;
    function onReady(n: any): void;
    function parse(json: string): any;
    function query(selector: string): any;
    function queryAll(selector: string): any[];
    function setImmediate(callback: any, ...args: any[]): any;
    function stringify(dom: any): any;
    function structify(elem: any, trim: any): any;
}

export default $$$;

export function destroy (div: any): void;

export function namespace (name: string, uri: string)
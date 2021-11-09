interface PluginMethods {
  [index: string]: any;
  init(this: JQuery, settings?: object): JQuery;
  setProp(this: JQuery, prop: string, value: string | number | (string | number)[]): JQuery;
  getProp(this: JQuery, prop: string): string | number | (string | number)[];
  getOptionsObj(this: JQuery): object;
  getCurrentValues(this: JQuery): [string, string] | [number, number];
  destroy(this: JQuery): JQuery;
  subscribe(this: JQuery, observer: Function): void;
  unsubscribe(this: JQuery, observer: Function): void;
}

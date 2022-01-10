/**
 * I use the any type to be able to pass any arguments
 * in the called slider methods. Methods can also return any values.
 */
interface JQuery {
  metaSlider(initParam?: string | object, ...prop: any): any;
}

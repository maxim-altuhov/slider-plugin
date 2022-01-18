/// <reference path='./interfaces/metaSlider.d.ts' />
import typeSettings from './data/typeSettings';
import initSettings from './data/initSettings';
import limitedProp from './data/limitedProp';
import Model from './layers/Model';
import View from './layers/View';
import Presenter from './layers/Presenter';
import './metaSlider.scss';

let pluginOptions: IPluginOptions;
const pluginMethods: IPluginMethods = {
  init(settings: { [key: string]: any }) {
    // If the slider is not initialized yet
    const data = this.data('metaSlider');

    if (!data) {
      if (this.length > 1) {
        throw new Error('The selector for initializing the slider must be unique on the page');
      }

      if (settings) {
        Object.keys(settings).forEach((key) => {
          if (typeSettings[key] && typeof settings[key] !== typeSettings[key]) {
            throw new Error(
              `The slider's "${key}" property should be passed as "${typeSettings[key]}"`,
            );
          }

          if (key === 'customValues' && !Array.isArray(settings[key])) {
            throw new Error('The slider`s "customValues" property should be passed as an array');
          }
        });
      }

      // Combining user settings and default settings
      pluginOptions = $.extend({}, initSettings, settings);

      // Initializing the plugin
      const model = new Model(this, pluginOptions);
      const view = new View();
      const presenter = new Presenter(view, model);

      presenter.renderSlider(this);
      presenter.setObservers();
      model.init();

      this.data('metaSlider', { model, view, presenter });
    }

    return this;
  },
  setProp(prop, value) {
    if (limitedProp.includes(prop)) throw new Error(`Property '${prop}' cannot be changed.`);

    if (!limitedProp.includes(prop) && prop in pluginOptions) {
      const { model } = this.data('metaSlider');

      if (value === undefined) throw new Error('The value parameter cannot be omitted.');

      model.opt[prop] = value;
      model.opt.key = prop;
      model.update();
    } else {
      throw new Error(`The '${prop}' property does not exist.`);
    }

    return this;
  },
  getProp(prop) {
    if (prop in pluginOptions) return this.data('metaSlider').model.opt[prop];

    throw new Error(`The '${prop}' property does not exist.`);
  },
  getOptionsObj() {
    return this.data('metaSlider').model.opt;
  },
  getCurrentValues() {
    const modelOptions = this.data('metaSlider').model.opt;
    const { customValues, textValuesArray, initValuesArray } = modelOptions;
    let currentValues = [];

    if (customValues.length > 0) {
      currentValues = textValuesArray;
    } else {
      currentValues = initValuesArray;
    }

    return currentValues;
  },
  destroy() {
    this.removeData('metaSlider');
    this.empty();

    return this;
  },
  subscribe(observer) {
    this.data('metaSlider').model.subscribe(observer);
  },
  unsubscribe(observer) {
    this.data('metaSlider').model.unsubscribe(observer);
  },
};

(($) => {
  // We call the desired plugin method, check the presence and type of the argument being passed
  $.fn.metaSlider = function (initParam, ...prop) {
    if (typeof initParam === 'string' && pluginMethods[initParam]) {
      return pluginMethods[initParam].apply(this, prop);
    }

    if (!initParam) return pluginMethods.init.call(this);
    if (typeof initParam === 'object') return pluginMethods.init.call(this, initParam);

    throw new Error(`A method named ${initParam} does not exist for jQuery.metaSlider`);
  };
})(jQuery);

export default pluginMethods;

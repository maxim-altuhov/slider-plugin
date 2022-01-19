import TypeSettings from '../data/TypeSettings';
import InitSettings from '../data/InitSettings';
import limitedProp from '../data/limitedProp';
import Presenter from '../layers/Presenter';
import Model from '../layers/Model';
import View from '../layers/View';

let pluginOptions: IPluginOptions;

const PluginMethods: IPluginMethods = {
  init(settings) {
    // If the slider is not initialized yet
    const data = this.data('metaSlider');

    if (!data) {
      if (this.length > 1) {
        throw new Error(
          'The selector for initializing the slider must be the only one in the list of passed selectors and unique on the page.',
        );
      }

      if (settings) {
        Object.keys(settings).forEach((key) => {
          if (TypeSettings[key] && typeof settings[key] !== TypeSettings[key]) {
            throw new Error(
              `The slider's "${key}" property should be passed as "${TypeSettings[key]}"`,
            );
          }

          if (key === 'customValues' && !Array.isArray(settings[key])) {
            throw new Error('The slider`s "customValues" property should be passed as an array');
          }
        });
      }

      // Combining user settings and default settings
      pluginOptions = $.extend({}, InitSettings, settings);

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

export default PluginMethods;

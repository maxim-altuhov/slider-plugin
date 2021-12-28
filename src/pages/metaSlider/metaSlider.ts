/// <reference path='./interfaces/metaSlider.d.ts' />
import './metaSlider.scss';
import initSettings from './data/initSettings';
import Model from './layers/Model';
import View from './layers/View';
import Presenter from './layers/Presenter';

let inputOptions: IPluginOptions;
const methods: IPluginMethods = {
  init(settings) {
    // Если слайдер ещё не инициализирован
    const data = this.data('metaSlider');

    if (!data) {
      if (this.length > 1) {
        throw new Error('The selector for initializing the slider must be unique on the page');
      }

      //  Объединяем пользовательские настройки и настройки по умолчанию
      inputOptions = $.extend({}, initSettings, settings);

      // инициализация плагина
      const model = new Model(this, inputOptions);
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
    const limitedProp =
      prop === 'key' ||
      prop === '$selector' ||
      prop === '$elemSlider' ||
      prop === '$sliderProgress' ||
      prop === '$elemMarkers' ||
      prop === '$elemScale' ||
      prop === '$elemThumbs' ||
      prop === 'textValueFirst' ||
      prop === 'textValueSecond' ||
      prop === 'initValuesArray' ||
      prop === 'textValuesArray' ||
      prop === 'valuesAsPercentageArray' ||
      prop === 'stepAsPercent';

    if (!limitedProp && prop in inputOptions) {
      const { model } = this.data('metaSlider');

      if (value === undefined) throw new Error('The value parameter cannot be omitted.');

      model.opt[prop] = value;
      model.opt.key = prop;
      model.update();
    } else if (limitedProp) {
      throw new Error(`Property '${prop}' cannot be changed.`);
    } else {
      throw new Error(`The '${prop}' property does not exist.`);
    }

    return this;
  },
  getProp(prop) {
    if (prop in inputOptions) return this.data('metaSlider').model.opt[prop];

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
  // Вызываем нужный метод плагина, проверяем наличие и тип передаваемого аргумента
  $.fn.metaSlider = function (initParam, ...prop) {
    if (typeof initParam === 'string' && methods[initParam]) {
      return methods[initParam].apply(this, prop);
    }

    if (!initParam) return methods.init.call(this);
    if (typeof initParam === 'object') return methods.init.call(this, initParam);

    throw new Error(`A method named ${initParam} does not exist for jQuery.metaSlider`);
  };
})(jQuery);

export default methods;

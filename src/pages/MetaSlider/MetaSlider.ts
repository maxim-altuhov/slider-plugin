/// <reference path='MetaSlider.d.ts' />

import Model from './layers/Model';
import View from './layers/View';
import Presenter from './layers/Presenter';

(($) => {
  class MetaSlider {
    jqueryObj;

    constructor(jqueryObj: JQuery) {
      this.jqueryObj = jqueryObj;
    }

    init(settings?: object): JQuery {
      const initSettings: PluginProps = {
        mainColor: '#6d6dff',
        secondColor: '#e4e4e4',
        colorMarker: '',
        colorThumb: '',
        colorTextForMarker: '#ffffff',
        colorBorderForMarker: '#ffffff',
        colorBorderForThumb: '#ffffff',
        colorForScale: '#000000',
        initFormatted: true,
        initAutoMargins: true,
        initScaleAdjustment: true,
        calcNumberOfDecimalPlaces: true,
        showError: false,
        showScale: true,
        showMarkers: true,
        showBackground: true,
        isRange: true,
        isVertical: false,
        initAutoScaleCreation: true,
        checkingStepSizeForScale: false,
        step: 1,
        minValue: 0,
        maxValue: 100,
        stepSizeForScale: null,
        numberOfDecimalPlaces: 0,
        preFix: '',
        postFix: '',
        customValues: [],
        initValueFirst: null,
        initValueSecond: null,
        textValueFirst: '',
        textValueSecond: '',
      };

      // Если слайдер ещё не инициализирован, делаем это
      const data = this.jqueryObj.data('metaSlider');

      if (!data) {
        /**
         * Объединяем пользовательские настройки и настройки по умолчанию,
         * делаем проверку некоторых опций слайдера
         */
        const inputOptions = $.extend({}, initSettings, settings);
        const {
          customValues,
          initValueFirst,
          initValueSecond,
          minValue,
          maxValue,
          stepSizeForScale,
          step,
        } = inputOptions;

        inputOptions.stepSizeForScale = stepSizeForScale ?? step;

        if (customValues.length === 0) {
          inputOptions.initValueFirst = initValueFirst ?? minValue;
          inputOptions.initValueSecond = initValueSecond ?? maxValue;
        }

        // инициализация плагина
        const model = new Model(this.jqueryObj, inputOptions);
        const view = new View();
        const presenter = new Presenter(view, model);

        view.renderSlider(this.jqueryObj);
        presenter.setObservers();
        model.init();
        this.jqueryObj.data('metaSlider', { model });
      }

      return this.jqueryObj;
    }

    setProp(
      prop: string,
      value: string | number | (string | number)[],
    ): JQuery {
      const { model } = this.jqueryObj.data('metaSlider');

      model.opt[prop] = value;
      model.opt.key = prop;
      model.update();

      return this.jqueryObj;
    }

    getProp(prop: string): string | number | (string | number)[] {
      const { model } = this.jqueryObj.data('metaSlider');

      return model.opt[prop];
    }

    getOptionsObj(): object {
      const { model } = this.jqueryObj.data('metaSlider');

      return model.opt;
    }

    getCurrentValues(): [string, string] | [number, number] {
      const modelOptions = this.jqueryObj.data('metaSlider').model.opt;
      let currentValues = [];

      if (modelOptions.customValues.length > 0) {
        currentValues = modelOptions.textValuesArray;
      } else {
        currentValues = modelOptions.initValuesArray;
      }

      return currentValues;
    }

    destroy(): JQuery {
      this.jqueryObj.removeData('metaSlider');
      this.jqueryObj.empty();

      return this.jqueryObj;
    }

    subscribe(observer: Function): void {
      const { model } = this.jqueryObj.data('metaSlider');

      model.subscribe(observer);
    }

    unsubscribe(observer: Function): void {
      const { model } = this.jqueryObj.data('metaSlider');

      model.unsubscribe(observer);
    }
  }

  let slider: Slider;

  $.fn.metaSlider = function (initParam, ...prop) {
    if (typeof initParam === 'object' || !initParam) {
      slider = new MetaSlider(this);

      return slider['init'](initParam);
    }

    if (initParam && initParam in slider) return slider[initParam](...prop);

    return $.error(
      `A method named ${initParam} does not exist for jQuery.MetaSlider`,
    );
  };
})(jQuery);

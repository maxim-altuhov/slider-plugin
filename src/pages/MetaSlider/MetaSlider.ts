/// <reference path='./interfaces/MetaSlider.d.ts' />
import Model from './layers/Model';
import View from './layers/View';
import Presenter from './layers/Presenter';

(($) => {
  const methods: PluginMethods = {
    init(settings) {
      const initSettings: PluginOptions = {
        key: '',
        $selector: null,
        $elemSlider: null,
        $sliderProgress: null,
        $elemMarkers: null,
        $elemScale: null,
        $elemThumbs: null,
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
        initValuesArray: null,
        textValueFirst: '',
        textValueSecond: '',
        textValuesArray: [''],
        valuesAsPercentageArray: null,
      };

      // Если слайдер ещё не инициализирован
      const data = this.data('metaSlider');

      if (!data) {
        /**
         * Объединяем пользовательские настройки и настройки по умолчанию,
         * делаем проверку некоторых опций слайдера
         */
        const inputOptions: PluginOptions = $.extend({}, initSettings, settings);
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
        const model = new Model(this, inputOptions);
        const view = new View();
        const presenter = new Presenter(view, model);

        view.renderSlider(this);
        presenter.setObservers();
        model.init();
        this.data('metaSlider', { model });
      }

      return this;
    },
    setProp(prop, value) {
      const { model } = this.data('metaSlider');

      model.opt[prop] = value;
      model.opt.key = prop;
      model.update();

      return this;
    },
    getProp(prop) {
      const { model } = this.data('metaSlider');

      return model.opt[prop];
    },
    getOptionsObj() {
      const { model } = this.data('metaSlider');

      return model.opt;
    },
    getCurrentValues() {
      const modelOptions = this.data('metaSlider').model.opt;
      let currentValues = [];

      if (modelOptions.customValues.length > 0) {
        currentValues = modelOptions.textValuesArray;
      } else {
        currentValues = modelOptions.initValuesArray;
      }

      return currentValues;
    },
    destroy() {
      this.removeData('metaSlider');
      this.empty();

      return this;
    },
    subscribe(observer) {
      const { model } = this.data('metaSlider');

      model.subscribe(observer);
    },
    unsubscribe(observer) {
      const { model } = this.data('metaSlider');

      model.unsubscribe(observer);
    },
  };

  // Проверяем вызываемый метод нашего плагина на наличие и тип передаваемого аргумента
  $.fn.metaSlider = function (initParam, ...prop) {
    if (methods[initParam]) return methods[initParam].apply(this, prop);
    if (typeof initParam === 'object' || !initParam) return methods.init.call(this, initParam);

    return $.error(`A method named ${initParam} does not exist for jQuery.MetaSlider`);
  };
})(jQuery);

import Model from './layers/Model';
import View from './layers/View';
import Presenter from './layers/Presenter';

(function ($) {
  const methods = {
    init(settings) {
      let initSettings = {
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
        stepSizeForScale: '',
        numberOfDecimalPlaces: 0,
        preFix: '',
        postFix: '',
        customValues: [],
        initValueFirst: '',
        initValueSecond: '',
        textValueFirst: '',
        textValueSecond: '',
      };

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

      inputOptions.stepSizeForScale = stepSizeForScale || step;

      if (customValues.length === 0) {
        inputOptions.initValueFirst = initValueFirst || minValue;
        inputOptions.initValueSecond = initValueSecond || maxValue;
      }

      // Возращаем объект JQuery
      return this.each(() => {
        const data = this.data('metaSlider');

        // Если слайдер ещё не ициализирован на этом селекторе, делаем это
        if (!data) {
          const model = new Model(this, inputOptions);
          const view = new View();
          const presenter = new Presenter(view, model);

          view.renderSlider(this);
          presenter.setObservers();
          model.init();
          this.data('metaSlider', { model: model });
        }
      });
    },
    setProp(prop, value) {
      const data = this.data('metaSlider');
      data.model.opt[prop] = value;
      data.model.opt.key = prop;
      data.model.update();

      return this;
    },
    getProp(prop) {
      return this.data('metaSlider').model.opt[prop];
    },
    getOptionsObj() {
      return this.data('metaSlider').model.opt;
    },
    destroy() {
      return this.each(() => {
        this.removeData('metaSlider');
        this.empty();
      });
    },
    subscribe(observer) {
      this.data('metaSlider').model.subscribe(observer);
    },
    unsubscribe(observer) {
      this.data('metaSlider').model.unsubscribe(observer);
    },
  };

  // Проверяем вызываемый метод нашего плагина на наличие и тип передаваемого аргумента
  $.fn.metaSlider = function (method, ...prop) {
    if (methods[method]) return methods[method].apply(this, prop);
    if (typeof method === 'object' || !method) return methods.init.call(this, method);

    return $.error(`A method named ${method} does not exist for jQuery.MetaSlider`);
  };
}(jQuery));

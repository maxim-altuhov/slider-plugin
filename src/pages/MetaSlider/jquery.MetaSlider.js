import Model from './layers/Model';
import ViewSlider from './layers/ViewSlider';
import ViewScale from './layers/ViewScale';
import ViewMarkers from './layers/ViewMarkers';
import ViewThumbs from './layers/ViewThumbs';
import ViewMinAndMaxValues from './layers/ViewMinAndMaxValues';
import ViewError from './layers/ViewError';
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
        colorTextForMinAndMax: '#000000',
        colorForScale: '#000000',
        verifyInitValues: true,
        initFormatted: true,
        initAutoMargins: true,
        initScaleAdjustment: true,
        setNumberOfDecimalPlaces: true,
        showError: true,
        showMinAndMax: false,
        showTheScale: true,
        showMarkers: true,
        showBackground: true,
        isRange: true,
        isVertical: false,
        initAutoScaleCreation: true,
        checkingStepSizeForScale: true,
        step: 1,
        minValue: 0,
        maxValue: 100,
        stepSizeForScale: '',
        numberOfDecimalPlaces: 0,
        preFix: '',
        postFix: '',
        customValues: [],
        initValueFirst: 0,
        initValueSecond: 100,
      };

      const inputOptions = $.extend({}, initSettings, settings);
      const {
        colorMarker,
        colorThumb,
        stepSizeForScale,
      } = inputOptions;

      inputOptions.colorMarker = colorMarker || inputOptions.mainColor;
      inputOptions.colorThumb = colorThumb || inputOptions.mainColor;
      inputOptions.stepSizeForScale = stepSizeForScale || inputOptions.step;

      return this.each(() => {
        const data = this.data('metaSlider');

        if (!data) {
          const model = new Model(this, inputOptions);
          const views = {
            viewSlider: new ViewSlider(),
            viewThumbs: new ViewThumbs(),
            viewMarkers: new ViewMarkers(),
            viewScale: new ViewScale(),
            viewMinAndMax: new ViewMinAndMaxValues(),
            viewError: new ViewError(),
          };
          const presenter = new Presenter(views);

          presenter.setModel(model);
          presenter.setObservers();

          Object.keys(views).forEach((view) => {
            views[view].init(inputOptions);
          });

          model.init();
          this.data('metaSlider', { model: model });
        }
      });
    },
    setProp(prop, value) {
      const data = this.data('metaSlider');
      data.model.opt[prop] = value;
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
  };

  $.fn.metaSlider = function (method, ...prop) {
    if (methods[method]) return methods[method].apply(this, prop);
    if (typeof method === 'object' || !method) return methods.init.call(this, method);

    return $.error(`Метод с именем ${method} не существует для jQuery.metaSlider`);
  };
}(jQuery));

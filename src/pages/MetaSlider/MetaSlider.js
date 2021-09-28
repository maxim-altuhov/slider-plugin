import Model from './layers/Model';
import ViewSlider from './layers/ViewSlider';
import ViewScale from './layers/ViewScale';
import ViewMarkers from './layers/ViewMarkers';
import ViewThumbs from './layers/ViewThumbs';
import ViewMinAndMaxValue from './layers/ViewMinAndMaxValue';
import ViewError from './layers/ViewError';
import Presenter from './layers/Presenter';

(function ($) {
  $.fn.metaSlider = function (settings) {
    const options = $.extend({
      $initSelector: this,
      mainColor: '#6d6dff',
      secondColor: '#e4e4e4',
      colorMarker: '#6d6dff',
      colorTextForMarker: '#ffffff',
      colorBorderForMarker: '#ffffff',
      colorBorderForThumb: '#ffffff',
      colorTextForMinAndMax: '#000000',
      verifyInitValues: true,
      initFormatted: true,
      initAutoMargins: true,
      initScaleAdjustment: true,
      setNumberOfDecimalPlaces: true,
      showError: true,
      showMinAndMax: true,
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
      stepSizeForScale: 1,
      numberOfDecimalPlaces: 0,
      preFix: '',
      postFix: '',
      customValues: [],
      initValueFirst: 0,
      initValueSecond: 150,
    }, settings);

    return this.each(function () {
      const model = new Model(options);
      const views = {
        viewSlider: new ViewSlider(),
        viewThumbs: new ViewThumbs(),
        viewMarkers: new ViewMarkers(),
        viewScale: new ViewScale(),
        viewMinAndMaxValue: new ViewMinAndMaxValue(),
        viewError: new ViewError(),
      };
      const presenter = new Presenter(views);

      presenter.setModel(model);
      presenter.setObservers();

      Object.keys(views).forEach((view) => {
        views[view].registerWith(presenter);
        views[view].init();
      });

      model.init();
    });
  };
}(jQuery));

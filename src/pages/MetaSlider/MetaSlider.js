import Model from './layers/Model';
import Presenter from './layers/Presenter';
import View from './layers/View';

(function ($) {
  $.fn.metaSlider = function (options) {
    const settings = $.extend({
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
      initValueSecond: 100,
    }, options);

    return this.each(function () {
      const model = new Model(this, settings);
      const presenter = new Presenter();
      const view = new View();
    });
  };
}(jQuery));

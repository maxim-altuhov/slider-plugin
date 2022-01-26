/// <reference path='./interfaces/metaSlider.d.ts' />
import Plugin from './main/Plugin';
import './metaSlider.scss';

(($) => {
  $.fn.metaSlider = function (initParam, ...prop) {
    if (typeof initParam === 'string' && Plugin[initParam]) {
      return Plugin[initParam](this, ...prop);
    }

    if (!initParam) return Plugin.init(this);
    if (typeof initParam === 'object') return Plugin.init(this, initParam);

    throw new Error(`A method named ${initParam} does not exist for jQuery.metaSlider`);
  };
})(jQuery);

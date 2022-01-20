/// <reference path='./interfaces/metaSlider.d.ts' />
import PluginMethods from './main/PluginMethods';
import './metaSlider.scss';

(($) => {
  $.fn.metaSlider = function (initParam, ...prop) {
    if (typeof initParam === 'string' && PluginMethods[initParam]) {
      return PluginMethods[initParam].apply(this, prop);
    }

    if (!initParam) return PluginMethods.init.call(this);
    if (typeof initParam === 'object') return PluginMethods.init.call(this, initParam);

    throw new Error(`A method named ${initParam} does not exist for jQuery.metaSlider`);
  };
})(jQuery);

import TypeSettings from '../data/TypeSettings';
import InitSettings from '../data/InitSettings';
import Presenter from '../layers/Presenter';
import Model from '../layers/Model';
import View from '../layers/View';

class Plugin {
  static [key: string]: any;
  static initSettings = InitSettings;
  static typeSettings = TypeSettings;
  static limitedProp = [
    'key',
    '$selector',
    '$elemSlider',
    '$sliderProgress',
    '$elemMarkers',
    '$elemScale',
    '$elemThumbs',
    'textValueFirst',
    'textValueSecond',
    'initValuesArray',
    'textValuesArray',
    'valuesAsPercentageArray',
    'stepAsPercent',
  ];

  static init($selector: JQuery<HTMLElement>, settings?: object & { [key: string]: any }) {
    if (!$selector.data('metaSlider')) {
      if ($selector.length > 1) {
        throw new Error(
          'The selector for initializing the slider must be the only one in the list of passed selectors and unique on the page.',
        );
      }

      if (settings) {
        const KEY_CUSTOM_VALUES = 'customValues';

        Object.keys(settings).forEach((key) => {
          const isCorrectType = typeof settings[key] === Plugin.typeSettings[key];

          if (Plugin.typeSettings[key] && !isCorrectType) {
            throw new Error(
              `The slider's "${key}" property should be passed as "${Plugin.typeSettings[key]}"`,
            );
          }

          if (key === KEY_CUSTOM_VALUES && !Array.isArray(settings[key])) {
            throw new Error('The slider\'s "customValues" property should be passed as an array.');
          }
        });
      }

      // Combining user settings and default settings
      const pluginOptions = $.extend({}, Plugin.initSettings, settings);

      // Initializing the plugin
      const model = new Model($selector, pluginOptions);
      const view = new View();
      const presenter = new Presenter(view, model);

      presenter.renderSlider($selector);
      presenter.setObservers();
      model.init();

      $selector.data('metaSlider', { model });
    }

    return $selector;
  }

  static setProp(
    $selector: JQuery<HTMLElement>,
    prop: string,
    value: string | number | (string | number)[],
  ) {
    const pluginOptions: IPluginOptions = $selector.data('metaSlider').model.opt;
    const includesLimitedProp = Plugin.limitedProp.includes(prop);

    if (includesLimitedProp) throw new Error(`Property '${prop}' cannot be changed.`);

    if (!includesLimitedProp && prop in pluginOptions) {
      const { model } = $selector.data('metaSlider');

      if (value === undefined) throw new Error(`The value property '${prop}' cannot be omitted.`);

      model.opt[prop] = value;
      model.opt.key = prop;
      model.update();
    } else {
      throw new Error(`The '${prop}' property does not exist.`);
    }

    return $selector;
  }

  static getProp(
    $selector: JQuery<HTMLElement>,
    prop: string,
  ): string | number | (string | number)[] {
    const pluginOptions: IPluginOptions = $selector.data('metaSlider').model.opt;

    if (prop in pluginOptions) return $selector.data('metaSlider').model.opt[prop];

    throw new Error(`The '${prop}' property does not exist.`);
  }

  static getOptionsObj($selector: JQuery<HTMLElement>): IPluginOptions {
    return $selector.data('metaSlider').model.opt;
  }

  static getCurrentValues($selector: JQuery<HTMLElement>) {
    const pluginOptions: IPluginOptions = $selector.data('metaSlider').model.opt;
    const { customValues, textValuesArray, initValuesArray } = pluginOptions;
    let currentValues = [];

    if (customValues.length > 0) {
      currentValues = textValuesArray;
    } else {
      currentValues = initValuesArray;
    }

    return currentValues;
  }

  static destroy($selector: JQuery<HTMLElement>) {
    $selector.removeData('metaSlider').removeAttr('data-id').empty();

    return $selector;
  }

  static subscribe($selector: JQuery<HTMLElement>, observer: Function) {
    const { model } = $selector.data('metaSlider');
    model.subscribe(observer);

    return $selector;
  }

  static unsubscribe($selector: JQuery<HTMLElement>, observer: Function) {
    const { model } = $selector.data('metaSlider');
    model.unsubscribe(observer);

    return $selector;
  }
}

export default Plugin;

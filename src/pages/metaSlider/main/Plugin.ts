import TypeSettings from '../data/TypeSettings';
import InitSettings from '../data/InitSettings';
import Presenter from '../layers/Presenter';
import Model from '../layers/Model';
import View from '../layers/View';

class Plugin {
  static [key: string]: InstanceType<typeof Plugin>;
  static initSettings = InitSettings;
  static typeSettings = TypeSettings;
  static limitedSetProp = [
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
    'testHeight',
    'testWidth',
  ];

  static init($selector: JQuery<HTMLElement>, settings?: Partial<IPluginOptions>) {
    if (!$selector.data('metaSlider')) {
      if ($selector.length > 1) {
        throw new Error(
          'The selector for initializing the slider must be the only one in the list of passed selectors and unique on the page.',
        );
      }

      if (settings) {
        Object.keys(settings).forEach((key) => {
          const isCorrectType = typeof settings[key] === Plugin.typeSettings[key];
          const isCustomValues = key === 'customValues';

          if (Plugin.typeSettings[key] && !isCorrectType) {
            throw new Error(
              `The slider's "${key}" property should be passed as "${Plugin.typeSettings[key]}"`,
            );
          }

          if (isCustomValues && !Array.isArray(settings[key])) {
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
      view.setObservers();
      model.init();

      $selector.data('metaSlider', { model });
    }

    return $selector;
  }

  static setProp(
    $selector: JQuery<HTMLElement>,
    prop: string,
    value: string | number | boolean | (string | number)[],
  ) {
    const { model } = $selector.data('metaSlider');
    const pluginOptions: IPluginOptions = model.getOptions();
    const includesLimitedProp = Plugin.limitedSetProp.includes(prop);

    if (includesLimitedProp) throw new Error(`Property '${prop}' cannot be changed.`);

    if (!includesLimitedProp && prop in pluginOptions) {
      if (value === undefined) throw new Error(`The value property '${prop}' cannot be omitted.`);

      model.setProp(prop, value);
      model.setProp('key', prop);
      model.update();
    } else {
      throw new Error(`The '${prop}' property does not exist.`);
    }

    return $selector;
  }

  static getProp(
    $selector: JQuery<HTMLElement>,
    prop: string,
  ): string | number | boolean | (string | number)[] {
    const { model } = $selector.data('metaSlider');
    const pluginOptions: IPluginOptions = model.getOptions();

    if (prop in pluginOptions) return model.getProp(prop);

    throw new Error(`The '${prop}' property does not exist.`);
  }

  static getOptionsObj($selector: JQuery<HTMLElement>): IPluginOptions {
    return $selector.data('metaSlider').model.getOptions();
  }

  static getCurrentValues($selector: JQuery<HTMLElement>) {
    const pluginOptions: IPluginOptions = $selector.data('metaSlider').model.getOptions();
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

  static subscribe($selector: JQuery<HTMLElement>, observer: (...args: any[]) => unknown) {
    const { model } = $selector.data('metaSlider');
    model.subscribe(observer);

    return $selector;
  }

  static unsubscribe($selector: JQuery<HTMLElement>, observer: (...args: any[]) => unknown) {
    const { model } = $selector.data('metaSlider');
    model.unsubscribe(observer);

    return $selector;
  }
}

export default Plugin;

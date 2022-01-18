import Model from '../layers/Model';
import pluginMethods from '../metaSlider';
import initSettings from '../data/initSettings';
import limitedProp from '../data/limitedProp';

jest.mock('../layers/View');
jest.mock('../layers/Presenter');
jest.spyOn($.fn, 'metaSlider');
jest.spyOn(Model.prototype, 'init').mockImplementation(() => 'init');

document.body.innerHTML = '<div id="fake-selector"></div>';
const $initSelector = $('#fake-selector');

describe('Checking the methods of the metaSlider plugin', () => {
  const defaultSettings = {
    key: 'init',
    $selector: $initSelector,
    customValues: ['A', 'B', 'C'],
    textValuesArray: ['A', 'C'],
    initValuesArray: [0, 2],
    stepSizeForScale: 10,
    initValueFirst: 1,
    initValueSecond: 100,
  };
  let testSettings: IPluginOptions = $.extend({}, initSettings, defaultSettings);

  afterEach(() => {
    testSettings = $.extend({}, initSettings, defaultSettings);
    $initSelector.removeData('metaSlider');
  });

  test.each([{}, testSettings])(
    'Checking the "init" method => Checking the initialization of the plugin without parameters and with the transmission of parameters (option $#)',
    (inputOptions) => {
      jest.spyOn(pluginMethods, 'init');

      expect($initSelector.data('metaSlider')).toBeUndefined();

      $initSelector.metaSlider(inputOptions);
      const { model, presenter } = $initSelector.data('metaSlider');

      expect(pluginMethods.init).toHaveBeenCalledWith(inputOptions);
      expect(pluginMethods.init).toHaveReturnedWith($initSelector);
      expect(model.init).toHaveBeenCalled();
      expect(presenter.renderSlider).toHaveBeenCalledWith($initSelector);
      expect(presenter.setObservers).toHaveBeenCalled();
      expect($initSelector.data('metaSlider')).toBeDefined();
      expect($initSelector.data('metaSlider')).toHaveProperty('model');
      expect($initSelector.data('metaSlider')).toHaveProperty('view');
      expect($initSelector.data('metaSlider')).toHaveProperty('presenter');
    },
  );

  test('Checking the "init" method => The selector for initializing the slider must be unique on the page', () => {
    $initSelector.length = 2;

    expect(() => {
      $initSelector.metaSlider();
    }).toThrow('The selector for initializing the slider must be unique on the page');

    $initSelector.length = 1;
  });

  test('Checking whether the passed method exists for the jQuery.metaSlider', () => {
    expect(() => {
      $initSelector.metaSlider('fakeMethodName');
    }).toThrow('A method named fakeMethodName does not exist for jQuery.metaSlider');
  });

  test.each`
    testProp            | incorrectType      | expected
    ${'initValueFirst'} | ${'incorrectType'} | ${'number'}
    ${'mainColor'}      | ${12345}           | ${'string'}
    ${'isRange'}        | ${'incorrectType'} | ${'boolean'}
    ${'customValues'}   | ${'incorrectType'} | ${'array'}
  `(
    'Checking by type the correctness of the properties passed in the slider parameters => testProp = $testProp',
    ({ testProp, incorrectType, expected }) => {
      const settings = {
        [testProp]: incorrectType,
      };

      if (testProp === 'customValues') {
        expect(() => {
          $initSelector.metaSlider(settings);
        }).toThrow('The slider`s "customValues" property should be passed as an array');
      } else {
        expect(() => {
          $initSelector.metaSlider(settings);
        }).toThrow(`The slider's "${testProp}" property should be passed as "${expected}"`);
      }
    },
  );

  test('Checking the "setProp" method', () => {
    const fakeProp = 'fakePropName';
    $initSelector.metaSlider(testSettings);
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'update').mockImplementation(() => 'update');
    jest.spyOn(pluginMethods, 'setProp');

    $initSelector.metaSlider('setProp', 'mainColor', 'red');

    expect(model.opt.mainColor).toBe('red');
    expect(model.opt.key).toBe('mainColor');
    expect(model.update).toHaveBeenCalled();
    expect(pluginMethods.setProp).toHaveReturnedWith($initSelector);

    expect(() => {
      $initSelector.metaSlider('setProp', 'fakePropName');
    }).toThrow(`The '${fakeProp}' property does not exist.`);

    expect(() => {
      $initSelector.metaSlider('setProp', 'mainColor');
    }).toThrow('The value parameter cannot be omitted.');

    limitedProp.forEach((prop) => {
      expect(() => {
        $initSelector.metaSlider('setProp', prop);
      }).toThrow(`Property '${prop}' cannot be changed.`);
    });
  });

  test('Checking the "getProp" method', () => {
    jest.spyOn(pluginMethods, 'getProp');
    const fakeMethodName = 'fakeMethodName';

    $initSelector.metaSlider(testSettings);
    $initSelector.metaSlider('getProp', 'customValues');

    expect(pluginMethods.getProp).toHaveReturnedWith(testSettings.customValues);

    expect(() => {
      $initSelector.metaSlider('getProp', fakeMethodName);
    }).toThrow(`The '${fakeMethodName}' property does not exist.`);
  });

  test('Checking the "getOptionsObj" method', () => {
    jest.spyOn(pluginMethods, 'getOptionsObj');

    $initSelector.metaSlider(testSettings);
    $initSelector.metaSlider('getOptionsObj');

    expect(pluginMethods.getOptionsObj).toHaveReturnedWith(testSettings);
  });

  test('Checking the "getCurrentValues" method', () => {
    jest.spyOn(pluginMethods, 'getCurrentValues');

    $initSelector.metaSlider(testSettings);
    $initSelector.metaSlider('getCurrentValues');

    expect(pluginMethods.getCurrentValues).toHaveReturnedWith(testSettings.textValuesArray);

    $initSelector.removeData('metaSlider');
    testSettings.customValues = [];
    $initSelector.metaSlider(testSettings);
    $initSelector.metaSlider('getCurrentValues');

    expect(pluginMethods.getCurrentValues).toHaveReturnedWith(testSettings.initValuesArray);
  });

  test('Checking the "destroy" method', () => {
    jest.spyOn(pluginMethods, 'destroy');
    jest.spyOn($.fn, 'removeData');
    jest.spyOn($.fn, 'empty');

    $initSelector.metaSlider();
    $initSelector.metaSlider('destroy');

    expect(pluginMethods.destroy).toHaveReturnedWith($initSelector);
    expect($initSelector.removeData).toHaveBeenCalledWith('metaSlider');
    expect($initSelector.empty).toHaveBeenCalled();
  });

  test('Checking the "subscribe" method', () => {
    jest.spyOn(pluginMethods, 'subscribe');
    $initSelector.metaSlider();

    const fakeFoo = () => true;
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'subscribe').mockImplementation();

    $initSelector.metaSlider('subscribe', fakeFoo);

    expect(model.subscribe).toHaveBeenCalledWith(fakeFoo);
  });

  test('Checking the "unsubscribe" method', () => {
    jest.spyOn(pluginMethods, 'unsubscribe');
    $initSelector.metaSlider();

    const fakeFoo = () => true;
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'unsubscribe').mockImplementation();

    $initSelector.metaSlider('unsubscribe', fakeFoo);

    expect(model.unsubscribe).toHaveBeenCalledWith(fakeFoo);
  });
});

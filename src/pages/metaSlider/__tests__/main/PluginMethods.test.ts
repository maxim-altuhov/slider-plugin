import Model from '../../layers/Model';
import PluginMethods from '../../main/PluginMethods';
import InitSettings from '../../data/InitSettings';
import limitedProp from '../../data/limitedProp';

jest.mock('../../layers/View');
jest.mock('../../layers/Presenter');
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
  let testSettings: IPluginOptions = $.extend({}, InitSettings, defaultSettings);

  afterEach(() => {
    testSettings = $.extend({}, InitSettings, defaultSettings);
    $initSelector.removeData('metaSlider');
  });

  test('Checking the "init" method => Checking the initialization of the plugin with the transmission of parameters', () => {
    jest.spyOn(PluginMethods, 'init');

    expect($initSelector.data('metaSlider')).toBeUndefined();

    PluginMethods.init.call($initSelector, testSettings);
    const { model, presenter } = $initSelector.data('metaSlider');

    expect(PluginMethods.init).toHaveBeenCalledWith(testSettings);
    expect(PluginMethods.init).toHaveReturnedWith($initSelector);
    expect(model.init).toHaveBeenCalled();
    expect(presenter.renderSlider).toHaveBeenCalledWith($initSelector);
    expect(presenter.setObservers).toHaveBeenCalled();
    expect($initSelector.data('metaSlider')).toBeDefined();
    expect($initSelector.data('metaSlider')).toHaveProperty('model');
    expect($initSelector.data('metaSlider')).toHaveProperty('view');
    expect($initSelector.data('metaSlider')).toHaveProperty('presenter');
  });

  test('Checking the "init" method => The selector for initializing the slider must be unique on the page', () => {
    $initSelector.length = 2;

    expect(() => {
      PluginMethods.init.call($initSelector);
    }).toThrow(
      'The selector for initializing the slider must be the only one in the list of passed selectors and unique on the page',
    );

    $initSelector.length = 1;
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
          PluginMethods.init.call($initSelector, settings);
        }).toThrow('The slider`s "customValues" property should be passed as an array.');
      } else {
        expect(() => {
          PluginMethods.init.call($initSelector, settings);
        }).toThrow(`The slider's "${testProp}" property should be passed as "${expected}"`);
      }
    },
  );

  /**
   * The test uses the @ts-ignore rule so that you can test
   * the error output when passing incorrect arguments to the "setProp" method
   */
  test('Checking the "setProp" method', () => {
    const fakeProp = 'fakePropName';
    PluginMethods.init.call($initSelector, testSettings);
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'update').mockImplementation(() => 'update');
    jest.spyOn(PluginMethods, 'setProp');

    PluginMethods.setProp.call($initSelector, 'mainColor', 'red');

    expect(model.opt.mainColor).toBe('red');
    expect(model.opt.key).toBe('mainColor');
    expect(model.update).toHaveBeenCalled();
    expect(PluginMethods.setProp).toHaveReturnedWith($initSelector);

    expect(() => {
      PluginMethods.setProp.call($initSelector, 'fakePropName', 'red');
    }).toThrow(`The '${fakeProp}' property does not exist.`);

    expect(() => {
      // @ts-ignore
      PluginMethods.setProp.call($initSelector, 'mainColor');
    }).toThrow('The value parameter cannot be omitted.');

    limitedProp.forEach((prop) => {
      expect(() => {
        PluginMethods.setProp.call($initSelector, prop, 'fakeValue');
      }).toThrow(`Property '${prop}' cannot be changed.`);
    });
  });

  test('Checking the "getProp" method', () => {
    jest.spyOn(PluginMethods, 'getProp');
    const fakeMethodName = 'fakeMethodName';

    PluginMethods.init.call($initSelector, testSettings);
    PluginMethods.getProp.call($initSelector, 'customValues');

    expect(PluginMethods.getProp).toHaveReturnedWith(testSettings.customValues);

    expect(() => {
      PluginMethods.getProp.call($initSelector, fakeMethodName);
    }).toThrow(`The '${fakeMethodName}' property does not exist.`);
  });

  test('Checking the "getOptionsObj" method', () => {
    jest.spyOn(PluginMethods, 'getOptionsObj');

    PluginMethods.init.call($initSelector, testSettings);
    PluginMethods.getOptionsObj.call($initSelector);

    expect(PluginMethods.getOptionsObj).toHaveReturnedWith(testSettings);
  });

  test('Checking the "getCurrentValues" method', () => {
    jest.spyOn(PluginMethods, 'getCurrentValues');

    PluginMethods.init.call($initSelector, testSettings);
    PluginMethods.getCurrentValues.call($initSelector);

    expect(PluginMethods.getCurrentValues).toHaveReturnedWith(testSettings.textValuesArray);

    $initSelector.removeData('metaSlider');
    testSettings.customValues = [];
    PluginMethods.init.call($initSelector, testSettings);
    PluginMethods.getCurrentValues.call($initSelector);

    expect(PluginMethods.getCurrentValues).toHaveReturnedWith(testSettings.initValuesArray);
  });

  test('Checking the "destroy" method', () => {
    jest.spyOn(PluginMethods, 'destroy');
    jest.spyOn($.fn, 'removeData');
    jest.spyOn($.fn, 'empty');

    PluginMethods.init.call($initSelector);
    PluginMethods.destroy.call($initSelector);

    expect(PluginMethods.destroy).toHaveReturnedWith($initSelector);
    expect($initSelector.removeData).toHaveBeenCalledWith('metaSlider');
    expect($initSelector.empty).toHaveBeenCalled();
  });

  test('Checking the "subscribe" method', () => {
    jest.spyOn(PluginMethods, 'subscribe');
    PluginMethods.init.call($initSelector);

    const fakeFoo = () => true;
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'subscribe').mockImplementation();

    PluginMethods.subscribe.call($initSelector, fakeFoo);

    expect(model.subscribe).toHaveBeenCalledWith(fakeFoo);
  });

  test('Checking the "unsubscribe" method', () => {
    jest.spyOn(PluginMethods, 'unsubscribe');
    PluginMethods.init.call($initSelector);

    const fakeFoo = () => true;
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'unsubscribe').mockImplementation();

    PluginMethods.unsubscribe.call($initSelector, fakeFoo);

    expect(model.unsubscribe).toHaveBeenCalledWith(fakeFoo);
  });
});

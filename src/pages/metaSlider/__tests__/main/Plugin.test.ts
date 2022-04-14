/* eslint-disable @typescript-eslint/dot-notation */
import Model from '../../layers/Model';
import Presenter from '../../layers/Presenter';
import View from '../../layers/View';
import Plugin from '../../main/Plugin';
import InitSettings from '../../data/InitSettings';

jest.mock('../../layers/View');
jest.mock('../../layers/Presenter');
jest.spyOn(Model.prototype, 'init').mockImplementation(() => 'init');
const mockRenderSlider = jest
  .spyOn(Presenter.prototype, 'renderSlider')
  .mockImplementation(() => 'renderSlider');
const mockSetObserversPresenter = jest
  .spyOn(Presenter.prototype, 'setObservers')
  .mockImplementation(() => 'setObservers');
const mockSetObserversView = jest
  .spyOn(View.prototype, 'setObservers')
  .mockImplementation(() => 'setObservers');

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
    jest.spyOn(Plugin, 'init');

    expect($initSelector.data('metaSlider')).toBeUndefined();

    Plugin.init($initSelector, testSettings);
    const { model } = $initSelector.data('metaSlider');

    expect(Plugin.init).toHaveBeenCalledWith($initSelector, testSettings);
    expect(Plugin.init).toHaveReturnedWith($initSelector);
    expect(model.init).toHaveBeenCalled();
    expect(mockRenderSlider).toHaveBeenCalledWith($initSelector);
    expect(mockSetObserversPresenter).toHaveBeenCalled();
    expect(mockSetObserversView).toHaveBeenCalled();
    expect($initSelector.data('metaSlider')).toBeDefined();
    expect($initSelector.data('metaSlider')).toHaveProperty('model');
  });

  test('Checking the "init" method => The selector for initializing the slider must be unique on the page', () => {
    $initSelector.length = 2;

    expect(() => {
      Plugin.init($initSelector);
    }).toThrow(
      'The selector for initializing the slider must be the only one in the list of passed selectors and unique on the page',
    );

    $initSelector.length = 1;
  });

  test.each`
    testProp            | incorrectType      | expected
    ${'initValueFirst'} | ${{ a: 'a' }}      | ${'number'}
    ${'initValueFirst'} | ${'incorrectType'} | ${'number'}
    ${'mainColor'}      | ${12345}           | ${'string'}
    ${'isRange'}        | ${'incorrectType'} | ${'boolean'}
    ${'customValues'}   | ${'incorrectType'} | ${'array'}
  `(
    'Checking by type the correctness of the properties passed in the slider parameters => testProp = $testProp',
    ({ testProp, incorrectType, expected }) => {
      const KEY_CUSTOM_VALUES = 'customValues';
      const settings = {
        [testProp]: incorrectType,
      };

      if (testProp === KEY_CUSTOM_VALUES) {
        expect(() => {
          Plugin.init($initSelector, settings);
        }).toThrow('The slider\'s "customValues" property should be passed as an array.');
      } else {
        expect(() => {
          Plugin.init($initSelector, settings);
        }).toThrow(`The slider's "${testProp}" property should be passed as "${expected}"`);
      }
    },
  );

  /**
   * The test uses the @ts-ignore rule so that you can test
   * the error output when passing incorrect arguments to the "setProp" method
   */
  test('Checking the "setProp" method', () => {
    const FAKE_PROP = 'fakePropName';
    const TEST_PROP = 'mainColor';
    const TEST_VALUE = 'red';

    Plugin.init($initSelector, testSettings);
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'update').mockImplementation(() => 'update');
    jest.spyOn(Plugin, 'setProp');

    Plugin.setProp($initSelector, TEST_PROP, TEST_VALUE);

    expect(model['_opt'][TEST_PROP]).toBe(TEST_VALUE);
    expect(model['_opt'].key).toBe(TEST_PROP);
    expect(model.update).toHaveBeenCalled();
    expect(Plugin.setProp).toHaveReturnedWith($initSelector);

    expect(() => {
      Plugin.setProp($initSelector, FAKE_PROP, TEST_VALUE);
    }).toThrow(`The '${FAKE_PROP}' property does not exist.`);

    expect(() => {
      // @ts-ignore
      Plugin.setProp($initSelector, TEST_PROP);
    }).toThrow(`The value property '${TEST_PROP}' cannot be omitted.`);

    Plugin.limitedProp.forEach((prop) => {
      expect(() => {
        Plugin.setProp($initSelector, prop, 'fakeValue');
      }).toThrow(`Property '${prop}' cannot be changed.`);
    });
  });

  test('Checking the "getProp" method', () => {
    const FAKE_METHOD_NAME = 'fakeMethodName';
    jest.spyOn(Plugin, 'getProp');

    Plugin.init($initSelector, testSettings);
    Plugin.getProp($initSelector, 'customValues');

    expect(Plugin.getProp).toHaveReturnedWith(testSettings.customValues);

    expect(() => {
      Plugin.getProp($initSelector, FAKE_METHOD_NAME);
    }).toThrow(`The '${FAKE_METHOD_NAME}' property does not exist.`);
  });

  test('Checking the "getOptionsObj" method', () => {
    jest.spyOn(Plugin, 'getOptionsObj');

    Plugin.init($initSelector, testSettings);
    Plugin.getOptionsObj($initSelector);

    expect(Plugin.getOptionsObj).toHaveReturnedWith(testSettings);
  });

  test('Checking the "getCurrentValues" method', () => {
    jest.spyOn(Plugin, 'getCurrentValues');

    Plugin.init($initSelector, testSettings);
    Plugin.getCurrentValues($initSelector);

    expect(Plugin.getCurrentValues).toHaveReturnedWith(testSettings.textValuesArray);

    $initSelector.removeData('metaSlider');
    testSettings.customValues = [];
    Plugin.init($initSelector, testSettings);
    Plugin.getCurrentValues($initSelector);

    expect(Plugin.getCurrentValues).toHaveReturnedWith(testSettings.initValuesArray);
  });

  test('Checking the "destroy" method', () => {
    jest.spyOn(Plugin, 'destroy');
    jest.spyOn($.fn, 'removeData');
    jest.spyOn($.fn, 'empty');

    Plugin.init($initSelector);
    Plugin.destroy($initSelector);

    expect(Plugin.destroy).toHaveReturnedWith($initSelector);
    expect($initSelector.removeData).toHaveBeenCalledWith('metaSlider');
    expect($initSelector.empty).toHaveBeenCalled();
  });

  test('Checking the "subscribe" method', () => {
    jest.spyOn(Plugin, 'subscribe');
    Plugin.init($initSelector);

    const fakeFoo = () => true;
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'subscribe').mockImplementation();

    Plugin.subscribe($initSelector, fakeFoo);

    expect(model.subscribe).toHaveBeenCalledWith(fakeFoo);
  });

  test('Checking the "unsubscribe" method', () => {
    jest.spyOn(Plugin, 'unsubscribe');
    Plugin.init($initSelector);

    const fakeFoo = () => true;
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'unsubscribe').mockImplementation();

    Plugin.unsubscribe($initSelector, fakeFoo);

    expect(model.unsubscribe).toHaveBeenCalledWith(fakeFoo);
  });
});

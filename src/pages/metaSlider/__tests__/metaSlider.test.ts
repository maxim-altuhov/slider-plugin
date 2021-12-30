import Model from '../layers/Model';
import methods from '../metaSlider';
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
  };
  let testSettings: IPluginOptions = $.extend({}, initSettings, defaultSettings);

  afterEach(() => {
    testSettings = $.extend({}, initSettings, defaultSettings);
    $initSelector.removeData('metaSlider');
  });

  test.each([{}, testSettings])(
    'Checking the "init" method => Checking the initialization of the plugin without parameters and with the transmission of parameters (option $#)',
    (inputOptions) => {
      jest.spyOn(methods, 'init');

      expect($initSelector.data('metaSlider')).toBeUndefined();

      $initSelector.metaSlider(inputOptions);
      const { model, presenter } = $initSelector.data('metaSlider');

      expect(methods.init).toHaveBeenCalledWith(inputOptions);
      expect(methods.init).toHaveReturnedWith($initSelector);
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

  test('Checking if the passed method does not exist for the jQuery.metaSlider', () => {
    expect(() => {
      $initSelector.metaSlider('fakeMethodName');
    }).toThrow('A method named fakeMethodName does not exist for jQuery.metaSlider');
  });

  test('Checking the "setProp" method', () => {
    const fakeProp = 'fakePropName';
    $initSelector.metaSlider(testSettings);
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'update').mockImplementation(() => 'update');
    jest.spyOn(methods, 'setProp');

    $initSelector.metaSlider('setProp', 'mainColor', 'red');

    expect(model.opt.mainColor).toBe('red');
    expect(model.opt.key).toBe('mainColor');
    expect(model.update).toHaveBeenCalled();
    expect(methods.setProp).toHaveReturnedWith($initSelector);

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
    jest.spyOn(methods, 'getProp');
    const fakeMethodName = 'fakeMethodName';

    $initSelector.metaSlider(testSettings);
    $initSelector.metaSlider('getProp', 'customValues');

    expect(methods.getProp).toHaveReturnedWith(testSettings.customValues);

    expect(() => {
      $initSelector.metaSlider('getProp', fakeMethodName);
    }).toThrow(`The '${fakeMethodName}' property does not exist.`);
  });

  test('Checking the "getOptionsObj" method', () => {
    jest.spyOn(methods, 'getOptionsObj');

    $initSelector.metaSlider(testSettings);
    $initSelector.metaSlider('getOptionsObj');

    expect(methods.getOptionsObj).toHaveReturnedWith(testSettings);
  });

  test('Checking the "getCurrentValues" method', () => {
    jest.spyOn(methods, 'getCurrentValues');

    $initSelector.metaSlider(testSettings);
    $initSelector.metaSlider('getCurrentValues');

    expect(methods.getCurrentValues).toHaveReturnedWith(testSettings.textValuesArray);

    $initSelector.removeData('metaSlider');
    testSettings.customValues = [];
    $initSelector.metaSlider(testSettings);
    $initSelector.metaSlider('getCurrentValues');

    expect(methods.getCurrentValues).toHaveReturnedWith(testSettings.initValuesArray);
  });

  test('Checking the "destroy" method', () => {
    jest.spyOn(methods, 'destroy');
    jest.spyOn($.fn, 'removeData');
    jest.spyOn($.fn, 'empty');

    $initSelector.metaSlider();
    $initSelector.metaSlider('destroy');

    expect(methods.destroy).toHaveReturnedWith($initSelector);
    expect($initSelector.removeData).toHaveBeenCalledWith('metaSlider');
    expect($initSelector.empty).toHaveBeenCalled();
  });

  test('Checking the "subscribe" method', () => {
    jest.spyOn(methods, 'subscribe');
    $initSelector.metaSlider();

    const fakeFoo = () => true;
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'subscribe');

    $initSelector.metaSlider('subscribe', fakeFoo);

    expect(model.subscribe).toHaveBeenCalledWith(fakeFoo);
  });

  test('Checking the "unsubscribe" method', () => {
    jest.spyOn(methods, 'unsubscribe');
    $initSelector.metaSlider();

    const fakeFoo = () => true;
    const { model } = $initSelector.data('metaSlider');
    jest.spyOn(model, 'unsubscribe');

    $initSelector.metaSlider('unsubscribe', fakeFoo);

    expect(model.unsubscribe).toHaveBeenCalledWith(fakeFoo);
  });
});
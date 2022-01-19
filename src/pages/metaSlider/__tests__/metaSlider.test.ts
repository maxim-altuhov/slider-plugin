import PluginMethods from '../main/PluginMethods';
import InitSettings from '../data/InitSettings';
import '../metaSlider';

jest.mock('../main/PluginMethods');
jest.spyOn($.fn, 'metaSlider');

document.body.innerHTML = '<div id="fake-selector"></div>';
const $initSelector = $('#fake-selector');

describe('Checking the correct operation of the plugin`s "metaSlider" method', () => {
  test.each(['setProp', 'init'])(
    'Checking the correctness of calls to available plugin methods => initParam: %p',
    (initParam) => {
      $initSelector.metaSlider(initParam);

      expect(PluginMethods[initParam]).toHaveBeenCalled();
    },
  );

  test.each([InitSettings, undefined])(
    'Checking the correct operation of the plugin`s "init" method => option: %#',
    (settings) => {
      $initSelector.metaSlider(settings);

      if (settings) {
        expect(PluginMethods.init).toHaveBeenCalledWith(settings);
      } else {
        expect(PluginMethods.init).toHaveBeenCalledWith();
      }
    },
  );

  test('Checking whether the passed method exists for the jQuery.metaSlider', () => {
    expect(() => {
      $initSelector.metaSlider('fakeMethodName');
    }).toThrow('A method named fakeMethodName does not exist for jQuery.metaSlider');
  });
});

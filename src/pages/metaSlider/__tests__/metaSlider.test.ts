import Plugin from '../main/Plugin';
import InitSettings from '../data/InitSettings';
import '../metaSlider';

jest.mock('../main/Plugin');
jest.spyOn($.fn, 'metaSlider');

document.body.innerHTML = '<div id="fake-selector"></div>';
const $initSelector = $('#fake-selector');

describe('Checking the correct operation of the plugin`s "metaSlider" method', () => {
  test.each(['setProp', 'init'])(
    'Checking the correctness of calls to available plugin methods => initParam: %p',
    (initParam) => {
      $initSelector.metaSlider(initParam);

      expect(Plugin[initParam]).toHaveBeenCalled();
    },
  );

  test.each([InitSettings, undefined])(
    'Checking the correct operation of the plugin`s "init" method => option: %#',
    (settings) => {
      $initSelector.metaSlider(settings);

      if (settings) {
        expect(Plugin.init).toHaveBeenCalledWith($initSelector, settings);
      } else {
        expect(Plugin.init).toHaveBeenCalledWith($initSelector);
      }
    },
  );

  test('Checking whether the passed method exists for the jQuery.metaSlider', () => {
    expect(() => {
      $initSelector.metaSlider('fakeMethodName');
    }).toThrow('A method named fakeMethodName does not exist for jQuery.metaSlider');
  });
});

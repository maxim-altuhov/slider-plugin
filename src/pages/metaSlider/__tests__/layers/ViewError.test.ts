/* eslint-disable @typescript-eslint/dot-notation */
import ViewError from '../../layers/ViewError';
import initSettings from '../../data/initSettings';

describe('Checking the "ViewError" layer, the "renderError" method', () => {
  const initHTMLBlock = '<div class="fake-selector"><div class="fake-slider"></div></div>';
  const TEXT_MSG = 'TEXT MESSAGE';
  const NEW_TEXT_MSG = 'NEW TEXT';

  describe('If the error block has not yet been created', () => {
    const classViewError = new ViewError();

    beforeAll(() => {
      document.body.innerHTML = initHTMLBlock;

      const defaultSettings = {
        $selector: $('.fake-selector'),
        $elemSlider: $('.fake-slider'),
        showError: true,
      };

      const testSettings: IPluginOptions = $.extend({}, initSettings, defaultSettings);
      classViewError.renderError(TEXT_MSG, testSettings);
    });

    test('When initializing the "renderError" method, data about selectors is collected', () => {
      expect(classViewError['_$selector']).toHaveLength(1);
      expect(classViewError['_$elemErrorInfo']).toHaveLength(1);
      expect(classViewError['_$elemErrorText']).toHaveLength(1);
      expect(classViewError['_$btnErrorClose']).toHaveLength(1);
    });

    test('When initializing the "renderError" method, creating block with error', () => {
      expect(document.body.innerHTML).not.toBe(initHTMLBlock);
      expect(document.body.innerHTML).toMatch(/js-error-info/);
      expect(document.body.innerHTML).toMatch(/js-error-info__text/);
      expect(document.body.innerHTML).toMatch(/js-error-info__close/);
    });

    test('When initializing the "renderError" method, the error text is output', () => {
      expect(classViewError['_$elemErrorText']?.text()).toBe(TEXT_MSG);
    });
  });

  describe('If the error block has already been created', () => {
    const classViewError = new ViewError();
    let testSettings: IPluginOptions;

    beforeAll(() => {
      document.body.innerHTML = initHTMLBlock;

      const defaultSettings = {
        $selector: $('.fake-selector'),
        $elemSlider: $('.fake-slider'),
        showError: true,
      };

      testSettings = $.extend({}, initSettings, defaultSettings);
      classViewError.renderError(TEXT_MSG, testSettings);
    });

    test('When initializing the "renderError" method, just change the error message', () => {
      expect(classViewError['_$elemErrorText']).toHaveLength(1);
      expect(classViewError['_$elemErrorText']?.text()).toBe(TEXT_MSG);

      classViewError.renderError(NEW_TEXT_MSG, testSettings);

      expect(classViewError['_$elemErrorText']?.text()).toBe(NEW_TEXT_MSG);
    });

    test('When we click on the button to close the error window, it is deleted and all selectors are reset', () => {
      expect(classViewError['_$elemErrorInfo']).not.toBeNull();
      expect(classViewError['_$elemErrorText']).not.toBeNull();
      expect(classViewError['_$btnErrorClose']).not.toBeNull();
      expect(document.body.innerHTML).not.toBe(initHTMLBlock);

      classViewError['_$btnErrorClose']?.trigger('click');

      expect(classViewError['_$elemErrorInfo']).toBeNull();
      expect(classViewError['_$elemErrorText']).toBeNull();
      expect(classViewError['_$btnErrorClose']).toBeNull();
      expect(document.body.innerHTML).toBe(initHTMLBlock);
    });
  });
});

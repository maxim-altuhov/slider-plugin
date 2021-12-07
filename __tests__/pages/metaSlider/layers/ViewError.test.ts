/* eslint-disable @typescript-eslint/dot-notation */
import ViewError from '../../../../src/pages/metaSlider/layers/ViewError';

/**
 * В тесте используется правило @ts-ignore для возможности передачи
 * в методы класса нестандартного объекта с настройками слайдера,
 * которые имеют значение только для тестируемых методов
 */
const classViewError = new ViewError();

describe('Test of the "ViewError" layer, method "renderError', () => {
  test('Initial state of class instance variables', () => {
    expect(classViewError['_$selector']).toBeUndefined();
    expect(classViewError['_$elemErrorInfo']).toBeUndefined();
    expect(classViewError['_$elemErrorText']).toBeUndefined();
    expect(classViewError['_$btnErrorClose']).toBeUndefined();
  });

  const TEXT_MSG = 'TEXT MESSAGE';
  const HTMLBlockError = `<div class="fake-selector"><div class="fake-slider"></div><div class="error-info js-error-info"><p class="error-info__text js-error-info__text">${TEXT_MSG}</p><button type="button" class="error-info__close js-error-info__close">X</button></div></div>`;

  describe('If the error block has not yet been created', () => {
    beforeAll(() => {
      document.body.innerHTML = '';
      document.body.innerHTML = '<div class="fake-selector"><div class="fake-slider"></div></div>';

      // @ts-ignore
      classViewError.renderError(TEXT_MSG, {
        $selector: $('.fake-selector'),
        $elemSlider: $('.fake-slider'),
        showError: true,
      });
    });

    test('When initializing the "Visualization Error" method, data about selectors is collected and an event handler is installed', () => {
      expect(classViewError['_$elemErrorInfo']).toBeDefined();
      expect(classViewError['_$elemErrorText']).toBeDefined();
      expect(classViewError['_$btnErrorClose']).toBeDefined();
    });

    test('When initializing the "renderError" method, the error text is output', () => {
      expect($('.js-error-info__text').text()).toEqual(TEXT_MSG);
    });

    test('When initializing the "renderError" method, creating block with error', () => {
      expect(document.body.innerHTML.replace(/\s+/g, '')).toEqual(
        HTMLBlockError.replace(/\s+/g, ''),
      );
    });
  });

  describe('If the error block has already been created', () => {
    const NEW_TEXT = 'NEW TEXT';

    beforeAll(() => {
      document.body.innerHTML = '';
      document.body.innerHTML = HTMLBlockError;
      classViewError['_$elemErrorInfo'] = $('.js-error-info');
      classViewError['_$elemErrorText'] = $('.js-error-info__text');

      // @ts-ignore
      classViewError.renderError(NEW_TEXT, {
        $selector: $('.fake-selector'),
        $elemSlider: $('.fake-slider'),
        showError: true,
      });
    });

    test('When initializing the "renderError" method, just change the error message', () => {
      classViewError['_$elemErrorText'] = $('.js-error-info__text');

      expect(classViewError['_$elemErrorText']).toBeDefined();
      expect(classViewError['_$elemErrorText'].text()).toEqual(NEW_TEXT);
    });

    test('When we click on the button to close the error window, it is deleted and all selectors are reset. The click event handler is removed from the button', () => {
      const defaultSliderBlock = `<div class="fake-selector"><div class="fake-slider">
      </div></div>`;

      expect(classViewError['_$elemErrorInfo']).not.toBeNull();
      expect(classViewError['_$elemErrorText']).not.toBeNull();
      expect(classViewError['_$btnErrorClose']).not.toBeNull();

      classViewError['_$btnErrorClose']?.click();

      expect(document.body.innerHTML.replace(/\s+/g, '')).toEqual(
        defaultSliderBlock.replace(/\s+/g, ''),
      );
      expect(classViewError['_$elemErrorInfo']).toBeNull();
      expect(classViewError['_$elemErrorText']).toBeNull();
      expect(classViewError['_$btnErrorClose']).toBeNull();
    });
  });
});

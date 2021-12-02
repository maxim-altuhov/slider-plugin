import ViewError from '../../../../src/pages/metaSlider/layers/ViewError';

/**
 * В тесте используется правило @ts-ignore для возможности передачи
 * в методы класса нестандартного объекта с настройками слайдера,
 * которые имеют значение только для тестируемых методов
 */
const classViewError = new ViewError();

describe('Test of the "ViewError" layer, method "renderError', () => {
  test('Initial state of class instance variables', () => {
    expect(classViewError.$selector).toBeUndefined();
    expect(classViewError.$elemErrorInfo).toBeUndefined();
    expect(classViewError.$elemErrorText).toBeUndefined();
    expect(classViewError.$btnErrorClose).toBeUndefined();
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
      expect(classViewError.$elemErrorInfo).toBeDefined();
      expect(classViewError.$elemErrorText).toBeDefined();
      expect(classViewError.$btnErrorClose).toBeDefined();
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
      classViewError.$elemErrorInfo = $('.js-error-info');
      classViewError.$elemErrorText = $('.js-error-info__text');

      // @ts-ignore
      classViewError.renderError(NEW_TEXT, {
        $selector: $('.fake-selector'),
        $elemSlider: $('.fake-slider'),
        showError: true,
      });
    });

    test('When initializing the "renderError" method, just change the error message', () => {
      classViewError.$elemErrorText = $('.js-error-info__text');

      expect(classViewError.$elemErrorText).toBeDefined();
      expect(classViewError.$elemErrorText.text()).toEqual(NEW_TEXT);
    });

    test('When we click on the button to close the error window, it is deleted and all selectors are reset. The click event handler is removed from the button', () => {
      const DEFAULT_BLOCK_SLIDER = `<div class="fake-selector"><div class="fake-slider">
      </div></div>`;

      expect(classViewError.$elemErrorInfo).not.toBeNull();
      expect(classViewError.$elemErrorText).not.toBeNull();
      expect(classViewError.$btnErrorClose).not.toBeNull();

      if (classViewError.$btnErrorClose) classViewError.$btnErrorClose.click();
      expect(document.body.innerHTML.replace(/\s+/g, '')).toEqual(
        DEFAULT_BLOCK_SLIDER.replace(/\s+/g, ''),
      );
      expect(classViewError.$elemErrorInfo).toBeNull();
      expect(classViewError.$elemErrorText).toBeNull();
      expect(classViewError.$btnErrorClose).toBeNull();
    });
  });
});

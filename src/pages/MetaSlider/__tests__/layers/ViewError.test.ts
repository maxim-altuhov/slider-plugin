/* eslint-disable @typescript-eslint/dot-notation */
import ViewError from '../../layers/ViewError';

/**
 * В тесте используется fakeRenderOptions и fakeOptions с типом any
 * для возможности передачи в методы класса нестандартного объекта
 * с настройками слайдера, которые имеют значение только для тестируемых методов
 */
const classViewError = new ViewError();
const TEXT_MSG = 'TEXT MESSAGE';

const fakeClassForTestRender = new ViewError();
document.body.innerHTML = '<div class="render-selector"><div class="render-slider"></div></div>';

const fakeRenderOptions: any = {
  $selector: $('.render-selector'),
  $elemSlider: $('.render-slider'),
  showError: true,
};
const HTMLBlockError = fakeClassForTestRender.renderError(TEXT_MSG, fakeRenderOptions);
const HTMLBlockWithError = `<div class="fake-selector"><div class="fake-slider"></div>${HTMLBlockError}</div>`;

describe('Checking the "ViewError" layer, the "renderError" method', () => {
  test('Initial state of class instance variables', () => {
    expect(classViewError['_$selector']).toBeUndefined();
    expect(classViewError['_$elemErrorInfo']).toBeUndefined();
    expect(classViewError['_$elemErrorText']).toBeUndefined();
    expect(classViewError['_$btnErrorClose']).toBeUndefined();
  });

  describe('If the error block has not yet been created', () => {
    beforeAll(() => {
      document.body.innerHTML = '<div class="fake-selector"><div class="fake-slider"></div></div>';
      const fakeOptions: any = {
        $selector: $('.fake-selector'),
        $elemSlider: $('.fake-slider'),
        showError: true,
      };

      classViewError.renderError(TEXT_MSG, fakeOptions);
    });

    test('When initializing the "renderError" method, data about selectors is collected and an event handler is installed', () => {
      expect(classViewError['_$elemErrorInfo']).toBeDefined();
      expect(classViewError['_$elemErrorText']).toBeDefined();
      expect(classViewError['_$btnErrorClose']).toBeDefined();
    });

    test('When initializing the "renderError" method, the error text is output', () => {
      expect(classViewError['_$elemErrorText']?.text()).toEqual(TEXT_MSG);
    });

    test('When initializing the "renderError" method, creating block with error', () => {
      // prettier-ignore
      expect(document.body.innerHTML.replace(/\s+/g, '')).toEqual(HTMLBlockWithError.replace(/\s+/g, ''));
    });
  });

  describe('If the error block has already been created', () => {
    const NEW_TEXT = 'NEW TEXT';

    beforeAll(() => {
      document.body.innerHTML = HTMLBlockWithError;
      classViewError['_$elemErrorInfo'] = $('.js-error-info');
      classViewError['_$elemErrorText'] = $('.js-error-info__text');

      const fakeOptions: any = {
        $selector: $('.fake-selector'),
        $elemSlider: $('.fake-slider'),
        showError: true,
      };

      classViewError.renderError(NEW_TEXT, fakeOptions);
    });

    test('When initializing the "renderError" method, just change the error message', () => {
      expect(classViewError['_$elemErrorText']).toBeDefined();
      expect(classViewError['_$elemErrorText']?.text()).toEqual(NEW_TEXT);
    });

    test('When we click on the button to close the error window, it is deleted and all selectors are reset. The click event handler is removed from the button', () => {
      const defaultSliderBlock = '<div class="fake-selector"><div class="fake-slider"></div></div>';

      expect(classViewError['_$elemErrorInfo']).not.toBeNull();
      expect(classViewError['_$elemErrorText']).not.toBeNull();
      expect(classViewError['_$btnErrorClose']).not.toBeNull();

      classViewError['_$btnErrorClose']?.click();

      // prettier-ignore
      expect(document.body.innerHTML.replace(/\s+/g, '')).toEqual(defaultSliderBlock.replace(/\s+/g, ''));
      expect(classViewError['_$elemErrorInfo']).toBeNull();
      expect(classViewError['_$elemErrorText']).toBeNull();
      expect(classViewError['_$btnErrorClose']).toBeNull();
    });
  });
});

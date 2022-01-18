/* eslint-disable @typescript-eslint/dot-notation */
import ViewError from '../../layers/ViewError';
import initSettings from '../../data/initSettings';

const initHTMLBlock = '<div class="fake-selector"><div class="fake-slider"></div></div>';
document.body.innerHTML = initHTMLBlock;

describe('Checking the "ViewError" layer, before first initialization "renderError" method', () => {
  const notInitViewError = new ViewError();

  test('State before first initialization', () => {
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(notInitViewError['_$selector']).toBeUndefined();
    expect(notInitViewError['_$elemErrorInfo']).toBeUndefined();
    expect(notInitViewError['_$elemErrorText']).toBeUndefined();
    expect(notInitViewError['_$elemErrorCloseBtn']).toBeUndefined();
  });
});

describe('Checking the "ViewError" layer', () => {
  const classViewError = new ViewError();
  const TEXT_MSG = 'TEXT MESSAGE';
  const NEW_TEXT_MSG = 'NEW TEXT';

  const defaultSettings = {
    $selector: $('.fake-selector'),
    $elemSlider: $('.fake-slider'),
    showError: true,
  };

  const testSettings: IPluginOptions = $.extend({}, initSettings, defaultSettings);
  let $elemErrorInfo: null | JQuery<HTMLElement> | undefined;
  let $elemErrorText: null | JQuery<HTMLElement> | undefined;
  let $elemErrorCloseBtn: null | JQuery<HTMLElement> | undefined;

  beforeEach(() => {
    classViewError.renderError(TEXT_MSG, testSettings);

    $elemErrorInfo = classViewError['_$elemErrorInfo'];
    $elemErrorText = classViewError['_$elemErrorText'];
    $elemErrorCloseBtn = classViewError['_$elemErrorCloseBtn'];
  });

  test('Checking the "renderError" method => Creating block with error', () => {
    const documentPage = document.body.innerHTML;

    expect(classViewError['_$selector']).toHaveLength(1);
    expect(documentPage).not.toBe(initHTMLBlock);
    expect(documentPage).toMatch(/js-error-info/);
    expect(documentPage).toMatch(/js-error-info__text/);
    expect(documentPage).toMatch(/js-error-info__close-btn/);
  });

  test('Checking the "_getErrorBlockSelectors" method => Data about selectors is collected', () => {
    expect($elemErrorInfo).toHaveLength(1);
    expect($elemErrorText).toHaveLength(1);
    expect($elemErrorCloseBtn).toHaveLength(1);
  });

  test('Checking the "renderError" method => The error text is output', () => {
    expect($elemErrorText?.text()).toBe(TEXT_MSG);
  });

  test('Checking the "renderError" method => If block already created, just changed the error message', () => {
    expect($elemErrorText).toHaveLength(1);
    expect($elemErrorText?.text()).toBe(TEXT_MSG);

    classViewError.renderError(NEW_TEXT_MSG, testSettings);

    expect($elemErrorText?.text()).toBe(NEW_TEXT_MSG);
  });

  test('Checking the "_setEventErrorClose" method, event "click" => init _handleCloseBtnClick => When we click on the button to close the error window, it is deleted and all selectors are reset', () => {
    expect(classViewError['_$elemErrorInfo']).not.toBeNull();
    expect(classViewError['_$elemErrorText']).not.toBeNull();
    expect(classViewError['_$elemErrorCloseBtn']).not.toBeNull();
    expect(document.body.innerHTML).not.toBe(initHTMLBlock);

    classViewError['_$elemErrorCloseBtn']?.trigger('click');

    expect(classViewError['_$elemErrorInfo']).toBeNull();
    expect(classViewError['_$elemErrorText']).toBeNull();
    expect(classViewError['_$elemErrorCloseBtn']).toBeNull();
    expect(document.body.innerHTML).toBe(initHTMLBlock);
  });
});

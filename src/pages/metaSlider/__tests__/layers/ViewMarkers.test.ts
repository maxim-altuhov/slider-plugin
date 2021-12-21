/* eslint-disable @typescript-eslint/dot-notation */
import ViewSlider from '../../layers/ViewSlider';
import ViewMarkers from '../../layers/ViewMarkers';
import initSettings from '../../data/initSettings';

const classViewSlider = new ViewSlider();
document.body.innerHTML = '<div id="render-selector"></div>';
const $selector = $('#render-selector');
classViewSlider.renderSlider($selector);

describe('Checking the "ViewMarkers" layer, before first initialization.', () => {
  const notInitViewMarkers = new ViewMarkers();

  test('State before first initialization the "update" method', () => {
    expect(notInitViewMarkers['_$elemMarkers']).toHaveLength(0);
    expect(notInitViewMarkers['_$elemThumbs']).toHaveLength(0);
    expect(notInitViewMarkers['_isFirstInit']).toBe(true);
  });
});

describe('Checking the "ViewMarkers" layer, the "update" method', () => {
  const classViewMarkers = new ViewMarkers();
  const defaultSettings = {
    key: 'init',
    $elemMarkers: $('.js-meta-slider__marker'),
    $elemThumbs: $('.js-meta-slider__thumb'),
    preFix: '',
    postFix: '',
    initFormatted: false,
    showMarkers: true,
    mainColor: 'red',
    colorMarker: '',
    colorTextForMarker: 'white',
    colorBorderForMarker: 'black',
    initValueFirst: 1000,
    initValueSecond: 2000,
    initValuesArray: [1000, 2000],
    customValues: [],
    textValueFirst: 'textValueFirst',
    textValueSecond: 'textValueSecond',
  };

  let testSettings: IPluginOptions;
  let $elemMarkers: JQuery<HTMLElement>;

  const getTextInMarker = (index: number) => $elemMarkers[index].textContent;

  const setSliderAttrForTest = (options: IPluginOptions) => {
    // prettier-ignore
    const {
    $elemThumbs,
    textValueFirst,
    textValueSecond,
    initValuesArray,
  } = options;

    const customValues = [textValueFirst, textValueSecond];

    initValuesArray.forEach((_, index) => {
      $elemThumbs
        .eq(index)
        .attr({ 'data-value': initValuesArray[index], 'data-text': customValues[index] });
    });
  };

  beforeAll(() => {
    testSettings = $.extend({}, initSettings, defaultSettings);
    setSliderAttrForTest(testSettings);
    classViewMarkers.update(testSettings);
    $elemMarkers = classViewMarkers['_$elemMarkers'];
  });

  afterEach(() => {
    testSettings = $.extend({}, initSettings, defaultSettings);
  });

  test('Checking the "_init" method', () => {
    expect(classViewMarkers['_$elemMarkers']).toHaveLength(2);
    expect(classViewMarkers['_$elemThumbs']).toHaveLength(2);
    expect(classViewMarkers['_isFirstInit']).toBe(false);
  });

  test('Checking the "_setValueInMarkers" method => defaultSettings', () => {
    const { initValueFirst, initValueSecond } = testSettings;
    classViewMarkers.update(testSettings);

    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));
  });

  test('Checking the "_setValueInMarkers" method => option "customValues"', () => {
    const { textValueFirst, textValueSecond } = testSettings;

    testSettings.key = 'customValues';
    testSettings.customValues = [textValueFirst, textValueSecond];
    classViewMarkers.update(testSettings);

    expect(getTextInMarker(0)).toBe(textValueFirst);
    expect(getTextInMarker(1)).toBe(textValueSecond);
  });

  test('Checking the "_setValueInMarkers" method => option "initFormatted = true"', () => {
    const { initValueFirst, initValueSecond } = testSettings;

    testSettings.key = 'initFormatted';
    testSettings.initFormatted = true;
    classViewMarkers.update(testSettings);

    expect(getTextInMarker(0)).toBe(initValueFirst?.toLocaleString());
    expect(getTextInMarker(1)).toBe(initValueSecond?.toLocaleString());
  });

  test('Checking the "_setValueInMarkers" method => option "preFix/postFix"', () => {
    const { initValueFirst, initValueSecond } = testSettings;

    testSettings.key = 'preFix';
    testSettings.preFix = 'abc';
    testSettings.postFix = 'cba';
    classViewMarkers.update(testSettings);

    expect(getTextInMarker(0)).toBe(`abc${String(initValueFirst)}cba`);
    expect(getTextInMarker(1)).toBe(`abc${String(initValueSecond)}cba`);
  });

  test('Checking the "_setValueInMarkers" method => option "preFix/postFix" + "customValues"', () => {
    const { textValueFirst, textValueSecond } = testSettings;

    testSettings.key = 'customValues';
    testSettings.customValues = [textValueFirst, textValueSecond];
    testSettings.preFix = 'abc';
    testSettings.postFix = 'cba';
    classViewMarkers.update(testSettings);

    expect(getTextInMarker(0)).toBe(`abc${textValueFirst}cba`);
    expect(getTextInMarker(1)).toBe(`abc${textValueSecond}cba`);
  });

  test('Checking the "_setStyleForMarkers" method => "defaultSettings"', () => {
    const { mainColor, colorTextForMarker, colorBorderForMarker } = testSettings;
    classViewMarkers.update(testSettings);

    expect($elemMarkers.length > 0).toBeTruthy();
    $elemMarkers.each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', mainColor);
      expect(elem.style).toHaveProperty('border-color', colorBorderForMarker);
      expect(elem.style).toHaveProperty('color', colorTextForMarker);
      expect(elem.style).toHaveProperty('display', '');
    });
  });

  test('Checking the "_setStyleForMarkers" method => option "colorMarker"', () => {
    testSettings.key = 'colorMarker';
    testSettings.colorMarker = 'yellow';
    classViewMarkers.update(testSettings);

    $elemMarkers.each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', testSettings.colorMarker);
    });
  });

  test('Checking the "_setStyleForMarkers" method => option "showMarkers"', () => {
    testSettings.key = 'showMarkers';
    testSettings.showMarkers = false;
    classViewMarkers.update(testSettings);

    $elemMarkers.each((_, elem) => {
      expect(elem.style).toHaveProperty('display', 'none');
    });
  });
});

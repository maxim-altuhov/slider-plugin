/* eslint-disable @typescript-eslint/dot-notation */
import ViewSlider from '../../layers/ViewSlider';
import ViewMarkers from '../../layers/ViewMarkers';
import initSettings from '../../data/initSettings';

const classViewSlider = new ViewSlider();
let classViewMarkers = new ViewMarkers();

document.body.innerHTML = '<div id="render-selector"></div>';
const $selector = $('#render-selector');

classViewSlider.renderSlider($selector);
const HTMLBlockWithSlider = document.body.innerHTML;

const getTextInMarker = (index: number) => classViewMarkers['_$elemMarkers'][index].textContent;

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

test('Checking the "ViewMarkers" layer. State before first initialization the "update" method', () => {
  expect(classViewMarkers['_$elemMarkers']).toHaveLength(0);
  expect(classViewMarkers['_$elemThumbs']).toHaveLength(0);
  expect(classViewMarkers['_isFirstInit']).toBe(true);
});

describe('Checking the "ViewMarkers" layer, the "update" method', () => {
  const defaultSettings = {
    key: 'init',
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

  beforeEach(() => {
    document.body.innerHTML = HTMLBlockWithSlider;
    testSettings = $.extend({}, initSettings, defaultSettings);
    testSettings.$elemMarkers = $('.js-meta-slider__marker');
    testSettings.$elemThumbs = $('.js-meta-slider__thumb');

    setSliderAttrForTest(testSettings);
    classViewMarkers = new ViewMarkers();
    classViewMarkers.update(testSettings);
  });

  test('Checking the "_init" method', () => {
    expect(classViewMarkers['_$elemMarkers']).toHaveLength(2);
    expect(classViewMarkers['_$elemThumbs']).toHaveLength(2);
    expect(classViewMarkers['_isFirstInit']).toBe(false);
  });

  test('Checking the "_setValueInMarkers" method', () => {
    // prettier-ignore
    const {
      initValueFirst,
      initValueSecond,
      textValueFirst,
      textValueSecond,
    } = testSettings;

    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));

    testSettings.key = 'customValues';
    testSettings.customValues = [textValueFirst, textValueSecond];
    classViewMarkers.update(testSettings);

    expect(getTextInMarker(0)).toBe(textValueFirst);
    expect(getTextInMarker(1)).toBe(textValueSecond);
  });

  test('Initialization and update with option "initFormatted = true"', () => {
    const { initValueFirst, initValueSecond } = testSettings;

    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));

    testSettings.key = 'initFormatted';
    testSettings.initFormatted = true;
    classViewMarkers.update(testSettings);

    expect(getTextInMarker(0)).toBe(initValueFirst?.toLocaleString());
    expect(getTextInMarker(1)).toBe(initValueSecond?.toLocaleString());
  });

  test('Initialization and update with option "preFix/postFix"', () => {
    // prettier-ignore
    const {
      initValueFirst,
      initValueSecond,
      textValueFirst,
      textValueSecond,
    } = testSettings;

    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));

    testSettings.key = 'preFix';
    testSettings.preFix = 'abc';
    testSettings.postFix = 'cba';
    classViewMarkers.update(testSettings);

    expect(getTextInMarker(0)).toBe(`abc${String(initValueFirst)}cba`);
    expect(getTextInMarker(1)).toBe(`abc${String(initValueSecond)}cba`);

    testSettings.key = 'customValues';
    testSettings.customValues = [textValueFirst, textValueSecond];
    testSettings.preFix = 'abc';
    testSettings.postFix = 'cba';
    classViewMarkers.update(testSettings);

    expect(getTextInMarker(0)).toBe(`abc${textValueFirst}cba`);
    expect(getTextInMarker(1)).toBe(`abc${textValueSecond}cba`);
  });

  test('Checking the "_setStyleForMarkers" method. Сhecking whether the styles for markers are set correctly', () => {
    const $elemMarkers = classViewMarkers['_$elemMarkers'];

    const { mainColor, colorTextForMarker, colorBorderForMarker } = testSettings;

    $elemMarkers.each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', mainColor);
      expect(elem.style).toHaveProperty('border-color', colorBorderForMarker);
      expect(elem.style).toHaveProperty('color', colorTextForMarker);
      expect(elem.style).toHaveProperty('display', '');
    });

    testSettings.key = 'colorMarker';
    testSettings.colorMarker = 'yellow';
    classViewMarkers.update(testSettings);

    $elemMarkers.each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', testSettings.colorMarker);
    });

    testSettings.key = 'showMarkers';
    testSettings.showMarkers = false;
    classViewMarkers.update(testSettings);

    $elemMarkers.each((_, elem) => {
      expect(elem.style).toHaveProperty('display', 'none');
    });
  });
});

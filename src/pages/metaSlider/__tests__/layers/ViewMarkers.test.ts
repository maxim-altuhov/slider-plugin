/* eslint-disable @typescript-eslint/dot-notation */
import ViewSlider from '../../layers/ViewSlider';
import ViewMarkers from '../../layers/ViewMarkers';

/**
 * В тесте используется initOptions с типом any
 * для возможности передачи в методы класс нестандартного объекта
 * с настройками слайдера, которые имеют значение только для тестируемых методов
 */

const classViewSlider = new ViewSlider();
let classViewMarkers = new ViewMarkers();

document.body.innerHTML = '<div id="render-selector"></div>';

const $selector = $('#render-selector');
classViewSlider.renderSlider($selector);
const HTMLBlockWithSlider = document.body.innerHTML;

const getTextInMarker = (index: number, replaceSpace = false) => {
  const textInMarker = classViewMarkers['_$elemMarkers'][index].textContent;
  if (replaceSpace) return textInMarker?.replace(/\s+/g, '_');

  return textInMarker;
};

const setSliderAttrForTest = (options: any) => {
  // prettier-ignore
  const {
    $elemThumbs,
    initValueFirst,
    initValueSecond,
    textValueFirst,
    textValueSecond,
  } = options;

  const initValuesArray = [initValueFirst, initValueSecond];
  const customValues = [textValueFirst, textValueSecond];

  initValuesArray.forEach((_, index) => {
    $elemThumbs
      .eq(index)
      .attr({ 'data-value': initValuesArray[index], 'data-text': customValues[index] });
  });
};

test('State before first initialization', () => {
  expect(classViewMarkers['_$elemMarkers']).toHaveLength(0);
  expect(classViewMarkers['_$elemThumbs']).toHaveLength(0);
  expect(classViewMarkers['_isFirstInit']).toBe(true);
});

describe('Checking the "ViewMarkers" layer, the "update" method', () => {
  const defaultOptions = {
    key: 'init',
    numberOfDecimalPlaces: 0,
    preFix: '',
    postFix: '',
    customValues: [],
    initFormatted: false,
    showMarkers: true,
    mainColor: 'red',
    colorMarker: '',
    colorTextForMarker: 'white',
    colorBorderForMarker: 'black',
    initValueFirst: 1000,
    initValueSecond: 2000,
    textValueFirst: 'textValueFirst',
    textValueSecond: 'textValueSecond',
  };

  let initOptions: any;

  beforeEach(() => {
    classViewMarkers = new ViewMarkers();

    initOptions = { ...defaultOptions };
    document.body.innerHTML = HTMLBlockWithSlider;

    initOptions.$elemMarkers = $('.js-meta-slider__marker');
    initOptions.$elemThumbs = $('.js-meta-slider__thumb');
    setSliderAttrForTest(initOptions);

    classViewMarkers.update(initOptions);
  });

  test('First initialization', () => {
    const { initValueFirst, initValueSecond } = initOptions;

    expect(classViewMarkers['_$elemMarkers']).toHaveLength(2);
    expect(classViewMarkers['_$elemThumbs']).toHaveLength(2);
    expect(classViewMarkers['_isFirstInit']).toBe(false);
    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));
  });

  test('Initialization and update with option "initFormatted = true"', () => {
    const { initValueFirst, initValueSecond } = initOptions;

    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));

    initOptions.key = 'initFormatted';
    initOptions.initFormatted = true;
    classViewMarkers.update(initOptions);

    expect(getTextInMarker(0, true)).toBe('1_000');
    expect(getTextInMarker(1, true)).toBe('2_000');
  });

  test('Initialization and update with option "preFix/postFix"', () => {
    // prettier-ignore
    const {
      initValueFirst,
      initValueSecond,
      textValueFirst,
      textValueSecond,
    } = initOptions;

    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));

    initOptions.key = 'preFix';
    initOptions.preFix = 'abc';
    initOptions.postFix = 'cba';
    classViewMarkers.update(initOptions);

    expect(getTextInMarker(0)).toBe(`abc${String(initValueFirst)}cba`);
    expect(getTextInMarker(1)).toBe(`abc${String(initValueSecond)}cba`);

    initOptions.key = 'customValues';
    initOptions.customValues = [textValueFirst, textValueSecond];
    initOptions.preFix = 'abc';
    initOptions.postFix = 'cba';
    classViewMarkers.update(initOptions);

    expect(getTextInMarker(0)).toBe(`abc${textValueFirst}cba`);
    expect(getTextInMarker(1)).toBe(`abc${textValueSecond}cba`);
  });

  test('Initialization and update with customValues', () => {
    // prettier-ignore
    const {
      initValueFirst,
      initValueSecond,
      textValueFirst,
      textValueSecond,
    } = initOptions;

    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));

    initOptions.key = 'customValues';
    initOptions.customValues = [textValueFirst, textValueSecond];
    classViewMarkers.update(initOptions);

    expect(getTextInMarker(0)).toBe(textValueFirst);
    expect(getTextInMarker(1)).toBe(textValueSecond);
  });

  test('Сhecking whether the styles for markers are set correctly', () => {
    const { mainColor, colorTextForMarker, colorBorderForMarker } = initOptions;

    classViewMarkers['_$elemMarkers'].each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', mainColor);
      expect(elem.style).toHaveProperty('border-color', colorBorderForMarker);
      expect(elem.style).toHaveProperty('color', colorTextForMarker);
      expect(elem.style).toHaveProperty('display', '');
    });

    initOptions.key = 'colorMarker';
    initOptions.colorMarker = 'yellow';
    classViewMarkers.update(initOptions);

    classViewMarkers['_$elemMarkers'].each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', initOptions.colorMarker);
    });

    initOptions.key = 'showMarkers';
    initOptions.showMarkers = false;
    classViewMarkers.update(initOptions);

    classViewMarkers['_$elemMarkers'].each((_, elem) => {
      expect(elem.style).toHaveProperty('display', 'none');
    });
  });
});

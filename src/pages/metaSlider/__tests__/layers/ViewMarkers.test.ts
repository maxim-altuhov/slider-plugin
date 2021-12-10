/* eslint-disable @typescript-eslint/dot-notation */
import ViewMarkers from '../../layers/ViewMarkers';
import '../../metaSlider';

document.body.innerHTML = '<div id="render-selector"></div>';
$('#render-selector').metaSlider({
  initValueFirst: 1000,
  initValueSecond: 2000,
  numberOfDecimalPlaces: 0,
  preFix: '',
  postFix: '',
  customValues: [],
  initFormatted: false,
  showMarkers: true,
  showScale: false,
  mainColor: 'red',
  colorMarker: '',
  colorTextForMarker: 'white',
  colorBorderForMarker: 'black',
});

console.log(document.body.innerHTML);

const classViewMarkers = new ViewMarkers();
const customValueFirst = 'textValueFirst';
const customValueSecond = 'textValueSecond';

const returnHTMLBlockSlider = (
  initValueFirst: number | string,
  initValueSecond: number | string,
) => `<div class="meta-slider__progress js-meta-slider__progress"></div>
<button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_left" data-value="${initValueFirst}" data-text=${customValueFirst}>
  <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_left"></span>
</button>
<button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_right" data-value="${initValueSecond}" data-text=${customValueSecond}>
  <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_right"></span>
</button>
<div class="meta-slider__scale js-meta-slider__scale"></div>`;

const getTextInMarker = (index: number, replaceSpace = false) => {
  const text = classViewMarkers['_$elemMarkers'][index].textContent;
  if (replaceSpace) return text?.replace(/\s+/g, '_');

  return text;
};

test('State before first initialization', () => {
  expect(classViewMarkers['_$elemMarkers']).toHaveLength(0);
  expect(classViewMarkers['_$elemThumbs']).toHaveLength(0);
  expect(classViewMarkers['_isFirstInit']).toBe(true);
});

describe('Checking the "ViewMarkers" layer, the "update" method', () => {
  const defaultOptions = {
    key: 'init',
    $elemMarkers: $(),
    $elemThumbs: $(),
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
  };

  let initOptions: any;

  beforeEach(() => {
    classViewMarkers['_$elemMarkers'] = $();
    classViewMarkers['_$elemThumbs'] = $();
    classViewMarkers['_isFirstInit'] = true;

    initOptions = { ...defaultOptions };
    const { initValueFirst, initValueSecond } = initOptions;
    document.body.innerHTML = returnHTMLBlockSlider(initValueFirst, initValueSecond);

    initOptions.$elemMarkers = $('.js-meta-slider__marker');
    initOptions.$elemThumbs = $('.js-meta-slider__thumb');

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
    const { initValueFirst, initValueSecond } = initOptions;

    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));

    initOptions.key = 'preFix';
    initOptions.preFix = 'abc';
    initOptions.postFix = 'cba';
    classViewMarkers.update(initOptions);

    expect(getTextInMarker(0)).toBe(`abc${String(initValueFirst)}cba`);
    expect(getTextInMarker(1)).toBe(`abc${String(initValueSecond)}cba`);

    initOptions.key = 'customValues';
    initOptions.customValues = ['A', 'B', 'C'];
    initOptions.preFix = 'abc';
    initOptions.postFix = 'cba';
    classViewMarkers.update(initOptions);

    expect(getTextInMarker(0)).toBe(`abc${customValueFirst}cba`);
    expect(getTextInMarker(1)).toBe(`abc${customValueSecond}cba`);
  });

  test('Initialization and update with customValues', () => {
    const { initValueFirst, initValueSecond } = initOptions;

    expect(getTextInMarker(0)).toBe(String(initValueFirst));
    expect(getTextInMarker(1)).toBe(String(initValueSecond));

    initOptions.key = 'customValues';
    initOptions.customValues = ['A', 'B', 'C'];
    classViewMarkers.update(initOptions);

    expect(getTextInMarker(0)).toBe(customValueFirst);
    expect(getTextInMarker(1)).toBe(customValueSecond);
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

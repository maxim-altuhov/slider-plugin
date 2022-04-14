/* eslint-disable @typescript-eslint/dot-notation */
// The tests uses the 'any' type in jest.spyOn so that private methods of the class can be tested
import View from '../../layers/View';
import ViewSlider from '../../layers/ViewSlider';
import InitSettings from '../../data/InitSettings';

jest.mock('../../utils/createUniqueID');
const classMainView = new View();
const classViewSlider = new ViewSlider();
const initSelectorName = 'render-selector';
const scaleSelectorName = '.js-meta-slider__scale';
const scalePointsSelectorName = '.js-meta-slider__scale-point';
const thumbSelectorName = '.js-meta-slider__thumb';
const markerSelectorName = '.js-meta-slider__marker';
const initHTMLBlock = `<div id="${initSelectorName}"></div>`;
document.body.innerHTML = initHTMLBlock;

// prettier-ignore
const scalePointHTML = '<button type="button" class="meta-slider__scale-point js-meta-slider__scale-point"></button>';
const $initSelector = $(`#${initSelectorName}`);
classMainView.renderSlider($initSelector);

const $initElemScale = $(scaleSelectorName);
$initElemScale.append(scalePointHTML);

const $initElemThumbs = $(thumbSelectorName);
const $initElemMarkers = $(markerSelectorName);
const $initElemScalePoints = $(scalePointsSelectorName);

const TEST_HEIGHT_ELEM = '20px';
$initElemThumbs.css('height', TEST_HEIGHT_ELEM);
$initElemMarkers.css('height', TEST_HEIGHT_ELEM);
$initElemScalePoints.css('height', TEST_HEIGHT_ELEM);

describe('Checking the "ViewSlider" layer. State before first initialization the "renderSlider" and "update" method', () => {
  const notInitViewSlider = new ViewSlider();

  test('State before first initialization', () => {
    expect($initSelector.html()).toMatchSnapshot();
    expect(notInitViewSlider['_$selector']).toHaveLength(0);
    expect(notInitViewSlider['_$elemSlider']).toHaveLength(0);
    expect(notInitViewSlider['_$sliderProgress']).toHaveLength(0);
    expect(notInitViewSlider['_$elemThumbs']).toHaveLength(0);
    expect(notInitViewSlider['_$elemMarkers']).toHaveLength(0);
    expect(notInitViewSlider['_isFirstInit']).toBe(true);
    expect(notInitViewSlider['_observerList']).toHaveLength(0);
    expect(notInitViewSlider['_verifKeysObj']).toBeDefined();
  });
});

describe('Checking the "ViewSlider" layer', () => {
  const defaultSettings = {
    key: 'init',
    $selector: $initSelector,
    $elemSlider: $('.js-meta-slider'),
    $sliderProgress: $('.js-meta-slider__progress'),
    $elemThumbs: $initElemThumbs,
    $elemMarkers: $initElemMarkers,
    $elemScale: $initElemScale,
    showBackground: true,
    initAutoMargins: true,
    showMarkers: true,
    showScale: true,
    isVertical: false,
    mainColor: 'red',
    secondColor: 'grey',
    minValue: 0,
    maxValue: 100,
    valuesAsPercentageArray: [0, 100],
    customValues: [],
  };
  let testSettings: IPluginOptions;
  let $selector: JQuery<HTMLElement>;
  let $elemSlider: JQuery<HTMLElement>;
  let $sliderProgress: JQuery<HTMLElement>;
  let $elemThumbs: JQuery<HTMLElement>;
  let $elemMarkers: JQuery<HTMLElement>;

  beforeAll(() => {
    testSettings = $.extend({}, InitSettings, defaultSettings);
    classViewSlider.update(testSettings);

    $selector = classViewSlider['_$selector'];
    $elemSlider = classViewSlider['_$elemSlider'];
    $sliderProgress = classViewSlider['_$sliderProgress'];
    $elemThumbs = classViewSlider['_$elemThumbs'];
    $elemMarkers = classViewSlider['_$elemMarkers'];
  });

  afterEach(() => {
    testSettings = $.extend({}, InitSettings, defaultSettings);
    jest.restoreAllMocks();
  });

  test('Checking the "_init" method', () => {
    jest.spyOn<ViewSlider, any>(classViewSlider, '_setEventsSlider');

    classViewSlider['_isFirstInit'] = true;
    classViewSlider.update(testSettings);

    expect(classViewSlider['_isFirstInit']).toBe(false);
    expect($selector).toHaveLength(1);
    expect($elemSlider).toHaveLength(1);
    expect($sliderProgress).toHaveLength(1);
    expect($elemThumbs).toHaveLength(2);
    expect($elemMarkers).toHaveLength(2);
    expect(classViewSlider['_setEventsSlider']).toHaveBeenCalled();
  });

  test('Checking the "_setMinAndMaxVal" method => "defaultSettings"', () => {
    classViewSlider.update(testSettings);
    const { minValue, maxValue } = testSettings;

    expect($elemSlider.attr('data-min')).toBe(String(minValue));
    expect($elemSlider.attr('data-max')).toBe(String(maxValue));
    expect($elemSlider.attr('data-min_text')).toBeUndefined();
    expect($elemSlider.attr('data-max_text')).toBeUndefined();
  });

  test('Checking the "_setMinAndMaxVal" method => option "customValues"', () => {
    testSettings.key = 'customValues';
    testSettings.customValues = ['one', 'two', 'three'];
    classViewSlider.update(testSettings);

    const { customValues } = testSettings;
    expect($elemSlider.attr('data-min_text')).toBe(String(customValues[0]));
    expect($elemSlider.attr('data-max_text')).toBe(String(customValues[customValues.length - 1]));

    testSettings.key = 'customValues';
    testSettings.customValues = [];
    classViewSlider.update(testSettings);

    expect($elemSlider.attr('data-min_text')).toBeUndefined();
    expect($elemSlider.attr('data-max_text')).toBeUndefined();
  });

  test('Checking the "_setAutoMargins" method => "defaultSettings"', () => {
    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-top')).toMatch(/\d+px/);
    expect($elemSlider.css('margin-top')).not.toBe('0px');
    expect($elemSlider.css('margin-bottom')).toMatch(/\d+px/);
    expect($elemSlider.css('margin-bottom')).not.toBe('0px');
  });

  test('Checking the "_setAutoMargins" method => option "showScale"', () => {
    testSettings.key = 'showScale';
    testSettings.showScale = false;
    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-bottom')).toBe('');
  });

  test('Checking the "_setAutoMargins" method => option "showMarkers"', () => {
    testSettings.key = 'showMarkers';
    testSettings.showMarkers = false;
    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-top')).toBe('');
  });

  test('Checking the "_setAutoMargins" method => option "initAutoMargins"', () => {
    testSettings.key = 'initAutoMargins';
    testSettings.initAutoMargins = false;
    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-top')).toBe('');
    expect($elemSlider.css('margin-bottom')).toBe('');
  });

  test('Checking the "_setAutoMargins" method => option "isVertical"', () => {
    testSettings.key = 'isVertical';
    testSettings.isVertical = true;
    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-top')).toBe('');
    expect($elemSlider.css('margin-bottom')).toBe('');
  });

  test('Checking the "_setAutoMargins" method => "elem.outerHeight() undefined or equal to zero"', () => {
    testSettings.key = 'initAutoMargins';
    testSettings.showMarkers = true;
    testSettings.showScale = true;
    $elemMarkers.length = 0;
    $elemThumbs.length = 0;
    $initElemScalePoints.detach();

    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-top')).toBe('0px');
    expect($elemSlider.css('margin-bottom')).toBe('0px');

    $elemMarkers.length = 2;
    $elemThumbs.length = 2;
    $initElemScalePoints.appendTo($initElemScale);
  });

  test('Checking the "_setBackgroundForSlider" method => "defaultSettings"', () => {
    classViewSlider.update(testSettings);
    const { secondColor } = testSettings;

    expect($elemSlider.prop('style')).toHaveProperty('background-color', secondColor);
  });

  test('Checking the "_setBackgroundForSlider" method => option "secondColor"', () => {
    testSettings.key = 'secondColor';
    testSettings.secondColor = 'yellow';
    classViewSlider.update(testSettings);
    const { secondColor } = testSettings;

    expect($elemSlider.prop('style')).toHaveProperty('background-color', secondColor);
  });

  test('Checking the "_setVerticalOrientation" method => "defaultSettings"', () => {
    classViewSlider.update(testSettings);

    expect($elemSlider.attr('class')).not.toMatch(/meta-slider_vertical/);
  });

  test('Checking the "_setVerticalOrientation" method => option "isVertical"', () => {
    testSettings.key = 'isVertical';
    testSettings.isVertical = true;
    classViewSlider.update(testSettings);

    expect($elemSlider.attr('class')).toMatch(/meta-slider_vertical/);
  });

  test('Checking the "_setBackgroundTheRange" method => "defaultSettings"', () => {
    classViewSlider.update(testSettings);
    const { valuesAsPercentageArray, mainColor } = testSettings;
    const [firstPosition, secondPosition] = valuesAsPercentageArray;

    expect($sliderProgress.prop('style')).toHaveProperty('left', `${firstPosition}%`);
    expect($sliderProgress.prop('style')).toHaveProperty('right', `${100 - secondPosition}%`);
    expect($sliderProgress.prop('style')).toHaveProperty('background', mainColor);
  });

  test('Checking the "_setBackgroundTheRange" method => option "showBackground"', () => {
    testSettings.key = 'showBackground';
    testSettings.showBackground = false;
    classViewSlider.update(testSettings);

    expect($sliderProgress.prop('style')).toHaveProperty('background', 'none');
  });

  test('Checking the "_setEventsSlider" method, event "pointerdown" => _handleSliderPointerdown', () => {
    jest.spyOn(classViewSlider, 'notify').mockImplementation();
    const eventPointerdown = $.Event('pointerdown.slider');
    eventPointerdown.preventDefault = jest.fn();

    $elemSlider.trigger(eventPointerdown);

    expect(eventPointerdown.preventDefault).toHaveBeenCalled();
    expect(classViewSlider.notify).toHaveBeenCalledWith(eventPointerdown);
  });
});

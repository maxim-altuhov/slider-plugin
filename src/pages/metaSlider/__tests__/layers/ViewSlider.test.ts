/* eslint-disable @typescript-eslint/dot-notation */
import ViewSlider from '../../layers/ViewSlider';
import initSettings from '../../data/initSettings';
import * as createUniqueID from '../../utils/createUniqueID';

let classViewSlider = new ViewSlider();
const selectorName = 'render-selector';
const initHTMLBlock = `<div class="slider-block" id="${selectorName}"></div>`;
document.body.innerHTML = initHTMLBlock;
const $initSelector = $(`#${selectorName}`);

test('Checking the "ViewSlider" layer. State before first initialization the "renderSlider" and "update" method', () => {
  expect(document.body.innerHTML).toBe(initHTMLBlock);
  expect(classViewSlider.observerList).toHaveLength(0);
  expect(classViewSlider['_$selector']).toHaveLength(0);
  expect(classViewSlider['_$elemSlider']).toHaveLength(0);
  expect(classViewSlider['_$sliderProgress']).toHaveLength(0);
  expect(classViewSlider['_$elemThumbs']).toHaveLength(0);
  expect(classViewSlider['_$elemMarkers']).toHaveLength(0);
  expect(classViewSlider['_isFirstInit']).toBe(true);
});

describe('Checking the "ViewSlider" layer', () => {
  const defaultSettings = {
    key: 'init',
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
  let HTMLBlockWithSlider: string;
  let testSettings: IPluginOptions;

  beforeAll(() => {
    const elemScalePoint = `<button type="button" class="meta-slider__scale-point
    js-meta-slider__scale-point"></button>`;

    classViewSlider.renderSlider($initSelector);
    $('.js-meta-slider__scale').append(elemScalePoint);
    HTMLBlockWithSlider = document.body.innerHTML;
  });

  beforeEach(() => {
    document.body.innerHTML = HTMLBlockWithSlider;
    testSettings = $.extend({}, initSettings, defaultSettings);
    testSettings.$selector = $(`#${selectorName}`);
    testSettings.$elemSlider = $('.js-meta-slider');
    testSettings.$sliderProgress = $('.js-meta-slider__progress');
    testSettings.$elemThumbs = $('.js-meta-slider__thumb');
    testSettings.$elemMarkers = $('.js-meta-slider__marker');
    testSettings.$elemScale = $('.js-meta-slider__scale');

    classViewSlider = new ViewSlider();
    classViewSlider.update(testSettings);
  });

  test('Checking the "renderSlider" method', () => {
    const checkingSelectorsArr = [
      /js-meta-slider/,
      /js-meta-slider__progress/,
      /js-meta-slider__thumb/,
      /js-meta-slider__marker/,
      /js-meta-slider__scale/,
      /data-id/,
      /data-value/,
      /data-text/,
    ];
    const mockCreateUniqueID = jest.spyOn(createUniqueID, 'default').mockImplementation(() => '');
    classViewSlider.renderSlider($initSelector);

    expect(document.body.innerHTML).not.toBe(initHTMLBlock);
    expect(mockCreateUniqueID).toHaveBeenCalled();
    expect(classViewSlider['_$selector']).toHaveLength(1);
    expect(classViewSlider['_$selector']).toBe($initSelector);

    checkingSelectorsArr.forEach((selector) => {
      expect(document.body.innerHTML).toMatch(selector);
    });
  });

  test('Checking the "_init" method', () => {
    expect(classViewSlider['_isFirstInit']).toBe(false);
    expect(classViewSlider['_$selector']).toHaveLength(1);
    expect(classViewSlider['_$elemSlider']).toHaveLength(1);
    expect(classViewSlider['_$sliderProgress']).toHaveLength(1);
    expect(classViewSlider['_$elemThumbs']).toHaveLength(2);
    expect(classViewSlider['_$elemMarkers']).toHaveLength(2);
  });

  test('Checking the "_setMinAndMaxVal" method => first init and update', () => {
    const { minValue, maxValue } = testSettings;
    const $elemSlider = classViewSlider['_$elemSlider'];

    expect($elemSlider.attr('data-min')).toBe(String(minValue));
    expect($elemSlider.attr('data-max')).toBe(String(maxValue));
    expect($elemSlider.attr('data-min_text')).toBeUndefined();
    expect($elemSlider.attr('data-max_text')).toBeUndefined();

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

  test('Checking the "_setAutoMargins" method => first init and update', () => {
    const TEST_HEIGHT_ELEM = 20;
    const $elemScalePoints = $('.js-meta-slider__scale-point');
    const $elemSlider = classViewSlider['_$elemSlider'];
    const $elemThumbs = classViewSlider['_$elemThumbs'];
    const $elemMarkers = classViewSlider['_$elemMarkers'];

    $elemScalePoints.eq(-1).css('height', TEST_HEIGHT_ELEM);
    $elemThumbs.eq(-1).css('height', TEST_HEIGHT_ELEM);
    $elemMarkers.eq(-1).css('height', TEST_HEIGHT_ELEM);

    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-top')).toMatch(/\d+px/);
    expect($elemSlider.css('margin-top')).not.toBe('0px');
    expect($elemSlider.css('margin-bottom')).toMatch(/\d+px/);
    expect($elemSlider.css('margin-bottom')).not.toBe('0px');

    testSettings.key = 'showScale';
    testSettings.showScale = false;
    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-bottom')).toBe('');

    testSettings.key = 'showMarkers';
    testSettings.showMarkers = false;
    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-top')).toBe('');

    testSettings = $.extend({}, initSettings, defaultSettings);
    testSettings.key = 'initAutoMargins';
    testSettings.initAutoMargins = false;
    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-top')).toBe('');
    expect($elemSlider.css('margin-bottom')).toBe('');

    testSettings = $.extend({}, initSettings, defaultSettings);
    testSettings.key = 'isVertical';
    testSettings.isVertical = true;
    classViewSlider.update(testSettings);

    expect($elemSlider.css('margin-top')).toBe('');
    expect($elemSlider.css('margin-bottom')).toBe('');
  });

  test('Checking the "_setBackgroundForSlider" method => first init and update', () => {
    const $elemSlider = classViewSlider['_$elemSlider'];
    const { secondColor } = testSettings;

    expect($elemSlider.prop('style')).toHaveProperty('background-color', secondColor);

    testSettings.key = 'secondColor';
    testSettings.secondColor = 'yellow';
    classViewSlider.update(testSettings);
    const { secondColor: newSecondColor } = testSettings;

    expect($elemSlider.prop('style')).toHaveProperty('background-color', newSecondColor);
  });

  test('Checking the "_setVerticalOrientation" method => first init and update', () => {
    expect(classViewSlider['_$selector'].attr('class')).not.toMatch(/ms-vertical/);
    expect(classViewSlider['_$elemSlider'].attr('class')).not.toMatch(/meta-slider_vertical/);

    testSettings.key = 'isVertical';
    testSettings.isVertical = true;
    classViewSlider.update(testSettings);

    expect(classViewSlider['_$selector'].attr('class')).toMatch(/ms-vertical/);
    expect(classViewSlider['_$elemSlider'].attr('class')).toMatch(/meta-slider_vertical/);
  });

  test('Checking the "_setBackgroundTheRange" method => first init and update', () => {
    const $sliderProgress = classViewSlider['_$sliderProgress'];
    const { valuesAsPercentageArray, mainColor } = testSettings;
    const [firstPosition, secondPosition] = valuesAsPercentageArray;

    expect($sliderProgress.prop('style')).toHaveProperty('left', `${firstPosition}%`);
    expect($sliderProgress.prop('style')).toHaveProperty('right', `${100 - secondPosition}%`);
    expect($sliderProgress.prop('style')).toHaveProperty('background', mainColor);

    testSettings.key = 'showBackground';
    testSettings.showBackground = false;
    classViewSlider.update(testSettings);

    expect($sliderProgress.prop('style')).toHaveProperty('background', 'none');
  });

  test('Checking the "_setEventsSlider" method, event "pointerdown" => _handleSetSliderValues', () => {
    const $elemSlider = classViewSlider['_$elemSlider'];
    const mockNotify = jest.spyOn(classViewSlider, 'notify');
    const eventPointerdown = $.Event('pointerdown.slider');
    eventPointerdown.preventDefault = jest.fn();
    $elemSlider.trigger(eventPointerdown);

    expect(eventPointerdown.preventDefault).toHaveBeenCalled();
    expect(mockNotify).toHaveBeenCalledWith(eventPointerdown);
  });
});

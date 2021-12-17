/* eslint-disable @typescript-eslint/dot-notation */
import ViewSlider from '../../layers/ViewSlider';
import initSettings from '../../data/initSettings';
import * as createUniqueID from '../../utils/createUniqueID';

let classViewSlider = new ViewSlider();
const initHTMLBlock = '<div id="render-selector"></div>';
document.body.innerHTML = initHTMLBlock;
let $selector = $('#render-selector');

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
    secondColor: '',
    minValue: 0,
    maxValue: 100,
    customValues: [],
  };

  let testSettings: IPluginOptions;

  beforeEach(() => {
    classViewSlider = new ViewSlider();
    document.body.innerHTML = initHTMLBlock;

    testSettings = $.extend({}, initSettings, defaultSettings);

    $selector = $('#render-selector');
    classViewSlider.renderSlider($selector);

    testSettings.$elemSlider = $('.js-meta-slider');
    testSettings.$sliderProgress = $('.js-meta-slider__progress');
    testSettings.$elemThumbs = $('.js-meta-slider__thumb');
    testSettings.$elemMarkers = $('.js-meta-slider__marker');

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
    classViewSlider.renderSlider($selector);

    expect(document.body.innerHTML).not.toBe(initHTMLBlock);
    expect(mockCreateUniqueID).toHaveBeenCalled();
    expect(classViewSlider['_$selector']).toHaveLength(1);
    expect(classViewSlider['_$selector']).toBe($selector);

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
  });
});

/* eslint-disable @typescript-eslint/dot-notation */
import ViewSlider from '../../layers/ViewSlider';
import ViewScale from '../../layers/ViewScale';
import initSettings from '../../data/initSettings';

const mockJQueryEmptyMethod = jest.spyOn($.fn, 'empty');
const classViewSlider = new ViewSlider();
let classViewScale = new ViewScale();

const selectorName = 'render-selector';
const initHTMLBlock = `<div class="slider-block" id="${selectorName}"></div>`;
document.body.innerHTML = initHTMLBlock;
const $initSelector = $(`#${selectorName}`);

classViewSlider.renderSlider($initSelector);
const HTMLBlockWithSlider = document.body.innerHTML;

test('Checking the "ViewThumbs" layer. State before first initialization the "update" method', () => {
  expect(classViewScale.observerList).toHaveLength(0);
  expect(classViewScale['_$selector']).toHaveLength(0);
  expect(classViewScale['_$elemSlider']).toHaveLength(0);
  expect(classViewScale['_$elemScale']).toHaveLength(0);
  expect(classViewScale['_$elemScalePoints']).toHaveLength(0);
  expect(classViewScale['_scalePointsSize']).toBe(0);
  expect(classViewScale['_mapSkipScalePoints'].size).toBe(0);
  expect(classViewScale['_skipScalePointsArray']).toHaveLength(0);
  expect(classViewScale['_isFirstInit']).toBe(true);
});

describe('Checking the "ViewScale" layer', () => {
  const defaultSettings = {
    key: 'init',
    showScale: true,
    initAutoScaleCreation: true,
    initFormatted: true,
    initScaleAdjustment: true,
    step: 10,
    stepSizeForScale: 50,
    minValue: 0,
    maxValue: 100,
    customValues: [],
    preFix: '',
    postFix: '',
    colorForScale: 'black',
  };

  let testSettings: IPluginOptions;

  beforeEach(() => {
    document.body.innerHTML = HTMLBlockWithSlider;
    testSettings = $.extend({}, initSettings, defaultSettings);
    testSettings.$selector = $(`#${selectorName}`);
    testSettings.$elemSlider = $('.js-meta-slider');
    testSettings.$elemScale = $('.js-meta-slider__scale');

    classViewScale = new ViewScale();
    classViewScale.update(testSettings);
  });

  test('Checking the "_init" method', () => {
    expect(classViewScale['_$selector']).toHaveLength(1);
    expect(classViewScale['_$elemSlider']).toHaveLength(1);
    expect(classViewScale['_$elemScale']).toHaveLength(1);
    expect(classViewScale['_isFirstInit']).toBe(false);
  });

  test('Checking the "_createScale" method => first init and update', () => {
    const $elemScalePoints = $('.js-meta-slider__scale-point');
    // const { minValue, maxValue, step } = testSettings;

    expect($elemScalePoints.length > 0).toBeTruthy();
    // expect($elemScalePoints.length).toBe((maxValue - minValue) / step + 1);
    expect(mockJQueryEmptyMethod).toHaveBeenCalled();

    $elemScalePoints.each((_, scalePoint) => {
      const $scalePoint = $(scalePoint);
      expect($scalePoint.attr('class')).toMatch(/js-meta-slider__scale-point/);
      expect($scalePoint.attr('data-value')).toBeDefined();
      expect($scalePoint.prop('style')).toHaveProperty('color');
    });
  });

  test('Checking the "_setStyleForScale" method => first init and update', () => {
    const { colorForScale } = testSettings;
    const $elemScale = classViewScale['_$elemScale'];
    const $elemScalePoints = $('.js-meta-slider__scale-point');

    expect($elemScale.length > 0).toBeTruthy();
    expect($elemScalePoints.length > 0).toBeTruthy();
    expect($elemScale.prop('style')).toHaveProperty('border-color', colorForScale);
    expect($elemScale.prop('style')).toHaveProperty('color', colorForScale);
    expect($elemScale.prop('style')).toHaveProperty('opacity', '1');
    expect($elemScale.prop('style')).toHaveProperty('pointer-events', '');
    expect($elemScale.html()).not.toMatch(/tabindex/);

    testSettings.key = 'colorForScale';
    testSettings.colorForScale = 'red';
    classViewScale.update(testSettings);
    const { colorForScale: newColorForScale } = testSettings;

    expect($elemScale.prop('style')).toHaveProperty('border-color', newColorForScale);
    expect($elemScale.prop('style')).toHaveProperty('color', newColorForScale);

    testSettings.key = 'showScale';
    testSettings.showScale = false;
    classViewScale.update(testSettings);

    $elemScalePoints.each((_, scalePoint) => expect($(scalePoint).attr('tabindex')).toBe('-1'));
    expect($elemScale.prop('style')).toHaveProperty('opacity', '0');
    expect($elemScale.prop('style')).toHaveProperty('pointer-events', 'none');
  });
});

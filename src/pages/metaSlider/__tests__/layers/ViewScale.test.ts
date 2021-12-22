/* eslint-disable @typescript-eslint/dot-notation */
import ViewSlider from '../../layers/ViewSlider';
import ViewScale from '../../layers/ViewScale';
import initSettings from '../../data/initSettings';

const classViewSlider = new ViewSlider();
document.body.innerHTML = '<div id="render-selector"></div>';
const $initSelector = $('#render-selector');
classViewSlider.renderSlider($initSelector);

describe('Checking the "ViewScale" layer, before first initialization.', () => {
  const notInitViewScale = new ViewScale();

  test('State before first initialization the "update" method', () => {
    expect($initSelector.html()).toMatchSnapshot();
    expect(notInitViewScale.observerList).toHaveLength(0);
    expect(notInitViewScale['_$selector']).toHaveLength(0);
    expect(notInitViewScale['_$elemSlider']).toHaveLength(0);
    expect(notInitViewScale['_$elemScale']).toHaveLength(0);
    expect(notInitViewScale['_$elemScalePoints']).toHaveLength(0);
    expect(notInitViewScale['_scalePointsSize']).toBe(0);
    expect(notInitViewScale['_mapSkipScalePoints'].size).toBe(0);
    expect(notInitViewScale['_skipScalePointsArray']).toHaveLength(0);
    expect(notInitViewScale['_isFirstInit']).toBe(true);
  });
});

describe('Checking the "ViewScale" layer', () => {
  const classViewScale = new ViewScale();
  const defaultSettings = {
    key: 'init',
    $selector: $initSelector,
    $elemSlider: $('.js-meta-slider'),
    $elemScale: $('.js-meta-slider__scale'),
    showScale: true,
    initAutoScaleCreation: true,
    initFormatted: false,
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
  let $elemSlider: JQuery<HTMLElement>;
  let $elemScale: JQuery<HTMLElement>;

  beforeAll(() => {
    testSettings = $.extend({}, initSettings, defaultSettings);
    classViewScale.update(testSettings);
    $elemSlider = classViewScale['_$elemSlider'];
    $elemScale = classViewScale['_$elemScale'];

    $elemSlider.css('width', '200px');
  });

  afterEach(() => {
    testSettings = $.extend({}, initSettings, defaultSettings);
  });

  test('Checking the "_init" method', () => {
    expect(classViewScale['_$selector']).toHaveLength(1);
    expect(classViewScale['_$elemSlider']).toHaveLength(1);
    expect(classViewScale['_$elemScale']).toHaveLength(1);
    expect(classViewScale['_isFirstInit']).toBe(false);
  });

  test('Checking the "_createScale" method => "defaultSettings"', () => {
    jest.spyOn<ViewScale, any>(classViewScale, '_setEventsScalePoints');
    jest.spyOn<ViewScale, any>(classViewScale, '_calcScalePointsSize');
    jest.spyOn(Map.prototype, 'clear');
    jest.spyOn($.fn, 'empty');
    const { maxValue, minValue, step } = testSettings;

    classViewScale.update(testSettings);

    const $elemScalePoints = classViewScale['_$elemScalePoints'];
    let scalePointCounter = 0;

    for (let currentValue = minValue; currentValue <= maxValue; currentValue += step) {
      expect($elemScalePoints.eq(scalePointCounter).attr('data-value')).toBe(String(currentValue));
      expect($elemScalePoints.eq(scalePointCounter).text()).toBe(String(currentValue));

      scalePointCounter += 1;
    }

    expect(classViewScale['_$elemScale'].empty).toHaveBeenCalled();
    expect($elemScalePoints).toHaveLength(scalePointCounter);

    $elemScalePoints.each((_, scalePoint) => {
      const $scalePoint = $(scalePoint);
      expect($scalePoint.attr('class')).toMatch(/js-meta-slider__scale-point/);
      expect($scalePoint.attr('data-value')).toBeDefined();
      expect($scalePoint.prop('style')).toHaveProperty('color');
      expect($scalePoint.prop('style')).toHaveProperty(
        'left',
        `${((Number($scalePoint.attr('data-value')) - minValue) / (maxValue - minValue)) * 100}%`,
      );
      expect(classViewScale['_calcScalePointsSize']).toHaveBeenCalledWith($scalePoint);
    });
    expect(classViewScale['_setEventsScalePoints']).toHaveBeenCalled();
    expect(classViewScale['_mapSkipScalePoints'].clear).toHaveBeenCalled();
  });

  test('Checking the "_createScale" method => option "preFix/postFix"', () => {
    testSettings.key = 'preFix';
    testSettings.preFix = 'abc';
    testSettings.postFix = 'cba';
    classViewScale.update(testSettings);
    const $elemScalePoints = classViewScale['_$elemScalePoints'];

    $elemScalePoints.each((_, scalePoint) => expect(scalePoint.textContent).toMatch(/abc\d+cba/));
  });

  test('Checking the "_createScale" method => option "initAutoScaleCreation"', () => {
    testSettings.key = 'initAutoScaleCreation';
    testSettings.initAutoScaleCreation = false;
    const { maxValue, minValue, stepSizeForScale } = testSettings;
    classViewScale.update(testSettings);

    const $elemScalePoints = classViewScale['_$elemScalePoints'];
    let scalePointCounter = 0;
    let stepValue = 0;

    if (stepSizeForScale) stepValue = stepSizeForScale;

    for (let currentValue = minValue; currentValue <= maxValue; currentValue += stepValue) {
      expect($elemScalePoints.eq(scalePointCounter).attr('data-value')).toBe(String(currentValue));
      expect($elemScalePoints.eq(scalePointCounter).text()).toBe(String(currentValue));

      scalePointCounter += 1;
    }
  });

  test('Checking the "_createScale" method => option "initFormatted"', () => {
    testSettings.key = 'initFormatted';
    testSettings.initFormatted = true;
    testSettings.minValue = 1000;
    testSettings.maxValue = 10000;
    testSettings.step = 1000;
    classViewScale.update(testSettings);

    const $elemScalePoints = classViewScale['_$elemScalePoints'];

    $elemScalePoints.each((_, scalePoint) => {
      const $scalePoint = $(scalePoint);
      expect($scalePoint.text()).toBe(Number($scalePoint.attr('data-value')).toLocaleString());
    });
  });

  test('Checking the "_createScale" method => option "customValues"', () => {
    testSettings.key = 'customValues';
    testSettings.customValues = ['a', 'b', 'c', 'd'];
    const { customValues } = testSettings;

    testSettings.minValue = 0;
    testSettings.maxValue = customValues.length - 1;
    testSettings.initAutoScaleCreation = false;
    testSettings.checkingStepSizeForScale = false;
    testSettings.initFormatted = false;
    testSettings.calcNumberOfDecimalPlaces = false;
    testSettings.numberOfDecimalPlaces = 0;
    testSettings.step = 1;
    testSettings.stepSizeForScale = 1;
    classViewScale.update(testSettings);

    const $elemScalePoints = classViewScale['_$elemScalePoints'];

    $elemScalePoints.each((index, scalePoint) => {
      const $scalePoint = $(scalePoint);
      expect($scalePoint.text()).toBe(customValues[index]);
    });
  });

  test('Checking the "_setStyleForScale" method => "defaultSettings"', () => {
    classViewScale.update(testSettings);
    const { colorForScale } = testSettings;

    expect($elemScale.prop('style')).toHaveProperty('border-color', colorForScale);
    expect($elemScale.prop('style')).toHaveProperty('color', colorForScale);
    expect($elemScale.prop('style')).toHaveProperty('opacity', '1');
    expect($elemScale.prop('style')).toHaveProperty('pointer-events', '');
    expect($elemScale.html()).not.toMatch(/tabindex/);
  });

  test('Checking the "_setStyleForScale" method => option "colorForScale"', () => {
    testSettings.key = 'colorForScale';
    testSettings.colorForScale = 'red';
    classViewScale.update(testSettings);
    const { colorForScale } = testSettings;

    expect($elemScale.prop('style')).toHaveProperty('border-color', colorForScale);
    expect($elemScale.prop('style')).toHaveProperty('color', colorForScale);
  });

  test('Checking the "_setStyleForScale" method => option "showScale"', () => {
    testSettings.key = 'showScale';
    testSettings.showScale = false;
    classViewScale.update(testSettings);
    const $elemScalePoints = classViewScale['_$elemScalePoints'];

    expect($elemScalePoints.length > 0).toBeTruthy();

    $elemScalePoints.each((_, scalePoint) => {
      expect($(scalePoint).attr('tabindex')).toBe('-1');
    });
    expect($elemScale.prop('style')).toHaveProperty('opacity', '0');
    expect($elemScale.prop('style')).toHaveProperty('pointer-events', 'none');
  });
});

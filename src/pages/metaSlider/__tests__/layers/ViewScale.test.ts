/* eslint-disable @typescript-eslint/dot-notation */
// The tests uses the 'any' type in jest.spyOn so that private methods of the class can be tested
import View from '../../layers/View';
import ViewScale from '../../layers/ViewScale';
import InitSettings from '../../data/InitSettings';
import * as makeThrottlingHandler from '../../utils/makeThrottlingHandler';

jest.mock('../../utils/createUniqueID');
const classMainView = new View();
document.body.innerHTML = '<div id="render-selector"></div>';
const $initSelector = $('#render-selector');
classMainView.renderSlider($initSelector);

describe('Checking the "ViewScale" layer, before first initialization.', () => {
  const notInitViewScale = new ViewScale();

  test('State before first initialization the "update" method', () => {
    expect($initSelector.html()).toMatchSnapshot();
    expect(notInitViewScale['_$selector']).toHaveLength(0);
    expect(notInitViewScale['_$elemSlider']).toHaveLength(0);
    expect(notInitViewScale['_$elemScale']).toHaveLength(0);
    expect(notInitViewScale['_$elemScalePoints']).toHaveLength(0);
    expect(notInitViewScale['_scalePointsSize']).toBe(0);
    expect(notInitViewScale['_mapSkipScalePoints'].size).toBe(0);
    expect(notInitViewScale['_skipScalePointsArray']).toHaveLength(0);
    expect(notInitViewScale['_isFirstInit']).toBe(true);
    expect(notInitViewScale.observerList).toHaveLength(0);
    expect(notInitViewScale['_verifKeysObj']).toBeDefined();
  });
});

describe('Checking the "ViewScale" layer', () => {
  const SLIDER_SIZE_PX = 250;
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
    step: 1,
    stepSizeForScale: 2.5,
    minValue: 1,
    maxValue: 5,
    customValues: [],
    preFix: '',
    postFix: '',
    colorForScale: 'black',
  };

  let testSettings: IPluginOptions;
  let $selector: JQuery<HTMLElement>;
  let $elemSlider: JQuery<HTMLElement>;
  let $elemScale: JQuery<HTMLElement>;
  let sliderID: string | undefined;

  beforeAll(() => {
    testSettings = $.extend({}, InitSettings, defaultSettings);
    classViewScale.update(testSettings);
    $selector = classViewScale['_$selector'];
    $elemSlider = classViewScale['_$elemSlider'];
    $elemScale = classViewScale['_$elemScale'];
    sliderID = $selector.attr('data-id');

    $elemSlider.css('width', `${SLIDER_SIZE_PX}px`);
  });

  afterEach(() => {
    testSettings = $.extend({}, InitSettings, defaultSettings);
    jest.restoreAllMocks();
  });

  test('Checking the "_init" method and the first initialization update method', () => {
    jest.spyOn<ViewScale, any>(classViewScale, '_setEventResize');

    classViewScale['_isFirstInit'] = true;
    classViewScale.update(testSettings);

    expect(classViewScale['_$selector']).toHaveLength(1);
    expect(classViewScale['_$elemSlider']).toHaveLength(1);
    expect(classViewScale['_$elemScale']).toHaveLength(1);
    expect(classViewScale['_isFirstInit']).toBe(false);
    expect(classViewScale['_setEventResize']).toHaveBeenCalledWith(testSettings);
  });

  test('Checking the "_createScale" method => "defaultSettings"', () => {
    jest.spyOn<ViewScale, any>(classViewScale, '_setEventsScalePoints');
    jest.spyOn<ViewScale, any>(classViewScale, '_calcScalePointsSize');
    jest.spyOn(Map.prototype, 'clear');
    jest.spyOn($.fn, 'empty');
    const CONTROL_SIZE_PX = 100;
    const { maxValue, minValue, step } = testSettings;

    expect(classViewScale['_mapSkipScalePoints'].size).toBe(0);
    classViewScale['_mapSkipScalePoints'].set(CONTROL_SIZE_PX, [
      classViewScale['_$elemScalePoints'].eq(0),
    ]);
    expect(classViewScale['_mapSkipScalePoints'].size).not.toBe(0);
    classViewScale.update(testSettings);

    const $elemScalePoints = classViewScale['_$elemScalePoints'];
    let scalePointCounter = 0;

    for (let currentValue = minValue; currentValue <= maxValue; currentValue += step) {
      expect($elemScalePoints.eq(scalePointCounter).attr('data-value')).toBe(String(currentValue));
      expect($elemScalePoints.eq(scalePointCounter).text()).toBe(String(currentValue));

      scalePointCounter += 1;
    }
    expect(classViewScale['_$elemScale'].html()).toMatchSnapshot();
    expect(classViewScale['_$elemScale'].empty).toHaveBeenCalled();
    expect($elemScalePoints).toHaveLength(scalePointCounter);

    $elemScalePoints.each((_, scalePoint) => {
      const $scalePoint = $(scalePoint);
      expect($scalePoint.attr('class')).toMatch(/js-meta-slider__scale-point/);
      expect($scalePoint.attr('data-value')).toBeDefined();
      expect($scalePoint.prop('style')).toHaveProperty('color', '');
      expect($scalePoint.prop('style')).toHaveProperty(
        'left',
        `${((Number($scalePoint.attr('data-value')) - minValue) / (maxValue - minValue)) * 100}%`,
      );
      expect(classViewScale['_calcScalePointsSize']).toHaveBeenCalledWith(scalePoint, testSettings);
    });

    expect(classViewScale['_setEventsScalePoints']).toHaveBeenCalled();
    expect(classViewScale['_mapSkipScalePoints'].clear).toHaveBeenCalled();
    expect(classViewScale['_mapSkipScalePoints'].size).toBe(0);
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
    testSettings.stepSizeForScale = null;
    testSettings.step = 1;
    const { maxValue, minValue } = testSettings;
    classViewScale.update(testSettings);

    const $elemScalePoints = classViewScale['_$elemScalePoints'];
    let scalePointCounter = 0;

    for (let currentValue = minValue; currentValue <= maxValue; currentValue += testSettings.step) {
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

  test.each`
    isVerticalStatus | testScalePointHeight | testScalePointWidth
    ${true}          | ${50}                | ${null}
    ${false}         | ${null}              | ${100}
    ${true}          | ${null}              | ${null}
    ${false}         | ${null}              | ${null}
  `(
    'Checking the "_calcScalePointsSize" method => option "isVertical"',
    ({ isVerticalStatus, testScalePointHeight, testScalePointWidth }) => {
      const $testScalePoint = classViewScale['_$elemScalePoints'].eq(0);

      testSettings.isVertical = isVerticalStatus;
      testSettings.testHeight = testScalePointHeight;
      testSettings.testWidth = testScalePointWidth;
      classViewScale['_calcScalePointsSize']($testScalePoint[0], testSettings);

      const { isVertical, testHeight, testWidth } = testSettings;

      if (isVertical && testHeight) {
        expect(classViewScale['_scalePointsSize']).toBe(testScalePointHeight);
      }

      if (isVertical && !testHeight) {
        expect(classViewScale['_scalePointsSize']).toBe(0);
      }

      if (!isVertical && testWidth) {
        expect(classViewScale['_scalePointsSize']).toBe(testScalePointWidth);
      }

      if (!isVertical && !testWidth) {
        expect(classViewScale['_scalePointsSize']).toBe(0);
      }

      classViewScale['_scalePointsSize'] = 0;
    },
  );

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

  test('Checking the "_checkingScaleSize" method => Main test with "defaultSettings" (if the number of scale points is odd and <= 6)', () => {
    jest.spyOn<ViewScale, any>(classViewScale, '_calcScalePointsSize');
    jest.spyOn<ViewScale, any>(classViewScale, '_setPropForSkipScalePoint');
    jest.spyOn<ViewScale, any>(classViewScale, '_checkingSkipScalePointSize');
    jest.spyOn(Map.prototype, 'set');

    const SCALE_POINTS_SIZE_PX = 200;
    classViewScale.update(testSettings);
    classViewScale['_scalePointsSize'] = SCALE_POINTS_SIZE_PX;

    expect(classViewScale['_skipScalePointsArray']).toHaveLength(0);

    classViewScale['_checkingScaleSize'](testSettings);
    const $elemScalePoints = classViewScale['_$elemScalePoints'];
    const sizeScalePointsArray = classViewScale['_$elemScalePoints'].length;
    const skipScalePointsArray = classViewScale['_skipScalePointsArray'];
    const mapSkipScalePoints = classViewScale['_mapSkipScalePoints'];
    const calcScalePointsSize = classViewScale['_calcScalePointsSize'];
    const checkingSkipScalePointSize = classViewScale['_checkingSkipScalePointSize'];

    $elemScalePoints.each((_, scalePoint) => {
      expect(classViewScale['_setPropForSkipScalePoint']).toHaveBeenCalledWith(scalePoint);
    });

    expect(sizeScalePointsArray > 0).toBeTruthy();
    expect(skipScalePointsArray.length > 0).toBeTruthy();

    skipScalePointsArray.forEach(($scalePointSkip) => {
      expect(calcScalePointsSize).toHaveBeenCalledWith($scalePointSkip[0], testSettings);
    });

    expect(mapSkipScalePoints.set).toHaveBeenCalledWith(expect.any(Number), [
      ...skipScalePointsArray,
    ]);

    expect(checkingSkipScalePointSize).toHaveBeenCalledWith(
      SLIDER_SIZE_PX,
      expect.any(Number),
      testSettings,
    );
  });

  test('Checking the "_checkingScaleSize" method => if the number of scale points is even and > 6"', () => {
    jest.spyOn<ViewScale, any>(classViewScale, '_calcScalePointsSize');
    jest.spyOn<ViewScale, any>(classViewScale, '_setPropForSkipScalePoint');
    testSettings.maxValue = 8;
    classViewScale.update(testSettings);
    const SCALE_POINTS_SIZE_PX = 200;

    classViewScale['_scalePointsSize'] = SCALE_POINTS_SIZE_PX;
    classViewScale['_checkingScaleSize'](testSettings);
    const $elemScalePoints = classViewScale['_$elemScalePoints'];
    const skipScalePointsArray = classViewScale['_skipScalePointsArray'];
    const calcScalePointsSize = classViewScale['_calcScalePointsSize'];

    $elemScalePoints.each((index, scalePoint) => {
      if (index % 2 !== 0) {
        expect(classViewScale['_setPropForSkipScalePoint']).toHaveBeenCalledWith(scalePoint);
      }
    });

    expect(skipScalePointsArray.length > 0).toBeTruthy();
    skipScalePointsArray.forEach(($scalePointSkip) => {
      expect(calcScalePointsSize).toHaveBeenCalledWith($scalePointSkip[0], testSettings);
    });
  });

  test('Checking the "_checkingScaleSize" method => if the number of scale points is odd, <= 6 and this is not the first or last value in the scale "', () => {
    jest.spyOn<ViewScale, any>(classViewScale, '_calcScalePointsSize');
    jest.spyOn<ViewScale, any>(classViewScale, '_setPropForSkipScalePoint');
    testSettings.maxValue = 6;
    classViewScale.update(testSettings);
    const SCALE_POINTS_SIZE_PX = 200;

    classViewScale['_scalePointsSize'] = SCALE_POINTS_SIZE_PX;
    classViewScale['_checkingScaleSize'](testSettings);
    const $elemScalePoints = classViewScale['_$elemScalePoints'];
    const skipScalePointsArray = classViewScale['_skipScalePointsArray'];
    const calcScalePointsSize = classViewScale['_calcScalePointsSize'];

    $elemScalePoints.each((index, scalePoint) => {
      const firstOrLastIndex = index === 0 || index === $elemScalePoints.length - 1;

      if (index % 2 === 0 && !firstOrLastIndex) {
        expect(classViewScale['_setPropForSkipScalePoint']).toHaveBeenCalledWith(scalePoint);
      }
    });

    expect(skipScalePointsArray.length > 0).toBeTruthy();
    skipScalePointsArray.forEach(($scalePointSkip) => {
      expect(calcScalePointsSize).toHaveBeenCalledWith($scalePointSkip[0], testSettings);
    });
  });

  test('Checking the "_setPropForSkipScalePoint" method', () => {
    classViewScale.update(testSettings);
    classViewScale['_skipScalePointsArray'].length = 0;
    const testScalePoint = classViewScale['_$elemScalePoints'][0];
    classViewScale['_setPropForSkipScalePoint'](testScalePoint);

    const $testScalePoint = $(testScalePoint);
    expect($testScalePoint[0].outerHTML).toMatchSnapshot();
    expect($testScalePoint.attr('class')).toMatch(/meta-slider__scale-point_skipped/);
    expect($testScalePoint.attr('tabindex')).toBe('-1');
    expect($testScalePoint.prop('style')).toHaveProperty('color', 'transparent');
    expect(classViewScale['_skipScalePointsArray'].length).toBe(1);
  });

  test('Checking the "_checkingSkipScalePointSize" method', () => {
    jest.spyOn<ViewScale, any>(classViewScale, '_calcScalePointsSize');
    jest.spyOn(Map.prototype, 'delete');
    classViewScale.update(testSettings);

    const CONTROL_SIZE_PX = 100;
    const MARGIN_PX = 100;
    const $testScalePoint = classViewScale['_$elemScalePoints'].eq(0);

    classViewScale['_setPropForSkipScalePoint']($testScalePoint[0]);
    classViewScale['_mapSkipScalePoints'].set(CONTROL_SIZE_PX, [$testScalePoint]);
    expect(classViewScale['_mapSkipScalePoints'].size > 0).toBeTruthy();

    classViewScale['_checkingSkipScalePointSize'](SLIDER_SIZE_PX, MARGIN_PX, testSettings);
    expect($testScalePoint[0].outerHTML).toMatchSnapshot();
    expect($testScalePoint.attr('tabindex')).toBeUndefined();
    expect($testScalePoint.attr('class')).not.toMatch(/meta-slider__scale-point_skipped/);
    expect(classViewScale['_calcScalePointsSize']).toHaveBeenCalledWith(
      $testScalePoint[0],
      testSettings,
    );
    expect(classViewScale['_mapSkipScalePoints'].delete).toHaveBeenCalledWith(CONTROL_SIZE_PX);
    expect(classViewScale['_mapSkipScalePoints'].size).toBe(0);
  });

  test('Checking the "_setEventResize" method, event "resize" => "defaultSettings" => init "_handleWindowResize"', () => {
    jest.spyOn<ViewScale, any>(classViewScale, '_checkingScaleSize');
    const mockMakeThrottlingHandler = jest.spyOn(makeThrottlingHandler, 'default');
    classViewScale.update(testSettings);

    jest.useFakeTimers();
    $(window).trigger(`resize.scale-${sliderID}`);

    jest.advanceTimersByTime(mockMakeThrottlingHandler.mock.calls[0][1]);

    expect(mockMakeThrottlingHandler).toHaveBeenCalled();
    expect(classViewScale['_checkingScaleSize']).toHaveBeenCalledWith(testSettings);
  });

  test('Checking the "_setEventResize" method => option "showScale"', () => {
    jest.spyOn($.fn, 'off');
    testSettings.key = 'showScale';
    testSettings.showScale = false;
    classViewScale.update(testSettings);

    expect($(window).off).toHaveBeenCalledWith(`resize.scale-${sliderID}`);
  });

  test('Checking the "_setEventResize" method => option "initScaleAdjustment"', () => {
    jest.spyOn($.fn, 'off');
    testSettings.key = 'initScaleAdjustment';
    testSettings.showScale = false;
    classViewScale.update(testSettings);

    expect($(window).off).toHaveBeenCalledWith(`resize.scale-${sliderID}`);
  });

  test('Checking the "_setEventsScalePoints" method, event "click" => init "_handleScalePointClick"', () => {
    jest.spyOn(classViewScale, 'notify').mockImplementation();

    classViewScale.update(testSettings);
    const $elemScalePoints = classViewScale['_$elemScalePoints'];

    expect($elemScalePoints.length > 0).toBeTruthy();

    $elemScalePoints.each((_, elemPoint) => {
      const $elemPoint = $(elemPoint);
      const eventClick = $.Event('click.scalePoint');
      eventClick.preventDefault = jest.fn();

      $elemPoint.trigger(eventClick);

      expect(eventClick.preventDefault).toHaveBeenCalled();
      expect(classViewScale.notify).toHaveBeenCalledWith(
        eventClick,
        Number($elemPoint.attr('data-value')),
      );
    });
  });
});

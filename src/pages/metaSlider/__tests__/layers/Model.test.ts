/* eslint-disable @typescript-eslint/dot-notation */
// The tests uses the 'any' type in jest.spyOn so that private methods of the class can be tested
import InitSettings from '../../data/InitSettings';
import View from '../../layers/View';
import Model from '../../layers/Model';

jest.mock('../../utils/createUniqueID');
const classMainView = new View();
document.body.innerHTML = '<div id="render-selector"></div>';
const $selector = $('#render-selector');
classMainView.renderSlider($selector);

describe('Checking the "Model" layer', () => {
  const classModel = new Model($selector, InitSettings);
  InitSettings.$elemSlider = $selector.find('.js-meta-slider');
  InitSettings.$sliderProgress = $selector.find('.js-meta-slider__progress');
  InitSettings.$elemThumbs = $selector.find('.js-meta-slider__thumb');
  InitSettings.$elemMarkers = $selector.find('.js-meta-slider__marker');
  InitSettings.$elemScale = $selector.find('.js-meta-slider__scale');

  afterEach(() => {
    classModel['_opt'] = { ...InitSettings };
    jest.restoreAllMocks();
  });

  test('State before first initialization', () => {
    expect($selector.html()).toMatchSnapshot();
    expect(classModel['_opt']).toBe(InitSettings);
    expect(classModel['_opt'].$selector).toBe($selector);
    expect(classModel['_observerList']).toHaveLength(0);
    expect(classModel['_listSavedStatus']).toBeDefined();
  });

  test('Checking the "init" method', () => {
    jest.spyOn(classModel, 'notify').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_getSliderSelectors').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_checkingIncomingProp').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();

    classModel.init();

    expect(classModel['_opt'].key).toBe('init');
    expect(classModel['_getSliderSelectors']).toHaveBeenCalled();
    expect(classModel['_checkingIncomingProp']).toHaveBeenCalled();
    expect(classModel['_calcValuesInPercentage']).toHaveBeenCalled();
    expect(classModel.notify).toHaveBeenCalledWith(classModel['_opt']);
  });

  test('Checking the "update" method', () => {
    jest.spyOn(classModel, 'notify').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_checkingIncomingProp').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();

    classModel.update();

    expect(classModel['_checkingIncomingProp']).toHaveBeenCalled();
    expect(classModel['_calcValuesInPercentage']).toHaveBeenCalled();
    expect(classModel.notify).toHaveBeenCalledWith(classModel['_opt']);
  });

  test('Checking the "getOptions" method', () => {
    jest.spyOn(classModel, 'getOptions');
    classModel.getOptions();

    expect(classModel.getOptions).toHaveReturnedWith(classModel['_opt']);
  });

  test('Checking the "getProp" method', () => {
    const TEST_PROP = 'mainColor';
    jest.spyOn(classModel, 'getOptions');
    jest.spyOn(classModel, 'getProp');

    classModel.getProp(TEST_PROP);

    expect(classModel.getOptions).toHaveBeenCalled();
    expect(classModel.getProp).toHaveReturnedWith(classModel['_opt'][TEST_PROP]);
  });

  test.each`
    testProp       | testValue
    ${'minValue'}  | ${1}
    ${'maxValue'}  | ${10}
    ${'step'}      | ${5}
    ${'mainColor'} | ${'red'}
  `('Checking the "setProp" method', ({ testProp, testValue }) => {
    classModel.setProp(testProp, testValue);

    expect(classModel['_opt'][testProp]).toBe(testValue);
  });

  // The test uses the @ts-ignore rule so that a fake event can be passed to the test method
  test.each`
    checkingValue | expected | isVertical | onlyReturn   | outerWidth   | offset
    ${50}         | ${50}    | ${false}   | ${true}      | ${825}       | ${{ top: 205, left: 85 }}
    ${50}         | ${50}    | ${true}    | ${false}     | ${825}       | ${{ top: 205, left: 85 }}
    ${-50}        | ${0}     | ${false}   | ${false}     | ${825}       | ${{ top: 205, left: 85 }}
    ${150}        | ${100}   | ${false}   | ${false}     | ${undefined} | ${undefined}
    ${150}        | ${100}   | ${false}   | ${false}     | ${undefined} | ${{ top: 205, left: undefined }}
    ${undefined}  | ${40}    | ${true}    | ${undefined} | ${825}       | ${{ top: 205, left: 85 }}
    ${undefined}  | ${59}    | ${false}   | ${undefined} | ${825}       | ${{ top: 205, left: 85 }}
    ${-50}        | ${0}     | ${false}   | ${true}      | ${825}       | ${{ top: 205, left: 85 }}
    ${150}        | ${100}   | ${false}   | ${true}      | ${825}       | ${{ top: 205, left: 85 }}
  `(
    'Checking the "calcTargetValue" method => checkingValue: $checkingValue, isVertical: $isVertical, onlyReturn: $onlyReturn',
    ({ checkingValue, expected, isVertical, onlyReturn, outerWidth, offset }) => {
      jest.spyOn(classModel, 'calcTargetValue');
      jest.spyOn<Model, any>(classModel, '_checkingTargetValue').mockImplementation();

      const mockGetBoundingClientRect = jest
        .spyOn(Element.prototype, 'getBoundingClientRect')
        .mockImplementation(() => ({
          bottom: 535.71875,
          height: 824.5,
          left: 490.25,
          right: 500.25,
          top: -288.78125,
          width: 10,
          x: 490.25,
          y: -288.78125,
          toJSON() {},
        }));
      const mockOuterWidth = jest.spyOn($.fn, 'outerWidth').mockImplementation(() => outerWidth);
      const mockOffset = jest.spyOn($.fn, 'offset').mockImplementation(() => offset);

      const fakeEvent = $.Event('click', {
        target: classModel['_opt'].$elemThumbs[0],
        clientY: 205,
        clientX: 575,
      });

      classModel['_opt'].isVertical = isVertical;
      classModel['_opt'].minValue = 0;
      classModel['_opt'].maxValue = 100;
      classModel['_opt'].step = 1;
      classModel['_opt'].stepAsPercent = 1;
      classModel['_opt'].numberOfDecimalPlaces = 0;

      // @ts-ignore
      classModel.calcTargetValue(onlyReturn, checkingValue, fakeEvent);

      if (isVertical) {
        expect(mockGetBoundingClientRect).toHaveBeenCalled();
      } else {
        expect(mockOffset).toHaveBeenCalled();
        expect(mockOuterWidth).toHaveBeenCalled();
      }

      if (onlyReturn) {
        expect(classModel.calcTargetValue).toHaveReturnedWith(expected);
      } else {
        expect(classModel.calcTargetValue).toHaveReturnedWith(null);
        expect(classModel['_checkingTargetValue']).toHaveBeenCalledWith(expected);
      }
    },
  );

  // The test uses the @ts-ignore rule so that a fake event can be passed to the test method
  test.each`
    eventCode       | expected
    ${'ArrowLeft'}  | ${40}
    ${'ArrowRight'} | ${60}
    ${'ArrowUp'}    | ${60}
    ${'ArrowDown'}  | ${40}
  `('Checking the "calcTargetValue" method => KeyboardEvent', ({ eventCode, expected }) => {
    jest.spyOn(classModel, 'calcTargetValue');
    jest.spyOn<Model, any>(classModel, '_checkingTargetValue').mockImplementation();

    const CONTROL_VALUE = 50;
    classModel['_opt'].step = 10;
    classModel['_opt'].stepAsPercent = 10;
    classModel['_opt'].minValue = 0;
    classModel['_opt'].maxValue = 100;
    classModel['_opt'].numberOfDecimalPlaces = 0;

    const fakeEvent = $.Event('keydown', { code: eventCode });
    const listEventCode = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const [codeLeft, codeRight, codeUp, codeDown] = listEventCode;
    const eventCodeReducingValue = eventCode === codeLeft || eventCode === codeDown;
    const eventCodeIncreasingValue = eventCode === codeRight || eventCode === codeUp;

    // @ts-ignore
    classModel.calcTargetValue(false, CONTROL_VALUE, fakeEvent);

    if (eventCodeReducingValue) {
      expect(classModel['_checkingTargetValue']).toHaveBeenCalledWith(expected);
    }

    if (eventCodeIncreasingValue) {
      expect(classModel['_checkingTargetValue']).toHaveBeenCalledWith(expected);
    }
  });

  test.each`
    checkingValue | valueFirst | valueSecond | testIsRange | activeThumb
    ${50}         | ${0}       | ${100}      | ${true}     | ${'first'}
    ${50}         | ${0}       | ${100}      | ${true}     | ${'second'}
    ${50}         | ${0}       | ${100}      | ${true}     | ${''}
    ${5}          | ${20}      | ${50}       | ${true}     | ${''}
    ${80}         | ${20}      | ${30}       | ${true}     | ${''}
    ${50}         | ${10}      | ${80}       | ${true}     | ${''}
    ${40}         | ${0}       | ${100}      | ${false}    | ${''}
    ${90}         | ${0}       | ${100}      | ${false}    | ${''}
  `(
    'Checking the "_checkingTargetValue" method => checkingValue: $checkingValue, isRange: $testIsRange, activeThumb: $activeThumb',
    ({ checkingValue, valueFirst, valueSecond, testIsRange, activeThumb }) => {
      jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();
      jest.spyOn<Model, any>(classModel, '_setCurrentValues').mockImplementation();

      classModel['_opt'].initValueFirst = valueFirst;
      classModel['_opt'].initValueSecond = valueSecond;
      classModel['_opt'].minValue = 0;
      classModel['_opt'].maxValue = 100;
      classModel['_opt'].isRange = testIsRange;
      classModel['_opt'].initValuesArray = [valueFirst, valueSecond];
      classModel['_listSavedStatus']['activeThumb'] = activeThumb;
      const averageValue = (valueFirst + valueSecond) / 2;

      classModel['_checkingTargetValue'](checkingValue);
      const statusActiveThumb = classModel['_listSavedStatus']['activeThumb'];
      const currentActiveThumb = {
        FIRST: 'first',
        SECOND: 'second',
      };

      // prettier-ignore
      const { 
        initValuesArray,
        initValueFirst,
        initValueSecond,
        isRange,
      } = classModel['_opt'];

      const checkingValueLessThanAverage = checkingValue < averageValue;
      const checkingValueMoreThanAverage = checkingValue > averageValue;

      if (checkingValueLessThanAverage && isRange) {
        expect(initValuesArray).toEqual([checkingValue, initValueSecond]);
        expect(statusActiveThumb).toBe('first');
      } else if (checkingValueMoreThanAverage || !isRange) {
        expect(initValuesArray).toEqual([initValueFirst, checkingValue]);
        expect(statusActiveThumb).toBe('second');
      }

      if (checkingValue === averageValue) {
        if (statusActiveThumb === currentActiveThumb.FIRST) {
          expect(initValuesArray).toEqual([checkingValue, initValueSecond]);
        } else if (statusActiveThumb === currentActiveThumb.SECOND) {
          expect(initValuesArray).toEqual([initValueFirst, checkingValue]);
        } else {
          expect(initValuesArray).toEqual([checkingValue, initValueSecond]);
        }
      }

      expect(classModel['_calcValuesInPercentage']).toHaveBeenCalled();
      expect(classModel['_setCurrentValues']).toHaveBeenCalled();
    },
  );

  test('Checking the "_calcValuesInPercentage" method', () => {
    classModel['_opt'].minValue = 0;
    classModel['_opt'].maxValue = 200;
    classModel['_opt'].initValuesArray = [0, 100];

    classModel['_calcValuesInPercentage']();
    const { valuesAsPercentageArray } = classModel['_opt'];

    expect(valuesAsPercentageArray).toEqual([0, 50]);
  });

  test('Checking the "_setCurrentValues" method', () => {
    jest.spyOn(classModel, 'notify').mockImplementation();
    classModel['_opt'].initValuesArray = [1, 2];
    classModel['_opt'].customValues = [0, 100, 200];

    classModel['_setCurrentValues']();

    const {
      key,
      initValuesArray,
      initValueFirst,
      initValueSecond,
      textValueFirst,
      textValueSecond,
      textValuesArray,
      customValues,
    } = classModel['_opt'];

    expect(key).toBe('changedValue');
    expect(initValueFirst).toBe(initValuesArray[0]);
    expect(initValueSecond).toBe(initValuesArray[1]);
    expect(textValueFirst).toBe(String(customValues[initValuesArray[0]]));
    expect(textValueSecond).toBe(String(customValues[initValuesArray[1]]));
    expect(textValuesArray).toEqual([textValueFirst, textValueSecond]);
    expect(classModel.notify).toHaveBeenCalledWith(classModel['_opt']);
  });

  test.each(['init', 'step', 'maxValue', 'minValue', 'customValues', 'numberOfDecimalPlaces'])(
    'Checking the "_calcStepAsPercentage" method => key: %p',
    (key) => {
      classModel['_opt'].key = key;
      classModel['_opt'].minValue = 0;
      classModel['_opt'].maxValue = 100;
      classModel['_opt'].step = 5;

      classModel['_calcStepAsPercentage']();
      const { stepAsPercent } = classModel['_opt'];

      expect(stepAsPercent).toBe(5);
    },
  );

  test('Checking the "_checkingIncomingProp" method', () => {
    jest.spyOn<Model, any>(classModel, '_checkingIsVerticalSlider').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_checkingNumberOfDecimalPlaces').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_checkingMinMaxValues').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_checkingStepSize').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_checkingCustomValues').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_calcStepAsPercentage').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_checkingInitValues').mockImplementation();

    classModel['_checkingIncomingProp']();

    expect(classModel['_checkingIsVerticalSlider']).toHaveBeenCalled();
    expect(classModel['_checkingNumberOfDecimalPlaces']).toHaveBeenCalled();
    expect(classModel['_checkingMinMaxValues']).toHaveBeenCalled();
    expect(classModel['_checkingStepSize']).toHaveBeenCalled();
    expect(classModel['_checkingCustomValues']).toHaveBeenCalled();
    expect(classModel['_calcStepAsPercentage']).toHaveBeenCalled();
    expect(classModel['_checkingInitValues']).toHaveBeenCalled();
  });

  test('Checking the "_getSliderSelectors" method', () => {
    const mockFind = jest.spyOn($.fn, 'find');
    classModel['_opt'].$elemSlider = $();
    classModel['_opt'].$sliderProgress = $();
    classModel['_opt'].$elemThumbs = $();
    classModel['_opt'].$elemMarkers = $();
    classModel['_opt'].$elemScale = $();

    expect(classModel['_opt'].$elemSlider).toHaveLength(0);
    expect(classModel['_opt'].$sliderProgress).toHaveLength(0);
    expect(classModel['_opt'].$elemThumbs).toHaveLength(0);
    expect(classModel['_opt'].$elemMarkers).toHaveLength(0);
    expect(classModel['_opt'].$elemScale).toHaveLength(0);

    classModel['_getSliderSelectors']();

    expect(mockFind).toBeCalledTimes(5);
    expect(classModel['_opt'].$elemSlider).toHaveLength(1);
    expect(classModel['_opt'].$sliderProgress).toHaveLength(1);
    expect(classModel['_opt'].$elemThumbs).toHaveLength(2);
    expect(classModel['_opt'].$elemMarkers).toHaveLength(2);
    expect(classModel['_opt'].$elemScale).toHaveLength(1);
  });

  test.each(['init', 'initAutoMargins', 'isVertical'])(
    'Checking the "_checkingIsVerticalSlider" method => isVertical and initAutoMargins: true/false => key: %p',
    (key) => {
      classModel['_opt'].key = key;

      [true, false].forEach((status) => {
        classModel['_opt'].isVertical = !status;
        classModel['_opt'].initAutoMargins = status;
        classModel['_checkingIsVerticalSlider']();

        const { initAutoMargins } = classModel['_opt'];
        const statusAutoMargins = classModel['_listSavedStatus']['autoMargins'];

        expect(classModel['_listSavedStatus']).toHaveProperty('autoMargins', initAutoMargins);
        expect(initAutoMargins).toBe(statusAutoMargins);
      });
    },
  );

  test.each([
    'init',
    'numberOfDecimalPlaces',
    'calcNumberOfDecimalPlaces',
    'initValueFirst',
    'initValueSecond',
    'minValue',
    'maxValue',
    'step',
  ])('Checking the "_checkingNumberOfDecimalPlaces" method => key: %p', (key) => {
    jest.spyOn<Model, any>(classModel, '_getNumberOfDecimalPlaces').mockImplementation();
    jest.spyOn(Number.prototype, 'toFixed');
    const mockIsInteger = jest.spyOn(Number, 'isInteger');
    const numberOfDecimalPlacesCheckingList = [-5, 5, 0, 2.5];
    const listVerifKeys = ['init', 'numberOfDecimalPlaces'];
    const isInit = key === 'init';
    const controlNumbers = {
      ZERO: 0,
      FRACTIONAL: 2.5,
      NEGATIVE: -5,
    };

    classModel['_opt'].key = key;

    numberOfDecimalPlacesCheckingList.forEach((currentNum) => {
      classModel['_opt'].numberOfDecimalPlaces = currentNum;
      const { numberOfDecimalPlaces } = classModel['_opt'];

      [true, false].forEach((status) => {
        const TESTING_KEY = 'numberOfDecimalPlaces';
        const isNotTestingKey = key !== TESTING_KEY;
        classModel['_opt'].calcNumberOfDecimalPlaces = status;

        classModel['_checkingNumberOfDecimalPlaces']();

        if (isNotTestingKey && classModel['_opt'].calcNumberOfDecimalPlaces) {
          expect(classModel['_getNumberOfDecimalPlaces']).toHaveBeenCalled();
        }
      });

      const currentNumIsNotZero = currentNum !== controlNumbers.ZERO;

      if (currentNumIsNotZero && isInit) {
        expect(classModel['_opt'].calcNumberOfDecimalPlaces).toBe(false);
      }

      if (listVerifKeys.includes(key)) {
        if (currentNum === controlNumbers.FRACTIONAL) {
          expect(numberOfDecimalPlaces.toFixed).toHaveBeenCalled();
        }

        if (currentNum === controlNumbers.NEGATIVE) {
          expect(mockIsInteger).toHaveBeenCalledWith(0);
        } else {
          expect(mockIsInteger).toHaveBeenCalledWith(currentNum);
        }
      }
    });
  });

  test.each`
    testProp      | testValue | expected
    ${'minValue'} | ${1}      | ${0}
    ${'maxValue'} | ${1.5}    | ${1}
    ${'step'}     | ${2.253}  | ${3}
    ${'step'}     | ${2.25}   | ${2}
  `(
    'Checking the "_getNumberOfDecimalPlaces" method => testProp: $testProp, testValue: $testValue',
    ({ testProp, testValue, expected }) => {
      classModel['_opt'][testProp] = testValue;

      classModel['_getNumberOfDecimalPlaces']();

      expect(classModel['_opt'].numberOfDecimalPlaces).toBe(expected);
    },
  );

  test.each`
    key                        | testMinValue | testMaxValue | valueFirst | valueSecond
    ${'init'}                  | ${0}         | ${100}       | ${10}      | ${80}
    ${'init'}                  | ${20}        | ${100}       | ${10}      | ${80}
    ${'init'}                  | ${0}         | ${70}        | ${10}      | ${80}
    ${'init'}                  | ${100}       | ${100}       | ${null}    | ${null}
    ${'minValue'}              | ${200}       | ${100}       | ${10}      | ${80}
    ${'maxValue'}              | ${200}       | ${100}       | ${10}      | ${80}
    ${'numberOfDecimalPlaces'} | ${0}         | ${100}       | ${50}      | ${100}
  `(
    'Checking the "_checkingMinMaxValues" method => key: $key, minValue: $testMinValue, maxValue: $testMaxValue, initValueFirst: $valueFirst, initValueSecond: $valueSecond',
    ({ key, testMinValue, testMaxValue, valueFirst, valueSecond }) => {
      jest.spyOn(Number.prototype, 'toFixed');

      classModel['_opt'].key = key;
      classModel['_opt'].initValueFirst = valueFirst;
      classModel['_opt'].initValueSecond = valueSecond;
      classModel['_opt'].minValue = testMinValue;
      classModel['_opt'].maxValue = testMaxValue;
      classModel['_opt'].numberOfDecimalPlaces = 2;

      classModel['_checkingMinMaxValues']();

      // prettier-ignore
      const { 
        initValueFirst,
        initValueSecond,
        minValue,
        maxValue,
        numberOfDecimalPlaces,
      } = classModel['_opt'];

      const isInit = key === 'init';
      const minValueIsIncorrect = initValueFirst && testMinValue > initValueFirst && isInit;
      const maxValueIsIncorrect = initValueSecond && testMaxValue < initValueSecond && isInit;

      if (minValueIsIncorrect) expect(minValue).toBe(initValueFirst);
      if (maxValueIsIncorrect) expect(maxValue).toBe(initValueSecond);

      expect(minValue.toFixed).toHaveBeenCalledWith(numberOfDecimalPlaces);
      expect(maxValue.toFixed).toHaveBeenCalledWith(numberOfDecimalPlaces);

      if (minValue >= maxValue) {
        if (!initValueFirst || !initValueSecond) {
          expect(minValue).toBe(0);
          expect(maxValue).toBe(100);
        } else {
          expect(minValue).toBe(initValueFirst);
          expect(maxValue).toBe(initValueSecond);
        }
      }
    },
  );

  test.each`
    testKey        | statusScale
    ${'init'}      | ${false}
    ${'showScale'} | ${true}
  `(
    'Checking the "_checkingShowScaleStatus" method => key: $testKey, showScale: $statusScale',
    ({ testKey, statusScale }) => {
      classModel['_opt'].key = testKey;
      classModel['_opt'].showScale = statusScale;
      classModel['_opt'].initAutoScaleCreation = true;
      classModel['_opt'].initScaleAdjustment = true;
      classModel['_opt'].checkingStepSizeForScale = false;

      classModel['_checkingShowScaleStatus']();

      const {
        key,
        showScale,
        initAutoScaleCreation,
        initScaleAdjustment,
        checkingStepSizeForScale,
      } = classModel['_opt'];

      const SHOW_SCALE_KEY = 'showScale';
      const listVerifKeys = ['init', 'showScale'];
      const isShowScaleKey = showScale && key === SHOW_SCALE_KEY;

      if (!showScale && listVerifKeys.includes(key)) {
        expect(initAutoScaleCreation).toBe(false);
        expect(initScaleAdjustment).toBe(false);
        expect(checkingStepSizeForScale).toBe(false);

        expect(classModel['_listSavedStatus']['initAutoScaleCreation']).toBe(true);
        expect(classModel['_listSavedStatus']['initScaleAdjustment']).toBe(true);
        expect(classModel['_listSavedStatus']['checkingStepSizeForScale']).toBe(false);
      } else if (isShowScaleKey) {
        expect(initAutoScaleCreation).toBe(classModel['_listSavedStatus']['initAutoScaleCreation']);
        expect(initScaleAdjustment).toBe(classModel['_listSavedStatus']['initScaleAdjustment']);
        expect(checkingStepSizeForScale).toBe(
          classModel['_listSavedStatus']['checkingStepSizeForScale'],
        );
      }
    },
  );

  test.each`
    key                        | min   | max    | stepForScale | stepValue | initAutoScale | checkingStep
    ${'init'}                  | ${0}  | ${100} | ${null}      | ${-5}     | ${true}       | ${true}
    ${'init'}                  | ${0}  | ${100} | ${10}        | ${10}     | ${true}       | ${false}
    ${'initAutoScaleCreation'} | ${0}  | ${100} | ${10}        | ${10}     | ${false}      | ${true}
    ${'step'}                  | ${0}  | ${100} | ${10}        | ${0}      | ${false}      | ${true}
    ${'stepSizeForScale'}      | ${80} | ${100} | ${25}        | ${10}     | ${false}      | ${true}
    ${'maxValue'}              | ${80} | ${100} | ${10}        | ${25}     | ${false}      | ${true}
    ${'minValue'}              | ${0}  | ${100} | ${10}        | ${10}     | ${false}      | ${true}
    ${'numberOfDecimalPlaces'} | ${0}  | ${100} | ${10}        | ${10}     | ${true}       | ${true}
  `(
    'Checking the "_checkingStepSize" method => key: $key, minValue: $min, maxValue: $max, stepSizeForScale: $stepForScale, step: $stepValue, initAutoScaleCreation: $initAutoScale, checkingStepSizeForScale: $checkingStep',
    ({ key, min, max, stepForScale, stepValue, initAutoScale, checkingStep }) => {
      jest.spyOn<Model, any>(classModel, '_checkingCorrectStepSizeForScale').mockImplementation();
      jest.spyOn(Number.prototype, 'toFixed');

      classModel['_opt'].key = key;
      classModel['_opt'].minValue = min;
      classModel['_opt'].maxValue = max;
      classModel['_opt'].stepSizeForScale = stepForScale;
      classModel['_opt'].step = stepValue;
      classModel['_opt'].initAutoScaleCreation = initAutoScale;
      classModel['_opt'].checkingStepSizeForScale = checkingStep;
      classModel['_opt'].numberOfDecimalPlaces = 2;

      const diffMinAndMax = classModel['_opt'].maxValue - classModel['_opt'].minValue;
      const isInit = key === 'init';

      classModel['_checkingStepSize']();

      if (stepForScale && isInit) {
        expect(classModel['_opt'].initAutoScaleCreation).toBe(false);
      }

      const {
        stepSizeForScale: stepScale,
        step,
        initAutoScaleCreation,
        checkingStepSizeForScale,
        numberOfDecimalPlaces,
      } = classModel['_opt'];

      expect(step.toFixed).toHaveBeenCalledWith(numberOfDecimalPlaces);

      const isIncorrectStepSize = step <= 0 || step > diffMinAndMax;

      if (!stepForScale) expect(stepScale).toBe(step);
      if (isIncorrectStepSize) expect(step).toBe(diffMinAndMax);
      if (initAutoScaleCreation) {
        expect(checkingStepSizeForScale).toBe(false);
        expect(stepScale).toBe(step);
      }

      const isIncorrectStepScale = stepScale && (stepScale <= 0 || stepScale > diffMinAndMax);

      if (isIncorrectStepScale) expect(stepScale).toBe(diffMinAndMax);
      if (checkingStepSizeForScale && !initAutoScaleCreation) {
        expect(classModel['_checkingCorrectStepSizeForScale']).toHaveBeenCalled();
      } else {
        expect(classModel['_checkingCorrectStepSizeForScale']).not.toHaveBeenCalled();
      }
    },
  );

  test.each`
    stepForScale | expected
    ${1}         | ${1}
    ${1.2}       | ${2}
    ${3}         | ${4}
    ${5.567}     | ${10}
    ${-3}        | ${-3}
  `(
    'Checking the "_checkingCorrectStepSizeForScale" method => stepSizeForScale: $stepForScale',
    ({ stepForScale, expected }) => {
      jest.spyOn(Number.prototype, 'toFixed');
      const mockIsInteger = jest.spyOn(Number, 'isInteger');

      classModel['_opt'].stepSizeForScale = stepForScale;
      classModel['_opt'].minValue = 0;
      classModel['_opt'].maxValue = 100;

      classModel['_checkingCorrectStepSizeForScale']();
      const { maxValue, minValue, stepSizeForScale } = classModel['_opt'];

      expect(mockIsInteger).toHaveBeenNthCalledWith(1, stepForScale);

      if (!Number.isInteger((maxValue - minValue) / stepForScale) && stepForScale > 0) {
        expect(stepSizeForScale).toBe(expected);

        if (!Number.isInteger(stepForScale) && stepSizeForScale) {
          expect(stepSizeForScale.toFixed).toHaveBeenCalledWith(1);
        }
      }
    },
  );

  test.each`
    key               | testCustomValues   | expected
    ${'init'}         | ${['a', 'b', 'c']} | ${['a', 'b', 'c']}
    ${'init'}         | ${[' ']}           | ${[]}
    ${'init'}         | ${['']}            | ${[]}
    ${'customValues'} | ${'c, b, a'}       | ${['c', 'b', 'a']}
  `(
    'Checking the "_checkingCustomValues" method => key: $key, customValues: $testCustomValues',
    ({ key, testCustomValues, expected }) => {
      jest.spyOn<Model, any>(classModel, '_initCustomValues').mockImplementation();

      classModel['_opt'].key = key;
      classModel['_opt'].customValues = testCustomValues;

      classModel['_checkingCustomValues']();
      const { customValues } = classModel['_opt'];

      expect(customValues).toEqual(expected);

      if (customValues.length > 0) expect(classModel['_initCustomValues']).toHaveBeenCalled();
    },
  );

  test.each([[[1]], [['a', 'b', 'c']], [['abc']]])(
    'Checking the "_initCustomValues" method => customValues: %p',
    (testValue) => {
      classModel['_opt'].customValues = [...testValue];

      classModel['_initCustomValues']();

      const {
        customValues,
        minValue,
        maxValue,
        initAutoScaleCreation,
        initScaleAdjustment,
        checkingStepSizeForScale,
        initFormatted,
        calcNumberOfDecimalPlaces,
        numberOfDecimalPlaces,
        step,
        stepSizeForScale,
      } = classModel['_opt'];

      expect(minValue).toBe(0);
      expect(maxValue).toBe(customValues.length - 1);
      expect(initAutoScaleCreation).toBe(false);
      expect(initScaleAdjustment).toBe(false);
      expect(checkingStepSizeForScale).toBe(false);
      expect(initFormatted).toBe(false);
      expect(calcNumberOfDecimalPlaces).toBe(false);
      expect(numberOfDecimalPlaces).toBe(0);
      expect(step).toBe(1);
      expect(stepSizeForScale).toBe(1);

      if (testValue.length === 1) {
        expect(customValues).toEqual([testValue[0], testValue[0]]);
      }
    },
  );

  /**
   * The test uses the @ts-ignore rule so that the implementation
   * can be correctly replaced in the method under test
   */
  test.each`
    key                        | valFirst | valSec  | min   | max    | range    | customVal
    ${'init'}                  | ${10}    | ${50}   | ${0}  | ${100} | ${true}  | ${[]}
    ${'isRange'}               | ${10}    | ${50}   | ${0}  | ${100} | ${false} | ${[]}
    ${'customValues'}          | ${10}    | ${50}   | ${0}  | ${100} | ${true}  | ${[1, 2]}
    ${'initValueFirst'}        | ${null}  | ${null} | ${0}  | ${100} | ${true}  | ${[]}
    ${'initValueSecond'}       | ${60}    | ${50}   | ${0}  | ${100} | ${true}  | ${[]}
    ${'initValueSecond'}       | ${10}    | ${150}  | ${0}  | ${100} | ${true}  | ${[]}
    ${'initValueSecond'}       | ${10}    | ${50}   | ${50} | ${100} | ${true}  | ${[]}
    ${'minValue'}              | ${-50}   | ${50}   | ${0}  | ${100} | ${true}  | ${[]}
    ${'maxValue'}              | ${150}   | ${50}   | ${0}  | ${100} | ${true}  | ${[]}
    ${'step'}                  | ${10}    | ${50}   | ${0}  | ${100} | ${true}  | ${[]}
    ${'numberOfDecimalPlaces'} | ${10}    | ${50}   | ${0}  | ${100} | ${true}  | ${[]}
  `(
    'Checking the "_checkingInitValues" method => key: $key, initValueFirst: $valFirst, initValueSecond: $valSec, isRange: $range, customValues: $customVal',
    ({ key, valFirst, valSec, min, max, range, customVal }) => {
      jest
        .spyOn(classModel, 'calcTargetValue')
        // @ts-ignore
        .mockImplementation((_, initValue) => initValue);

      classModel['_opt'].key = key;
      classModel['_opt'].initValueFirst = valFirst;
      classModel['_opt'].initValueSecond = valSec;
      classModel['_opt'].minValue = min;
      classModel['_opt'].maxValue = max;
      classModel['_opt'].isRange = range;
      classModel['_opt'].customValues = customVal;

      classModel['_checkingInitValues']();

      const {
        initValueFirst,
        initValueSecond,
        minValue,
        maxValue,
        customValues,
        initValuesArray,
        textValueFirst,
        textValueSecond,
        textValuesArray,
        isRange,
      } = classModel['_opt'];

      if (!valFirst) expect(initValueFirst).toBe(minValue);
      if (!valSec) expect(initValueSecond).toBe(maxValue);

      const firstValueIsIncorrect = valFirst > maxValue || valFirst < minValue;
      const secondValueIsIncorrect = valSec > maxValue || valSec < minValue;
      const valuesOverlap = valFirst > valSec;

      if (firstValueIsIncorrect || valuesOverlap) expect(initValueFirst).toBe(minValue);
      if (secondValueIsIncorrect || valuesOverlap) expect(initValueSecond).toBe(maxValue);
      if (!isRange) expect(initValueFirst).toBe(minValue);

      expect(classModel.calcTargetValue).toHaveBeenNthCalledWith(1, true, initValueFirst);
      expect(classModel.calcTargetValue).toHaveBeenNthCalledWith(2, true, initValueSecond);

      const initValuesIsDefined = initValueFirst && initValueSecond;
      const hasCustomValues = customValues.length > 0;

      if (hasCustomValues && initValuesIsDefined) {
        expect(textValueFirst).toBe(String(customValues[initValueFirst]));
        expect(textValueSecond).toBe(String(customValues[initValueSecond]));
        expect(textValuesArray).toEqual([textValueFirst, textValueSecond]);
      } else {
        expect(textValueFirst).toBe('');
        expect(textValueSecond).toBe('');
        expect(textValuesArray).toEqual([]);
      }

      expect(initValuesArray).toEqual([initValueFirst, initValueSecond]);
    },
  );
});

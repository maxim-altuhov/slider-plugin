/* eslint-disable @typescript-eslint/dot-notation */
import initSettings from '../../data/initSettings';
import ViewSlider from '../../layers/ViewSlider';
import Model from '../../layers/Model';

const classViewSlider = new ViewSlider();
document.body.innerHTML = '<div id="render-selector"></div>';
const $selector = $('#render-selector');
classViewSlider.renderSlider($selector);

describe('Checking the "Model" layer', () => {
  const classModel = new Model($selector, initSettings);
  initSettings.$elemSlider = $selector.find('.js-meta-slider');
  initSettings.$sliderProgress = $selector.find('.js-meta-slider__progress');
  initSettings.$elemThumbs = $selector.find('.js-meta-slider__thumb');
  initSettings.$elemMarkers = $selector.find('.js-meta-slider__marker');
  initSettings.$elemScale = $selector.find('.js-meta-slider__scale');

  afterEach(() => {
    classModel.opt = { ...initSettings };
    jest.restoreAllMocks();
  });

  test('State before first initialization', () => {
    expect($selector.html()).toMatchSnapshot();
    expect(classModel.opt).toBe(initSettings);
    expect(classModel.opt.$selector).toBe($selector);
    expect(classModel.observerList).toHaveLength(0);
    expect(classModel.errorEvent).toBeDefined();
    expect(classModel['_listSavedStatus']).toBeDefined();
  });

  test('Checking the "init" method', () => {
    jest.spyOn(classModel, 'notify').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_getSliderSelectors').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_checkingIncomingProp').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();

    classModel.init();

    expect(classModel.opt.key).toBe('init');
    expect(classModel['_getSliderSelectors']).toHaveBeenCalled();
    expect(classModel['_checkingIncomingProp']).toHaveBeenCalled();
    expect(classModel['_calcValuesInPercentage']).toHaveBeenCalled();
    expect(classModel.notify).toHaveBeenCalledWith(classModel.opt);
  });

  test('Checking the "update" method', () => {
    jest.spyOn(classModel, 'notify').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_checkingIncomingProp').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();

    classModel.update();

    expect(classModel['_checkingIncomingProp']).toHaveBeenCalled();
    expect(classModel['_calcValuesInPercentage']).toHaveBeenCalled();
    expect(classModel.notify).toHaveBeenCalledWith(classModel.opt);
  });

  test.each([50, undefined])(
    'Checking the "calcTargetValue" method => initValue is defined/undefined => checkingValue: %p',
    (checkingValue) => {
      jest.spyOn(classModel, 'calcTargetValue');
      jest.spyOn<Model, any>(classModel, '_checkingTargetValue').mockImplementation();
      const mockOuterWidth = jest.spyOn($.fn, 'outerWidth').mockImplementation(() => 825);
      const mockOffset = jest
        .spyOn($.fn, 'offset')
        .mockImplementation(() => ({ top: 205, left: 85 }));

      const fakeEvent = $.Event('click', {
        target: classModel.opt.$elemThumbs[0],
        clientY: 205,
        clientX: 575,
      });

      classModel.opt.isVertical = false;
      classModel.opt.minValue = 0;
      classModel.opt.maxValue = 100;
      classModel.opt.step = 1;
      classModel.opt.stepAsPercent = 1;
      classModel.opt.numberOfDecimalPlaces = 0;

      // @ts-ignore
      classModel.calcTargetValue(fakeEvent, checkingValue);

      expect(classModel.calcTargetValue).toHaveReturnedWith(null);
      expect(mockOffset).toHaveBeenCalled();
      expect(mockOuterWidth).toHaveBeenCalled();

      if (checkingValue) {
        expect(classModel['_checkingTargetValue']).toHaveBeenCalledWith(checkingValue);
      } else {
        expect(classModel['_checkingTargetValue']).toHaveBeenCalledWith(59);
      }
    },
  );

  test('Checking the "calcTargetValue" method => isVertical = true', () => {
    jest.spyOn<Model, any>(classModel, '_checkingTargetValue').mockImplementation();

    const fakeEvent = $.Event('click', {
      target: classModel.opt.$elemThumbs[0],
      clientY: 205,
      clientX: 575,
    });

    classModel.opt.isVertical = true;
    classModel.opt.minValue = 0;
    classModel.opt.maxValue = 100;
    classModel.opt.step = 1;
    classModel.opt.stepAsPercent = 1;
    classModel.opt.numberOfDecimalPlaces = 0;
    const TEST_VALUE = 50;

    // @ts-ignore
    classModel.calcTargetValue(fakeEvent, TEST_VALUE);

    expect(classModel['_checkingTargetValue']).toHaveBeenCalledWith(TEST_VALUE);
  });

  test.each([-50, 50, 150])(
    'Checking the "calcTargetValue" method => onlyReturn = true => checkingValue: %p',
    (checkingValue) => {
      jest.spyOn(classModel, 'calcTargetValue');

      classModel.opt.isVertical = false;
      classModel.opt.minValue = -20;
      classModel.opt.maxValue = 100;
      classModel.opt.step = 1;
      classModel.opt.stepAsPercent = 1;
      classModel.opt.numberOfDecimalPlaces = 0;

      classModel.calcTargetValue(null, checkingValue, true);
      const { minValue, maxValue } = classModel.opt;

      if (checkingValue < minValue) {
        expect(classModel.calcTargetValue).toHaveReturnedWith(minValue);
      } else if (checkingValue > maxValue) {
        expect(classModel.calcTargetValue).toHaveReturnedWith(maxValue + minValue);
      } else {
        expect(classModel.calcTargetValue).toHaveReturnedWith(38);
      }
    },
  );

  test.each([-50, 10, 50, 90, 150])(
    'Checking the "_checkingTargetValue" method => isVertical = false/true; isRange = true; initValueFirst, initValueSecond is defined => checkingValue: %p',
    (checkingValue) => {
      jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();
      jest.spyOn<Model, any>(classModel, '_setCurrentValues').mockImplementation();

      classModel.opt.isRange = true;
      classModel.opt.initValueFirst = 0;
      classModel.opt.initValueSecond = 100;
      classModel.opt.initValuesArray = [0, 100];

      [true, false].forEach((testValue) => {
        classModel.opt.isVertical = testValue;

        classModel['_checkingTargetValue'](checkingValue);

        const { initValuesArray } = classModel.opt;
        const averageValue = (initValuesArray[0] + initValuesArray[1]) / 2;

        if (checkingValue > averageValue) {
          expect(initValuesArray).toEqual([initValuesArray[0], checkingValue]);
        } else {
          expect(initValuesArray).toEqual([checkingValue, initValuesArray[1]]);
        }

        expect(classModel['_calcValuesInPercentage']).toHaveBeenCalled();
        expect(classModel['_setCurrentValues']).toHaveBeenCalled();
      });
    },
  );

  test('Checking the "_checkingTargetValue" method => initValueFirst, initValueSecond is undefined', () => {
    jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_setCurrentValues').mockImplementation();
    const TEST_VALUE = 50;

    classModel.opt.isVertical = false;
    classModel.opt.isRange = true;
    classModel.opt.minValue = 0;
    classModel.opt.maxValue = 100;

    classModel['_checkingTargetValue'](TEST_VALUE);

    // prettier-ignore
    const { 
      initValueFirst,
      initValueSecond,
      minValue,
      maxValue,
    } = classModel.opt;

    expect(initValueFirst).toBe(minValue);
    expect(initValueSecond).toBe(maxValue);
  });

  test('Checking the "_checkingTargetValue" method => isRange = false', () => {
    jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_setCurrentValues').mockImplementation();
    const TEST_VALUE = 50;

    classModel.opt.isVertical = false;
    classModel.opt.isRange = false;
    classModel.opt.initValueFirst = 0;
    classModel.opt.initValueSecond = 100;
    classModel.opt.initValuesArray = [0, 100];

    classModel['_checkingTargetValue'](TEST_VALUE);
    const { initValuesArray, initValueFirst } = classModel.opt;

    expect(initValuesArray).toEqual([initValueFirst, TEST_VALUE]);
  });

  test('Checking the "_checkingTargetValue" method => targetValue === averageValue', () => {
    jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_setCurrentValues').mockImplementation();
    const TEST_VALUE = 50;

    classModel.opt.isVertical = false;
    classModel.opt.isRange = true;
    classModel.opt.initValueFirst = 0;
    classModel.opt.initValueSecond = 100;
    classModel.opt.initValuesArray = [0, 100];

    classModel['_listSavedStatus']['activeThumb'] = '';
    classModel['_checkingTargetValue'](TEST_VALUE);
    const { initValuesArray, initValueSecond } = classModel.opt;

    expect(initValuesArray).toEqual([TEST_VALUE, initValueSecond]);
  });

  test('Checking the "_calcValuesInPercentage" method', () => {
    classModel.opt.minValue = 0;
    classModel.opt.maxValue = 200;
    classModel.opt.initValuesArray = [0, 100];

    classModel['_calcValuesInPercentage']();
    const { valuesAsPercentageArray } = classModel.opt;

    expect(valuesAsPercentageArray).toEqual([0, 50]);
  });

  test('Checking the "_setCurrentValues" method', () => {
    jest.spyOn(classModel, 'notify').mockImplementation();
    classModel.opt.initValuesArray = [1, 2];
    classModel.opt.customValues = [0, 100, 200];

    classModel['_setCurrentValues']();

    // prettier-ignore
    const { 
      key, 
      initValuesArray,
      initValueFirst,
      initValueSecond,
      textValueFirst,
      textValueSecond,
      textValuesArray,
      customValues,
    } = classModel.opt;

    expect(key).toBe('changedValue');
    expect(initValueFirst).toBe(initValuesArray[0]);
    expect(initValueSecond).toBe(initValuesArray[1]);
    expect(textValueFirst).toBe(String(customValues[initValuesArray[0]]));
    expect(textValueSecond).toBe(String(customValues[initValuesArray[1]]));
    expect(textValuesArray).toEqual([textValueFirst, textValueSecond]);
    expect(classModel.notify).toHaveBeenCalledWith(classModel.opt);
  });

  test.each(['init', 'step', 'maxValue', 'minValue', 'customValues', 'numberOfDecimalPlaces'])(
    'Checking the "_calcStepAsPercentage" method => key = %p',
    (key) => {
      classModel.opt.key = key;
      classModel.opt.minValue = 0;
      classModel.opt.maxValue = 100;
      classModel.opt.step = 5;

      classModel['_calcStepAsPercentage']();
      const { stepAsPercent } = classModel.opt;

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
    classModel.opt.$elemSlider = $();
    classModel.opt.$sliderProgress = $();
    classModel.opt.$elemThumbs = $();
    classModel.opt.$elemMarkers = $();
    classModel.opt.$elemScale = $();

    expect(classModel.opt.$elemSlider).toHaveLength(0);
    expect(classModel.opt.$sliderProgress).toHaveLength(0);
    expect(classModel.opt.$elemThumbs).toHaveLength(0);
    expect(classModel.opt.$elemMarkers).toHaveLength(0);
    expect(classModel.opt.$elemScale).toHaveLength(0);

    classModel['_getSliderSelectors']();

    expect(mockFind).toBeCalledTimes(5);
    expect(classModel.opt.$elemSlider).toHaveLength(1);
    expect(classModel.opt.$sliderProgress).toHaveLength(1);
    expect(classModel.opt.$elemThumbs).toHaveLength(2);
    expect(classModel.opt.$elemMarkers).toHaveLength(2);
    expect(classModel.opt.$elemScale).toHaveLength(1);
  });

  test.each(['init', 'initAutoMargins', 'isVertical'])(
    'Checking the "_checkingIsVerticalSlider" method => isVertical, initAutoMargins = true/false => key = %p',
    (key) => {
      classModel.opt.key = key;

      [true, false].forEach((status) => {
        classModel.opt.isVertical = !status;
        classModel.opt.initAutoMargins = status;
        classModel['_checkingIsVerticalSlider']();

        const { initAutoMargins } = classModel.opt;
        const statusAutoMargins = classModel['_listSavedStatus']['autoMargins'];

        expect(classModel['_listSavedStatus']).toHaveProperty('autoMargins', initAutoMargins);
        expect(initAutoMargins).toBe(statusAutoMargins);
      });
    },
  );
});

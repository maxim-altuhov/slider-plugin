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
    expect(classModel.opt).toBe(initSettings);
    expect(classModel.opt.$selector).toBe($selector);
    expect(classModel.observerList).toHaveLength(0);
    expect(classModel.errorEvent).toBeDefined();
    expect(classModel['_propSavedStatus']).toBeDefined();
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
        expect(classModel['_checkingTargetValue']).toHaveBeenCalledWith(
          checkingValue,
          fakeEvent,
          fakeEvent.clientX,
        );
      } else {
        expect(classModel['_checkingTargetValue']).toHaveBeenCalledWith(
          59,
          fakeEvent,
          fakeEvent.clientX,
        );
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

    expect(classModel['_checkingTargetValue']).toHaveBeenCalledWith(
      TEST_VALUE,
      fakeEvent,
      fakeEvent.clientY,
    );
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
    'Checking the "_checkingTargetValue" method => isVertical = false/true; isRange = true; initValueFirst, initValueSecond, eventPosition is defined => checkingValue: %p',
    (checkingValue) => {
      jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();
      jest.spyOn<Model, any>(classModel, '_setCurrentValues').mockImplementation();
      const mockGetBoundingClientRect = jest.spyOn(Element.prototype, 'getBoundingClientRect');

      const fakeEvent = $.Event('click', {
        target: classModel.opt.$elemThumbs[0],
        clientX: 575,
      });

      classModel.opt.isRange = true;
      classModel.opt.initValueFirst = 0;
      classModel.opt.initValueSecond = 100;
      classModel.opt.initValuesArray = [0, 100];

      [true, false].forEach((testValue) => {
        classModel.opt.isVertical = testValue;

        // @ts-ignore
        classModel['_checkingTargetValue'](checkingValue, fakeEvent, fakeEvent.clientX);

        const { initValuesArray } = classModel.opt;
        const averageValue = (initValuesArray[0] + initValuesArray[1]) / 2;

        if (checkingValue > averageValue) {
          expect(initValuesArray).toEqual([initValuesArray[0], checkingValue]);
        } else {
          expect(initValuesArray).toEqual([checkingValue, initValuesArray[1]]);
        }

        expect(mockGetBoundingClientRect).toHaveBeenCalled();
        expect(classModel['_calcValuesInPercentage']).toHaveBeenCalled();
        expect(classModel['_setCurrentValues']).toHaveBeenCalled();
      });
    },
  );

  test.each([0, 1])(
    'Checking the "_checkingTargetValue" method => isEventMoveKeypress => $elemThumbsIndex: %p',
    (index) => {
      jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();
      jest.spyOn<Model, any>(classModel, '_setCurrentValues').mockImplementation();

      const fakeEvent = $.Event('click', {
        target: classModel.opt.$elemThumbs[index],
        code: '',
      });

      classModel.opt.isVertical = false;
      classModel.opt.isRange = true;
      classModel.opt.initValueFirst = 0;
      classModel.opt.initValueSecond = 100;
      classModel.opt.initValuesArray = [0, 100];

      const TEST_VALUE = 50;
      const testEventCode = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

      testEventCode.forEach((eventCode) => {
        fakeEvent.code = eventCode;

        // @ts-ignore
        classModel['_checkingTargetValue'](TEST_VALUE, fakeEvent);
        const { initValuesArray, initValueFirst, initValueSecond } = classModel.opt;

        if (index === 0) {
          expect(initValuesArray).toEqual([TEST_VALUE, initValueSecond]);
        } else {
          expect(initValuesArray).toEqual([initValueFirst, TEST_VALUE]);
        }
      });
    },
  );

  test('Checking the "_checkingTargetValue" method => initValueFirst, initValueSecond is undefined', () => {
    jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_setCurrentValues').mockImplementation();
    const TEST_VALUE = 50;

    const fakeEvent = $.Event('click', {
      target: classModel.opt.$elemThumbs[0],
    });

    classModel.opt.isVertical = false;
    classModel.opt.isRange = true;
    classModel.opt.minValue = 0;
    classModel.opt.maxValue = 100;

    // @ts-ignore
    classModel['_checkingTargetValue'](TEST_VALUE, fakeEvent);
    const { initValueFirst, initValueSecond, minValue, maxValue } = classModel.opt;

    expect(initValueFirst).toBe(minValue);
    expect(initValueSecond).toBe(maxValue);
  });

  test('Checking the "_checkingTargetValue" method => isRange = false', () => {
    jest.spyOn<Model, any>(classModel, '_calcValuesInPercentage').mockImplementation();
    jest.spyOn<Model, any>(classModel, '_setCurrentValues').mockImplementation();
    const TEST_VALUE = 50;

    const fakeEvent = $.Event('click', {
      target: classModel.opt.$elemThumbs[0],
    });

    classModel.opt.isVertical = false;
    classModel.opt.isRange = false;
    classModel.opt.initValueFirst = 0;
    classModel.opt.initValueSecond = 100;
    classModel.opt.initValuesArray = [0, 100];

    // @ts-ignore
    classModel['_checkingTargetValue'](TEST_VALUE, fakeEvent);
    const { initValuesArray, initValueFirst } = classModel.opt;

    expect(initValuesArray).toEqual([initValueFirst, TEST_VALUE]);
  });
});

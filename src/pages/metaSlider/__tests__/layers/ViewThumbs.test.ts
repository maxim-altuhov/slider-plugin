/* eslint-disable @typescript-eslint/dot-notation */
// The tests uses the 'any' type in jest.spyOn so that private methods of the class can be tested
import * as makeThrottlingHandler from '../../utils/makeThrottlingHandler';
import View from '../../layers/View';
import ViewThumbs from '../../layers/ViewThumbs';
import InitSettings from '../../data/InitSettings';

jest.mock('../../utils/createUniqueID');
const classMainView = new View();
document.body.innerHTML = '<div id="render-selector"></div>';
const $selector = $('#render-selector');
classMainView.renderSlider($selector);

describe('Checking the "ViewThumbs" layer, before first initialization.', () => {
  const notInitViewThumbs = new ViewThumbs();

  test('State before first initialization the "update" method', () => {
    expect($selector.html()).toMatchSnapshot();
    expect(notInitViewThumbs['_$elemThumbs']).toHaveLength(0);
    expect(notInitViewThumbs['_isFirstInit']).toBe(true);
    expect(notInitViewThumbs['_verifKeysObj']).toBeDefined();
    expect(notInitViewThumbs['_observerList']).toHaveLength(0);
  });
});

describe('Checking the "ViewThumbs" layer => "update" method', () => {
  const classViewThumbs = new ViewThumbs();
  const defaultSettings = {
    key: 'init',
    $elemThumbs: $('.js-meta-slider__thumb'),
    isRange: true,
    mainColor: 'red',
    colorThumb: '',
    colorBorderForThumb: 'black',
    step: 100,
    initValueFirst: 1000,
    initValueSecond: 2000,
    initValuesArray: [1000, 2000],
    valuesAsPercentageArray: [0, 100],
    textValueFirst: 'textValueFirst',
    textValueSecond: 'textValueSecond',
    customValues: [],
    numberOfDecimalPlaces: 0,
  };
  let testSettings: IPluginOptions;
  let $elemThumbs: JQuery<HTMLElement>;

  beforeAll(() => {
    testSettings = $.extend({}, InitSettings, defaultSettings);
    classViewThumbs.update(testSettings);
    $elemThumbs = classViewThumbs['_$elemThumbs'];
  });

  afterEach(() => {
    testSettings = $.extend({}, InitSettings, defaultSettings);
    jest.restoreAllMocks();
  });

  test('Checking the "_init" method', () => {
    jest.spyOn<ViewThumbs, any>(classViewThumbs, '_setEventsThumbs');

    classViewThumbs['_isFirstInit'] = true;
    classViewThumbs.update(testSettings);

    expect($elemThumbs).toHaveLength(2);
    expect(classViewThumbs['_isFirstInit']).toBe(false);
    expect(classViewThumbs['_setEventsThumbs']).toHaveBeenCalled();
  });

  test('Checking the "_setValueInThumbs" method => defaultSettings', () => {
    const { initValuesArray, valuesAsPercentageArray } = testSettings;
    classViewThumbs.update(testSettings);

    $elemThumbs.each((index, thumb) => {
      const $currentThumb = $(thumb);
      expect($currentThumb.attr('data-value')).toBe(String(initValuesArray[index]));
      expect($currentThumb.attr('data-text')).toBeUndefined();
      expect(thumb.style).toHaveProperty('left', `${valuesAsPercentageArray[index]}%`);
    });
  });

  test('Checking the "_setValueInThumbs" method => option "customValues"', () => {
    const { textValueFirst, textValueSecond } = testSettings;

    testSettings.key = 'customValues';
    testSettings.initValuesArray = [0, 2];
    testSettings.customValues = [textValueFirst, 'randomCustomValue', textValueSecond];
    classViewThumbs.update(testSettings);

    const { customValues, initValuesArray } = testSettings;

    initValuesArray.forEach((currentValue, index) => {
      expect($elemThumbs.eq(index).attr('data-text')).toBe(customValues[currentValue]);
    });
  });

  test('Checking the "_setValueInThumbs" method => option "numberOfDecimalPlaces"', () => {
    testSettings.key = 'numberOfDecimalPlaces';
    testSettings.numberOfDecimalPlaces = 2;
    classViewThumbs.update(testSettings);

    const { initValueFirst, initValueSecond, numberOfDecimalPlaces: numFix } = testSettings;

    expect($elemThumbs.eq(0).attr('data-value')).toBe(initValueFirst?.toFixed(numFix));
    expect($elemThumbs.eq(1).attr('data-value')).toBe(initValueSecond?.toFixed(numFix));

    testSettings.numberOfDecimalPlaces = 4;
    const { numberOfDecimalPlaces: updateNumFix } = testSettings;
    classViewThumbs.update(testSettings);

    expect($elemThumbs.eq(0).attr('data-value')).toBe(initValueFirst?.toFixed(updateNumFix));
    expect($elemThumbs.eq(1).attr('data-value')).toBe(initValueSecond?.toFixed(updateNumFix));
  });

  test('Checking the "_setStyleForThumbs" method => "defaultSettings"', () => {
    const { mainColor, colorBorderForThumb } = testSettings;
    classViewThumbs.update(testSettings);

    $elemThumbs.each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', mainColor);
      expect(elem.style).toHaveProperty('border-color', colorBorderForThumb);
    });
  });

  test('Checking the "_setStyleForThumbs" method => option "colorThumb"', () => {
    testSettings.key = 'colorThumb';
    testSettings.colorThumb = 'yellow';
    const { colorThumb } = testSettings;
    classViewThumbs.update(testSettings);

    $elemThumbs.each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', colorThumb);
    });
  });

  test('Checking the "_checkIsRange" method => "defaultSettings"', () => {
    classViewThumbs.update(testSettings);

    expect($elemThumbs.prop('style')).toHaveProperty('display', '');
  });

  test('Checking the "_checkIsRange" method => option "isRange"', () => {
    testSettings.key = 'isRange';
    testSettings.isRange = false;
    classViewThumbs.update(testSettings);

    expect($elemThumbs.prop('style')).toHaveProperty('display', 'none');
  });

  test.each(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyS', 'KeyX'])(
    'Checking the "_setEventsThumbs" method, event "keydown" (index %d) => init _handleThumbKeydown',
    (eventCode) => {
      jest.spyOn(classViewThumbs, 'notify').mockImplementation();
      const { initValuesArray } = testSettings;
      const listEventCode = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      const eventKeydown = $.Event('keydown', { code: eventCode });
      eventKeydown.preventDefault = jest.fn();
      $elemThumbs.eq(1).trigger(eventKeydown);

      if (listEventCode.includes(eventCode)) {
        expect(eventKeydown.preventDefault).toHaveBeenCalled();
        expect(classViewThumbs.notify).toHaveBeenCalledWith(eventKeydown, initValuesArray[1]);
      } else {
        expect(eventKeydown.preventDefault).not.toHaveBeenCalled();
        expect(classViewThumbs.notify).not.toHaveBeenCalled();
      }
    },
  );

  test.each([0, 1])(
    'Checking the "_setEventsThumbs" method, event "pointerdown/pointerup" (index %d) => init _handleThumbPointerdown, _handleThumbPointermove, _handleThumbPointerup',
    (index) => {
      jest.spyOn(classViewThumbs, 'notify').mockImplementation();
      const mockMakeThrottlingHandler = jest.spyOn(makeThrottlingHandler, 'default');
      $elemThumbs[index].setPointerCapture = jest.fn();
      const mockSetPointerCapture = $elemThumbs[index].setPointerCapture;

      jest.useFakeTimers();

      const eventPointerdown = $.Event('pointerdown.thumb', { pointerId: 1 });
      const eventPointermove = $.Event('pointermove.thumb');
      $elemThumbs.eq(index).trigger(eventPointerdown);
      $elemThumbs.eq(index).trigger(eventPointermove);

      jest.advanceTimersByTime(mockMakeThrottlingHandler.mock.calls[0][1]);

      expect(mockSetPointerCapture).toHaveBeenCalledWith(eventPointerdown.pointerId);
      expect(mockMakeThrottlingHandler).toHaveBeenCalled();
      expect(classViewThumbs.notify).toHaveBeenCalledWith(eventPointermove);

      jest.clearAllTimers();

      const mockRemoveEvent = jest.spyOn($.fn, 'off');
      $elemThumbs.eq(index).trigger('pointerup.thumb');
      expect(mockRemoveEvent).toHaveBeenCalledWith('pointermove.thumb');
      expect(mockRemoveEvent).toHaveBeenCalledWith('pointerup.thumb');
    },
  );
});

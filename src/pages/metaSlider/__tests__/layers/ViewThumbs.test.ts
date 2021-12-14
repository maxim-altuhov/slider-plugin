/* eslint-disable @typescript-eslint/dot-notation */
import ViewSlider from '../../layers/ViewSlider';
import ViewThumbs from '../../layers/ViewThumbs';
import initSettings from '../../data/initSettings';

const classViewSlider = new ViewSlider();
let classViewThumbs = new ViewThumbs();

document.body.innerHTML = '<div id="render-selector"></div>';

const $selector = $('#render-selector');
classViewSlider.renderSlider($selector);
const HTMLBlockWithSlider = document.body.innerHTML;

test('Checking the "ViewThumbs" layer. State before first initialization the "update" method', () => {
  expect(classViewThumbs['_$elemThumbs']).toHaveLength(0);
  expect(classViewThumbs['_isFirstInit']).toBe(true);
});

describe('Checking the "ViewThumbs" layer, the "update" method', () => {
  const defaultSettings = {
    key: 'init',
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

  beforeEach(() => {
    classViewThumbs = new ViewThumbs();
    document.body.innerHTML = HTMLBlockWithSlider;
    testSettings = $.extend({}, initSettings, defaultSettings);
    testSettings.$elemThumbs = $('.js-meta-slider__thumb');

    classViewThumbs.update(testSettings);
  });

  test('Checking the "_init" method', () => {
    const { $elemThumbs } = testSettings;

    expect(classViewThumbs['_isFirstInit']).toBe(false);
    expect($elemThumbs).toHaveLength(2);
  });

  test('Checking the "_setValueInThumbs" method', () => {
    const {
      $elemThumbs,
      initValuesArray,
      valuesAsPercentageArray,
      textValueFirst,
      textValueSecond,
    } = testSettings;

    $elemThumbs.each((index, thumb) => {
      const $currentThumb = $(thumb);
      expect($currentThumb.attr('data-value')).toBe(String(initValuesArray[index]));
      expect($currentThumb.attr('data-text')).toBeUndefined();
      expect(thumb.style).toHaveProperty('left', `${valuesAsPercentageArray[index]}%`);
    });

    testSettings.key = 'customValues';
    testSettings.initValuesArray = [0, 2];
    testSettings.customValues = [textValueFirst, 'randomCustomValue', textValueSecond];
    classViewThumbs.update(testSettings);

    const { customValues, initValuesArray: initValuesArrayChanged } = testSettings;

    initValuesArrayChanged.forEach((currentValue, index) => {
      expect($elemThumbs[index].getAttribute('data-text')).toBe(customValues[currentValue]);
    });
  });

  test('Checking the "_setValueInThumbs" method, option "numberOfDecimalPlaces"', () => {
    testSettings.key = 'numberOfDecimalPlaces';
    testSettings.numberOfDecimalPlaces = 2;
    classViewThumbs.update(testSettings);

    // prettier-ignore
    const { 
      $elemThumbs,
      initValueFirst,
      initValueSecond,
      numberOfDecimalPlaces,
    } = testSettings;

    expect($elemThumbs.eq(0).attr('data-value')).toBe(
      initValueFirst?.toFixed(numberOfDecimalPlaces),
    );
    expect($elemThumbs.eq(1).attr('data-value')).toBe(
      initValueSecond?.toFixed(numberOfDecimalPlaces),
    );

    testSettings.numberOfDecimalPlaces = 4;
    classViewThumbs.update(testSettings);

    expect($elemThumbs.eq(0).attr('data-value')).toBe(
      initValueFirst?.toFixed(testSettings.numberOfDecimalPlaces),
    );
    expect($elemThumbs.eq(1).attr('data-value')).toBe(
      initValueSecond?.toFixed(testSettings.numberOfDecimalPlaces),
    );
  });

  test('Checking the "_setStyleForThumbs" method. Сhecking whether the styles for thumbs are set correctly', () => {
    // prettier-ignore
    const { 
      $elemThumbs,
      mainColor,
      colorBorderForThumb,
    } = testSettings;

    $elemThumbs.each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', mainColor);
      expect(elem.style).toHaveProperty('border-color', colorBorderForThumb);
    });

    testSettings.key = 'colorThumb';
    testSettings.colorThumb = 'yellow';
    classViewThumbs.update(testSettings);

    $elemThumbs.each((_, elem) => {
      expect(elem.style).toHaveProperty('background-color', testSettings.colorThumb);
    });
  });

  test('Checking the "_checkIsRange" method', () => {
    const { $elemThumbs } = testSettings;

    expect($elemThumbs[0].style).toHaveProperty('display', '');

    testSettings.key = 'isRange';
    testSettings.isRange = false;
    classViewThumbs.update(testSettings);

    expect($elemThumbs[0].style).toHaveProperty('display', 'none');
  });

  test('Checking the "_setEventsThumbs" method, event "keydown" => _handleChangeThumbPosition', () => {
    const { $elemThumbs, initValuesArray, step } = testSettings;
    const mockNotify = jest.spyOn(classViewThumbs, 'notify');
    const testKeysArr = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];

    testKeysArr.forEach((keyCode) => {
      const event = $.Event('keydown', { code: keyCode });
      $elemThumbs.eq(1).trigger(event, testSettings);

      if (keyCode === 'ArrowUp' || keyCode === 'ArrowRight') {
        expect(mockNotify).toHaveBeenCalledWith(event, initValuesArray[1] + step);
      }

      if (keyCode === 'ArrowDown' || keyCode === 'ArrowLeft') {
        expect(mockNotify).toHaveBeenCalledWith(event, initValuesArray[1] - step);
      }
    });
  });

  test('Checking the "_setEventsThumbs" method, event "pointerdown" => _handleSetEventListenerForThumbs', () => {
    const { $elemThumbs } = testSettings;
    $elemThumbs.eq(1).trigger('pointerdown', { pointerId: 1 });
  });
});

/* eslint-disable @typescript-eslint/dot-notation */
// The tests uses the 'any' type in jest.spyOn so that private methods of the class can be tested
import Model from '../../metaSlider/layers/Model';
import '../../metaSlider/metaSlider';
import ControlPanel from '../ts/ControlPanel';

jest.mock('../../../pages/metaSlider/layers/View');
jest.mock('../../../pages/metaSlider/layers/Presenter');
jest.spyOn($.fn, 'metaSlider');
jest.spyOn(Model.prototype, 'init').mockImplementation(() => 'init');
jest.spyOn(Model.prototype, 'update').mockImplementation(() => 'update');

document.body.innerHTML = `<div id="fake-slider-selector"></div>
<div id="fake-panel-selector">
  <input type="number" name="initValueFirst">
  <input type="number" name="initValueSecond">
  <input type="number" name="minValue">
  <input type="number" name="maxValue">
  <input type="number" name="step">
  <input type="text" name="customValues">
  <input type="text" name="mainColor">
  <input type="checkbox" name="isRange" value="isRange">
  <input type="checkbox" name="showScale" value="showScale">
  <input type="checkbox" name="isVertical" value="isVertical">
  <input type="checkbox" name="initAutoMargins" value="initAutoMargins">
</div>`;
$('#fake-slider-selector').metaSlider();

describe('Checking the "ControlPanel", before first initialization.', () => {
  test('State before first initialization the "init" method', () => {
    const mockGetSelectors = jest.spyOn<ControlPanel, any>(ControlPanel.prototype, '_getSelectors');
    const notInitControlPanel = new ControlPanel('#fake-panel-selector', '#fake-slider-selector');

    expect(notInitControlPanel.watchTheSlider).toBeDefined();
    expect(notInitControlPanel['_handleInputChange']).toBeDefined();
    expect(notInitControlPanel['_$panelSelector']).toHaveLength(1);
    expect(notInitControlPanel['_$sliderSelector']).toHaveLength(1);
    expect(notInitControlPanel['_selectorsObj']).toBeDefined();
    expect(notInitControlPanel['_objWithControlPanelDependencies']).toBeDefined();
    expect(notInitControlPanel['_keysWatchList']).toBeDefined();
    expect(notInitControlPanel.propertyList.length > 0).toBeTruthy();
    expect(notInitControlPanel['_getSelectors']).toHaveBeenCalled();

    mockGetSelectors.mockRestore();
  });
});

describe('Checking the "ControlPanel"', () => {
  const classControlPanel = new ControlPanel('#fake-panel-selector', '#fake-slider-selector');

  const $sliderSelector = classControlPanel['_$sliderSelector'];
  const $panelSelector = classControlPanel['_$panelSelector'];
  const allSelectorsObj = classControlPanel['_selectorsObj'];
  const keysWatchList = classControlPanel['_keysWatchList'];
  const objWithControlPanelDependencies = classControlPanel['_objWithControlPanelDependencies'];
  const testSelectorsArr = Object.entries(allSelectorsObj).filter((elem) => elem[1].length > 0);
  const { propertyList } = classControlPanel;

  beforeAll(() => {
    classControlPanel.init();
  });

  beforeEach(() => {
    testSelectorsArr.forEach((currentElem) => {
      const [, $inputSelector] = currentElem;

      if ($inputSelector.attr('type') === 'checkbox') $inputSelector.prop('checked', true);
      $inputSelector.removeAttr('data-dependency');
      $inputSelector.removeAttr('disabled');
    });

    const {
      initValueFirst: inputValueFirst,
      initValueSecond: inputValueSecond,
      minValue: inputMinValue,
      maxValue: inputMaxValue,
      step: inputStep,
      customValues: inputCustomValues,
      mainColor: inputMainColor,
    } = allSelectorsObj;

    inputValueFirst.val(20);
    inputValueSecond.val(80);
    inputMaxValue.val(100);
    inputMinValue.val(0);
    inputStep.val(10);
    inputCustomValues.val(['a', 'b', 'c']);
    inputMainColor.val('red');

    $sliderSelector.data('metaSlider').model.opt.key = '';
  });

  test('Checking the "init" method', () => {
    const { model } = $sliderSelector.data('metaSlider');

    const handleInputChanges = classControlPanel['_handleInputChange'];
    const mockGetProp = jest.spyOn<ControlPanel, any>(classControlPanel, '_getProp');
    const mockSubscribe = jest.spyOn(model, 'subscribe').mockImplementation();
    const mockInitCheckingDependencies = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_initCheckingDependencies')
      .mockImplementation();
    const mockSetOptionStepForInputs = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_setOptionStepForInputs')
      .mockImplementation();
    jest.spyOn($.fn, 'on');

    classControlPanel.init();

    testSelectorsArr.forEach((currentElem) => {
      const [prop, $inputSelector] = currentElem;

      expect(mockGetProp).toHaveBeenCalledWith(prop);
      expect(mockInitCheckingDependencies).toHaveBeenCalledWith(prop);
      expect($inputSelector.on).toHaveBeenCalledWith('change.input', handleInputChanges);
    });

    expect(mockSetOptionStepForInputs).toHaveBeenCalled();
    expect($sliderSelector.metaSlider).toHaveBeenCalledWith(
      'subscribe',
      classControlPanel.watchTheSlider,
    );

    mockSubscribe.mockRestore();
    mockInitCheckingDependencies.mockRestore();
    mockSetOptionStepForInputs.mockRestore();
  });

  test('Checking the "unbind" method', () => {
    const { model } = $sliderSelector.data('metaSlider');
    const mockRemoveEvent = jest.spyOn($.fn, 'off').mockImplementation();
    const mockUnsubscribe = jest.spyOn(model, 'unsubscribe').mockImplementation();

    classControlPanel.unbind();

    testSelectorsArr.forEach((currentElem) => {
      const [, $inputSelector] = currentElem;
      expect($inputSelector.off).toHaveBeenCalledWith('change.input');
    });

    expect($sliderSelector.metaSlider).toHaveBeenCalledWith(
      'unsubscribe',
      classControlPanel.watchTheSlider,
    );

    mockRemoveEvent.mockRestore();
    mockUnsubscribe.mockRestore();
  });

  test('Checking the "watchTheSlider" method', () => {
    const mockInitCheckingDependencies = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_initCheckingDependencies')
      .mockImplementation();
    const mockSetOptionStepForInputs = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_setOptionStepForInputs')
      .mockImplementation();
    const mockGetProp = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_getProp')
      .mockImplementation();

    propertyList.forEach((propKey) => {
      $sliderSelector.data('metaSlider').model.opt.key = propKey;
      classControlPanel.watchTheSlider();

      expect($sliderSelector.metaSlider).toHaveBeenCalledWith('getProp', 'key');
      expect(mockInitCheckingDependencies).toHaveBeenCalledWith(propKey);
      expect(mockSetOptionStepForInputs).toHaveBeenCalled();

      if (propKey in keysWatchList) {
        keysWatchList[propKey].forEach((prop) => expect(mockGetProp).toHaveBeenCalledWith(prop));
      }
    });

    mockInitCheckingDependencies.mockRestore();
    mockSetOptionStepForInputs.mockRestore();
    mockGetProp.mockRestore();
  });

  test('Checking the "_setOptionStepForInputs" method', () => {
    classControlPanel['_setOptionStepForInputs']();

    const {
      initValueFirst: inputValueFirst,
      initValueSecond: inputValueSecond,
      minValue: inputMinValue,
      maxValue: inputMaxValue,
      step: inputStep,
    } = allSelectorsObj;

    const maxValueForFirstThumbs = Number(inputValueSecond.val()) - Number(inputStep.val());
    const minValueForSecondThumbs = Number(inputValueFirst.val()) + Number(inputStep.val());

    expect(inputValueFirst.attr('min')).toBe(inputMinValue.val());
    expect(inputValueFirst.attr('max')).toBe(String(maxValueForFirstThumbs));
    expect(inputValueFirst.attr('step')).toBe(inputStep.val());

    expect(inputValueSecond.attr('min')).toBe(String(minValueForSecondThumbs));
    expect(inputValueSecond.attr('max')).toBe(inputMaxValue.val());
    expect(inputValueSecond.attr('step')).toBe(inputStep.val());
  });

  test('Checking the "_setProp" method', () => {
    classControlPanel['_setProp']('mainColor', 'black');

    expect($sliderSelector.metaSlider).toHaveBeenCalledWith('setProp', 'mainColor', 'black');
  });

  test.each(['step', 'showScale'])('Checking the "_getProp" method => option %p', (prop) => {
    jest.spyOn<ControlPanel, any>(classControlPanel, '_getProp');
    const currentValue = $sliderSelector.data('metaSlider').model.opt[prop];
    classControlPanel['_getProp'](prop);

    expect($sliderSelector.metaSlider).toHaveBeenCalledWith('getProp', prop);

    if (allSelectorsObj[prop].attr('type') === 'checkbox') {
      expect(allSelectorsObj[prop].prop('checked')).toBe(currentValue);
    } else {
      expect(allSelectorsObj[prop].val()).toBe(String(currentValue));
    }

    expect(classControlPanel['_getProp']).toHaveReturnedWith(currentValue);
  });

  test('Checking the "_getSelectors" method', () => {
    jest.spyOn($.fn, 'find');
    classControlPanel['_getSelectors']();

    propertyList.forEach((prop) => {
      expect($panelSelector.find).toHaveBeenCalledWith(`[name = ${prop}]`);
    });
  });

  test('Checking the "_initCheckingDependencies" method', () => {
    const mockCheckTheProp = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_checkingInputWithTargetProp')
      .mockImplementation();

    Object.keys(objWithControlPanelDependencies).forEach((initProp) => {
      const { checkingOptions, isReverseDependency } = objWithControlPanelDependencies[initProp];

      classControlPanel['_initCheckingDependencies'](initProp);

      expect(mockCheckTheProp).toHaveBeenCalledWith(initProp, checkingOptions, isReverseDependency);

      checkingOptions.forEach((nestedProp) => {
        if (nestedProp in objWithControlPanelDependencies) {
          expect(mockCheckTheProp).toHaveBeenCalledWith(
            nestedProp,
            objWithControlPanelDependencies[nestedProp].checkingOptions,
            objWithControlPanelDependencies[nestedProp].isReverseDependency,
          );
        }
      });
    });

    mockCheckTheProp.mockRestore();
  });

  test.each(['isVertical', 'isRange', 'customValues'])(
    'Checking the "_checkingInputWithTargetProp" method => option %p',
    (initProp) => {
      jest.spyOn<ControlPanel, any>(classControlPanel, '_togglePropDisableForInput');
      jest.spyOn<ControlPanel, any>(classControlPanel, '_checkingInputWithTargetProp');
      const { checkingOptions, isReverseDependency } = objWithControlPanelDependencies[initProp];
      const $inputTarget = allSelectorsObj[initProp];
      $inputTarget.attr('data-dependency', String(!isReverseDependency));

      classControlPanel['_initCheckingDependencies'](initProp);

      expect($inputTarget.attr('data-dependency')).toBe(String(!isReverseDependency));
      expect(classControlPanel['_checkingInputWithTargetProp']).toHaveBeenCalledWith(
        initProp,
        checkingOptions,
        isReverseDependency,
      );

      checkingOptions.forEach((targetProp) => {
        expect(classControlPanel['_togglePropDisableForInput']).toHaveBeenCalledWith(
          targetProp,
          !isReverseDependency,
        );
      });
    },
  );

  test('Checking the "_togglePropDisableForInput" method', () => {
    const targetProp = 'isVertical';
    const targetOption = false;
    classControlPanel['_togglePropDisableForInput'](targetProp, targetOption);

    expect(allSelectorsObj[targetProp].prop('disabled')).toBe(targetOption);
  });

  test.each(['isVertical', 'isRange', 'customValues', 'step'])(
    'Checking the "_handleInputChange" method => option %p',
    (initProp) => {
      const mockSetProp = jest.spyOn<ControlPanel, any>(classControlPanel, '_setProp');
      const eventChange = $.Event('change.input');
      const $targetInput = allSelectorsObj[initProp];

      $targetInput.trigger(eventChange);

      if ($targetInput.attr('type') === 'number') {
        expect(mockSetProp).toHaveBeenCalledWith(initProp, Number($targetInput.val()));
      } else if ($targetInput.attr('type') === 'checkbox') {
        expect(mockSetProp).toHaveBeenCalledWith(initProp, $targetInput.prop('checked'));
      } else {
        expect(mockSetProp).toHaveBeenCalledWith(initProp, $targetInput.val());
      }
    },
  );
});

/* eslint-disable @typescript-eslint/dot-notation */
import Model from '../../../pages/metaSlider/layers/Model';
import '../../../pages/metaSlider/metaSlider';
import ControlPanel from '../ControlPanel';

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
<input type="checkbox" name="showScale" value="showScale">
</div>`;
$('#fake-slider-selector').metaSlider();

describe('Checking the "ControlPanel"', () => {
  const classControlPanel = new ControlPanel('#fake-panel-selector', '#fake-slider-selector');
  const $sliderSelector = classControlPanel['_$sliderSelector'];
  const $panelSelector = classControlPanel['_$panelSelector'];
  const selectorsObj = classControlPanel['_selectorsObj'];
  const objWithControlPanelDependencies = classControlPanel['_objWithControlPanelDependencies'];
  const { propertyList } = classControlPanel;

  test('State before first initialization the "init" method', () => {
    const mockGetSelectors = jest.spyOn<ControlPanel, any>(ControlPanel.prototype, '_getSelectors');
    const notInitControlPanel = new ControlPanel('#fake-panel-selector', '#fake-slider-selector');

    expect(notInitControlPanel.watchTheSlider).toBeDefined();
    expect(notInitControlPanel['_handleInputChanges']).toBeDefined();
    expect(notInitControlPanel['_$panelSelector']).toHaveLength(1);
    expect(notInitControlPanel['_$sliderSelector']).toHaveLength(1);
    expect(notInitControlPanel['_selectorsObj']).toBeDefined();
    expect(notInitControlPanel['_objWithControlPanelDependencies']).toBeDefined();
    expect(notInitControlPanel.propertyList.length > 0).toBeTruthy();

    expect(notInitControlPanel['_getSelectors']).toHaveBeenCalled();

    mockGetSelectors.mockRestore();
  });

  test('Checking the "init" method (It must be run first before other tests!)', () => {
    jest.spyOn($.fn, 'on');
    const handleInputChanges = classControlPanel['_handleInputChanges'];
    const mockGetProp = jest.spyOn<ControlPanel, any>(classControlPanel, '_getProp');
    const mockInitCheckingDependencies = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_initCheckingDependencies')
      .mockImplementation(() => '_initCheckingDependencies');

    const mockSetOptionsForInputs = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_setOptionStepForInputs')
      .mockImplementation(() => '_setOptionStepForInputs');

    classControlPanel.init();

    Object.entries(selectorsObj).forEach((selectorsObjArr: [string, JQuery]) => {
      const [prop, $selector] = selectorsObjArr;

      expect(mockGetProp).toHaveBeenCalledWith(prop);
      expect(mockInitCheckingDependencies).toHaveBeenCalledWith(prop);
      expect($selector.on).toHaveBeenCalledWith('change.input', handleInputChanges);
    });

    expect(mockSetOptionsForInputs).toHaveBeenCalled();
    expect($sliderSelector.metaSlider).toHaveBeenCalledWith(
      'subscribe',
      classControlPanel.watchTheSlider,
    );

    mockInitCheckingDependencies.mockRestore();
    mockSetOptionsForInputs.mockRestore();
  });

  test('Checking the "unbind" method', () => {
    jest.spyOn($.fn, 'off');
    classControlPanel.unbind();

    Object.entries(selectorsObj).forEach((selectorsObjArr: [string, JQuery]) => {
      const $selector = selectorsObjArr[1];
      expect($selector.off).toHaveBeenCalledWith('change.input');
    });

    expect($sliderSelector.metaSlider).toHaveBeenCalledWith(
      'unsubscribe',
      classControlPanel.watchTheSlider,
    );
  });

  test('Checking the "watchTheSlider" method', () => {
    const mockInitCheckingDependencies = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_initCheckingDependencies')
      .mockImplementation(() => '_initCheckingDependencies');
    const mockSetOptionsForInputs = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_setOptionStepForInputs')
      .mockImplementation(() => '_setOptionStepForInputs');
    const mockGetProp = jest
      .spyOn<ControlPanel, any>(classControlPanel, '_getProp')
      .mockImplementation(() => '_getProp');

    propertyList.forEach((prop) => {
      $sliderSelector.data('metaSlider').model.opt.key = prop;
      classControlPanel.watchTheSlider();

      expect(mockGetProp).toHaveBeenCalledWith(prop);
    });

    expect($sliderSelector.metaSlider).toHaveBeenCalledWith('getProp', 'key');
    expect(mockInitCheckingDependencies).toHaveBeenCalled();
    expect(mockSetOptionsForInputs).toHaveBeenCalled();

    mockInitCheckingDependencies.mockRestore();
    mockSetOptionsForInputs.mockRestore();
    mockGetProp.mockRestore();
  });

  test('Checking the "_setOptionStepForInputs" method', () => {
    const {
      initValueFirst: inputValueFirst,
      initValueSecond: inputValueSecond,
      minValue: inputMinValue,
      maxValue: inputMaxValue,
      step: inputStep,
    } = selectorsObj;

    inputValueFirst.val(20);
    inputValueSecond.val(80);
    inputMaxValue.val(100);
    inputMinValue.val(0);
    inputStep.val(10);

    classControlPanel['_setOptionStepForInputs']();

    expect(inputValueFirst.attr('min')).toBeDefined();
    expect(inputValueFirst.attr('max')).toBeDefined();
    expect(inputValueFirst.attr('step')).toBeDefined();

    expect(inputValueSecond.attr('min')).toBeDefined();
    expect(inputValueSecond.attr('max')).toBeDefined();
    expect(inputValueSecond.attr('step')).toBeDefined();
  });

  test('Checking the "_setProp" method', () => {
    classControlPanel['_setProp']('mainColor', 'red');

    expect($sliderSelector.metaSlider).toHaveBeenCalledWith('setProp', 'mainColor', 'red');
  });

  test.each(['step', 'showScale'])('Checking the "_getProp" method => option %p', (prop) => {
    jest.spyOn<ControlPanel, any>(classControlPanel, '_getProp');
    const currentValue = $sliderSelector.data('metaSlider').model.opt[prop];
    classControlPanel['_getProp'](prop);

    expect($sliderSelector.metaSlider).toHaveBeenCalledWith('getProp', prop);

    if (selectorsObj[prop].attr('type') === 'checkbox') {
      expect(selectorsObj[prop].prop('checked')).toBe(currentValue);
    } else {
      expect(selectorsObj[prop].val()).toBe(String(currentValue));
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
      .mockImplementation(() => '_checkingInputWithTargetProp');

    Object.keys(objWithControlPanelDependencies).forEach((prop) => {
      classControlPanel['_initCheckingDependencies'](prop);

      if (objWithControlPanelDependencies[prop].isReverseDependency) {
        expect(mockCheckTheProp).toHaveBeenCalledWith(prop, expect.any(Array), expect.any(Boolean));
      } else {
        expect(mockCheckTheProp).toHaveBeenCalledWith(prop, expect.any(Array), undefined);
      }
    });

    mockCheckTheProp.mockRestore();
  });

  test('Checking the "_checkingInputWithTargetProp" method', () => {
    classControlPanel['_checkingInputWithTargetProp']('isVertical', ['initAutoMargins']);
  });
});

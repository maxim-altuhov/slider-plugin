import objWithControlPanelDependencies from '../data/objWithControlPanelDependencies';
import propertyList from '../data/propertyList';
import keysWatchList from '../data/keysWatchList';

class ControlPanel {
  readonly propertyList = propertyList;
  private _$panelSelector: JQuery;
  private _$sliderSelector: JQuery;
  private _selectorsObj: { [key: string]: JQuery } = {};
  private _objWithControlPanelDependencies = objWithControlPanelDependencies;
  private _keysWatchList = keysWatchList;

  constructor(panelSelector: string, sliderSelector: string) {
    this.watchTheSlider = this.watchTheSlider.bind(this);
    this._handleInputChanges = this._handleInputChanges.bind(this);
    this._$panelSelector = $(panelSelector);
    this._$sliderSelector = $(sliderSelector);

    this._getSelectors();
  }

  /**
   * Initializing the control panel and filling it with slider property values,
   * installing event handlers on inputs and subscribing to the slider model update
   */
  init() {
    Object.entries(this._selectorsObj).forEach((currentElem) => {
      const [prop, $inputSelector] = currentElem;
      this._getProp(prop);
      this._initCheckingDependencies(prop);

      $inputSelector.on('change.input', this._handleInputChanges);
    });

    this._setOptionStepForInputs();
    this._$sliderSelector.metaSlider('subscribe', this.watchTheSlider);
  }

  unbind() {
    Object.entries(this._selectorsObj).forEach((currentElem) => {
      const [, $inputSelector] = currentElem;
      $inputSelector.off('change.input');
    });

    this._$sliderSelector.metaSlider('unsubscribe', this.watchTheSlider);
  }

  /**
   * A method that monitors the model update through the Observer pattern and outputs data
   * in the control panel, the check is performed by the value of the 'key' property,
   * which is assigned depending on which property of the slider has changed.
   * This is also where the initialization of the method for checking the dependence
   * of the slider properties on each other takes place
   */
  watchTheSlider() {
    const key: string = this._$sliderSelector.metaSlider('getProp', 'key');

    // Getting the current value of the measured property
    if (key !== 'changedValue') this._getProp(key);

    // Tracking the property being changed by key
    if (key in this._keysWatchList) {
      this._keysWatchList[key].forEach((prop) => this._getProp(prop));
    }

    // Initialization of checking the dependence of slider properties on each other
    this._initCheckingDependencies(key);

    // Sets the correct step for inputs
    this._setOptionStepForInputs();
  }

  private _setOptionStepForInputs() {
    const {
      initValueFirst: inputValueFirst,
      initValueSecond: inputValueSecond,
      minValue: inputMinValue,
      maxValue: inputMaxValue,
      step: inputStep,
    } = this._selectorsObj;

    const maxValueForFirstThumbs = Number(inputValueSecond.val()) - Number(inputStep.val());
    const minValueForSecondThumbs = Number(inputValueFirst.val()) + Number(inputStep.val());

    inputValueFirst.attr({
      min: inputMinValue.val(),
      max: maxValueForFirstThumbs,
      step: inputStep.val(),
    });

    inputValueSecond.attr({
      min: minValueForSecondThumbs,
      max: inputMaxValue.val(),
      step: inputStep.val(),
    });
  }

  // Method for setting new values for the slider
  private _setProp(prop: string, value: string | number | (string | number)[]) {
    this._$sliderSelector.metaSlider('setProp', prop, value);
  }

  // Method for getting the current slider properties and setting new values in the control panel
  private _getProp(prop: string) {
    const valueProp = this._$sliderSelector.metaSlider('getProp', prop);
    const $inputTarget = this._selectorsObj[prop];

    if ($inputTarget.attr('type') === 'checkbox') {
      $inputTarget.prop('checked', valueProp);
    } else {
      $inputTarget.val(valueProp);
    }

    return valueProp;
  }

  // Forming an object with all the inputs, searching by the name of the slider property
  private _getSelectors() {
    this.propertyList.forEach((prop) => {
      this._selectorsObj[prop] = this._$panelSelector.find(`[name = ${prop}]`);
    });
  }

  /**
   * Checking whether the incoming property is dependent on other predefined slider properties
   * and setting the input in the control panel with these properties of the specified attribute
   */
  private _initCheckingDependencies(prop: string) {
    if (prop in this._objWithControlPanelDependencies) {
      this._checkingInputWithTargetProp(
        prop,
        this._objWithControlPanelDependencies[prop].checkingOptions,
        this._objWithControlPanelDependencies[prop].isReverseDependency,
      );
    }
  }

  /**
   * Checking an input with a certain slider property for the presence of a value in it
   * and setting the disabled attribute to the inputs dependent on it
   */
  private _checkingInputWithTargetProp(
    initProp: string,
    checkingOptions: string[],
    isReverseDependency: boolean,
  ) {
    const $inputTarget = this._selectorsObj[initProp];
    let targetValueInBooleanType;

    if ($inputTarget.attr('type') === 'checkbox') {
      targetValueInBooleanType = $inputTarget.prop('checked');
    } else {
      targetValueInBooleanType = Boolean($inputTarget.val());
    }

    targetValueInBooleanType = isReverseDependency
      ? !targetValueInBooleanType
      : targetValueInBooleanType;

    if (targetValueInBooleanType) {
      $inputTarget.attr('data-dependency', 'true');

      checkingOptions.forEach((targetProp) => {
        this._togglePropDisableForInput(targetProp, true);
      });
    } else if ($inputTarget.attr('data-dependency')) {
      $inputTarget.attr('data-dependency', 'false');

      checkingOptions.forEach((targetProp) => {
        this._togglePropDisableForInput(targetProp, false);
      });
    }
  }

  // Method for switching the disabled attribute for inputs
  private _togglePropDisableForInput(targetProp: string, option: boolean) {
    const $inputTarget = this._selectorsObj[targetProp];
    $inputTarget.prop('disabled', option);
  }

  // Setting new slider property values when changing control panel inputs
  private _handleInputChanges(event: Event & { target: EventTarget }) {
    const $inputTarget = $(event.target);
    const targetProp = $inputTarget.attr('name');
    let value = null;

    if ($inputTarget.attr('type') === 'checkbox') {
      value = $inputTarget.prop('checked');
    } else if ($inputTarget.attr('type') === 'text') {
      value = $inputTarget.val();
    } else {
      value = Number($inputTarget.val());
    }

    if (targetProp) this._setProp(targetProp, value);
  }
}

export default ControlPanel;

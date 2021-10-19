import $ from 'jquery';
import '../../MetaSlider/jquery.MetaSlider';

class ControlPanel {
  constructor(panelSelector, sliderSelector) {
    this.$selector = $(panelSelector);
    this.$sliderSelector = sliderSelector;
    this.customValuesDependencies = [
      'minValue',
      'maxValue',
      'step',
      'stepSizeForScale',
      'initAutoScaleCreation',
      'numberOfDecimalPlaces',
      'setNumberOfDecimalPlaces',
    ];

    this.getSelectors();
  }

  getSelectors() {
    this.selectorsObj = {
      mainColor: this.$selector.find('[name = mainColor]'),
      secondColor: this.$selector.find('[name = secondColor]'),
      colorForScale: this.$selector.find('[name = colorForScale]'),
      colorMarker: this.$selector.find('[name = colorMarker]'),
      colorTextForMarker: this.$selector.find('[name = colorTextForMarker]'),
      colorBorderForMarker: this.$selector.find('[name = colorBorderForMarker]'),
      colorThumb: this.$selector.find('[name = colorThumb]'),
      colorBorderForThumb: this.$selector.find('[name = colorBorderForThumb]'),
      initValueFirst: this.$selector.find('[name = initValueFirst]'),
      initValueSecond: this.$selector.find('[name = initValueSecond]'),
      minValue: this.$selector.find('[name = minValue]'),
      maxValue: this.$selector.find('[name = maxValue]'),
      step: this.$selector.find('[name = step]'),
      stepSizeForScale: this.$selector.find('[name = stepSizeForScale]'),
      preFix: this.$selector.find('[name = preFix]'),
      postFix: this.$selector.find('[name = postFix]'),
      setNumberOfDecimalPlaces: this.$selector.find('[name = setNumberOfDecimalPlaces]'),
      numberOfDecimalPlaces: this.$selector.find('[name = numberOfDecimalPlaces]'),
      customValues: this.$selector.find('[name = customValues]'),
      showMarkers: this.$selector.find('[name = showMarkers]'),
      showScale: this.$selector.find('[name = showScale]'),
      isRange: this.$selector.find('[name = isRange]'),
      isVertical: this.$selector.find('[name = isVertical]'),
      showBackground: this.$selector.find('[name = showBackground]'),
      initAutoMargins: this.$selector.find('[name = initAutoMargins]'),
      initFormatted: this.$selector.find('[name = initFormatted]'),
      initScaleAdjustment: this.$selector.find('[name = initScaleAdjustment]'),
      showError: this.$selector.find('[name = showError]'),
      initAutoScaleCreation: this.$selector.find('[name = initAutoScaleCreation]'),
      checkingStepSizeForScale: this.$selector.find('[name = checkingStepSizeForScale]'),
    };
  }

  watchTheSlider() {
    const key = this.$sliderSelector.metaSlider('getProp', 'key');
    const setValueVerifKeys = (
      key === 'changedValue'
      || key === 'initValueFirst'
      || key === 'initValueSecond'
      || key === 'customValues'
      || key === 'numberOfDecimalPlaces'
      || key === 'minValue'
      || key === 'maxValue'
    );

    if (setValueVerifKeys || key === 'isRange') this.getProp('initValueFirst');

    if (setValueVerifKeys) {
      this.getProp('initValueSecond');
      this.getProp('minValue');
      this.getProp('maxValue');
      this.getProp('setNumberOfDecimalPlaces');
      this.getProp('numberOfDecimalPlaces');

      if (key === 'customValues') this.getProp('initAutoScaleCreation');
    }

    if (key === 'setNumberOfDecimalPlaces') this.checkingDependencies(key, ['numberOfDecimalPlaces']);
    if (key === 'customValues') this.checkingDependencies(key, this.customValuesDependencies);
  }

  checkingDependencies(initProp, checkingOptions) {
    const target = this.selectorsObj[initProp];
    let verifyingKey;
    if (target.attr('type') === 'checkbox') {
      verifyingKey = target.prop('checked');
    } else {
      verifyingKey = target.val();
    }

    if (verifyingKey) {
      target.attr('data-disabled', true);
      checkingOptions.forEach((prop) => {
        this.propDisableToggle(prop, true);
      });
    } else if (target.attr('data-disabled')) {
      target.attr('data-disabled', false);
      checkingOptions.forEach((prop) => {
        this.propDisableToggle(prop, false);
      });
    }
  }

  handleInputChanges(event) {
    const target = $(event.target);
    const prop = target.attr('name');
    let value = '';

    if (target.attr('type') === 'checkbox') {
      value = target.prop('checked');
    } else if (target.attr('type') === 'text') {
      value = target.val();
    } else {
      value = Number(target.val());
    }

    this.setProp(prop, value);
  }

  setProp(prop, value) {
    this.$sliderSelector.metaSlider('setProp', prop, value);
  }

  propDisableToggle(prop, options) {
    const target = this.selectorsObj[prop];
    target.prop('disabled', options);
  }

  getProp(prop) {
    const resultProp = this.$sliderSelector.metaSlider('getProp', prop);
    const target = this.selectorsObj[prop];

    if (target.attr('type') === 'checkbox') {
      target.prop('checked', resultProp);
    } else {
      target.val(resultProp);
    }

    return resultProp;
  }

  init() {
    Object.entries(this.selectorsObj).forEach((valuesArray) => {
      const [prop, selector] = valuesArray;
      this.getProp(prop);

      if (prop === 'setNumberOfDecimalPlaces') this.checkingDependencies(prop, ['numberOfDecimalPlaces']);
      if (prop === 'customValues') this.checkingDependencies(prop, this.customValuesDependencies);

      selector.on('change.input', this.handleInputChanges.bind(this));
    });

    this.$sliderSelector.metaSlider('subscribe', this.watchTheSlider.bind(this));
  }
}

export default ControlPanel;

import $ from 'jquery';
import '@pages/MetaSlider/jquery.MetaSlider';

class ControlPanel {
  constructor(panelSelector, sliderSelector) {
    this.$selector = $(panelSelector);
    this.$sliderSelector = sliderSelector;
    this.selectorsObj = {};
    this.propertyList = [
      'mainColor',
      'secondColor',
      'colorForScale',
      'colorMarker',
      'colorTextForMarker',
      'colorBorderForMarker',
      'colorThumb',
      'colorBorderForThumb',
      'initValueFirst',
      'initValueSecond',
      'textValueFirst',
      'textValueSecond',
      'minValue',
      'maxValue',
      'step',
      'stepSizeForScale',
      'preFix',
      'postFix',
      'calcNumberOfDecimalPlaces',
      'numberOfDecimalPlaces',
      'customValues',
      'showMarkers',
      'showScale',
      'isRange',
      'isVertical',
      'showBackground',
      'initAutoMargins',
      'initFormatted',
      'initScaleAdjustment',
      'showError',
      'initAutoScaleCreation',
      'checkingStepSizeForScale',
    ];

    this.getSelectors();
  }

  getSelectors() {
    this.propertyList.forEach((prop) => {
      this.selectorsObj[prop] = this.$selector.find(`[name = ${prop}]`);
    });
  }

  watchTheSlider() {
    const key = this.$sliderSelector.metaSlider('getProp', 'key');
    const changeValuesVerifKeys = (
      key === 'changedValue'
      || key === 'initValueFirst'
      || key === 'initValueSecond'
    );

    if (changeValuesVerifKeys) {
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('textValueFirst');
      this.getProp('textValueSecond');
    }

    if (key === 'maxValue' || key === 'minValue') {
      this.getProp('minValue');
      this.getProp('maxValue');
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('numberOfDecimalPlaces');
    }

    if (key === 'step') {
      this.getProp('step');
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('numberOfDecimalPlaces');
      this.getProp('stepSizeForScale');
    }

    if (key === 'stepSizeForScale') this.getProp('stepSizeForScale');

    if (key === 'customValues') {
      this.getProp('customValues');
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('textValueFirst');
      this.getProp('textValueSecond');
      this.getProp('minValue');
      this.getProp('maxValue');
      this.getProp('step');
      this.getProp('stepSizeForScale');
      this.getProp('numberOfDecimalPlaces');
      this.getProp('initFormatted');
      this.getProp('calcNumberOfDecimalPlaces');
      this.getProp('initAutoScaleCreation');
      this.getProp('checkingStepSizeForScale');
    }

    if (key === 'calcNumberOfDecimalPlaces') this.getProp('numberOfDecimalPlaces');

    if (key === 'numberOfDecimalPlaces') {
      this.getProp('numberOfDecimalPlaces');
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('minValue');
      this.getProp('maxValue');
      this.getProp('step');
    }

    if (key === 'isRange') {
      this.getProp('initValueFirst');
      this.getProp('textValueFirst');
    }

    if (key === 'isVertical') {
      this.getProp('initAutoMargins');
    }

    if (key === 'initAutoScaleCreation' || key === 'checkingStepSizeForScale') {
      this.getProp('initAutoScaleCreation');
      this.getProp('checkingStepSizeForScale');
      this.getProp('stepSizeForScale');
    }

    this.initCheckingDependencies(key);
  }

  initCheckingDependencies(prop) {
    if (prop === 'isRange') this.checkingDependencies(prop, ['initValueFirst'], true);
    if (prop === 'isVertical') this.checkingDependencies(prop, ['initAutoMargins']);
    if (prop === 'initAutoScaleCreation') this.checkingDependencies(prop, ['stepSizeForScale', 'checkingStepSizeForScale']);
    if (prop === 'checkingStepSizeForScale') this.checkingDependencies(prop, ['initAutoScaleCreation']);
    if (prop === 'calcNumberOfDecimalPlaces') this.checkingDependencies(prop, ['numberOfDecimalPlaces']);

    if (prop === 'customValues') {
      const customValuesDependencies = [
        'minValue',
        'maxValue',
        'step',
        'stepSizeForScale',
        'initAutoScaleCreation',
        'numberOfDecimalPlaces',
        'calcNumberOfDecimalPlaces',
        'checkingStepSizeForScale',
        'initFormatted',
      ];

      this.checkingDependencies(prop, customValuesDependencies);
    }
  }

  checkingDependencies(initProp, checkingOptions, isReverse = false) {
    let target = this.selectorsObj[initProp];
    let verifyingKey;

    if (target.attr('type') === 'checkbox') {
      verifyingKey = target.prop('checked');
    } else {
      verifyingKey = target.val();
    }

    verifyingKey = isReverse ? !verifyingKey : verifyingKey;

    if (verifyingKey) {
      target.attr('data-link', true);

      checkingOptions.forEach((prop) => {
        this.togglePropDisable(prop, true);
      });
    } else if (target.attr('data-link')) {
      target.attr('data-link', false);

      checkingOptions.forEach((prop) => {
        this.togglePropDisable(prop, false);
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

  togglePropDisable(prop, options) {
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
      const [prop, $selector] = valuesArray;
      this.getProp(prop);
      this.initCheckingDependencies(prop);

      $selector.on('change.input', this.handleInputChanges.bind(this));
    });

    this.$sliderSelector.metaSlider('subscribe', this.watchTheSlider.bind(this));
  }
}

export default ControlPanel;

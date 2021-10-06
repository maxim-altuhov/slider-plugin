import $ from 'jquery';

class ControlPanel {
  constructor(panelSelector, sliderSelector) {
    this.$selector = $(panelSelector);
    this.$sliderSelector = sliderSelector;
    this.getSelectors();
  }

  getSelectors() {
    this.selectorsObj = {
      mainColor: this.$selector.find('[name = mainColor]'),
      secondColor: this.$selector.find('[name = secondColor]'),
      initValueFirst: this.$selector.find('[name = initValueFirst]'),
      initValueSecond: this.$selector.find('[name = initValueSecond]'),
      minValue: this.$selector.find('[name = minValue]'),
      maxValue: this.$selector.find('[name = maxValue]'),
      step: this.$selector.find('[name = step]'),
      stepSizeForScale: this.$selector.find('[name = stepSizeForScale]'),
      preFix: this.$selector.find('[name = preFix]'),
      postFix: this.$selector.find('[name = postFix]'),
      customValues: this.$selector.find('[name = customValues]'),
      showMarkers: this.$selector.find('[name = showMarkers]'),
      showTheScale: this.$selector.find('[name = showTheScale]'),
      isRange: this.$selector.find('[name = isRange]'),
      isVertical: this.$selector.find('[name = isVertical]'),
    };
  }

  init() {
    Object.keys(this.selectorsObj).forEach((selector) => {
      this.getProp(selector);
    });
  }

  setProp(prop, value) {
    const data = this.$sliderSelector.data('metaSlider');
    data.model.opt[prop] = value;
  }

  getProp(prop) {
    const data = this.$sliderSelector.data('metaSlider');
    const target = this.selectorsObj[prop];
    const resultProp = data.model.opt[prop];

    if (typeof resultProp === 'boolean') {
      target.prop('checked', resultProp);
    } else {
      target.val(resultProp);
    }

    return resultProp;
  }
}

export default ControlPanel;

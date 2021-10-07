import $ from 'jquery';
import '../../MetaSlider/jquery.MetaSlider';

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

  handleInputChanges(event) {
    const target = $(event.target);
    const prop = target.attr('name');
    let value = '';

    if (target.attr('type') === 'checkbox') {
      value = target.prop('checked');
    } else {
      value = target.val();
    }

    this.setProp(prop, value);
  }

  setProp(prop, value) {
    this.$sliderSelector.metaSlider('setProp', prop, value);
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

      selector.on('change.input', this.handleInputChanges.bind(this));
    });
  }
}

export default ControlPanel;

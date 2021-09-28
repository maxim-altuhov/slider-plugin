import $ from 'jquery';

class ViewMinAndMaxValue {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  init() {
    console.log('Init MinAndMaxValues');
    this.opt = this.presenter.getOptionsObj();
    this.$selector = this.opt.$initSelector;
  }
}

export default ViewMinAndMaxValue;

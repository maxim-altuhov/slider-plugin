import $ from 'jquery';

class ViewScale {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  init() {
    console.log('Init Scale');
    this.opt = this.presenter.getOptionsObj();
    this.$selector = this.opt.$initSelector;
  }
}

export default ViewScale;

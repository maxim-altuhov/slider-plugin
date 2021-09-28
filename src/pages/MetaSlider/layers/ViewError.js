import $ from 'jquery';

class ViewError {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  init() {
    console.log('Init Error');
    this.opt = this.presenter.getOptionsObj();
    this.$selector = this.opt.$initSelector;
    this.$elemSlider = this.opt.$elemSlider;
  }

  renderErrorMessage(message) {
    if (this.opt.showError) {
      const HTMLBlockError = `<div class="error-info js-error-info"><p class="error-info__text">${message}</p><button type="button" class="error-info__close js-error-info__close">X</button></div>`;
      this.$elemSlider.after(HTMLBlockError);
      this.presenter.setProp('showError', false);

      this.$elemErrorInfo = this.$selector.find('.js-error-info');
      this.$btnErrorClose = this.$selector.find('.js-error-info__close');
    }
  }
}

export default ViewError;

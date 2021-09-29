class ViewError {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  getProp(prop) {
    return this.presenter.getProp(prop);
  }

  setProp(prop, value) {
    this.presenter.setProp(prop, value);
  }

  init() {
    this.$selector = this.getProp('$initSelector');
    this.$elemSlider = this.getProp('$elemSlider');
  }

  renderError(message) {
    if (this.getProp('showError')) {
      const HTMLBlockError = `<div class="error-info js-error-info"><p class="error-info__text">${message}</p><button type="button" class="error-info__close js-error-info__close">X</button></div>`;
      this.$elemSlider.after(HTMLBlockError);

      this.getInfoAboutError();
      this.setEventErrorClose();
      this.setProp('showError', false);
    }
  }

  getInfoAboutError() {
    this.$elemErrorInfo = this.$selector.find('.js-error-info');
    this.$btnErrorClose = this.$selector.find('.js-error-info__close');
  }

  handleRemoveErrorWindow() {
    this.$elemErrorInfo.remove();
    this.setProp('showError', true);
  }

  setEventErrorClose() {
    if (this.$btnErrorClose) {
      this.$btnErrorClose.on('click.btnErrorClose', this.handleRemoveErrorWindow.bind(this));
    }
  }
}

export default ViewError;

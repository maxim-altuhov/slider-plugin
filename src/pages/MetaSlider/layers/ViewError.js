class ViewError {
  renderError(message, options) {
    if (!this.$selector) this.$selector = options.$selector;

    if (options.showError && !this.$elemErrorInfo) {
      const HTMLBlockError = `<div class="error-info js-error-info"><p class="error-info__text js-error-info__text">${message}</p><button type="button" class="error-info__close js-error-info__close">X</button></div>`;
      options.$elemSlider.after(HTMLBlockError);

      this.getInfoAboutError();
      this.setEventErrorClose();
    } else if (options.showError && this.$elemErrorInfo) {
      this.$elemErrorText.text(message);
    }
  }

  getInfoAboutError() {
    this.$elemErrorInfo = this.$selector.find('.js-error-info');
    this.$elemErrorText = this.$selector.find('.js-error-info__text');
    this.$btnErrorClose = this.$selector.find('.js-error-info__close');
  }

  handleRemoveErrorWindow() {
    this.$elemErrorInfo.remove();
  }

  setEventErrorClose() {
    if (this.$btnErrorClose) {
      this.$btnErrorClose.on('click.btnErrorClose', this.handleRemoveErrorWindow.bind(this));
    }
  }
}

export default ViewError;

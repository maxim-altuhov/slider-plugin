class ViewError {
  // Рендерим ошибку
  renderError(message, options) {
    const {
      $selector,
      $elemSlider,
      showError,
    } = options;

    if (!this.$selector) this.$selector = $selector;

    if (showError && !this.$elemErrorInfo) {
      const HTMLBlockError = `<div class="error-info js-error-info"><p class="error-info__text js-error-info__text">${message}</p><button type="button" class="error-info__close js-error-info__close">X</button></div>`;
      $elemSlider.after(HTMLBlockError);

      this.getInfoAboutError();
      this.setEventErrorClose();
    } else if (showError && this.$elemErrorInfo) {
      this.$elemErrorText.text(message);
    }
  }

  // Собираем селекторы
  getInfoAboutError() {
    this.$elemErrorInfo = this.$selector.find('.js-error-info');
    this.$elemErrorText = this.$selector.find('.js-error-info__text');
    this.$btnErrorClose = this.$selector.find('.js-error-info__close');
  }

  // Устанавливаем обработчик на кнопку закрытия окна с ошибкой
  setEventErrorClose() {
    if (this.$btnErrorClose) this.$btnErrorClose.on('click.btnErrorClose', this.handleRemoveErrorWindow.bind(this));
  }

  // Удаляем сообщение с ошибкой
  handleRemoveErrorWindow() {
    this.$btnErrorClose.off('click.btnErrorClose');
    this.$elemErrorInfo.remove();
    this.$elemErrorInfo = null;
    this.$elemErrorText = null;
    this.$btnErrorClose = null;
  }
}

export default ViewError;

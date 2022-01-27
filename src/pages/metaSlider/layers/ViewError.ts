class ViewError {
  private _$selector: undefined | JQuery<HTMLElement>;
  private _$elemErrorInfo: undefined | JQuery<HTMLElement>;
  private _$elemErrorText: undefined | JQuery<HTMLElement>;
  private _$elemErrorCloseBtn: undefined | JQuery<HTMLElement>;

  renderError(message: string, options: IPluginOptions) {
    const { $selector, $elemSlider, showError } = options;

    if (!this._$selector) this._$selector = $selector;

    if (showError && !this._$elemErrorInfo) {
      const HTMLBlockError = `<div class="error-info js-error-info">
      <p class="error-info__text js-error-info__text">${message}</p>
      <button type="button" class="error-info__close-btn js-error-info__close-btn">X</button>
      </div>`;
      $elemSlider.after(HTMLBlockError);

      this._getErrorBlockSelectors();
      this._setEventErrorClose();
    } else if (showError && this._$elemErrorText) {
      this._$elemErrorText.text(message);
    }
  }

  // Collecting selectors
  private _getErrorBlockSelectors() {
    if (this._$selector) {
      this._$elemErrorInfo = this._$selector.find('.js-error-info');
      this._$elemErrorText = this._$selector.find('.js-error-info__text');
      this._$elemErrorCloseBtn = this._$selector.find('.js-error-info__close-btn');
    }
  }

  // Setting the handler to the close window button with an error
  private _setEventErrorClose() {
    if (this._$elemErrorCloseBtn) {
      this._$elemErrorCloseBtn.on('click.closeBtn', this._handleCloseBtnClick.bind(this));
    }
  }

  // Deleting the error message
  private _handleCloseBtnClick() {
    if (this._$elemErrorCloseBtn && this._$elemErrorInfo) {
      this._$elemErrorCloseBtn.off('click.closeBtn');
      this._$elemErrorInfo.remove();
      this._$elemErrorInfo = undefined;
      this._$elemErrorText = undefined;
      this._$elemErrorCloseBtn = undefined;
    }
  }
}

export default ViewError;

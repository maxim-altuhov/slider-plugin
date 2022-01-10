class ViewError {
  private _$selector: undefined | JQuery<HTMLElement>;
  private _$elemErrorInfo: null | JQuery<HTMLElement> | undefined;
  private _$elemErrorText: null | JQuery<HTMLElement> | undefined;
  private _$btnErrorClose: null | JQuery<HTMLElement> | undefined;

  renderError(message: string, options: IPluginOptions) {
    const { $selector, $elemSlider, showError } = options;

    if (!this._$selector) this._$selector = $selector;

    if (showError && !this._$elemErrorInfo) {
      const HTMLBlockError = `<div class="error-info js-error-info">
      <p class="error-info__text js-error-info__text">${message}</p>
      <button type="button" class="error-info__close js-error-info__close">X</button>
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
      this._$btnErrorClose = this._$selector.find('.js-error-info__close');
    }
  }

  // Setting the handler to the close window button with an error
  private _setEventErrorClose() {
    if (this._$btnErrorClose) {
      this._$btnErrorClose.on('click.btnErrorClose', this._handleRemoveErrorBlock.bind(this));
    }
  }

  // Deleting the error message
  private _handleRemoveErrorBlock() {
    if (this._$btnErrorClose && this._$elemErrorInfo) {
      this._$btnErrorClose.off('click.btnErrorClose');
      this._$elemErrorInfo.remove();
      this._$elemErrorInfo = null;
      this._$elemErrorText = null;
      this._$btnErrorClose = null;
    }
  }
}

export default ViewError;

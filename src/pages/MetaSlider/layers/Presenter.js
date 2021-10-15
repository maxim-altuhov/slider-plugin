class Presenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  getView(view) {
    return this.view.views[view];
  }

  calcTargetValue(event, initValue, onlyReturn) {
    this.model.calcTargetValue(event, initValue, onlyReturn);
  }

  renderError(message, options) {
    this.getView('viewError').renderError(message, options);
  }

  updateViews(options) {
    this.view.update(options);
  }

  setObservers() {
    this.model.subscribe(this.updateViews.bind(this));
    this.model.errorEvent.subscribe(this.renderError.bind(this));

    this.getView('viewSlider').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewThumbs').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewScale').subscribe(this.calcTargetValue.bind(this));
  }
}

export default Presenter;

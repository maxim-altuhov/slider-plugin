class Presenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  getView(view) {
    return this.view.views[view];
  }

  initViews(options) {
    if (options.key === 'init') {
      this.view.init(options);
      this.model.unsubscribe(this.linkInitViewsFunc);
    }
  }

  calcTargetValue(event, initValue, onlyReturn) {
    this.model.calcTargetValue(event, initValue, onlyReturn);
  }

  renderError(message, options) {
    this.getView('viewError').renderError(message, options);
  }

  updateViews(options) {
    this.setValueForSlider(options);

    this.getView('viewSlider').update(options);
    this.getView('viewMarkers').update(options);
    this.getView('viewMinAndMax').update(options);
  }

  setValueForSlider(options) {
    this.getView('viewThumbs').setValueInThumbs(options);
  }

  setObservers() {
    this.linkInitViewsFunc = this.initViews.bind(this);

    this.model.subscribe(this.linkInitViewsFunc);
    this.model.subscribe(this.updateViews.bind(this));
    this.model.errorEvent.subscribe(this.renderError.bind(this));

    this.getView('viewSlider').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewThumbs').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewMinAndMax').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewScale').subscribe(this.calcTargetValue.bind(this));
  }
}

export default Presenter;

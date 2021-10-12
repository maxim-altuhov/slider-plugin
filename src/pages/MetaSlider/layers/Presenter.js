class Presenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  getView(view) {
    return this.view.views[view];
  }

  initViews(options) {
    this.view.init(options);
  }

  calcTargetValue(event, initValue, onlyReturn) {
    this.model.calcTargetValue(event, initValue, onlyReturn);
  }

  renderError(message, options) {
    this.getView('viewError').renderError(message, options);
  }

  setValueForSlider(options) {
    this.getView('viewThumbs').setValueInThumbs(options);
    this.getView('viewSlider').setBackgroundTheRange(options);
    this.getView('viewMarkers').setValueInMarkers(options);
  }

  setObservers() {
    this.getView('viewSlider').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewThumbs').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewMinAndMax').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewScale').subscribe(this.calcTargetValue.bind(this));

    this.model.initViewsEvent.subscribe(this.initViews.bind(this));
    this.model.errorEvent.subscribe(this.renderError.bind(this));
    this.model.setValueEvent.subscribe(this.setValueForSlider.bind(this));
  }
}

export default Presenter;

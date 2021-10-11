class Presenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  getView(view) {
    return this.view.views[view];
  }

  getProp(prop) {
    return this.model.getProp(prop);
  }

  setProp(prop, value) {
    this.model.setProp(prop, value);
  }

  getOptionsObj() {
    return this.model.getOptionsObj();
  }

  initViews(options) {
    this.view.init(options);
  }

  calcTargetValue(event, initValue, onlyReturn) {
    this.model.calcTargetValue(event, initValue, onlyReturn);
  }

  renderError(options, message) {
    this.getView('viewError').renderError(options, message);
  }

  setValueForSlider(options) {
    this.getView('viewThumbs').setValueInThumbs(options);
    this.getView('viewSlider').setBackgroundTheRange(options);
    this.getView('viewMarkers').setValueInMarkers(options);
  }

  renderSliderElem(options) {
    this.getView('viewMinAndMax').initRender(options);
    this.getView('viewScale').initRender(options);
  }

  setObservers() {
    const options = this.getOptionsObj();
    this.getView('viewSlider').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewThumbs').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewMinAndMax').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewScale').subscribe(this.calcTargetValue.bind(this));

    this.model.initViewsEvent.subscribe(this.initViews.bind(this, options));
    this.model.errorEvent.subscribe(this.renderError.bind(this, options));
    this.model.setValueEvent.subscribe(this.setValueForSlider.bind(this, options));
    this.model.renderSliderElemEvent.subscribe(this.renderSliderElem.bind(this, options));
  }
}

export default Presenter;

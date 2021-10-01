class Presenter {
  constructor(views) {
    this.views = views;
    this.model = null;
  }

  setModel(model) {
    this.model = model;
  }

  getView(view) {
    return this.views[view];
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

  setObservers() {
    const {
      viewSlider,
      viewMarkers,
      viewThumbs,
      viewScale,
      viewMinAndMaxVal,
      viewError,
    } = this.views;
    this.model.errorEvent.subscribe(viewError.renderError.bind(viewError));
    this.model.setValueForSliderEvent.subscribe(viewThumbs.setValueInThumbs.bind(viewThumbs));
    this.model.setValueForSliderEvent.subscribe(viewSlider.setBackgroundTheRange.bind(viewSlider));
    this.model.setValueForSliderEvent.subscribe(viewMarkers.setValueInMarkers.bind(viewMarkers));
    this.model.renderSliderElemEvent.subscribe(viewMinAndMaxVal.initRender.bind(viewMinAndMaxVal));
    this.model.renderSliderElemEvent.subscribe(viewScale.initRender.bind(viewScale));
  }

  checkTargetValue(targetValue, event) {
    this.model.checkTargetValue(targetValue, event);
  }

  calcTargetValue(event, initValue) {
    return this.model.calcTargetValue(event, initValue);
  }
}

export default Presenter;

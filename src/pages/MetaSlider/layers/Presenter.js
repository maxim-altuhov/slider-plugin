class Presenter {
  constructor(views) {
    this.views = views;
    this.model = null;
  }

  setModel(model) {
    this.model = model;
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
      viewMinAndMax,
      viewError,
    } = this.views;
    const options = this.getOptionsObj();

    this.model.errorEvent.subscribe(viewError.renderError.bind(viewError, options));
    this.model.setValueEvent.subscribe(viewThumbs.setValueInThumbs.bind(viewThumbs, options));
    this.model.setValueEvent.subscribe(viewSlider.setBackgroundTheRange.bind(viewSlider, options));
    this.model.setValueEvent.subscribe(viewMarkers.setValueInMarkers.bind(viewMarkers, options));
    this.model.renderSliderEvent.subscribe(viewMinAndMax.initRender.bind(viewMinAndMax, options));
    this.model.renderSliderEvent.subscribe(viewScale.initRender.bind(viewScale, options));
  }

  checkTargetValue(targetValue, event) {
    this.model.checkTargetValue(targetValue, event);
  }

  calcTargetValue(event, initValue) {
    return this.model.calcTargetValue(event, initValue);
  }
}

export default Presenter;

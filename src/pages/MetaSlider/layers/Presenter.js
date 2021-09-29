import $ from 'jquery';

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
    this.model.errorEvent.subscribe(this.views.viewError.renderError.bind(this.views.viewError));
  }
}

export default Presenter;
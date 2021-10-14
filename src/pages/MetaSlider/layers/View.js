import ViewSlider from './ViewSlider';
import ViewScale from './ViewScale';
import ViewMarkers from './ViewMarkers';
import ViewThumbs from './ViewThumbs';
import ViewMinAndMaxValues from './ViewMinAndMaxValues';
import ViewError from './ViewError';

class View {
  constructor() {
    this.views = {
      viewError: new ViewError(),
      viewSlider: new ViewSlider(),
      viewThumbs: new ViewThumbs(),
      viewMarkers: new ViewMarkers(),
      viewMinAndMax: new ViewMinAndMaxValues(),
      viewScale: new ViewScale(),
    };
  }

  init(options) {
    Object.keys(this.views).forEach((view) => {
      if ('init' in this.views[view]) this.views[view].init(options);
    });
  }

  renderSlider(initSelector) {
    this.views.viewSlider.renderSlider(initSelector);
  }
}

export default View;

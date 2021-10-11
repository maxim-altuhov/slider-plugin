import ViewSlider from './ViewSlider';
import ViewScale from './ViewScale';
import ViewMarkers from './ViewMarkers';
import ViewThumbs from './ViewThumbs';
import ViewMinAndMaxValues from './ViewMinAndMaxValues';
import ViewError from './ViewError';

class View {
  constructor() {
    this.views = {
      viewSlider: new ViewSlider(),
      viewThumbs: new ViewThumbs(),
      viewMarkers: new ViewMarkers(),
      viewScale: new ViewScale(),
      viewMinAndMax: new ViewMinAndMaxValues(),
      viewError: new ViewError(),
    };
  }

  init(options) {
    Object.keys(this.views).forEach((view) => {
      this.views[view].init(options);
    });
  }
}

export default View;

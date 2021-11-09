import ViewSlider from './ViewSlider';
import ViewScale from './ViewScale';
import ViewMarkers from './ViewMarkers';
import ViewThumbs from './ViewThumbs';
import ViewError from './ViewError';

class View {
  views: IObjectOrClass;

  constructor() {
    this.views = {
      viewError: new ViewError(),
      viewScale: new ViewScale(),
      viewSlider: new ViewSlider(),
      viewThumbs: new ViewThumbs(),
      viewMarkers: new ViewMarkers(),
    };
  }

  // Вызываем метод update() в subview
  update(options: PluginOptions) {
    Object.keys(this.views).forEach((view) => {
      if ('update' in this.views[view]) this.views[view].update(options);
    });
  }

  // Первоначальный рендер слайдера и его основных элементов
  renderSlider(initSelector: JQuery) {
    this.views['viewSlider'].renderSlider(initSelector);
  }
}

export default View;

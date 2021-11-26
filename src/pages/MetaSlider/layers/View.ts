import ViewSlider from './ViewSlider';
import ViewScale from './ViewScale';
import ViewMarkers from './ViewMarkers';
import ViewThumbs from './ViewThumbs';
import ViewError from './ViewError';

class View {
  readonly viewList: Record<string, any>;

  constructor() {
    this.viewList = {
      viewError: new ViewError(),
      viewScale: new ViewScale(),
      viewSlider: new ViewSlider(),
      viewThumbs: new ViewThumbs(),
      viewMarkers: new ViewMarkers(),
    };
  }

  // Вызываем метод update() в subview
  update(options: IPluginOptions) {
    Object.keys(this.viewList).forEach((view) => {
      if ('update' in this.viewList[view]) this.viewList[view].update(options);
    });
  }

  // Первоначальный рендер слайдера и его основных элементов
  renderSlider($initSelector: JQuery) {
    this.viewList['viewSlider'].renderSlider($initSelector);
  }
}

export default View;

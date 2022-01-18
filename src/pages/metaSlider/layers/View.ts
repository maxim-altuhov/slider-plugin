import ViewSlider from './ViewSlider';
import ViewScale from './ViewScale';
import ViewMarkers from './ViewMarkers';
import ViewThumbs from './ViewThumbs';
import ViewError from './ViewError';

class View {
  /**
   * I use the any type to be able to access any method
   * of the class instance in the viewList object.
   */
  readonly viewList: Record<string, any> = {
    viewError: new ViewError(),
    viewScale: new ViewScale(),
    viewSlider: new ViewSlider(),
    viewThumbs: new ViewThumbs(),
    viewMarkers: new ViewMarkers(),
  };

  update(options: IPluginOptions) {
    Object.keys(this.viewList).forEach((view) => {
      if ('update' in this.viewList[view]) this.viewList[view].update(options);
    });
  }

  // Initial render of the slider and its main elements
  renderSlider($initSelector: JQuery) {
    this.viewList['viewSlider'].renderSlider($initSelector);
  }
}

export default View;

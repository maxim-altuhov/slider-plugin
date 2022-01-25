import createUniqueID from '../utils/createUniqueID';
import Observer from '../patterns/Observer';
import ViewSlider from './ViewSlider';
import ViewScale from './ViewScale';
import ViewMarkers from './ViewMarkers';
import ViewThumbs from './ViewThumbs';
import ViewError from './ViewError';

class View extends Observer implements IMainView {
  private _$selector = $();

  /**
   * I use the any type to be able to access any method
   * of the class instance in the viewList object.
   */
  readonly viewList: Record<string, any> = {
    viewError: new ViewError(),
    viewScale: new ViewScale(this),
    viewSlider: new ViewSlider(this),
    viewThumbs: new ViewThumbs(this),
    viewMarkers: new ViewMarkers(),
  };

  // Initial render of the slider and its main elements
  renderSlider($initSelector: JQuery<HTMLElement>) {
    const sliderID = createUniqueID();

    this._$selector = $initSelector;
    const $fragmentWithASlider = $(document.createDocumentFragment());
    const $blockSlider = $(document.createElement('div'));

    $blockSlider.addClass('meta-slider js-meta-slider');
    this._$selector.attr('data-id', sliderID);

    const HTMLBlock = `<div class="meta-slider__progress js-meta-slider__progress"></div>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_left" data-value="" data-text="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_left"></span>
    </button>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_right" data-value="" data-text="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_right"></span>
    </button>
    <div class="meta-slider__scale js-meta-slider__scale"></div>`;

    $blockSlider.html(HTMLBlock);

    $fragmentWithASlider.append($blockSlider);
    this._$selector.append($fragmentWithASlider);
  }

  updateViews(options: IPluginOptions) {
    Object.keys(this.viewList).forEach((view) => {
      if ('update' in this.viewList[view]) this.viewList[view].update(options);
    });
  }

  updateModel(event: Event, targetValue?: number) {
    this.notify(event, targetValue);
  }
}

export default View;

import createUniqueID from '../utils/createUniqueID';
import Observer from '../patterns/Observer';
import ViewSlider from './ViewSlider';
import ViewScale from './ViewScale';
import ViewMarkers from './ViewMarkers';
import ViewThumbs from './ViewThumbs';

class View extends Observer {
  readonly subViewsList: Record<string, ISubView> = {
    viewSlider: new ViewSlider(),
    viewScale: new ViewScale(),
    viewThumbs: new ViewThumbs(),
    viewMarkers: new ViewMarkers(),
  };
  private _$selector = $();

  // Adding method "updateModel" to the observer list in subviews
  setObservers() {
    Object.values(this.subViewsList).forEach((view) => {
      if (view.subscribe) view.subscribe(this.updateModel.bind(this));
    });
  }

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
    <div class="meta-slider__scale js-meta-slider__scale">
      <button type="button" class="meta-slider__scale-point js-meta-slider__scale-point" style="display: none;"></button>
    </div>`;

    $blockSlider.html(HTMLBlock);

    $fragmentWithASlider.append($blockSlider);
    this._$selector.append($fragmentWithASlider);
  }

  updateViews(options: IPluginOptions) {
    Object.values(this.subViewsList).forEach((view) => {
      if (view.update) view.update(options);
    });
  }

  updateModel(event: Event, targetValue?: number) {
    this.notify(event, targetValue);
  }
}

export default View;

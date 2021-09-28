import $ from 'jquery';

class ViewMarkers {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  init() {
    console.log('Init Markers');
    this.opt = this.presenter.getOptionsObj();
    this.$selector = this.opt.$initSelector;
    this.getInfoAboutMarkers();
  }

  getInfoAboutMarkers() {
    this.$elemMarkers = this.$selector.find('.js-meta-slider__marker');
    this.heightMarker = this.$elemMarkers.eq(-1).outerHeight();

    this.presenter.setProp('$elemMarkers', this.$elemMarkers);
    this.presenter.setProp('$heightMarker', this.heightMarker);
  }
}

export default ViewMarkers;

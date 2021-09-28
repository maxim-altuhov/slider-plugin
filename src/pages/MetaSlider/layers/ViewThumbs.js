import $ from 'jquery';

class ViewThumbs {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  init() {
    console.log('Init Thumbs');
    this.opt = this.presenter.getOptionsObj();
    this.$selector = this.opt.$initSelector;
    this.getInfoAboutThumbs();
  }

  getInfoAboutThumbs() {
    this.$elemThumbs = this.$selector.find('.js-meta-slider__thumb');
    this.heightThumb = this.$elemThumbs.eq(-1).outerHeight();

    this.presenter.setProp('$elemThumbs', this.$elemThumbs);
    this.presenter.setProp('heightThumb', this.heightThumb);
  }
}

export default ViewThumbs;

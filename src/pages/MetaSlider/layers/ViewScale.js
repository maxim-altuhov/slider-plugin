import $ from 'jquery';

class ViewScale {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  init() {
    console.log('Init Scale');
    this.opt = this.presenter.getOptionsObj();
    this.$selector = this.opt.$initSelector;
  }

  createScale() {
    if (!this.showMinAndMax) this.$elemSlider.css('margin-bottom', '');

    if (this.showTheScale) {
      this.scalePointsSize = 0;
      this.mapSkipScalePoints = new Map();

      const $fragmentWithScale = $(document.createDocumentFragment());
      const $blockScale = $(document.createElement('div'));
      const stepSizeValue = this.initAutoScaleCreation ? this.step : this.stepSizeForScale;
      let currentValue = this.minValue;

      $blockScale.addClass('meta-slider__scale');
      this.$elemSlider.append($blockScale);

      for (; currentValue <= this.maxValue; currentValue += stepSizeValue) {
        currentValue = Number(currentValue.toFixed(this.numberOfDecimalPlaces));

        const isCustomValue = this.customValues.length > 0;
        const convertedValue = this.initFormatted ? currentValue.toLocaleString() : currentValue;
        const resultValue = isCustomValue ? this.customValues[currentValue] : convertedValue;

        const elemScalePoint = `<button type="button" class="meta-slider__scale-point js-meta-slider__scale-point" data-value="${currentValue}">${this.preFix}${resultValue}${this.postFix}</button>`;

        $blockScale.append(elemScalePoint);
        $fragmentWithScale.append($blockScale);
      }

      this.$elemSlider.append($fragmentWithScale);

      this.$elemScalePoints = this.$selector.find('.js-meta-slider__scale-point');

      this.$elemScalePoints.each((index, scalePoint) => {
        const $scalePoint = $(scalePoint);
        const valueInScalePoint = Number($scalePoint.attr('data-value'));
        const resultValue = (valueInScalePoint - this.minValue) / (this.maxValue - this.minValue);
        this.scalePointsSize += $scalePoint.outerWidth();

        $scalePoint.css('left', `${resultValue * 100}%`);
      });

      if (this.initAutoMargins) this.$elemSlider.css('margin-bottom', `${this.$elemScalePoints.eq(0).outerHeight() * 3}px`);
    }
  }

  setPropForSkipScalePoint($scalePoint) {
    $scalePoint.addClass('meta-slider__scale-point_skip').attr('tabindex', -1);
    this.op.skipScalePointsArray.push($scalePoint);
  }

  checkingScaleSize() {
    if (this.showTheScale && this.initScaleAdjustment) {
      const MARGIN_POINTS = 100;
      const sliderSize = this.$elemSlider.outerWidth();

      while (this.scalePointsSize + MARGIN_POINTS > sliderSize) {
        const totalSizeScalePoints = this.scalePointsSize + MARGIN_POINTS;
        this.skipScalePointsArray = [];
        this.$elemScalePoints = this.$selector.find('.js-meta-slider__scale-point:not(.meta-slider__scale-point_skip)');
        this.scalePointsSize = 0;

        const sizeScalePointsArray = this.$elemScalePoints.length;

        if (sizeScalePointsArray <= 2) break;

        this.$elemScalePoints.each((index, scalePoint) => {
          const $currentScalePoint = $(scalePoint);
          const firstOrLastIndex = (index === 0) || (index === (sizeScalePointsArray - 1));
          const intervalWithoutFirstAndLastIndex = !firstOrLastIndex && sizeScalePointsArray <= 6;

          if (index % 2 !== 0 && sizeScalePointsArray > 6) {
            this.setPropForSkipScalePoint($currentScalePoint);
          } else if ((sizeScalePointsArray % 2 !== 0) && sizeScalePointsArray <= 6) {
            this.setPropForSkipScalePoint($currentScalePoint);
          } else if ((sizeScalePointsArray % 2 === 0) && intervalWithoutFirstAndLastIndex) {
            this.setPropForSkipScalePoint($currentScalePoint);
          }

          if (!$currentScalePoint.hasClass('meta-slider__scale-point_skip')) this.scalePointsSize += $currentScalePoint.outerWidth();
        });

        this.mapSkipScalePoints.set(totalSizeScalePoints, [...this.skipScalePointsArray]);
      }

      this.mapSkipScalePoints.forEach((scalePointSkipArray, controlSize) => {
        if (sliderSize > controlSize + (MARGIN_POINTS / 3)) {
          scalePointSkipArray.forEach(($scalePoint) => {
            $scalePoint.removeAttr('tabindex').removeClass('meta-slider__scale-point_skip');
            this.scalePointsSize += $scalePoint.outerWidth();
          });

          this.mapSkipScalePoints.delete(controlSize);
        }
      });
    }
  }

  handleCheckingScaleSize() {
    this.checkingScaleSize();
  }

  handleGetValueInScalePoint(event) {
    event.preventDefault();
    const $target = $(event.target);
    let targetValue = Number($target.attr('data-value'));

    if (!$target.hasClass('js-meta-slider__value')) {
      targetValue = this.verifyInitValues ? this.calcTargetValue(null, targetValue) : targetValue;
    }

    this.checkTargetValue(
      targetValue,
      event,
    );
  }

  setEventsWindow() {
    if (this.showTheScale && this.initScaleAdjustment) {
      $(window).on('resize.scale', this.handleCheckingScaleSize.bind(this));
    }
  }

  setEventsSlider() {
    if (this.$elemScalePoints) {
      this.$elemScalePoints.each((index, elemPoint) => {
        $(elemPoint).on('click.scalePoint', this.handleGetValueInScalePoint.bind(this));
      });
    }
  }
}

export default ViewScale;

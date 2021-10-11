import $ from 'jquery';
import Observer from '../patterns/Observer';
class ViewScale extends Observer {
  init(options) {
    this.$selector = options.$initSelector;
    this.$elemSlider = this.$selector.find('.js-meta-slider');
  }

  initRender(options) {
    this.createScale(options);
    this.handleCheckingScaleSize(options);
    this.setEventsScalePoints();
    this.setEventsWindow(options);
  }

  createScale(options) {
    if (!options.showMinAndMax) this.$elemSlider.css('margin-bottom', '');

    if (options.showTheScale) {
      const {
        initAutoScaleCreation,
        step,
        stepSizeForScale,
        minValue,
        maxValue,
        numberOfDecimalPlaces,
        customValues,
        initFormatted,
        colorForScale,
        preFix,
        postFix,
        initAutoMargins,
      } = options;
      const $fragmentWithScale = $(document.createDocumentFragment());
      const $blockScale = $(document.createElement('div'));

      const stepSizeValue = initAutoScaleCreation ? step : stepSizeForScale;
      let currentValue = minValue;

      $blockScale.addClass('meta-slider__scale').css({ borderColor: colorForScale, color: colorForScale });
      this.$elemSlider.append($blockScale);

      for (; currentValue <= maxValue; currentValue += stepSizeValue) {
        currentValue = Number(currentValue.toFixed(numberOfDecimalPlaces));

        const isCustomValue = customValues.length > 0;
        const convertedValue = initFormatted ? currentValue.toLocaleString() : currentValue;
        const resultValue = isCustomValue ? customValues[currentValue] : convertedValue;

        const elemScalePoint = `<button type="button" class="meta-slider__scale-point js-meta-slider__scale-point" style="color: inherit" data-value="${currentValue}">${preFix}${resultValue}${postFix}</button>`;

        $blockScale.append(elemScalePoint);
        $fragmentWithScale.append($blockScale);
      }

      this.$elemSlider.append($fragmentWithScale);

      this.$elemScalePoints = this.$selector.find('.js-meta-slider__scale-point');
      this.scalePointsSize = 0;
      this.mapSkipScalePoints = new Map();

      this.$elemScalePoints.each((index, scalePoint) => {
        const $scalePoint = $(scalePoint);
        const valueInScalePoint = Number($scalePoint.attr('data-value'));
        const resultValue = (valueInScalePoint - minValue) / (maxValue - minValue);
        this.scalePointsSize += $scalePoint.outerWidth();

        $scalePoint.css('left', `${resultValue * 100}%`);
      });

      if (initAutoMargins) this.$elemSlider.css('margin-bottom', `${this.$elemScalePoints.eq(0).outerHeight() * 3}px`);
    }
  }

  setPropForSkipScalePoint($scalePoint) {
    $scalePoint.addClass('meta-slider__scale-point_skip')
      .attr('tabindex', -1)
      .css({ color: 'transparent', borderColor: 'inherit' });
    this.skipScalePointsArray.push($scalePoint);
  }

  handleCheckingScaleSize(options) {
    if (options.showTheScale && options.initScaleAdjustment) {
      const MARGIN_PX = 100;
      const sliderSize = this.$elemSlider.outerWidth();

      while (this.scalePointsSize + MARGIN_PX > sliderSize) {
        const totalSizeScalePoints = this.scalePointsSize + MARGIN_PX;
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
        if (sliderSize > controlSize + (MARGIN_PX / 3)) {
          scalePointSkipArray.forEach(($scalePoint) => {
            $scalePoint.removeAttr('tabindex')
              .removeClass('meta-slider__scale-point_skip')
              .css({ color: 'inherit', borderColor: '' });
            this.scalePointsSize += $scalePoint.outerWidth();
          });

          this.mapSkipScalePoints.delete(controlSize);
        }
      });
    }
  }

  handleGetValueInScalePoint(event) {
    event.preventDefault();
    const $target = $(event.target);
    let targetValue = Number($target.attr('data-value'));

    this.notify(event, targetValue);
  }

  setEventsWindow(options) {
    if (options.showTheScale && options.initScaleAdjustment) {
      $(window).on('resize.scale', this.handleCheckingScaleSize.bind(this, options));
    }
  }

  setEventsScalePoints() {
    if (this.$elemScalePoints) {
      this.$elemScalePoints.each((index, elemPoint) => {
        $(elemPoint).on('click.scalePoint', this.handleGetValueInScalePoint.bind(this));
      });
    }
  }
}

export default ViewScale;

import $ from 'jquery';
import Observer from '../patterns/Observer';

class ViewThumbs extends Observer {
  isFirstInit: boolean;
  $selector: JQuery;
  $elemThumbs: JQuery;

  constructor() {
    super();
    this.isFirstInit = true;
  }

  // Обновление view
  update(options: IPluginOptions) {
    if (this.isFirstInit) {
      this._init(options);
      this.isFirstInit = false;
    }

    const { key } = options;

    // prettier-ignore
    const setValueVerifKeys = (
      key === 'init' ||
      key === 'changedValue' ||
      key === 'initValueFirst' ||
      key === 'initValueSecond' ||
      key === 'customValues' ||
      key === 'calcNumberOfDecimalPlaces' ||
      key === 'numberOfDecimalPlaces' ||
      key === 'isRange' ||
      key === 'minValue' ||
      key === 'maxValue' ||
      key === 'step'
    );

    // prettier-ignore
    const styleVerifKeys = (
      key === 'init' ||
      key === 'mainColor' ||
      key === 'colorThumb' ||
      key === 'colorBorderForThumb'
    );

    if (setValueVerifKeys) this._setValueInThumbs(options);
    if (styleVerifKeys) this._setStyleForThumbs(options);
    if (key === 'init' || key === 'isRange') this._checkIsRange(options);
  }

  // Первоначальная инициализация
  private _init(options: IPluginOptions) {
    this.$selector = options.$selector;
    this.$elemThumbs = options.$elemThumbs;
    this._setEventsThumbs(options);
  }

  //  Установка стиля для бегунков
  private _setStyleForThumbs(options: IPluginOptions) {
    const { mainColor, colorThumb, colorBorderForThumb } = options;
    const backgroundColor = colorThumb || mainColor;

    this.$elemThumbs.each((index, thumb) => {
      $(thumb).css({ 'background-color': backgroundColor, 'border-color': colorBorderForThumb });
    });
  }

  // Установка бегунков в нужные позиции и добавление data-атрибутов для слайдера
  private _setValueInThumbs(options: IPluginOptions) {
    // prettier-ignore
    const { 
      initValuesArray,
      valuesAsPercentageArray,
      numberOfDecimalPlaces,
      customValues,
    } = options;

    initValuesArray.forEach((currentValue, index) => {
      this.$elemThumbs
        .eq(index)
        .css('left', `${valuesAsPercentageArray[index]}%`)
        .attr('data-value', currentValue.toFixed(numberOfDecimalPlaces));

      if (customValues.length > 0) {
        this.$elemThumbs.eq(index).attr('data-text', customValues[currentValue]);
      } else {
        this.$elemThumbs.eq(index).removeAttr('data-text');
      }
    });
  }

  // Проверка опции "IsRange" у слайдера и показ/скрытие первого бегунка
  private _checkIsRange(options: IPluginOptions) {
    if (options.isRange) {
      this.$elemThumbs.eq(0).css('display', '');
    } else {
      this.$elemThumbs.eq(0).css('display', 'none');
    }
  }

  // Установка обработчиков событий на бегунки слайдера
  private _setEventsThumbs(options: IPluginOptions) {
    this.$elemThumbs.each((index, thumb) => {
      const $currentThumb = $(thumb);

      $currentThumb.on('pointerdown.thumb', this._handleSetEventListenerForThumbs.bind(this));
      $currentThumb.on('keydown.thumb', this._handleChangeThumbPosition.bind(this, options));
      $currentThumb.on('dragstart.thumb', false);
    });
  }

  // Изменение позиции бегунков слайдера при использовании клавиатуры
  private _handleChangeThumbPosition(options: IPluginOptions, event: IEvent) {
    // prettier-ignore
    const configEventCode = (
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight' ||
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown'
    );
    const $target = $(event.target);

    if (configEventCode) {
      const { step } = options;
      let eventTargetValue = Number($target.attr('data-value'));

      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') event.preventDefault();
      if (event.code === 'ArrowLeft' || event.code === 'ArrowDown') eventTargetValue -= step;
      if (event.code === 'ArrowRight' || event.code === 'ArrowUp') eventTargetValue += step;

      this.notify(event, eventTargetValue);
    }
  }

  // Установка обработчиков событий движения/прекращения движения бегунков слайдера
  private _handleSetEventListenerForThumbs(event: IEvent) {
    const $target = $(event.target);
    event.target.setPointerCapture(event.pointerId);
    $target.on('pointermove.thumb', this._handleInitPointerMove.bind(this));
    $target.on('pointerup.thumb', ViewThumbs._handleInitPointerUp.bind(this));
  }

  // Отслеживание перемещение бегунков слайдера
  private _handleInitPointerMove(event: Event) {
    this.notify(event);
  }

  // Отслеживание прекращения движения бегунков слайдера
  private static _handleInitPointerUp(event: IEvent) {
    const $target = $(event.target);
    $target.off('pointermove.thumb');
    $target.off('pointerup.thumb');
  }
}

export default ViewThumbs;

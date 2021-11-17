import Observer from '../patterns/Observer';

class ViewThumbs extends Observer {
  $selector!: JQuery;
  $elemThumbs!: JQuery;

  constructor(public isFirstInit: boolean = true) {
    super();
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

    this.$elemThumbs.each((_, thumb) => {
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
    this.$elemThumbs.each((_, thumb) => {
      const $currentThumb = $(thumb);

      $currentThumb.on('pointerdown.thumb', this._handleSetEventListenerForThumbs.bind(this));
      $currentThumb.on('keydown.thumb', this._handleChangeThumbPosition.bind(this, options));
      $currentThumb.on('dragstart.thumb', false);
    });
  }

  // Изменение позиции бегунков слайдера при использовании клавиатуры
  private _handleChangeThumbPosition(options: IPluginOptions, event: Event) {
    const { code } = event as KeyboardEvent;

    // prettier-ignore
    const configEventCode = (
      code === 'ArrowLeft' ||
      code === 'ArrowRight' ||
      code === 'ArrowUp' ||
      code === 'ArrowDown'
    );

    const $target = $(event.target as HTMLButtonElement);

    if (configEventCode) {
      const { step } = options;
      let eventTargetValue = Number($target.attr('data-value'));

      if (code === 'ArrowUp' || code === 'ArrowDown') event.preventDefault();
      if (code === 'ArrowLeft' || code === 'ArrowDown') eventTargetValue -= step;
      if (code === 'ArrowRight' || code === 'ArrowUp') eventTargetValue += step;

      this.notify(event, eventTargetValue);
    }
  }

  // Установка обработчиков событий движения/прекращения движения бегунков слайдера
  private _handleSetEventListenerForThumbs(event: Event) {
    const target = event.target as HTMLButtonElement;

    if (target) target.setPointerCapture((event as PointerEvent).pointerId);

    const $target = $(target);
    $target.on(
      'pointermove.thumb',
      ViewThumbs._makeThrottlingHandler(this._handleInitPointerMove.bind(this), 50),
    );
    $target.on('pointerup.thumb', ViewThumbs._handleInitPointerUp.bind(this));
  }

  // Отслеживание перемещение бегунков слайдера
  private _handleInitPointerMove(event: Event) {
    this.notify(event);
  }

  // Отслеживание прекращения движения бегунков слайдера
  private static _handleInitPointerUp(event: { target: HTMLButtonElement }) {
    const $target = $(event.target);
    $target.off('pointermove.thumb');
    $target.off('pointerup.thumb');
  }

  // throttling декоратор
  private static _makeThrottlingHandler(fn: Function, timeout: number) {
    let timer: NodeJS.Timeout | null = null;

    return (...args: any[]) => {
      if (timer) return;

      timer = setTimeout(() => {
        fn(...args);
        clearTimeout(timer!);
        timer = null;
      }, timeout);
    };
  }
}

export default ViewThumbs;

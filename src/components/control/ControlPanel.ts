class ControlPanel {
  public savedWatchFn: Function;
  private _$selector: JQuery;
  private _$sliderSelector: JQuery;
  private _selectorsObj: {
    [key: string]: JQuery;
  };
  private readonly _propertyList: string[];

  constructor(panelSelector: string, sliderSelector: string) {
    this.savedWatchFn = this.watchTheSlider.bind(this);
    this._$selector = $(panelSelector);
    this._$sliderSelector = $(sliderSelector);
    this._selectorsObj = {};

    // список всех доступных свойств слайдера
    this._propertyList = [
      'mainColor',
      'secondColor',
      'colorForScale',
      'colorMarker',
      'colorTextForMarker',
      'colorBorderForMarker',
      'colorThumb',
      'colorBorderForThumb',
      'initValueFirst',
      'initValueSecond',
      'textValueFirst',
      'textValueSecond',
      'minValue',
      'maxValue',
      'step',
      'stepSizeForScale',
      'preFix',
      'postFix',
      'calcNumberOfDecimalPlaces',
      'numberOfDecimalPlaces',
      'customValues',
      'showMarkers',
      'showScale',
      'isRange',
      'isVertical',
      'showBackground',
      'initAutoMargins',
      'initFormatted',
      'initScaleAdjustment',
      'showError',
      'initAutoScaleCreation',
      'checkingStepSizeForScale',
    ];

    this._getSelectors();
  }

  /**
   * Инициализация контр.панели и её заполнение значениями свойств слайдера,
   * установка обработчика событий на инпуты и подписка на обновление модели слайдера
   */
  init() {
    Object.entries(this._selectorsObj).forEach((_selectorsObjArr: [string, JQuery]) => {
      const [prop, $selector] = _selectorsObjArr;
      this._getProp(prop);
      this._initCheckingDependencies(prop);

      $selector.on('change.input', this._handleInputChanges.bind(this));
    });

    this._setOptionsForInputs();
    this._$sliderSelector.metaSlider('subscribe', this.savedWatchFn);
  }

  unbind() {
    Object.entries(this._selectorsObj).forEach((_selectorsObjArr: [string, JQuery]) => {
      const $selector = _selectorsObjArr[1];
      $selector.off('change.input');
    });

    this._$sliderSelector.metaSlider('unsubscribe', this.savedWatchFn);
  }

  /**
   * Метод который следит за обновлением модели через патерн Observer и выводит данные
   * в контр. панель, проверка происходит по значению свойства 'key', которое присваевается
   * в зависимости от того, какое свойство слайдера изменилось.
   * Здесь также происходит инициализация метода проверки зависимости свойств слайдера друг от друга
   */
  watchTheSlider() {
    const key = this._$sliderSelector.metaSlider('getProp', 'key');

    // prettier-ignore
    const changeValuesVerifKeys = 
      key === 'changedValue' ||
      key === 'initValueFirst' ||
      key === 'initValueSecond';

    if (changeValuesVerifKeys) {
      this._getProp('initValueFirst');
      this._getProp('initValueSecond');
      this._getProp('textValueFirst');
      this._getProp('textValueSecond');
    }

    if (key === 'maxValue' || key === 'minValue') {
      this._getProp('minValue');
      this._getProp('maxValue');
      this._getProp('initValueFirst');
      this._getProp('initValueSecond');
      this._getProp('numberOfDecimalPlaces');
    }

    if (key === 'step') {
      this._getProp('initValueFirst');
      this._getProp('initValueSecond');
      this._getProp('numberOfDecimalPlaces');
      this._getProp('stepSizeForScale');
    }

    if (key === 'customValues') {
      this._getProp('initValueFirst');
      this._getProp('initValueSecond');
      this._getProp('textValueFirst');
      this._getProp('textValueSecond');
      this._getProp('minValue');
      this._getProp('maxValue');
      this._getProp('step');
      this._getProp('stepSizeForScale');
      this._getProp('numberOfDecimalPlaces');
      this._getProp('initFormatted');
      this._getProp('calcNumberOfDecimalPlaces');
      this._getProp('initAutoScaleCreation');
      this._getProp('checkingStepSizeForScale');
    }

    if (key === 'calcNumberOfDecimalPlaces') {
      this._getProp('numberOfDecimalPlaces');
    }

    if (key === 'numberOfDecimalPlaces') {
      this._getProp('initValueFirst');
      this._getProp('initValueSecond');
      this._getProp('minValue');
      this._getProp('maxValue');
      this._getProp('step');
    }

    if (key === 'isRange') {
      this._getProp('initValueFirst');
      this._getProp('textValueFirst');
    }

    if (key === 'isVertical') {
      this._getProp('initAutoMargins');
    }

    if (key === 'initAutoScaleCreation' || key === 'checkingStepSizeForScale') {
      this._getProp('initAutoScaleCreation');
      this._getProp('checkingStepSizeForScale');
      this._getProp('stepSizeForScale');
    }

    // Получение текущего значения изменяемого свойства
    if (key !== 'changedValue') this._getProp(key);

    // Инициализация проверки зависимости свойств слайдера друг от друга
    this._initCheckingDependencies(key);

    // Устанавливает корректный шаг для инпутов
    this._setOptionsForInputs();
  }

  private _setOptionsForInputs() {
    const {
      initValueFirst: inputValueFirst,
      initValueSecond: inputValueSecond,
      minValue: inputMinValue,
      maxValue: inputMaxValue,
      step: inputStep,
    } = this._selectorsObj;

    const maxValueForFirstThumbs = Number(inputValueSecond.val()) - Number(inputStep.val());
    const minValueForSecondThumbs = Number(inputValueFirst.val()) + Number(inputStep.val());

    inputValueFirst.attr({
      min: inputMinValue.val(),
      max: maxValueForFirstThumbs,
      step: inputStep.val(),
    });

    inputValueSecond.attr({
      min: minValueForSecondThumbs,
      max: inputMaxValue.val(),
      step: inputStep.val(),
    });
  }

  // Метод установки новых значений для слайдера
  private _setProp(prop: string, value: string | number | (string | number)[]) {
    this._$sliderSelector.metaSlider('setProp', prop, value);
  }

  // Метод для получения текущих свойств слайдера и установки новых значений в контр.панели
  private _getProp(prop: string) {
    const resultProp = this._$sliderSelector.metaSlider('getProp', prop);
    const $target = this._selectorsObj[prop];

    if ($target.attr('type') === 'checkbox') {
      $target.prop('checked', resultProp);
    } else {
      $target.val(resultProp);
    }

    return resultProp;
  }

  // Формируем объект со всеми инпутами, поиск по имени свойства слайдера
  private _getSelectors() {
    this._propertyList.forEach((prop) => {
      this._selectorsObj[prop] = this._$selector.find(`[name = ${prop}]`);
    });
  }

  /**
   * Проверка наличия зависимости входящего свойства от других заранее определенных свойств слайдера
   * и установка инпутам в контр.панели с этими свойствами заданного атрибута
   */
  private _initCheckingDependencies(prop: string) {
    if (prop === 'isRange') this._checkTheProp(prop, ['initValueFirst'], true);
    if (prop === 'isVertical') this._checkTheProp(prop, ['initAutoMargins']);

    if (prop === 'initAutoScaleCreation') {
      this._checkTheProp(prop, ['stepSizeForScale', 'checkingStepSizeForScale']);
    }

    if (prop === 'checkingStepSizeForScale') {
      this._checkTheProp(prop, ['initAutoScaleCreation']);
    }

    if (prop === 'calcNumberOfDecimalPlaces') {
      this._checkTheProp(prop, ['numberOfDecimalPlaces']);
    }

    if (prop === 'customValues') {
      const customValuesDependencies = [
        'minValue',
        'maxValue',
        'step',
        'stepSizeForScale',
        'initAutoScaleCreation',
        'numberOfDecimalPlaces',
        'calcNumberOfDecimalPlaces',
        'checkingStepSizeForScale',
        'initFormatted',
      ];

      this._checkTheProp(prop, customValuesDependencies);
    }
  }

  /**
   * Проверка инпута с определенным свойством слайдера на наличие в нём значения
   * и установка атрибута disabled зависимым от него инпутам
   */
  private _checkTheProp(initProp: string, checkingOptions: string[], isReverseDependency = false) {
    const $target = this._selectorsObj[initProp];
    let verifyingKey;

    if ($target.attr('type') === 'checkbox') {
      verifyingKey = $target.prop('checked');
    } else {
      verifyingKey = $target.val();
    }

    verifyingKey = isReverseDependency ? !verifyingKey : verifyingKey;

    if (verifyingKey) {
      $target.attr('data-dependency', 'true');

      checkingOptions.forEach((prop) => {
        this._togglePropDisable(prop, true);
      });
    } else if ($target.attr('data-dependency')) {
      $target.attr('data-dependency', 'false');

      checkingOptions.forEach((prop) => {
        this._togglePropDisable(prop, false);
      });
    }
  }

  // Метод переключения атрибута disabled у инпутов
  private _togglePropDisable(prop: string, option: boolean) {
    const $target = this._selectorsObj[prop];
    $target.prop('disabled', option);
  }

  // Установка новых значений свойств слайдера при изменении инпутов контр. панели
  private _handleInputChanges(event: Event) {
    const $target = $(event.target as HTMLInputElement);
    const prop = $target.attr('name');
    let value = null;

    if ($target.attr('type') === 'checkbox') {
      value = $target.prop('checked');
    } else if ($target.attr('type') === 'text') {
      value = $target.val();
    } else {
      value = Number($target.val());
    }

    if (prop) this._setProp(prop, value);
  }
}

export default ControlPanel;
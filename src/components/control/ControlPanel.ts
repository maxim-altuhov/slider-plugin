type TypeObjWithOptions = {
  checkingOptions: string[];
  isReverseDependency?: boolean;
};
class ControlPanel {
  private _$panelSelector: JQuery;
  private _$sliderSelector: JQuery;
  private _selectorsObj: { [key: string]: JQuery } = {};
  private _objWithControlPanelDependencies: { [key: string]: TypeObjWithOptions };
  readonly propertyList: string[];

  constructor(panelSelector: string, sliderSelector: string) {
    this.watchTheSlider = this.watchTheSlider.bind(this);
    this._handleInputChanges = this._handleInputChanges.bind(this);
    this._$panelSelector = $(panelSelector);
    this._$sliderSelector = $(sliderSelector);
    this._objWithControlPanelDependencies = {
      isRange: {
        checkingOptions: ['initValueFirst'],
        isReverseDependency: true,
      },
      isVertical: {
        checkingOptions: ['initAutoMargins'],
      },
      initAutoScaleCreation: {
        checkingOptions: ['stepSizeForScale', 'checkingStepSizeForScale'],
      },
      checkingStepSizeForScale: {
        checkingOptions: ['initAutoScaleCreation'],
      },
      calcNumberOfDecimalPlaces: {
        checkingOptions: ['numberOfDecimalPlaces'],
      },
      customValues: {
        checkingOptions: [
          'minValue',
          'maxValue',
          'step',
          'stepSizeForScale',
          'initAutoScaleCreation',
          'numberOfDecimalPlaces',
          'calcNumberOfDecimalPlaces',
          'checkingStepSizeForScale',
          'initFormatted',
        ],
      },
    };

    // список всех доступных свойств слайдера
    this.propertyList = [
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

      $selector.on('change.input', this._handleInputChanges);
    });

    this._setOptionStepForInputs();
    this._$sliderSelector.metaSlider('subscribe', this.watchTheSlider);
  }

  unbind() {
    Object.entries(this._selectorsObj).forEach((_selectorsObjArr: [string, JQuery]) => {
      const $selector = _selectorsObjArr[1];
      $selector.off('change.input');
    });

    this._$sliderSelector.metaSlider('unsubscribe', this.watchTheSlider);
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
    this._setOptionStepForInputs();
  }

  private _setOptionStepForInputs() {
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
    const $inputTarget = this._selectorsObj[prop];

    if ($inputTarget.attr('type') === 'checkbox') {
      $inputTarget.prop('checked', resultProp);
    } else {
      $inputTarget.val(resultProp);
    }

    return resultProp;
  }

  // Формируем объект со всеми инпутами, поиск по имени свойства слайдера
  private _getSelectors() {
    this.propertyList.forEach((prop) => {
      this._selectorsObj[prop] = this._$panelSelector.find(`[name = ${prop}]`);
    });
  }

  /**
   * Проверка наличия зависимости входящего свойства от других заранее определенных свойств слайдера
   * и установка инпутам в контр.панели с этими свойствами заданного атрибута
   */
  private _initCheckingDependencies(prop: string) {
    if (prop in this._objWithControlPanelDependencies) {
      this._checkingInputWithTargetProp(
        prop,
        this._objWithControlPanelDependencies[prop].checkingOptions,
        this._objWithControlPanelDependencies[prop].isReverseDependency,
      );
    }
  }

  /**
   * Проверка инпута с определенным свойством слайдера на наличие в нём значения
   * и установка атрибута disabled зависимым от него инпутам
   */
  private _checkingInputWithTargetProp(
    initProp: string,
    checkingOptions: string[],
    isReverseDependency = false,
  ) {
    const $inputTarget = this._selectorsObj[initProp];
    let targetValueInBooleanType;

    if ($inputTarget.attr('type') === 'checkbox') {
      targetValueInBooleanType = $inputTarget.prop('checked');
    } else {
      targetValueInBooleanType = Boolean($inputTarget.val());
    }

    targetValueInBooleanType = isReverseDependency
      ? !targetValueInBooleanType
      : targetValueInBooleanType;

    if (targetValueInBooleanType) {
      $inputTarget.attr('data-dependency', 'true');

      checkingOptions.forEach((targetProp) => {
        this._togglePropDisableForInput(targetProp, true);
      });
    } else if ($inputTarget.attr('data-dependency')) {
      $inputTarget.attr('data-dependency', 'false');

      checkingOptions.forEach((targetProp) => {
        this._togglePropDisableForInput(targetProp, false);
      });
    }
  }

  // Метод переключения атрибута disabled у инпутов
  private _togglePropDisableForInput(targetProp: string, option: boolean) {
    const $inputTarget = this._selectorsObj[targetProp];
    $inputTarget.prop('disabled', option);
  }

  // Установка новых значений свойств слайдера при изменении инпутов контр. панели
  private _handleInputChanges(event: Event & { target: EventTarget }) {
    const $inputTarget = $(event.target);
    const prop = $inputTarget.attr('name');
    let value = null;

    if ($inputTarget.attr('type') === 'checkbox') {
      value = $inputTarget.prop('checked');
    } else if ($inputTarget.attr('type') === 'text') {
      value = $inputTarget.val();
    } else {
      value = Number($inputTarget.val());
    }

    if (prop) this._setProp(prop, value);
  }
}

export default ControlPanel;

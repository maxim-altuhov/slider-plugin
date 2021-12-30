import objWithControlPanelDependencies from '../data/objWithControlPanelDependencies';
import propertyList from '../data/propertyList';
import keysWatchList from '../data/keysWatchList';

class ControlPanel {
  readonly propertyList = propertyList;
  readonly keysWatchList = keysWatchList;
  private _$panelSelector: JQuery;
  private _$sliderSelector: JQuery;
  private _selectorsObj: { [key: string]: JQuery } = {};
  private _objWithControlPanelDependencies = objWithControlPanelDependencies;

  constructor(panelSelector: string, sliderSelector: string) {
    this.watchTheSlider = this.watchTheSlider.bind(this);
    this._handleInputChanges = this._handleInputChanges.bind(this);
    this._$panelSelector = $(panelSelector);
    this._$sliderSelector = $(sliderSelector);

    this._getSelectors();
  }

  /**
   * Инициализация контр.панели и её заполнение значениями свойств слайдера,
   * установка обработчика событий на инпуты и подписка на обновление модели слайдера
   */
  init() {
    Object.entries(this._selectorsObj).forEach((currentElem) => {
      const [prop, $inputSelector] = currentElem;
      this._getProp(prop);
      this._initCheckingDependencies(prop);

      $inputSelector.on('change.input', this._handleInputChanges);
    });

    this._setOptionStepForInputs();
    this._$sliderSelector.metaSlider('subscribe', this.watchTheSlider);
  }

  unbind() {
    Object.entries(this._selectorsObj).forEach((currentElem) => {
      const [, $inputSelector] = currentElem;
      $inputSelector.off('change.input');
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
    const key: string = this._$sliderSelector.metaSlider('getProp', 'key');

    // Получение текущего значения изменяемого свойства
    if (key !== 'changedValue') this._getProp(key);

    // отслеживание изменяемого свойства по ключу
    if (key in this.keysWatchList) {
      this.keysWatchList[key].forEach((prop) => this._getProp(prop));
    }

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
    const valueProp = this._$sliderSelector.metaSlider('getProp', prop);
    const $inputTarget = this._selectorsObj[prop];

    if ($inputTarget.attr('type') === 'checkbox') {
      $inputTarget.prop('checked', valueProp);
    } else {
      $inputTarget.val(valueProp);
    }

    return valueProp;
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
    isReverseDependency: boolean,
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
    const targetProp = $inputTarget.attr('name');
    let value = null;

    if ($inputTarget.attr('type') === 'checkbox') {
      value = $inputTarget.prop('checked');
    } else if ($inputTarget.attr('type') === 'text') {
      value = $inputTarget.val();
    } else {
      value = Number($inputTarget.val());
    }

    if (targetProp) this._setProp(targetProp, value);
  }
}

export default ControlPanel;

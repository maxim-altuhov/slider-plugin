import $ from 'jquery';
import '@pages/MetaSlider/MetaSlider';

class ControlPanel {
  $selector: JQuery<HTMLElement>;

  $sliderSelector: JQuery<HTMLElement>;

  selectorsObj: {};

  propertyList: string[];

  constructor(panelSelector: string, sliderSelector: JQuery<HTMLElement>) {
    this.$selector = $(panelSelector);
    this.$sliderSelector = sliderSelector;
    this.selectorsObj = {};

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

    this.getSelectors();
  }

  /**
   * Инициализация контр.панели и её заполнение значениями свойств слайдера,
   * установка обработчика событий на инпуты и подписка на обновление модели слайдера
   */
  init() {
    Object.entries(this.selectorsObj).forEach((valuesArray) => {
      const [prop, $selector] = valuesArray;
      this.getProp(prop);
      this.initCheckingDependencies(prop);

      $selector.on('change.input', this.handleInputChanges.bind(this));
    });

    this.$sliderSelector.metaSlider('subscribe', this.watchTheSlider.bind(this));
  }

  // Метод для установки новых значений для слайдера
  setProp(prop, value) {
    this.$sliderSelector.metaSlider('setProp', prop, value);
  }

  // Метод для получения текущих свойств слайдера и установки новых значений в контр.панели
  getProp(prop) {
    const resultProp = this.$sliderSelector.metaSlider('getProp', prop);
    const target = this.selectorsObj[prop];

    if (target.attr('type') === 'checkbox') {
      target.prop('checked', resultProp);
    } else {
      target.val(resultProp);
    }

    return resultProp;
  }

  // Получаем в виде объекта все инпуты по имени свойств слайдера
  getSelectors() {
    this.propertyList.forEach((prop) => {
      this.selectorsObj[prop] = this.$selector.find(`[name = ${prop}]`);
    });
  }

  /**
   * Метод который следит за обновлением модели через патерн Observer и выводит данные
   * в контр. панель, проверка происходит по значению свойства 'key', которое присваевается
   * в зависимости от того, какое свойство слайдера изменилось.
   * Здесь также происходит инициализация метода проверки зависимости свойств слайдера друг от друга
   */
  watchTheSlider() {
    const key = this.$sliderSelector.metaSlider('getProp', 'key');
    const changeValuesVerifKeys = (
      key === 'changedValue'
      || key === 'initValueFirst'
      || key === 'initValueSecond'
    );

    if (changeValuesVerifKeys) {
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('textValueFirst');
      this.getProp('textValueSecond');
    }

    if (key === 'maxValue' || key === 'minValue') {
      this.getProp('minValue');
      this.getProp('maxValue');
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('numberOfDecimalPlaces');
    }

    if (key === 'step') {
      this.getProp('step');
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('numberOfDecimalPlaces');
      this.getProp('stepSizeForScale');
    }

    if (key === 'stepSizeForScale') this.getProp('stepSizeForScale');

    if (key === 'customValues') {
      this.getProp('customValues');
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('textValueFirst');
      this.getProp('textValueSecond');
      this.getProp('minValue');
      this.getProp('maxValue');
      this.getProp('step');
      this.getProp('stepSizeForScale');
      this.getProp('numberOfDecimalPlaces');
      this.getProp('initFormatted');
      this.getProp('calcNumberOfDecimalPlaces');
      this.getProp('initAutoScaleCreation');
      this.getProp('checkingStepSizeForScale');
    }

    if (key === 'calcNumberOfDecimalPlaces') this.getProp('numberOfDecimalPlaces');

    if (key === 'numberOfDecimalPlaces') {
      this.getProp('numberOfDecimalPlaces');
      this.getProp('initValueFirst');
      this.getProp('initValueSecond');
      this.getProp('minValue');
      this.getProp('maxValue');
      this.getProp('step');
    }

    if (key === 'isRange') {
      this.getProp('initValueFirst');
      this.getProp('textValueFirst');
    }

    if (key === 'isVertical') {
      this.getProp('initAutoMargins');
    }

    if (key === 'initAutoScaleCreation' || key === 'checkingStepSizeForScale') {
      this.getProp('initAutoScaleCreation');
      this.getProp('checkingStepSizeForScale');
      this.getProp('stepSizeForScale');
    }

    // Инициализация проверки зависимости свойств слайдера друг от друга
    this.initCheckingDependencies(key);
  }

  /**
   * Проверка наличия зависимости входящего свойства от других заранее определенных свойств слайдера
   * и установка инпутам в контр.панели с этими свойствами заданного атрибута
   */
  //
  initCheckingDependencies(prop) {
    if (prop === 'isRange') this.checkTheProp(prop, ['initValueFirst'], true);
    if (prop === 'isVertical') this.checkTheProp(prop, ['initAutoMargins']);
    if (prop === 'initAutoScaleCreation') this.checkTheProp(prop, ['stepSizeForScale', 'checkingStepSizeForScale']);
    if (prop === 'checkingStepSizeForScale') this.checkTheProp(prop, ['initAutoScaleCreation']);
    if (prop === 'calcNumberOfDecimalPlaces') this.checkTheProp(prop, ['numberOfDecimalPlaces']);

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

      this.checkTheProp(prop, customValuesDependencies);
    }
  }

  /**
   * Проверка инпута с определенным свойством слайдера на наличие в нём значения
   * и установка атрибута disabled зависимым от него инпутам
   */
  checkTheProp(initProp, checkingOptions, isReverse = false) {
    let target = this.selectorsObj[initProp];
    let verifyingKey;

    if (target.attr('type') === 'checkbox') {
      verifyingKey = target.prop('checked');
    } else {
      verifyingKey = target.val();
    }

    verifyingKey = isReverse ? !verifyingKey : verifyingKey;

    if (verifyingKey) {
      target.attr('data-link', true);

      checkingOptions.forEach((prop) => {
        this.togglePropDisable(prop, true);
      });
    } else if (target.attr('data-link')) {
      target.attr('data-link', false);

      checkingOptions.forEach((prop) => {
        this.togglePropDisable(prop, false);
      });
    }
  }

  // Метод переключения атрибута disabled у инпутов
  togglePropDisable(prop, options) {
    const target = this.selectorsObj[prop];
    target.prop('disabled', options);
  }

  // Установка новых значений свойств слайдера при изменении инпутов контр. панели
  handleInputChanges(event) {
    const target = $(event.target);
    const prop = target.attr('name');
    let value = '';

    if (target.attr('type') === 'checkbox') {
      value = target.prop('checked');
    } else if (target.attr('type') === 'text') {
      value = target.val();
    } else {
      value = Number(target.val());
    }

    this.setProp(prop, value);
  }
}

export default ControlPanel;

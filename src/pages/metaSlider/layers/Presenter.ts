import Model from './Model';
import View from './View';

class Presenter {
  constructor(private _view: View, private _model: Model) {}

  // Первоначальный рендер слайдера и его основных элементов главным View
  renderSlider(initSelector: JQuery) {
    this._view.renderSlider(initSelector);
  }

  // Добавляем методы в Observer
  setObservers() {
    this._model.subscribe(this.updateViews.bind(this));
    this._model.errorEvent.subscribe(this.renderError.bind(this));

    this._getView('viewSlider').subscribe(this.calcTargetValue.bind(this));
    this._getView('viewThumbs').subscribe(this.calcTargetValue.bind(this));
    this._getView('viewScale').subscribe(this.calcTargetValue.bind(this));
  }

  // Передаем новые данные из модели и обновляем view и subview
  updateViews(options: IPluginOptions) {
    this._view.update(options);
  }

  // Вывод ошибки при наличии некорректных значений в настройках слайдера
  renderError(message: string, options: IPluginOptions) {
    this._getView('viewError').renderError(message, options);
  }

  // Вызов метода в модели для расчёта значений позиций бегунков слайдера
  calcTargetValue(
    event: (Event & { target: EventTarget; clientY: number; clientX: number }) | null,
    initValue?: number,
    onlyReturn = false,
  ) {
    this._model.calcTargetValue(event, initValue, onlyReturn);
  }

  // Получаем нужный subview через главный view
  private _getView(viewName: string) {
    return this._view.viewList[viewName];
  }
}

export default Presenter;

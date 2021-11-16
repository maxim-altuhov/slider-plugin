import Model from './Model';
import View from './View';

class Presenter {
  constructor(public view: View, public model: Model) {}

  // Первоначальный рендер слайдера и его основных элементов главным View
  public renderSlider(initSelector: JQuery) {
    this.view.renderSlider(initSelector);
  }

  // Добавляем методы в Observer
  public setObservers() {
    this.model.subscribe(this._updateViews.bind(this));
    this.model.errorEvent.subscribe(this._renderError.bind(this));

    this._getView('viewSlider').subscribe(this._calcTargetValue.bind(this));
    this._getView('viewThumbs').subscribe(this._calcTargetValue.bind(this));
    this._getView('viewScale').subscribe(this._calcTargetValue.bind(this));
  }

  // Получаем нужный subview через главный view
  private _getView(view: string) {
    return this.view.views[view];
  }

  // Передаем новые данные из модели и обновляем view и subview
  private _updateViews(options: IPluginOptions) {
    this.view.update(options);
  }

  // Вывод ошибки при наличии некорректных значений в настройках слайдера
  private _renderError(message: string, options: IPluginOptions) {
    this._getView('viewError').renderError(message, options);
  }

  // Вызов метода в модели для расчёта значений позиций бегунков слайдера
  private _calcTargetValue(event: Event, initValue?: number, onlyReturn?: boolean) {
    this.model.calcTargetValue(event, initValue, onlyReturn);
  }
}

export default Presenter;

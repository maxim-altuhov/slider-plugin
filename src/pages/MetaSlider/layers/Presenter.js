class Presenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  // Передаем новые данные из модели и обновляем view и subview
  updateViews(options) {
    this.view.update(options);
  }

  // Вывод ошибки при наличии некорректных значений в настройках слайдера
  renderError(message, options) {
    this.getView('viewError').renderError(message, options);
  }

  // Вызов метода в модели для расчёта значений позиций бегунков слайдера
  calcTargetValue(event, initValue, onlyReturn) {
    this.model.calcTargetValue(event, initValue, onlyReturn);
  }

  // Добавляем методы в Observer
  setObservers() {
    this.model.subscribe(this.updateViews.bind(this));
    this.model.errorEvent.subscribe(this.renderError.bind(this));

    this.getView('viewSlider').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewThumbs').subscribe(this.calcTargetValue.bind(this));
    this.getView('viewScale').subscribe(this.calcTargetValue.bind(this));
  }

  // Получаем нужный subview через главный view
  getView(view) {
    return this.view.views[view];
  }
}

export default Presenter;

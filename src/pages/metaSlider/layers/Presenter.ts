import Model from './Model';
import View from './View';

class Presenter {
  constructor(private _view: View, private _model: Model) {}

  // The initial render of the slider and its main elements is the main View
  renderSlider(initSelector: JQuery) {
    this._view.renderSlider(initSelector);
  }

  // Adding methods to the Observer
  setObservers() {
    this._model.subscribe(this.updateViews.bind(this));
    this._model.errorEvent.subscribe(this.renderError.bind(this));

    this._getView('viewSlider').subscribe(this.calcTargetValue.bind(this));
    this._getView('viewThumbs').subscribe(this.calcTargetValue.bind(this));
    this._getView('viewScale').subscribe(this.calcTargetValue.bind(this));
  }

  // Passing new data from the model and updating the view and subview
  updateViews(options: IPluginOptions) {
    this._view.update(options);
  }

  // Error output if there are incorrect values in the slider settings
  renderError(message: string, options: IPluginOptions) {
    this._getView('viewError').renderError(message, options);
  }

  // Calling a method in the model to calculate the values of the thumbs slider positions
  calcTargetValue(
    event: (Event & { clientY: number; clientX: number }) | null,
    initValue?: number,
    onlyReturn = false,
  ) {
    this._model.calcTargetValue(event, initValue, onlyReturn);
  }

  // Getting the desired subview via the main View
  private _getView(viewName: string) {
    return this._view.viewList[viewName];
  }
}

export default Presenter;

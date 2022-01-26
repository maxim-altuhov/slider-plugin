import Model from './Model';
import View from './View';

class Presenter {
  constructor(private _view: View, private _model: Model) {}

  // The initial render of the slider and its main elements is the main View
  renderSlider(initSelector: JQuery<HTMLElement>) {
    this._view.renderSlider(initSelector);
  }

  // Adding methods to the Observer
  setObservers() {
    this._model.subscribe(this.updateViews.bind(this));
    this._model.errorEvent.subscribe(this.renderError.bind(this));
    this._view.subscribe(this.updateModel.bind(this));
  }

  // Error output if there are incorrect values in the slider settings
  renderError(message: string, options: IPluginOptions) {
    this._view.renderError(message, options);
  }

  // Passing new data from the model and updating the view and subview
  updateViews(options: IPluginOptions) {
    this._view.updateViews(options);
  }

  // Calling a method in the model to calculate the values of the thumbs slider positions
  updateModel(event: MouseEvent, inputValue?: number, onlyReturn = false) {
    this._model.calcTargetValue(onlyReturn, inputValue, event);
  }
}

export default Presenter;

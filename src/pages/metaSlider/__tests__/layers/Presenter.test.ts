/* eslint-disable @typescript-eslint/dot-notation */
import Model from '../../layers/Model';
import View from '../../layers/View';
import Presenter from '../../layers/Presenter';
import InitSettings from '../../data/InitSettings';

const fakeSelector = $('.fake-selector');
const initView = new View();
const initModel = new Model(fakeSelector, InitSettings);
const presenter = new Presenter(initView, initModel);

const view = presenter['_view'];
const model = presenter['_model'];

describe('Checking the "Presenter" layer', () => {
  test('Initializing the "renderSlider" method', () => {
    view.renderSlider = jest.fn();
    presenter.renderSlider(fakeSelector);

    expect(view.renderSlider).toHaveBeenCalledWith(fakeSelector);
  });

  test('Initializing the "setObservers" method', () => {
    model.subscribe = jest.fn();
    model.errorEvent.subscribe = jest.fn();
    presenter['_getView']('viewSlider').subscribe = jest.fn();
    presenter['_getView']('viewThumbs').subscribe = jest.fn();
    presenter['_getView']('viewScale').subscribe = jest.fn();

    presenter.setObservers();

    expect(model.subscribe).toHaveBeenCalled();
    expect(model.errorEvent.subscribe).toHaveBeenCalled();
    expect(view.viewList['viewSlider'].subscribe).toHaveBeenCalled();
    expect(view.viewList['viewThumbs'].subscribe).toHaveBeenCalled();
    expect(view.viewList['viewScale'].subscribe).toHaveBeenCalled();
  });

  test('Initializing the "updateViews" method', () => {
    view.update = jest.fn();
    presenter.updateViews(InitSettings);

    expect(view.update).toHaveBeenCalledWith(InitSettings);
  });

  test('Initializing the "renderError" method', () => {
    presenter['_getView']('viewError').renderError = jest.fn();
    presenter.renderError('message', InitSettings);

    expect(view.viewList['viewError'].renderError).toHaveBeenCalledWith('message', InitSettings);
  });

  test('Initializing the "calcTargetValue" method', () => {
    const INIT_VALUE = 50;
    model.calcTargetValue = jest.fn();
    presenter.calcTargetValue(null, INIT_VALUE);

    expect(model.calcTargetValue).toHaveBeenCalledWith(null, INIT_VALUE, false);
  });
});

/* eslint-disable @typescript-eslint/dot-notation */
import Model from '../../layers/Model';
import View from '../../layers/View';
import Presenter from '../../layers/Presenter';
import initSettings from '../../data/initSettings';

const fakeSelector = $('.fake-selector');
const initView = new View();
const initModel = new Model(fakeSelector, initSettings);
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
    presenter.updateViews(initSettings);

    expect(view.update).toHaveBeenCalledWith(initSettings);
  });

  test('Initializing the "renderError" method', () => {
    presenter['_getView']('viewError').renderError = jest.fn();
    presenter.renderError('message', initSettings);

    expect(view.viewList['viewError'].renderError).toHaveBeenCalledWith('message', initSettings);
  });

  test('Initializing the "calcTargetValue" method', () => {
    model.calcTargetValue = jest.fn();
    presenter.calcTargetValue(null, 50);

    expect(model.calcTargetValue).toHaveBeenCalledWith(null, 50, false);
  });
});

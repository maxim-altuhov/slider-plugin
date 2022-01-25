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
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Initializing the "renderSlider" method', () => {
    view.renderSlider = jest.fn();
    presenter.renderSlider(fakeSelector);

    expect(view.renderSlider).toHaveBeenCalledWith(fakeSelector);
  });

  test('Initializing the "setObservers" method', () => {
    model.subscribe = jest.fn();
    model.errorEvent.subscribe = jest.fn();
    view.subscribe = jest.fn();

    presenter.setObservers();

    expect(model.subscribe).toHaveBeenCalled();
    expect(model.errorEvent.subscribe).toHaveBeenCalled();
    expect(view.subscribe).toHaveBeenCalled();
  });

  test('Initializing the "updateViews" method', () => {
    view.updateViews = jest.fn();
    presenter.updateViews(InitSettings);

    expect(view.updateViews).toHaveBeenCalledWith(InitSettings);
  });

  test('Initializing the "renderError" method', () => {
    view.renderError = jest.fn();
    presenter.renderError('message', InitSettings);

    expect(view.renderError).toHaveBeenCalledWith('message', InitSettings);
  });

  test('Initializing the "updateModel" method', () => {
    const INPUT_VALUE = 50;
    model.calcTargetValue = jest.fn();
    presenter.updateModel(null, INPUT_VALUE);

    expect(model.calcTargetValue).toHaveBeenCalledWith(null, INPUT_VALUE, false);
  });
});

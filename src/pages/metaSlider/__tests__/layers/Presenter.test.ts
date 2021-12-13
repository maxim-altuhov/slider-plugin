/* eslint-disable @typescript-eslint/dot-notation */
import Model from '../../layers/Model';
import View from '../../layers/View';
import Presenter from '../../layers/Presenter';
import initSettings from '../../data/initSettings';

const fakeSelector = $('.fake-selector');
const view = new View();
const model = new Model(fakeSelector, initSettings);
const presenter = new Presenter(view, model);

describe('Checking the "Presenter" layer', () => {
  test('Initializing the "renderSlider" method', () => {
    presenter['_view'].renderSlider = jest.fn();
    presenter.renderSlider(fakeSelector);

    expect(presenter['_view'].renderSlider).toHaveBeenCalledWith(fakeSelector);
  });

  test('Initializing the "setObservers" method', () => {
    presenter['_model'].subscribe = jest.fn();
    presenter['_model'].errorEvent.subscribe = jest.fn();
    presenter['_getView']('viewSlider').subscribe = jest.fn();
    presenter['_getView']('viewThumbs').subscribe = jest.fn();
    presenter['_getView']('viewScale').subscribe = jest.fn();

    presenter.setObservers();

    expect(presenter['_model'].subscribe).toHaveBeenCalled();
    expect(presenter['_model'].errorEvent.subscribe).toHaveBeenCalled();
    expect(presenter['_view'].viewList['viewSlider'].subscribe).toHaveBeenCalled();
    expect(presenter['_view'].viewList['viewThumbs'].subscribe).toHaveBeenCalled();
    expect(presenter['_view'].viewList['viewScale'].subscribe).toHaveBeenCalled();
  });

  test('Initializing the "updateViews" method', () => {
    presenter['_view'].update = jest.fn();
    presenter.updateViews(initSettings);

    expect(presenter['_view'].update).toHaveBeenCalledWith(initSettings);
  });

  test('Initializing the "renderError" method', () => {
    presenter['_getView']('viewError').renderError = jest.fn();
    presenter.renderError('message', initSettings);

    expect(presenter['_view'].viewList['viewError'].renderError).toHaveBeenCalledWith(
      'message',
      initSettings,
    );
  });

  test('Initializing the "calcTargetValue" method', () => {
    presenter['_model'].calcTargetValue = jest.fn();
    presenter.calcTargetValue(null, 50);

    expect(presenter['_model'].calcTargetValue).toHaveBeenCalledWith(null, 50, false);
  });
});

import View from '../../layers/View';
import InitSettings from '../../data/InitSettings';

describe('Checking the "View" layer', () => {
  const classView = new View();
  const viewListContainsUpdate: string[] = [];
  let viewContainsRenderSlider = '';

  Object.keys(classView.viewList).forEach((view) => {
    if ('update' in classView.viewList[view]) {
      classView.viewList[view].update = jest.fn();
      viewListContainsUpdate.push(view);
    }

    if ('renderSlider' in classView.viewList[view]) {
      classView.viewList[view].renderSlider = jest.fn();
      viewContainsRenderSlider = view;
    }
  });

  test.each(viewListContainsUpdate)(
    'When the "update" method is performed at the "View" level, an update occurs in the dependent subview from "ViewList"-> %s and an object with options is passed to the "update"',
    (view) => {
      classView.updateViews(InitSettings);

      expect(classView.viewList[view].update).toHaveBeenCalledWith(InitSettings);
    },
  );

  test('When the slider rendering method is initialized, the required method is called in the subspecies responsible for it and the selector necessary for rendering the slider is passed there.', () => {
    const $FAKE_SELECTOR = $('.fake-selector');
    classView.renderSlider($FAKE_SELECTOR);

    expect(classView.viewList[viewContainsRenderSlider].renderSlider).toHaveBeenCalledWith(
      $FAKE_SELECTOR,
    );
  });

  test('Checking the "updateModel" method', () => {
    const FAKE_TARGET_VALUE = 50;
    const fakeEvent: Event = $.Event('click');
    const mockNotify = jest.spyOn(classView, 'notify').mockImplementation();

    classView.updateModel(fakeEvent, FAKE_TARGET_VALUE);

    expect(classView.notify).toHaveBeenCalledWith(fakeEvent, FAKE_TARGET_VALUE);

    mockNotify.mockRestore();
  });
});

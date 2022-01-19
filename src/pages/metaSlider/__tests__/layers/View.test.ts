import View from '../../layers/View';
import InitSettings from '../../data/InitSettings';

describe('Checking the "View" layer', () => {
  const classView = new View();
  const $FAKE_SELECTOR = $('.fake-selector');
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

  beforeEach(() => {
    classView.update(InitSettings);
    classView.renderSlider($FAKE_SELECTOR);
  });

  test.each(viewListContainsUpdate)(
    'When the "update" method is performed at the "View" level, an update occurs in the dependent subview from "ViewList"-> %s and an object with options is passed to the "update"',
    (view) => {
      expect(classView.viewList[view].update).toHaveBeenCalledWith(InitSettings);
    },
  );

  test('When the slider rendering method is initialized, the required method is called in the subspecies responsible for it and the selector necessary for rendering the slider is passed there.', () => {
    expect(classView.viewList[viewContainsRenderSlider].renderSlider).toHaveBeenCalledWith(
      $FAKE_SELECTOR,
    );
  });
});

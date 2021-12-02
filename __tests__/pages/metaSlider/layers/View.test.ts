import View from '../../../../src/pages/metaSlider/layers/View';
import initSettings from '../../../../src/pages/metaSlider/data/initSettings';

const classView = new View();

describe('Test of the "View" layer, method "update"', () => {
  const viewListForTest: string[] = [];

  Object.keys(classView.viewList).forEach((view) => {
    if ('update' in classView.viewList[view]) {
      classView.viewList[view].update = jest.fn();
      viewListForTest.push(view);
    }
  });

  beforeEach(() => {
    classView.update(initSettings);
  });

  test.each(viewListForTest)(
    'When the "update" method is performed at the "View" level, an update occurs in the dependent subview from "ViewList"-> %s and an object with options is passed to the "update"',
    (view) => {
      expect(classView.viewList[view].update).toHaveBeenCalled();
      expect(classView.viewList[view].update).toHaveBeenCalledWith(initSettings);
    },
  );
});

describe('Test of the "View" layer, method "renderSlider"', () => {
  const TARGET_VIEW = 'viewSlider';
  const $FAKE_SELECTOR = $('.fake-selector');

  classView.viewList[TARGET_VIEW].renderSlider = jest.fn();
  const mockRenderSlider = classView.viewList[TARGET_VIEW].renderSlider;

  beforeEach(() => {
    classView.renderSlider($FAKE_SELECTOR);
  });

  test('When the slider rendering method is initialized, the required method is called in the subspecies responsible for it and the selector necessary for rendering the slider is passed there.', () => {
    expect(mockRenderSlider).toHaveBeenCalled();
    expect(mockRenderSlider).toHaveBeenCalledWith($FAKE_SELECTOR);
  });
});

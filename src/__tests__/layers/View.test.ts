import View from '../../pages/metaSlider/layers/View';

const classView = new View();

describe('Test of the "View" layer, method "update"', () => {
  const initSettings: IPluginOptions = {
    key: '',
    $selector: $(),
    $elemSlider: $(),
    $sliderProgress: $(),
    $elemMarkers: $(),
    $elemScale: $(),
    $elemThumbs: $(),
    mainColor: '#6d6dff',
    secondColor: '#e4e4e4',
    colorMarker: '',
    colorThumb: '',
    colorTextForMarker: '#ffffff',
    colorBorderForMarker: '#ffffff',
    colorBorderForThumb: '#ffffff',
    colorForScale: '#000000',
    initFormatted: true,
    initAutoMargins: true,
    initScaleAdjustment: true,
    calcNumberOfDecimalPlaces: true,
    showError: false,
    showScale: true,
    showMarkers: true,
    showBackground: true,
    isRange: true,
    isVertical: false,
    initAutoScaleCreation: true,
    checkingStepSizeForScale: false,
    step: 1,
    stepAsPercent: 0,
    minValue: 0,
    maxValue: 100,
    stepSizeForScale: null,
    numberOfDecimalPlaces: 0,
    preFix: '',
    postFix: '',
    customValues: [],
    initValueFirst: null,
    initValueSecond: null,
    initValuesArray: [],
    textValueFirst: '',
    textValueSecond: '',
    textValuesArray: [],
    valuesAsPercentageArray: [],
  };
  const viewList: string[] = [];

  Object.keys(classView.viewList).forEach((view) => {
    if ('update' in classView.viewList[view]) {
      classView.viewList[view].update = jest.fn();
      viewList.push(view);
    }
  });

  beforeEach(() => {
    classView.update(initSettings);
  });

  test.each(viewList)(
    'When the "update" method is performed at the "View" level, an update occurs in the dependent subview from "ViewList"-> %s',
    (view) => {
      expect(classView.viewList[view].update).toBeCalled();
    },
  );

  test.each(viewList)(
    'An object with options is passed to the "update" method for the subview from the "View List" when called -> %s',
    (view) => {
      expect(classView.viewList[view].update).toBeCalledWith(initSettings);
    },
  );
});

describe('Test of the "View" layer, method "renderSlider"', () => {
  const TARGET_VIEW = 'viewSlider';
  const $FAKE_SELECTOR = $();

  classView.viewList[TARGET_VIEW].renderSlider = jest.fn();
  const mockRenderSlider = classView.viewList[TARGET_VIEW].renderSlider;

  beforeEach(() => {
    classView.renderSlider($FAKE_SELECTOR);
  });

  test('When the slider render method is initialized, the required method is called in the subview responsible for this', () => {
    expect(mockRenderSlider).toBeCalled();
  });

  test('The selector on which the slider is initialized is passed to the arguments of the slider rendering method', () => {
    expect(mockRenderSlider).toBeCalledWith($FAKE_SELECTOR);
  });
});

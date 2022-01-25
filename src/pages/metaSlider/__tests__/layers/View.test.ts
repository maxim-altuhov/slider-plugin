/* eslint-disable @typescript-eslint/dot-notation */
import View from '../../layers/View';
import InitSettings from '../../data/InitSettings';
import * as createUniqueID from '../../utils/createUniqueID';

const initSelectorName = 'render-selector';
const initHTMLBlock = `<div id="${initSelectorName}"></div>`;
document.body.innerHTML = initHTMLBlock;
const $initSelector = $(`#${initSelectorName}`);

describe('Checking the "View" layer', () => {
  const classView = new View();
  const viewListContainsUpdate: string[] = [];

  Object.keys(classView.viewList).forEach((view) => {
    if ('update' in classView.viewList[view]) {
      classView.viewList[view].update = jest.fn();
      viewListContainsUpdate.push(view);
    }
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('Checking the "renderSlider" method', () => {
    const mockCreateUniqueID = jest.spyOn(createUniqueID, 'default').mockImplementation(() => '');
    const checkingSelectorsArr = [
      /js-meta-slider/,
      /js-meta-slider__progress/,
      /js-meta-slider__thumb/,
      /js-meta-slider__marker/,
      /js-meta-slider__scale/,
      /data-id/,
      /data-value/,
      /data-text/,
    ];

    classView.renderSlider($initSelector);

    expect(document.body.innerHTML).toMatchSnapshot();
    checkingSelectorsArr.forEach((selector) => {
      expect(document.body.innerHTML).toMatch(selector);
    });
    expect(mockCreateUniqueID).toHaveBeenCalled();
    expect(document.body.innerHTML).not.toBe(initHTMLBlock);
    expect(classView['_$selector']).toHaveLength(1);
    expect(classView['_$selector']).toBe($initSelector);
  });

  test.each(viewListContainsUpdate)(
    'When the "update" method is performed at the "View" level, an update occurs in the dependent subview from "ViewList"-> %s and an object with options is passed to the "update"',
    (view) => {
      classView.updateViews(InitSettings);

      expect(classView.viewList[view].update).toHaveBeenCalledWith(InitSettings);
    },
  );

  test('Checking the "updateModel" method', () => {
    const FAKE_TARGET_VALUE = 50;
    const fakeEvent: Event = $.Event('click');
    const mockNotify = jest.spyOn(classView, 'notify').mockImplementation();

    classView.updateModel(fakeEvent, FAKE_TARGET_VALUE);

    expect(classView.notify).toHaveBeenCalledWith(fakeEvent, FAKE_TARGET_VALUE);

    mockNotify.mockRestore();
  });
});

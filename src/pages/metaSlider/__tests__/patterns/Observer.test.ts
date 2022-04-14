/* eslint-disable @typescript-eslint/dot-notation */
import Observer from '../../patterns/Observer';

class TestClass extends Observer {}
const classWithObserver = new TestClass();
const sumFnForTest = (a: number, b: number) => a + b;

afterEach(() => {
  classWithObserver['_observerList'].length = 0;
});

describe('Checking the "Observer" pattern, the "subscribe" method', () => {
  test('When the subscribe method is used, the function passed to the method is added to the "observerList" list', () => {
    classWithObserver.subscribe(sumFnForTest);

    expect(classWithObserver['_observerList']).toHaveLength(1);
    expect(classWithObserver['_observerList']).toContainEqual(sumFnForTest);
  });

  test.each([expect.any(Number), expect.any(Array), expect.any(String)])(
    'When a non-function is passed to the subscribe method, an error is thrown (test $#)',
    (testArg) => {
      expect(() => {
        classWithObserver.subscribe(testArg);
      }).toThrow('Add observer must be a function');
    },
  );

  test('The function is passed to the subscribe method', () => {
    expect(() => {
      classWithObserver.subscribe(() => true);
    }).not.toThrow();
  });

  test('When a function that is already in the "observerList" is passed to the subscribe method, an error is thrown', () => {
    expect(() => {
      classWithObserver.subscribe(sumFnForTest);
    }).not.toThrow();

    expect(() => {
      classWithObserver.subscribe(sumFnForTest);
    }).toThrow('Observer already in the list');
  });
});

describe('Checking the "Observer" pattern, the "unsubscribe" method', () => {
  test('When a function that is already in the "observerList" is passed to the unsubscribe method, it is removed from the "observerList"', () => {
    classWithObserver.subscribe(sumFnForTest);
    expect(classWithObserver['_observerList']).toHaveLength(1);
    expect(classWithObserver['_observerList']).toContainEqual(sumFnForTest);

    classWithObserver.unsubscribe(sumFnForTest);
    expect(classWithObserver['_observerList']).toHaveLength(0);
  });
});

describe('Checking the "Observer" pattern, the "notify" method', () => {
  const mockReturnNum = jest.fn((x: number) => x);
  const mockDoubleNum = jest.fn((num: number) => num ** 2);

  test('When the "notify" method is called, all functions stored in the "observerList" instance of the class are called', () => {
    classWithObserver.subscribe(mockReturnNum);
    classWithObserver.subscribe(mockDoubleNum);
    classWithObserver.notify(5);

    expect(mockReturnNum).toHaveBeenCalledTimes(1);
    expect(mockReturnNum).toHaveReturnedWith(5);

    expect(mockDoubleNum).toHaveBeenCalledTimes(1);
    expect(mockDoubleNum).toHaveReturnedWith(25);
  });
});

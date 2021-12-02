import Observer from '../../../../src/pages/metaSlider/patterns/Observer';

/**
 * В тесте используется правило @ts-ignore для возможности
 * дополнительной проверки класса Observer на вывод ошибок
 * при передаче в методы некорректных типов данных
 */
const classObserver = new Observer();
const sumFnTest = (a: number, b: number) => a + b;

afterEach(() => {
  classObserver.observerList.length = 0;
});

describe('Test of the "Observer" pattern, method "subscribe"', () => {
  test('When the subscribe method is used, the function passed to the method is added to the "observerList" list', () => {
    classObserver.subscribe(sumFnTest);

    expect(classObserver.observerList).toHaveLength(1);
    expect(classObserver.observerList).toContainEqual(sumFnTest);
  });

  test('When a non-function is passed to the subscribe method, an error is thrown', () => {
    expect(() => {
      // @ts-ignore
      classObserver.subscribe(expect.any(Number));
    }).toThrow();

    expect(() => {
      // @ts-ignore
      classObserver.subscribe(expect.any(Array));
    }).toThrow();

    expect(() => {
      // @ts-ignore
      classObserver.subscribe(expect.any(String));
    }).toThrow();

    expect(() => {
      classObserver.subscribe(() => true);
    }).not.toThrow();
  });

  test('When a function that is already in the "observerList" is passed to the subscribe method, an error is thrown', () => {
    expect(() => {
      classObserver.subscribe(sumFnTest);
    }).not.toThrow();

    expect(() => {
      classObserver.subscribe(sumFnTest);
    }).toThrow();
  });
});

describe('Test of the "Observer" pattern, method "unsubscribe"', () => {
  test('When a function that is already in the "observerList" is passed to the unsubscribe method, it is removed from the "observerList"', () => {
    classObserver.subscribe(sumFnTest);
    expect(classObserver.observerList).toHaveLength(1);
    expect(classObserver.observerList).toContainEqual(sumFnTest);

    classObserver.unsubscribe(sumFnTest);
    expect(classObserver.observerList).toHaveLength(0);
  });
});

describe('Test of the "Observer" pattern, method "notify"', () => {
  const mockReturnNum = jest.fn((x: number) => x);
  const mockDoubleNum = jest.fn((num: number) => num ** 2);

  test('When the "notify" method is called, all functions stored in the "observerList" instance of the class are called', () => {
    classObserver.subscribe(mockReturnNum);
    classObserver.subscribe(mockDoubleNum);
    classObserver.notify(5);

    expect(mockReturnNum).toHaveBeenCalledTimes(1);
    expect(mockReturnNum).toHaveReturnedWith(5);

    expect(mockDoubleNum).toHaveBeenCalledTimes(1);
    expect(mockDoubleNum).toHaveReturnedWith(25);
  });
});

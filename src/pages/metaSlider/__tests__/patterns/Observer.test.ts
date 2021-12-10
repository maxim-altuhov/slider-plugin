import Observer from '../../patterns/Observer';

/**
 * В тесте используется правило @ts-ignore для возможности
 * дополнительной проверки класса Observer на вывод ошибок
 * при передаче в методы некорректных типов данных
 */
const classObserver = new Observer();
const sumFnForTest = (a: number, b: number) => a + b;

afterEach(() => {
  classObserver.observerList.length = 0;
});

describe('Checking the "Observer" pattern, the "subscribe" method', () => {
  test('When the subscribe method is used, the function passed to the method is added to the "observerList" list', () => {
    classObserver.subscribe(sumFnForTest);

    expect(classObserver.observerList).toHaveLength(1);
    expect(classObserver.observerList).toContainEqual(sumFnForTest);
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
      classObserver.subscribe(sumFnForTest);
    }).not.toThrow();

    expect(() => {
      classObserver.subscribe(sumFnForTest);
    }).toThrow();
  });
});

describe('Checking the "Observer" pattern, the "unsubscribe" method', () => {
  test('When a function that is already in the "observerList" is passed to the unsubscribe method, it is removed from the "observerList"', () => {
    classObserver.subscribe(sumFnForTest);
    expect(classObserver.observerList).toHaveLength(1);
    expect(classObserver.observerList).toContainEqual(sumFnForTest);

    classObserver.unsubscribe(sumFnForTest);
    expect(classObserver.observerList).toHaveLength(0);
  });
});

describe('Checking the "Observer" pattern, the "notify" method', () => {
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

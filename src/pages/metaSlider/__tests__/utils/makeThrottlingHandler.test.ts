import makeThrottlingHandler from '../../utils/makeThrottlingHandler';

document.body.innerHTML = '<button id="click-btn"></button>';

// I use the any type so that it is possible to pass any arguments to the called functions
const TIMEOUT_MS = 5000;
const btn = $('#click-btn');
const testFn = jest.fn((arg?: any) => arg);
let timer: NodeJS.Timeout;

btn.on('click', makeThrottlingHandler(testFn.bind(null, true), TIMEOUT_MS));

beforeEach(() => {
  jest.useFakeTimers();

  timer = setInterval(() => {
    btn.trigger('click');
  }, 1000);
});

afterEach(() => {
  clearTimeout(timer);
  jest.clearAllTimers();
});

test('Checking the "makeThrottlingHandler" function, the function being checked was called only once during the specified period of time', () => {
  jest.advanceTimersByTime(TIMEOUT_MS);
  expect(testFn).toHaveBeenCalledTimes(0);

  jest.advanceTimersToNextTimer(1);
  expect(testFn).toHaveBeenCalledTimes(1);
  expect(testFn).toHaveReturnedWith(true);
});

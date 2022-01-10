function makeThrottlingHandler(fn: Function, timeout: number) {
  let timer: NodeJS.Timeout | null = null;

  // I use the any type so that it is possible to pass any arguments to the called functions
  return (...args: any) => {
    if (timer) return;

    timer = setTimeout(() => {
      fn(...args);

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }, timeout);
  };
}

export default makeThrottlingHandler;

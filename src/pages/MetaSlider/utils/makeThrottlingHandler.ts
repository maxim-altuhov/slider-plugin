function makeThrottlingHandler(fn: Function, timeout: number) {
  let timer: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
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

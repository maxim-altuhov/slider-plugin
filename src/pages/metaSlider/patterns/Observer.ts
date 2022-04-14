abstract class Observer {
  private _observerList: Function[] = [];

  subscribe(observer: Function) {
    if (typeof observer !== 'function') {
      throw new Error('Add observer must be a function');
    }

    this._observerList.forEach((item) => {
      if (item === observer) throw new Error('Observer already in the list');
    });

    this._observerList.push(observer);
  }

  unsubscribe(observer: Function) {
    this._observerList = this._observerList.filter((item) => item !== observer);
  }

  /**
   * Calls all subscribed methods from the list.
   * Type any, so that it is possible to pass any arguments to the called methods
   */
  notify(...arg: any) {
    this._observerList.forEach((observer) => observer(...arg));
  }
}

export default Observer;

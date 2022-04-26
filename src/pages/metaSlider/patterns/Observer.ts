abstract class Observer implements IObserver {
  private _observerList: ((...args: any[]) => unknown)[] = [];

  subscribe(observer: (...args: any[]) => unknown) {
    if (typeof observer !== 'function') {
      throw new Error('Add observer must be a function');
    }

    this._observerList.forEach((item) => {
      if (item === observer) throw new Error('Observer already in the list');
    });

    this._observerList.push(observer);
  }

  unsubscribe(observer: (...args: any[]) => unknown) {
    this._observerList = this._observerList.filter((item) => item !== observer);
  }

  notify(...arg: any[]) {
    this._observerList.forEach((observer) => observer(...arg));
  }
}

export default Observer;

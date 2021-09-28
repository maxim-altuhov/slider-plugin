class Observer {
  constructor() {
    this.observerList = [];
  }

  subscribe(observer) {
    if (typeof observer !== 'function') throw new Error('Add observer must be a function');

    this.observerList.forEach((item) => {
      if (item === observer) throw new Error('Add observer must be a function');
    });

    this.observerList.push(observer);
  }

  unsubscribe(observer) {
    this.observerList = this.observerList.filter((item) => item !== observer);
  }

  notify(arg) {
    this.observerList.forEach((observer) => observer(arg));
  }
}

export default Observer;

class Observer {
  public observerList: Function[] = [];

  subscribe(observer: Function) {
    if (typeof observer !== 'function') {
      throw new Error('Add observer must be a function');
    }

    this.observerList.forEach((item) => {
      if (item === observer) throw new Error('Observer already in the list');
    });

    this.observerList.push(observer);
  }

  unsubscribe(observer: Function) {
    this.observerList = this.observerList.filter((item) => item !== observer);
  }

  /**
   * Calls all subscribed methods from the list.
   * Type any, so that it is possible to pass any arguments to the called methods
   */
  notify(...arg: any) {
    this.observerList.forEach((observer) => observer(...arg));
  }
}

export default Observer;

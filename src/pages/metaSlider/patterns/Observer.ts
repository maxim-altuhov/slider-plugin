class Observer {
  public observerList: Function[] = [];

  // Добавляет метод в список подписчиков
  subscribe(observer: Function) {
    if (typeof observer !== 'function') {
      throw new Error('Add observer must be a function');
    }

    this.observerList.forEach((item) => {
      if (item === observer) throw new Error('Observer already in the list');
    });

    this.observerList.push(observer);
  }

  // Удаляет метод из списка подписчиков
  unsubscribe(observer: Function) {
    this.observerList = this.observerList.filter((item) => item !== observer);
  }

  /**
   * Вызывает все подписанные методы из списка.
   * Тип any, чтобы была возможность передавать любые аргументы в вызываемые методы
   */
  notify(...arg: any) {
    this.observerList.forEach((observer) => observer(...arg));
  }
}

export default Observer;

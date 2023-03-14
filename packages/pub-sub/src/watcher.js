/**
 * Subject类表示主题，它可以添加和删除观察者，并在数据更改时通知它们。
 */
class Subject {
  /**
   * 创建一个新的Subject实例。
   */
  constructor() {
    /** @type {Observer[]} 观察者列表 */
    this.observers = [];
  }

  /**
   * 添加一个观察者。
   * @param {Observer} observer - 要添加的观察者。
   */
  addObserver(observer) {
    this.observers.push(observer);
  }

  /**
   * 删除一个观察者。
   * @param {Observer} observer - 要删除的观察者。
   */
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * 向所有观察者发送通知，并传递数据。
   * @param {*} data - 要传递给观察者的数据。
   */
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

/**
 * Observer类表示观察者，它定义了一个update方法，该方法在主题发出通知时被调用。
 */
class Observer {
  /**
   * 当主题发出通知时调用此方法。
   * @param {*} data - 主题传递的数据。
   */
  update(data) {}
}

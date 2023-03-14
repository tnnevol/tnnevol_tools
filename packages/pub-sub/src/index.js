/**
 * @class PubSub
 * @description 发布订阅类
 */
class PubSub {
  constructor() {
    this.events = {};
  }

  /**
   * @method subscribe
   * @description 订阅事件
   * @param {string} event - 事件名称
   * @param {function} callback - 回调函数
   */
  subscribe(event, callback) {
    if (!hasOwnProperty(this.events, event)) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * @method publish
   * @description 发布事件
   * @param {string} event - 事件名称
   * @param {...*} data - 数据参数
   */
  publish(event, ...data) {
    if (!hasOwnProperty(this.events, event)) return;
    this.events[event].forEach(callback => callback(...data));
  }
}

function hasOwnProperty(subject, ...args) {
  return Object.prototype.hasOwnProperty.apply(subject, args);
}

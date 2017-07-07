/**
 * 简单实现了一下 subscribe 和 dispatch
 * 注册监听事件规范：
 * 1. 注册的事件名规则   模块名_事件名  module1_add  / module1_delete
 * 2. 注册事件，统一在组件的  getInitialState  方法里面注册【该方法只在实例化的时候，调用一次】
 */
window.EventEmitter = {
  _events: {},
  /**
   * 派发事件
   * @param eventName
   * @param data
   */
  dispatch: function (eventName, data) {
    if (!this._events[eventName]) {
    } else {
      for (var i = 0; i < this._events[eventName].length; i++) {
        this._events[eventName][i] && this._events[eventName][i](data);
      }
    }
  },
  /**
   * 注册事件
   * @param eventName
   * @param func
   */
  subscribe: function (eventName, func) {
    this._events[eventName] = this._events[eventName] || [];
    if (this._events[eventName].indexOf(func) === -1) {
      this._events[eventName].push(func);
    } else {
    }
  },
  /**
   * 移除事件
   * @param eventName
   * @param func
   */
  remove: function (eventName, func) {
    if (this._events[eventName]) {
      if (func) {
        var index = this._events[eventName].indexOf(func);
        this._events[eventName].splice(index, 1);
      } else {
        delete this._events[eventName];
      }

    }
  },
  /**
   * 是否已经注册
   * @param eventName
   * @returns {boolean}
   */
  hasEvent: function (eventName) {
    var flag = false;
    if (this._events[eventName])
      flag = true;
    return flag;
  }
};

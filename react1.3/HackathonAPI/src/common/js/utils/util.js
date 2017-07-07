export default {
  /**
   * 根据key和value 删除 数组里面的值,返回删除后的数组
   * @param arr
   * @param key
   * @param value
   * @returns {Array}
   */
  delItemByKeyAndValue: function (arr, key, value) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] !== value) {
        newArr.push(arr[i])
      }
    }
    return newArr;
  },
  /**
   * 根据Key 和 value ，修改 对象数组里面的值,替换整个对象
   * @param arr
   * @param key
   * @param value
   * @param newValue
   * @returns {*}
   */
  setItemByKeyAndValue: function (arr, key, value, newItem) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) {
        arr[i] = newItem;
      }
    }
    return arr;
  },
  /**
   * 数组中是否存在该值
   * @return true 已经存在在队列中
   */
  valIsExist4Arr: function (arr, key, val) {
    for (var i = 0; i < arr.length; i++) {
      var file = arr[i];
      if (file[key] === val) {
        return true;
      }
    }
    return false;
  },
  /**
   * 生成BFD-UI DataTable 组件的数据格式
   * @param data
   * @returns {{totalList: *, currentPage: number, totalPageNum: *}}
   */
  generaotrDTData(data){
    return {
      totalList: data,
      currentPage: 1,
      totalPageNum: data && data.length
    }
  },
  /**
   * 把文件大小,转换成只对的单位
   * @param len
   * @returns {*}
   */
  changeSize: function (len) {
    if (len === 0) {
      return "";
    }
    if (len < 1024) {
      return len.toFixed(2) + " B";
    }
    if (len < (1024 * 1024)) {
      return (len / 1024).toFixed(2) + " KB";
    }
    if (len < (1024 * 1024 * 1024)) {
      return (len / 1024 / 1024).toFixed(2) + " MB";
    }
    if (len < (1024 * 1024 * 1024 * 1024)) {
      return (len / 1024 / 1024 / 1024).toFixed(2) + " GB";
    }
    if (len >= (1024 * 1024 * 1024 * 1024)) {
      return (len / 1024 / 1024 / 1024 / 1024).toFixed(2) + " TB";
    }
    return "";
  }
}
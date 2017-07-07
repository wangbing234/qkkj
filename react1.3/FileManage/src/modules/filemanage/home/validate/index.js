/***************************************************
 * 时间: 16/4/29 11:31
 * 作者: zhongxia
 * 说明: 抽取出来的基本验证方法,和组合而成的业务相关逻辑验证
 *
 ***************************************************/
import Model from '../model/fileManageAjax'

export default {
  /**
   * 目录名称不能含有特殊字符
   * @param val
   * @returns {boolean}
   */
  checkDirName: (val) => {
    let reg = /^[0-9a-zA-Z\u4E00-\u9FA5\_\-]+$/i
    return reg.test(val)
  },
  /**
   * 文件名不能含有特殊字符(字母数字中文 _ -)
   * @param val
   * @returns {boolean}
   */
  checkFileName: function (val) {
    let reg = /^[0-9a-zA-Z\u4E00-\u9FA5\_\-][0-9a-zA-Z\u4E00-\u9FA5\_\-\.]+$/i
    return reg.test(val)
  },
  /**
   * 检查长度
   * @param val
   * @param minLength 最小长度
   * @param maxLength 最大长度
   * @returns {boolean}
   */
  checkLength: function (val, minLength, maxLength) {
    if (val.length <= maxLength && val.length >= minLength) {
      return true
    }
    return false
  },

  /**
   * 验证创建文件夹
   * @param path 文件路径
   * @param name 文件名
   * @param min  最小长度
   * @param max  最大长度
   * @param flag 是否验证文件名是否重复
   * @returns {*}
   */
  mkdir: function (path, name, min, max, flag) {
    min = min || 2
    max = max || 30
    name = name && name.trim() || ''
    if (!name) {
      return '文件夹名不允许为空'
    }
    if (!this.checkDirName(name)) {
      return '文件夹名不允许输入特殊字符'
    }
    if (!this.checkLength(name, min, max)) {
      return '文件夹名长度必须在2~30之间'
    }
    if (flag) {
      if (Model.checkAsyncFileExist(path, name)) {
        return '文件夹名称已经存在'
      }
    }
  }
}


/***************************************************
 * 时间: 8/3/16 11:16
 * 作者: zhongxia
 * 说明: 选项卡的一些常用JS的相关方法
 ***************************************************/
import Model from 'IDERoot/model/ide'

const SCRIPTS = "SCRIPTS"
/**
 * 把数据数据到IDE的变量里面
 * @param key 关键字
 * @param value  值
 */
function saveData(key, value) {
  window['_IDE_'] = window['_IDE_'] || {};
  window['_IDE_'][key] = value;
}

/**
 * 根据key获取数据
 * @param key
 * @returns {*}
 */
function getDatabyKey(key) {
  return window['_IDE_'][key];
}

/**
 * 保存所有脚本数据
 * @param data
 */
function saveScripts() {
  //加载过了, 不继续加载
  if (!getDatabyKey(SCRIPTS)) {
    Model.getAllScriptInfo((result)=> {
      let data = [];
      result.data && result.data.map((item, index)=> {
        let name = item.name.split('.')[0];
        data.push(name)
      })
      saveData(SCRIPTS, data);
    })
  }
}

/**
 * 生成脚本类型的名称
 * @param typeF
 */
function generatorName(item, count) {
  let scriptName = `新建${item.key}${count++}.${item.suffix}`
  let scripts = getDatabyKey(SCRIPTS);
  while (scripts.indexOf(scriptName) === -1) {
    scriptName = `新建${item.key}${count++}.${item.suffix}`
  }
  return scriptName;
}

export default {
  saveData,
  getDatabyKey,
  generatorName,
  saveScripts
}
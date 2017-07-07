import React from 'react';
import AuthButton from 'CommonComponent/component/authbutton'
//把对象拼接成URL，应用于post改为url
function objectToURL(obj) {
  let props = "";
  for (var p in obj) { // 方法
    if (typeof ( obj [p]) != "function" && String(obj [p]).trim()) {
      props += ("&" + p + "=" + (obj [p] != "全部" ? obj [p] : ""));
    }
  }
  return props.substring(1);
}

//把对象数组拼接成字符串
function spiltArrayToString(array, field, spilt) {
  let strArray = "";
  for (var toItem of array) {
    if (toItem[field])
      strArray += spilt + toItem[field];
  }
  return strArray.substring(spilt.length);
}

//把对象的数组中的对象，变成字符串数组
function getStringArrayByObjectArray(array, field) {
  let strArray = [];
  for (var toItem of array) {
    strArray.push(toItem[field])
  }
  return strArray;
}

//是否有重复的数据,为空的不算
function hasSameFieldValue(array, field) {
  for (var toItem of array) {
    for (var toItemIn of array) {
      if (toItem != toItemIn && toItem[field] == toItemIn[field])
        return true;
    }
  }
  return false;
}

//过滤获取字段对象值
function fifterArrayByValue(array, field, value) {
  var rArray = [];
  for (var toItem of array) {
    if (toItem[field] == value)
      rArray.push(toItem);
  }
  return rArray;
}


//获取指定数值的数组
function getAssginValueItem(array, field, value) {
  let rArray = [];
  for (var toItem of array) {
    if (toItem && toItem[field] && toItem[field] == value) {
      rArray.push(toItem);
    }
  }
  return rArray;
}


//去掉source中，和target重复的数据，通过field区分，主要用于穿梭框
function removeFormOtherArray(source, target, field) {
  let result = [];
  for (var toItem of source) {
    let isHasSame = false;
    for (var sItem of target) {
      if (toItem[field] == sItem[field]) {
        isHasSame = true;
        break;
      }
    }
    if (!isHasSame)
      result.push(toItem);
  }
  return result;
}

function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
}


/***************************************************************************
 * @param {string} url 完整的URL地址
 * @returns {object} 自定义的对象
 * @description 用法示例：var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
 *  myURL.file='index.html'
 *  myURL.base = 'http://abc.com:8080'
 *  myURL.hash= 'top'
 *  myURL.host= 'abc.com'
 *  myURL.query= '?id=255&m=hello'
 *  myURL.params= Object = { id: 255, m: hello }
 *  myURL.path= '/dir/index.html'
 *  myURL.segments= Array = ['dir', 'index.html']
 *  myURL.port= '8080'
 *  myURL.protocol= 'http'
 *  myURL.source= 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'
 ***************************************************************************/
function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    base: a.protocol.replace(':', '') + '://' + a.hostname + (a.port ? ':' + a.port : ''),
    query: a.search,
    params: (function () {
      var ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length, i = 0, s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
}


var swapItems = function (arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};

// 上移
var upRecord = function (arr, item) {
  var $index = arr.indexOf(item);
  if ($index <= 0) {
    return arr;
  }
  return swapItems(arr, $index, $index - 1);
};

// 下移
var downRecord = function (arr, item) {
  var $index = arr.indexOf(item);
  if ($index == arr.length - 1) {
    return arr;
  }
  return swapItems(arr, $index, $index + 1);
};

function dataFormatter(dataNum) {
  var _data = new Date(dataNum);
  var year = _data.getFullYear();
  var month = _data.getMonth() + 1;
  var date = _data.getDate();
  var hour = _data.getHours();
  var minute = _data.getMinutes();
  var second = _data.getSeconds();
  if (month < 10) {
    month = `0${month}`;
  }
  if (date < 10) {
    date = `0${date}`;
  }
  return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
}

/*计算时长*/
function getTimers(timeNum) {
  var num = Number(timeNum);
  var day = Math.floor(num / (24 * 60 * 60 * 1000));
  var timeArr = [];
  var hour = Math.floor((num - day * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  var min = Math.floor((num - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000) / (60 * 1000));
  var sec = Math.floor((num - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000 - min * 60 * 1000) / 1000);
  var micSec = num - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000 - min * 60 * 1000 - sec * 1000;
  if (day > 0) {
    timeArr.push(day.toString() + '天');
  }
  if (hour > 0) {
    timeArr.push(hour.toString() + '小时');
  }
  if (min > 0) {
    timeArr.push(min.toString() + '分钟');
  }
  if (sec > 0) {
    timeArr.push(sec.toString() + '秒');
  }
  if (micSec > 0) {
    timeArr.push(micSec.toString() + '毫秒');
  }
  if (timeArr.length > 0)
    return timeArr.join('');
  return '0秒';
}


//把对象数组拼接成字符串
function transferObjectArray(array, field) {
  let strArray = [];
  for (var toItem of array) {
    strArray.push(toItem[field])
  }
  return strArray;
}


/*
 功能：获取选中的tree的节点数组
 *  objTree 树对象
 *  onlyLeaf 是否只是添加叶子节点
 *  arrayIds空数组，用来接受选择的ID
 ***************************************************************************/
function getCheckTree(objTree, onlyLeaf, arrayIds, isCode) {
  if (objTree instanceof Array) {
    for (var toItem of objTree)
      getCheckTree(toItem, onlyLeaf, arrayIds);
  }
  else {
    if (onlyLeaf) {
      if (objTree["checked"] && (!objTree.children || objTree.children.length == 0)) {
        arrayIds.push(isCode ? objTree["id"] : objTree)
      }
    }

    else {
      if (objTree["checked"])
        arrayIds.push(isCode ? objTree["id"] : objTree)
    }

    if (objTree.children)
      getCheckTree(objTree.children, onlyLeaf, arrayIds);
  }
}

/*
 功能：获取选中的tree的节点数组
 *  objTree 树对象
 *  onlyLeaf 是否只是添加叶子节点
 *  arrayIds空数组，用来接受选择的ID
 ***************************************************************************/
function getCheckTreeByCode(objTree, onlyLeaf, arrayIds) {
  if (objTree instanceof Array) {
    for (var toItem of objTree)
      getCheckTreeByCode(toItem, onlyLeaf, arrayIds);
  }
  else {
    if (onlyLeaf) {
      if (objTree.checked && (!objTree.children || objTree.children.length == 0)) {
        arrayIds.push(objTree["id"])
      }
    }

    else {
      if (objTree.checked)
        arrayIds.push(objTree["id"])
    }

    if (objTree.children)
      getCheckTreeByCode(objTree.children, onlyLeaf, arrayIds);
  }
}

function getSelectTree(objTree, arr) {
  if (objTree instanceof Array) {
    for (var toItem of objTree)
      getSelectTree(toItem, arr);
  }
  else {
    if (objTree.checked && objTree.authStatus == 2 && objTree.authStatus != 0) {//未授权
      arr.push(objTree);
    }
    if (objTree.children) {
      getSelectTree(objTree.children, arr);
    }

  }
}


/*
 *  objTree 如果子节点选择，父节点也选中
 ***************************************************************************/
function renderParentTree(objTree) {
  if (objTree instanceof Array) {
    for (var toItem of objTree)
      renderParentTree(toItem);
  }
  else {
    if (objTree.children && objTree.children.length >= 1) {
      let isNotCheck = false;
      for (var toItem of array) {
        if (toItem["checked"] == false) {
          isNotCheck = true;
          break;
        }
      }
      if (!isNotCheck)
        objTree["checked"] = true;
      renderParentTree(objTree.children);
    }
  }
}

/**
 * 生成UUID
 * @param len 指定生成项的长度
 * @param radix 范围  比如设置 2 , 就只会生成 0101010之类的
 * @returns {string}
 */
function generatorUUID(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

/*
 * 展开第一个节点
 ***************************************************************************/
function spreadTree(objTree) {
  if (!objTree)
    return;
  let obj;
  if (objTree instanceof Array && objTree.length != 0) {
    obj = objTree[0]
    obj.open = true;
  }
}

/**
 * 禁用浏览器回退事件
 * @param e
 * @returns {boolean}
 */
function forbidBackSpace(e) {
  var ev = e || window.event; //获取event对象
  var obj = ev.target || ev.srcElement; //获取事件源
  var t = obj.type || obj.getAttribute('type');
  var vReadOnly = obj.readOnly;
  var vDisabled = obj.disabled;
  //处理undefined值情况
  vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
  vDisabled = (vDisabled == undefined) ? true : vDisabled;
  //当敲Backspace键时，事件源类型为密码或单行、多行文本的，

  //并且readOnly属性为true或disabled属性为true的，则退格键失效
  var flag1 = ev.keyCode == 8 && (t == "search" || t == "email" || t == "password" || t == "number" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);

  //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
  var flag2 = ev.keyCode == 8 && t == "search" && t == "email" && t != "password" && t != "number" && t != "text" && t != "textarea";
  //判断
  if (flag2 || flag1) {
    console.info("禁用键盘回退键,导致页面回退...");
    return false;
  }
}

/**
 * 从字符串中,匹配出参数列表, 生成表单配置
 * @param str 字符串内容
 * @param reg 匹配出需要的参数数组   默认匹配  ${xx}  这种类型的
 */
function generatorFormConfigByStr(str, reg = /\${[^{}]+}/g) {
  let formConfig = [];
  let params = str.match(reg);
  if (params) {

    params = unique(params);

    for (var i = 0; i < params.length; i++) {
      var param = params[i];
      let formItemConfig = {};

      param = param.replace(/[$|{|}]/g, '')
      formItemConfig['label'] = param;
      formItemConfig['valueFiled'] = param;
      formItemConfig['required'] = true;
      formConfig.push(formItemConfig);
    }
  }
  return formConfig;
}

/**
 * 数组去重
 */
function unique(array) {
  var n = [];//临时数组
  for (var i = 0; i < array.length; i++) {
    if (n.indexOf(array[i]) == -1) n.push(array[i]);
  }
  return n;
}
/**
 * 根据数据和模板生成结果
 * @param template 模板
 * @param data 数据
 * @returns {string}
 */
function attachTplToArrayData(template, data) {
  var i = 0,
    len = data.length,
    fragment = '';

  // 遍历数据集合里的每一个项，做相应的替换
  function replace(obj) {
    var t, key, reg;
    for (key in obj) {
      reg = new RegExp('{{' + key + '}}', 'ig');
      t = (t || template).replace(reg, obj[key]);
    }
    return t;
  }

  for (; i < len; i++) {
    fragment += replace(data[i]);
  }
  return fragment;
}

/**
 * 根据数据和模板生成结果
 * @param template 模板
 * @param data 数据
 * @returns {string}
 */
function attachTplToObjData(template, obj) {
  let fragment;

  // 遍历数据集合里的每一个项，做相应的替换
  let key, reg;
  for (key in obj) {
    reg = new RegExp('{{' + key + '}}', 'ig');
    fragment = (fragment || template).replace(reg, obj[key]);
  }
  return fragment;
}

/**获取userType**/
function getCurrentUserType() {
  /* SUPERADMIN: "0",// 超级管理员
   ADMIN: "1",// 管理员
   OWNER: "2",// 租户所有者
   USER:"3" //普通用户*/
  //OWNER: "2"// 普通用户  isTenantOwner 0:普通用户 1：租户所有者
  if (!window._currentUser) return;
  if (window._currentUser.userType != 2) {
    return String(window._currentUser.userType);
  } else {
    if (window._currentUser.isTenantOwner == 0) {
      return window.BFD.ENUM.UserType.USER;
    } else {
      return window.BFD.ENUM.UserType.OWNER;
    }
  }
}

function seeMore(that, text, title, showNum) {
  let seeAll;
  let num = showNum ? showNum - 1 : 1;
  if (text && text.length > 0) {
    return text.map(function (name, index) {
      if (index > num && !seeAll) {//跳不出map循环，先这样干吧 //angle-double-right ellipsis-h
        seeAll = <AuthButton renderType="icon" type="angle-double-right" key={index}
                             onClick={that.seeMoreModal.bind(that,text,title)} title="查看全部"/>;
        // seeAll = <a href="javascript:void(0)" key={index} onClick={that.seeMoreModal.bind(that,text,title)}>查看全部</a>
        return seeAll;
      }
      if (!seeAll) {
        return <span key={index} className="list-function-span">{name}</span>
      }
    });
  }
}

/**获取工作流状态**/
function getWfState(flowState) {
  let stateStr;
  switch (flowState) {
    case "0":
      stateStr = '未上线';
      break;
    case "1":
      stateStr = '已上线';
      break;
    case "2":
      stateStr = '已下线';
      break;
  }
  return stateStr
}

/**
 * 去掉收尾的空格
 * @param str
 * @returns {*}
 */
function trimStr(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}


export default {
  objectToURL,
  removeFormOtherArray,
  isFunction,
  spiltArrayToString,
  hasSameFieldValue,
  upRecord,
  downRecord,
  getAssginValueItem,
  parseURL,
  renderParentTree,
  transferObjectArray,
  getCheckTree,
  getCheckTreeByCode,
  spreadTree,
  getStringArrayByObjectArray,
  fifterArrayByValue,
  dataFormatter,
  getTimers,
  generatorUUID,
  forbidBackSpace,
  generatorFormConfigByStr,
  attachTplToObjData,
  attachTplToArrayData,
  getCurrentUserType,
  getSelectTree,
  seeMore,
  getWfState,
  trimStr
}
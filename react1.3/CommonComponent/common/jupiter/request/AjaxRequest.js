//import message from 'bfd-ui/lib/message'
import Util from '../utils/CommonUtil'
import loading from '../component/loading'
import message from '../component/bdosmessage'


const TIMEOUT = 30 * 1000  //超时时间
const SHOWTIME = 3  // 错误信息显示时长,单位秒
//后端返回码
const CODE = {
  SUCCESS: "000000"
}
jQuery.support.cors = true;
/******************************************************
 * GET 请求 [处理了后端返回码]
 * @param url 接口地址
 * @param successFunc 成功的处理函数
 * @param faultFunc 错误的处理函数
 * @param useLoading 是否使用loading 效果, 默认 true
 *****************************************************/
function request_get(url, successFunc, faultFunc, useLoading = true) {
  fnUseLoading(useLoading)
  return $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    timeout: TIMEOUT,
    success: function (data, textStatus) {
      if (data.code === CODE.SUCCESS && successFunc) {
        successFunc(data, textStatus)
      }
      else {
        serverErrorHandler(data)
        //报错后的回调
        if (faultFunc)   faultFunc(data)
      }
    },
    error: function (requestObj, textStatus, errorThrown) {
      if (faultFunc) {
        faultFunc(requestObj, textStatus, errorThrown);
      } else {
        errorHandle(requestObj, textStatus, errorThrown);
      }
    },
    complete: function () {
      loading.show(false)
    }
  });
}

/******************************************************
 * POST 请求 [处理了后端返回码]
 * @param url 接口地址
 * @param successFunc 成功的处理函数
 * @param faultFunc 错误的处理函数
 * @param useLoading 是否使用loading 效果, 默认 true
 *****************************************************/
function request_post(url, params, successFunc, faultFunc, useLoading = true) {
  fnUseLoading(useLoading)
  return $.ajax({
    type: "POST",
    url: url,
    data: params,
    timeout: TIMEOUT,
    dataType: "json",
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    success: function (data, textStatus) {
      if (data.code === CODE.SUCCESS && successFunc) {
        successFunc(data, textStatus)
      }
      else {
        serverErrorHandler(data)
        //报错后的回调
        if (faultFunc)   faultFunc(data)
      }
    },
    error: function (requestObj, textStatus, errorThrown) {
      if (faultFunc) {
        faultFunc(requestObj, textStatus, errorThrown);
      } else {
        errorHandle(requestObj, textStatus, errorThrown);
      }
    },
    complete: function () {
      loading.show(false)
    }
  });
}

/******************************************************
 * POST 请求 [处理了后端返回码]
 * @param url 接口地址
 * @param successFunc 成功的处理函数
 * @param faultFunc 错误的处理函数
 * @param useLoading 是否使用loading 效果, 默认 true
 *****************************************************/
function request_post_stringData(url, params, successFunc, faultFunc, useLoading = true) {
  fnUseLoading(useLoading)
  return $.ajax({
    type: "POST",
    url: url,
    timeout: TIMEOUT,
    data: {data: JSON.stringify(params)},
    dataType: "json",
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    success: function (data, textStatus) {
      if (data.code === CODE.SUCCESS && successFunc) {
        successFunc(data, textStatus)
      }
      else {
        serverErrorHandler(data)
      }
    },
    error: function (requestObj, textStatus, errorThrown) {
      if (faultFunc) {
        faultFunc(requestObj, textStatus, errorThrown);
      } else {
        errorHandle(requestObj, textStatus, errorThrown);
      }
    },
    complete: function () {
      loading.show(false)
    }
  });
}


/******************************************************
 * 同步 GET 请求 [处理了后端返回码]
 * @param url 接口地址
 * @param successFunc 成功的处理函数
 * @param faultFunc 错误的处理函数
 * @param useLoading 是否使用loading 效果, 默认 false
 *****************************************************/
function request_asyncGet(url, successFunc, faultFunc, useLoading = false) {
  fnUseLoading(useLoading)
  return $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    timeout: TIMEOUT,
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    async: false,
    success: function (data, textStatus) {
      if (data.code === CODE.SUCCESS) {
        successFunc && successFunc(data, textStatus)
      } else {
        serverErrorHandler(data)
      }
    },
    error: function (requestObj, textStatus, errorThrown) {
      if (faultFunc) {
        faultFunc(requestObj, textStatus, errorThrown);
      } else {
        errorHandle(requestObj, textStatus, errorThrown, url);
      }
    },
    complete: function () {
      loading.show(false)
    }
  });
}

/******************************************************
 * 同步 POST 请求 [处理了后端返回码]
 * @param url 接口地址
 * @param successFunc 成功的处理函数
 * @param faultFunc 错误的处理函数
 * @param useLoading 是否使用loading 效果, 默认 false
 *****************************************************/
function request_asyncPost(url, params, successFunc, faultFunc, useLoading = false) {
  fnUseLoading(useLoading)
  return $.ajax({
    type: "POST",
    url: url,
    data: params,
    timeout: TIMEOUT,
    dataType: "json",
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    async: false,
    success: function (data, textStatus) {
      if (data.code === CODE.SUCCESS) {
        successFunc && successFunc(data, textStatus)
      } else {
        serverErrorHandler(data)
      }
    },
    error: function (requestObj, textStatus, errorThrown) {
      if (faultFunc) {
        faultFunc(requestObj, textStatus, errorThrown);
      } else {
        errorHandle(requestObj, textStatus, errorThrown, url);
      }
    },
    complete: function () {
      loading.show(false)
    }
  });
}

/******************************************************
 * GET 请求 [处理了后端返回码]
 * @param url 接口地址
 * @param successFunc 成功的处理函数
 * @param faultFunc 错误的处理函数
 *****************************************************/
function request_get_data(url, successFunc, faultFunc, useLoading = true) {
  fnUseLoading(useLoading)
  return $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    timeout: TIMEOUT,
    success: function (data, textStatus) {
      if (data.code === CODE.SUCCESS) {
        successFunc && successFunc(data.data, textStatus)
      } else {
        serverErrorHandler(data)
      }
    },
    error: function (requestObj, textStatus, errorThrown) {
      if (faultFunc) {
        faultFunc(requestObj, textStatus, errorThrown);
      } else {
        errorHandle(requestObj, textStatus, errorThrown, url);
      }
    },
    complete: function () {
      loading.show(false)
    }
  });
}

/******************************************************
 * POST 请求 [处理了后端返回码]
 * @param url 接口地址
 * @param params 参数对象
 * @param successFunc 成功的处理函数
 * @param faultFunc 错误的处理函数
 *****************************************************/
function request_post_data(url, params, successFunc, faultFunc, useLoading = true, isAsync = true) {
  fnUseLoading(useLoading)
  return $.ajax({
    type: "POST",
    url: url,
    data: params,
    timeout: TIMEOUT,
    dataType: "json",
    contentType: 'application/x-www-form-urlencoded;charset=UTF-8;',
    async: isAsync,
    success: function (data, textStatus) {
      loading.show(false);
      if (data.code === CODE.SUCCESS) {
        successFunc && successFunc(data.data, textStatus)
      } else {
        serverErrorHandler(data)
      }
    },
    error: function (requestObj, textStatus, errorThrown) {
      if (faultFunc) {
        faultFunc(requestObj, textStatus, errorThrown);
      } else {
        errorHandle(requestObj, textStatus, errorThrown, url);
      }
    },
    complete: function () {
      loading.show(false)
    }
  });
}


/*******************************************************
 * 请求错误处理,返回状态码 不等于 200 的错误
 * @param requestObj
 * @param textStatus
 * @param errorThrown
 * @param url
 *******************************************************/
function errorHandle(requestObj, textStatus, errorThrown, url) {
  //正常情况下,返回JSON格式的数据,但如果接口进行302跳转,返回的可能是HTML字符串代码,解析成JSON可能报错
  if (textStatus === "parsererror") {
    message.danger(`服务端接口返回非JSON格式数据!`);
    return;
  }
  switch (requestObj.status) {
    case 0:
      if (textStatus != 'abort') {
        message.danger(`请求数据超过${TIMEOUT / 1000}秒,请求超时!`);
      }
      break;
    case 401:  //未认证
    case "401":
      message.danger(`Token失效,请刷新页面,重新登录!`)
      //message.danger(`Token失效,请重新登录!`, function () {
      //  top.location.href = Util.parseURL(url)['base'];
      //})
      break
    case 404:  //未找到
    case "404":
      message.danger(`未找到接口地址,请检查服务器是否正确部署,或者接口地址是否错误!`)
      break
    case 502:  //服务器错误
    case "502":
      message.danger(`服务端错误,请检查服务端接口是否存在问题!`)
      break
    default :  //其他错误[TODO:慢慢补充]
      message.danger(`${requestObj.statusText}`)
      break
  }
}


/******************************************************
 * Ajax 状态码 200 ,但是服务端返回码不为 000000的错误处理
 * 目前直接弹出错误信息
 * @param data
 *****************************************************/
function serverErrorHandler(data) {
  switch (data.code) {
    case 401:
    case "401":
      //message.danger(`Token失效,请重新登录!`, function () {
      //  top.location.href = data.data;
      //})
      message.danger(`Token失效,请刷新页面,重新登录!`)
      break
    default:
      message.danger(data.msg)
  }
}

/******************************************************
 * 是否使用 loading 效果, 默认为true
 * @param flag
 ******************************************************/
function fnUseLoading(flag) {
  if (flag) {
    loading.show(true)
  }
}


export default {
  ajaxGet: request_get,
  ajaxPost: request_post,
  ajaxPostStrData: request_post_stringData,
  ajaxGetData: request_get_data,
  ajaxPostData: request_post_data,
  ajaxAsyncPost: request_asyncPost,
  ajaxAsyncGet: request_asyncGet,
}

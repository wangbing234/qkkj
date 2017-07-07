/**
 接口说明:
 hdfs/browser  查看列表 path 如 /bd-os/data/jupiter
 hdfs/ checkFileExsit 检测是否存在该文件 参数 path 路径 如/bd-os/data/jupiter   fileName 检测文件 如 test01.txt
 hdfs/mkdirToHdfs 创建文件夹 参数path 路径 newPath 文件夹名称
 hdfs/renameToHdfs 重命名文件  参数path /bd-os/data/jupiter 路径 newPath新文件名称如 test02  oldPath 原文件名称 如 test01
 hdfs/downloadFromHdfs 下载文件 参数path 路径 要下载的文件路径 具体到文件
 hdfs/deleteHdfs 删除文件接口(文件或者文件夹) 参数 path 路径 要删除的文件（或者文件夹）
 hdfs/checkFileDownload  参数 path 如 /bd-os/data/jupiter/test.txt
 */

/****************************************************************
 * 各个接口的地址别名
 ****************************************************************/
let CONFIG = {
  BASE: window.Server.jupiterWeb,  // 本地开发使用全路径
 // BASE: '/',                      // 发布在一起,使用相对目录
  PROJECT: 'configCenterApi/configCenter/',
  TYPE: {
    SAVECONFIG: 'alert/saveAlertConfig',//保存报警配置信息
    GETWARNLIST:'alert/getAlertConfigList',//获取报警列表
    GETCLUSTER:'alert/getClusterList',//查询集群
    GETGROUP:'alert/getGroupList',//查询组
    GETWARNITEM:'alert/getMetricList',//查询监控项
    GETHOST:'alert/getHostsListByParam',
    DELWARNITEM:'alert/deleteAlertConfig',//删除监控项

    GETEMAILGROUP:'alert/getEmailGroup',
    GETMSGGROUP:'alert/getSmsGroup'
  }
};

/****************************************************************
 * 返回完整的接口地址，后期修改 BASE的值
 * eg: 拼接成 http://bdosdev.com/jupiter-web/hdfs/browser.action
 ****************************************************************/
export default (function () {
  let base = CONFIG.BASE;
  let project = CONFIG.PROJECT;
  let url = CONFIG.TYPE;
  for (let key in url) {
    if (url.hasOwnProperty(key)) {
      url[key] = `${base}${project}${url[key]}?_r=${Math.random()}`
    }
  }
  url['BASE'] = base;
  return url
})()
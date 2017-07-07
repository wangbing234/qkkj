/****************************************************************
 * 各个接口的地址别名
 ****************************************************************/
let CONFIG = {
  BASE: window._CONFIG_.BASE,  //部署之后
  TYPE: {
    //===============用户管理 START===================
    getTableUser: '/user/list',                                     //获取用户列表
    addUser: '/user/add',                                           //添加有on过户
    updateUser: '/user/update',                                     //更新用户
    delUser: '/user/delete',                                        //删除用户

    getTableRole: '/role/list',                                     //获取角色列表
    addRole: '/role/add',                                           //添加角色
    updateRole: '/role/update',                                     //更新角色
    delRole: '/role/delete',                                        //删除角色
    authRole: '/auth/list',                                         //授权列表
    grantRole: '/auth/grant',                                       //提交授权
    addUserRole: '/role/addUser',                                   //角色 添加用户
    getAllUser: '/role/getAllUser',                                 //角色 添加用户 左边
    getRoleUser: '/role/getRoleUser',                               //橘色 添加用户 右边

    //===============API管理 START===================
    getAPIInfo: '/api/info/page',                                   //获取mysql,hbase 列表,用type 区分
    addAPIInfo: '/api/info/add',                                    //添加
    updateAPIInfo: '/api/info/update',                              //更新
    delAPIInfo: '/api/info/del',                                    //删除
    viewAPIInfo: '/api/info/view',                                  //回显

    getDbSource: '/api/resourceConfig/list',                        //API管理添加, 数据源下拉框
    getTableSource: '/api/mysqlsource/listTable',                   //API管理添加,表 下拉框
    getColSource: '/api/mysqlsource/listColumn',                    //API管理添加, 列 下拉框
    getHbaseTable: '/manage/hbase/tables/list',                    //获取Hbase表

    revockAPI: '/api/info/revock',                                   //撤销发布
    pubishAPI: '/api/info/pubish',                                   //发布API

    //===============API服务 START===================
    getAPIs: '/api/doc/getapi',                                      //获取API列表
    viewAPI: '/api/doc/view',                                        //获取API详细信息

    //===============统计 START===================
    getAPIStatistics: '/statistics/api/history/list',               //获取API统计
    getAPIDayStatistics: '/statistics/api/day/list',                //获取API总访问量
    getAPIHourStatistics: '/statistics/api/hour/list',              //获取API日访问量

    getUserStatistics: '/statistics/user/history/list',             //获取用户统计
    getUserDayStatistics: '/statistics/user/day/list',              //获取用户总访问量
    getUserHourStatistics: '/statistics/user/hour/list',            //获取用户日访问量

    //===============资源配置  START===================
    getTableResourceConfig: '/api/resourceConfig/page',              //获取资源配置列表
    addOrEditResourceConfig: '/api/resourceConfig/add',              //添加资源配置
    addResourceConfig: '/api/resourceConfig/add',                    //添加资源配置
    updateResourceConfig: '/api/resourceConfig/update',              //编辑资源配置
    delResourceConfig: '/api/resourceConfig/del',                    //删除资源配置
    viewResourceConfig: '/api/resourceConfig/view',                  //根据id 获取数据
    testConn: '/api/resourceConfig/checkconn',                  //测试连接
  }
}

/****************************************************************
 * 返回完整的接口地址，后期修改 BASE的值
 * eg: 拼接成 http://bdosdev.com/jupiter-web/hdfs/browser.action
 ****************************************************************/
export default (function () {
  let url = CONFIG.TYPE
  let BASEURL = CONFIG.BASE  //从全局获取接口基本路径
  for (let key in url) {
    if (url.hasOwnProperty(key)) {
      url[key] = `${BASEURL}${url[key]}`
    }
  }
  return url
})()
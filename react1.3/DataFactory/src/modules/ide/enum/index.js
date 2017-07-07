export  default {
  EVENTNAME: {
    IDE_ADD_LOG: 'IDE_ADD_LOG',  //添加脚本日志 Tab
    IDE_LOG_CLOSE_TAB: 'IDE_LOG_CLOSE_TAB',//关闭日志选项卡
    IDE_LOG_CHANGE_TAB: 'IDE_LOG_CHANGE_TAB', //IDE 选项卡切换, 修改日志面板的数据
    IDE_CLOSEALL_LOG: 'IDE_CLOSEALL_LOG',//关闭所有日志面板
    IDE_GOTO_SCRIPTLIST: 'IDE_GOTO_SCRIPTLIST', //跳转脚本列表页面
    IDE_ADD_EDITOR: 'IDE_ADD_EDITOR', //添加IDE编辑器
    IDE_HIDE_EXPORT: 'IDE_HIDE_EXPORT', //隐藏导出按钮
    IDE_ADD_IDEDROPDOWN: 'IDE_ADD_IDEDROPDOWN', //添加IDE编辑器类型下拉框
    IDE_INSERT_CODE: 'IDE_INSERT_CODE', //给当前的IDE编辑器选项卡插入代码
    IDE_UPDATE_SCRIPTTREE: "IDE_UPDATE_SCRIPTTREE",  //更新脚本树(保存脚本之后, 更新脚本树)
    IDE_UPDATE_SCRIPTLIST: "IDE_UPDATE_SCRIPTLIST",  //更新脚本列表
    IDE_UPDATE_TAB: "IDE_UPDATE_TAB",  //更新脚本的选项卡信息
    IDE_EXPORT: "IDE_EXPORT",//脚本导出
    IDE_IMPORT: "IDE_IMPORT",//脚本导入
    IDE_STOP_RUN: "IDE_STOP_RUN",//是否停止运行,日志面板用,
    IDE_STOP_RUN_INTERFACE: "IDE_STOP_RUN_INTERFACE",//停止获取日志,
    IDE_CREATESCRIPT: "IDE_CREATESCRIPT",  //数据模型派发过来的创建脚本事件,
  },
  PAGE: {
    SCRIPTLIST: 0, //脚本维护页面
    IDE: 1, //IDE页面
  },
  SCRIPTTYPE: {
    SHELL: 1,
    PYTHON: 2,
    HIVE: 3,
    HBASE: 10,
    SPARKSQL: 7,
    CUSTOMMR: 6,
    CUSTOMSPART: 8,
  },
  /**
   * 根据脚本类型 typeCode, 获取相关IDE配置
   * @param typeCode 脚本类型
   */
  getScriptConfig(typeCode){
    let SCRIPTCONFIG = [
      {key: "Shell", typeCode: this.SCRIPTTYPE.SHELL, mode: 'shell', suffix: '.sh'},
      {key: "Python", typeCode: this.SCRIPTTYPE.PYTHON, mode: 'python', suffix: '.py'},
      {key: "Hive", typeCode: this.SCRIPTTYPE.HIVE, mode: 'hive', suffix: '.hql'},
      //{key: "Hbase", typeCode: this.SCRIPTTYPE.HBASE, mode: 'sh', suffix: '.sh'},
      {key: "Spark-SQL", typeCode: this.SCRIPTTYPE.SPARKSQL, mode: 'hive', suffix: '.sql'},
      {key: "MR", typeCode: this.SCRIPTTYPE.CUSTOMMR, mode: '', suffix: ''},
      {key: "Spark", typeCode: this.SCRIPTTYPE.CUSTOMSPART, mode: '', suffix: ''}
    ];
    if (typeCode) {
      for (var i = 0; i < SCRIPTCONFIG.length; i++) {
        var obj = SCRIPTCONFIG[i];
        if (obj.typeCode === typeCode) {
          return obj;
        }
      }
    } else {
      return SCRIPTCONFIG;
    }

  }
}
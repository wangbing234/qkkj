/***************************************************
 * 时间: 16/6/20 14:48
 * 作者: zhongxia
 * 说明: IDE编辑器主容器,包含 工具栏, IDE编辑器, 运行自己
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

import Icon from 'bfd-ui/lib/Icon'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Dropdown, DropdownToggle,DropdownHover, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import message from 'CommonComponent/component/bdosmessage'
import SplitPane from 'CommonComponent/component/splitpane'


import ScriptEditer from './editor/ScriptEditer'
import ResultLog from './log/ResultLog'
import SaveScriptWin from './win/SaveScriptWin'
import ScriptMeun from './win/ScriptMeun'

//权限控制
import AuthButton from 'CommonComponent/component/authbutton'
import FormGenerator from 'CommonComponent/component/formgenerator'
import Util from 'CommonComponent/utils/CommonUtil'

import ENUM from 'IDERoot/enum'
import Model from 'IDERoot/model/ide'

const KEYHELPS = [
  {key: 'ctrl+s', remark: '保存'},
  {key: 'ctrl+c', remark: '复制'},
  {key: 'ctrl+v', remark: '粘贴'},
  {key: 'ctrl+z', remark: '回退'},
  {key: 'ctrl+a', remark: '全选'},
  {key: 'ctrl+f', remark: '查找'},
  {key: 'ctrl+d', remark: '删除当前行'},
  {key: 'shift+alt+↓', remark: '复制当前行'},
]


class ScriptEditerPanel extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      visible: true,
      isEdit: false,
      name: "",
      age: "",
      address: "",
      hasTab: false,   //是否有选项卡,没有的话, 运行按钮不可用
      isRun: false,    //是否正在运行
      hasUndo: false,   //是否可以回退
      hasRedo: false,  //是否可以重做
      isLock: false,   //是否锁定
      canExport: false, //是否支持下载查询的结果
      paramsFormConfig: []   //hive , sparksql 运行动态参数 参数赋值
    };

    this.stopExecute = this.stopExecute.bind(this);
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_STOP_RUN_INTERFACE, this.stopExecute);
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_HIDE_EXPORT, ()=> {
      this.setState({canExport: false})
    });
  }


  componentWillReceiveProps(nextProps) {
    let _editers = this.refs.refScriptEditer;
    let _tabItemConfig = _editers.getCurrentTabConfig();

    if (_tabItemConfig) {
      this.setState({isLock: _tabItemConfig.taskLock, hasTab: true})
    }
  }

  componentWillUnmount() {
    EventEmitter.remove(ENUM.EVENTNAME.IDE_STOP_RUN_INTERFACE);
    EventEmitter.remove(ENUM.EVENTNAME.IDE_HIDE_EXPORT);
  }

  /**
   * 重新渲染编辑器大小
   */
  resizeEditor() {
    if (this.refs.refScriptEditer) {
      let _currentIDEEditor = this.refs.refScriptEditer.getCurrentTab();

      if (_currentIDEEditor) {
        if (_currentIDEEditor.getEditor)   _currentIDEEditor.getEditor().resize(true);
      }
    }
  }

  /**
   * 通过快捷键Ctrl+s 保存脚本
   */
  saveScriptByCustomBindKey() {
    let _editers = this.refs.refScriptEditer;
    let _currentIDEEditor = _editers.getCurrentTab();
    let _tabItemConfig = _editers.getCurrentTabConfig();
    //编辑,则直接保存,不弹出框
    if (_tabItemConfig.code) {
      /* 整理成后端需要的数据 START, 目前和保存*/
      let _command = _currentIDEEditor && _currentIDEEditor.getValue && _currentIDEEditor.getValue(true);
      _tabItemConfig.command = _command;

      let data = {..._tabItemConfig};
      let typeCode = data.typeCode;

      data.name = `${data.name}${data.suffix}`;
      // 自定义mr sparkmr 数据要格式化成JSON字符串
      if (typeCode === ENUM.SCRIPTTYPE.CUSTOMMR || typeCode === ENUM.SCRIPTTYPE.CUSTOMSPART) {
        data.command = JSON.stringify(data.command)
      }
      //shell python 如果是mr 才有队列值
      else if ((typeCode === ENUM.SCRIPTTYPE.PYTHON || typeCode === ENUM.SCRIPTTYPE.SHELL) && !data.mr) {
        data.queue = "";
      }
      else if (typeCode === ENUM.SCRIPTTYPE.SPARKSQL) {
        let _otherParams = data.otherParams;
        if (Array.isArray(_otherParams || [])) {
          _otherParams = data.otherParams.join(',');
        }
        data.command = JSON.stringify({
          executorNum: data.executorNum,
          executorMemory: data.executorMemory,
          executorCores: data.executorCores,
          otherParams: _otherParams,
          sql: data.command
        })
      }
      /* 整理成后端需要的数据 END*/

      //验证是否重名
      Model.saveScript(data, (result)=> {
        //更新左侧脚本树, 更新脚本选项卡信息
        EventEmitter.dispatch(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTTREE, {data: data, code: result.data});
        EventEmitter.dispatch(ENUM.EVENTNAME.IDE_UPDATE_TAB, {data: data, code: result.data})
        message.success("保存脚本成功!");
      })
    }
    //新增的,弹窗保存
    else {
      this.saveScriptTab();
    }
  }

  /**
   * 保存脚本
   */
  saveScriptTab() {
    let _editers = this.refs.refScriptEditer;
    let _tabItemConfig = _editers.getCurrentTabConfig();

    let _currentIDEEditor = _editers.getCurrentTab();

    //如果当前选中的IDE选项卡不为空
    if (_currentIDEEditor) {
      //获取脚本的值, 是MR的话, 是一个MR数据对象, 否则是一个 代码字符串
      let _data = _currentIDEEditor.getValue && _currentIDEEditor.getValue(true);
      if (!_data) {
        message.danger('脚本不能为空,或内容验证不通过!')
        return;
      }
      _tabItemConfig["command"] = _data;
      _tabItemConfig['mr'] = _tabItemConfig.mr || _currentIDEEditor.mr || 0;

      this.setState({scriptData: _tabItemConfig}, ()=> {
        //弹出保存窗口, 会把当前的数据传到保存页面里面去
        this.refs.refSaveScript.open();
        console.log("保存脚本的数据", _tabItemConfig)
      })
    }
  }

  /**
   * 关闭保存脚本弹框
   */
  closeModal() {
    this.refs.refSaveScript.close();
    this.refs.refParams.close();
  }

  /**
   * 开始执行
   * hive 和 sparksql 运行的时候, 需要解析 ${} 类型的参数
   */
  startExecute() {
    let _editers = this.refs.refScriptEditer;
    let _tabItemConfig = _editers.getCurrentTabConfig();
    let _currentIDEEditor = _editers.getCurrentTab();
    let _command = _currentIDEEditor.getValue();    //运行的命令,就是代码

    //支持参数(hive 和 sparkSql 支持 参数, 从IDE里面的脚本内容检验是否有参数)
    let sqlParam = _tabItemConfig.typeCode === ENUM.SCRIPTTYPE.HIVE || _tabItemConfig.typeCode === ENUM.SCRIPTTYPE.SPARKSQL;
    let mrParam = _tabItemConfig.typeCode === ENUM.SCRIPTTYPE.CUSTOMMR || _tabItemConfig.typeCode === ENUM.SCRIPTTYPE.CUSTOMSPART;

    //存在参数,弹出modal框, 给参数赋值
    if (sqlParam || mrParam) {
      let formConfig;
      if (sqlParam) {
        formConfig = Util.generatorFormConfigByStr(_command || "");
      } else {
        let param = "";
        if (_tabItemConfig.typeCode === ENUM.SCRIPTTYPE.CUSTOMMR) {
          param = _command.proParam;
        } else if (_tabItemConfig.typeCode === ENUM.SCRIPTTYPE.CUSTOMSPART) {
          param = _command.proParams;
        }
        formConfig = Util.generatorFormConfigByStr(param || "");
      }
      if (formConfig.length > 0) {
        this.setState({paramsFormConfig: formConfig})
        this.refs.refParams.open();
      } else {
        this.runExecute();
      }
    } else {
      this.runExecute();
    }

  }

  /**
   * 执行 hive 或者 sparkSql 赋值参数
   */
  setRunParams(param) {
    this.runExecute(param);
  }

  /**
   * 开始执行
   * hive 和 sparksql 运行的时候, 需要解析 ${} 类型的参数
   */
  runExecute(param) {
    let _editers = this.refs.refScriptEditer;
    let _tabItemConfig = _editers.getCurrentTabConfig();
    let _currentIDEEditor = _editers.getCurrentTab();
    let _command = _currentIDEEditor.getValue();    //运行的命令,就是代码

    let isMr = 0;
    //编辑
    if (_tabItemConfig.code) {
      isMr = _tabItemConfig.mr;
    }
    //为保存的脚本
    else {
      let flag = _tabItemConfig.typeCode === ENUM.SCRIPTTYPE.CUSTOMMR || _tabItemConfig.typeCode === ENUM.SCRIPTTYPE.CUSTOMSPART;
      isMr = flag ? 1 : 0;
    }


    if (!_command || _command === "") {
      message.danger('执行脚本不能为空!');
      return;
    }

    //是否支持参数(hive 和 sparkSql 支持 参数)
    _tabItemConfig.execName = Util.generatorUUID();

    //重新执行的时候,去掉之前执行结果状态[成功和失败的小图标]
    _tabItemConfig._runSucess = null;

    //CustomMr and SparkMr
    if (_tabItemConfig.typeCode === ENUM.SCRIPTTYPE.CUSTOMMR || _tabItemConfig.typeCode === ENUM.SCRIPTTYPE.CUSTOMSPART) {

      _command = JSON.stringify(_command);
    }

    //SparkSql
    else if (_tabItemConfig.typeCode === ENUM.SCRIPTTYPE.SPARKSQL) {
      _command = {
        executorNum: _tabItemConfig.executorNum || "2",
        executorMemory: _tabItemConfig.executorMemory || "1",
        executorCores: _tabItemConfig.executorCores || "1",
        otherParams: _tabItemConfig.otherParams || "",
        sql: _command
      }
      _command = JSON.stringify(_command)
    }

    let modelParam = {
      projectCode: projectCode,
      execType: 'ide',
      params: JSON.stringify(param),
      execName: _tabItemConfig.execName,
      taskCode: '',
      command: _command,
      typeCode: _tabItemConfig.typeCode,
      isMr: isMr,
      queue: _tabItemConfig.queue,
      queuePriority: _tabItemConfig.priority
    }

    console.info("运行脚本的参数:", modelParam)

    //脚本开始运行之后,轮询调用过程日志
    Model.taskExecute(modelParam, (result=> {
      //101 继续执行   非101 报错
      if (result.data === 101) {
        _tabItemConfig.isRun = true;
        this.setState({isRun: true, canExport: false})
        EventEmitter.dispatch(ENUM.EVENTNAME.IDE_ADD_LOG, {code: _command, config: _tabItemConfig});
      } else {
        message.danger(`执行失败! ErrorCode:${result.data}`)
      }
    }))
  }

  /**
   * 日志运行结束的回调
   * @param status
   */
  handleRunEnd(tabConfig, canExport) {
    if (tabConfig)  tabConfig.isRun = false;
    this.setState({isRun: false, canExport: canExport})
  }

  /**
   * Log面板,切换选项卡回调,是否显示导出按钮
   */
  handleCanExport(config) {
    config = config || {};
    let canExport = config.typeCode === ENUM.SCRIPTTYPE.HIVE || config.typeCode === ENUM.SCRIPTTYPE.SPARKSQL;
    this.setState({canExport: canExport})
  }

  /**
   * 停止运行
   */
  stopExecute() {
    let tabConfig;
    let isCloseTabFlag = false;
    //点击暂停按钮触发的事件
    if (arguments.length > 1) {
      //获取当前选中选项卡的运行标识
      tabConfig = this.refs.refScriptEditer.getCurrentTabConfig();
    }
    //关闭选项卡触发的事件
    else {
      isCloseTabFlag = true;
      tabConfig = arguments[0];
    }

    //如果正在运行, 则停止运行
    if (tabConfig.isRun) {
      Model.stopExecute(tabConfig.uuid, ()=> {
        //派发出停止运行, 让获取日志面板停止定时请求数据
        EventEmitter.dispatch(ENUM.EVENTNAME.IDE_STOP_RUN, {flag: isCloseTabFlag, config: tabConfig});
        tabConfig.isRun = false;
        this.setState({isRun: false})
      })
    }
  }


  /**
   * 锁定
   */
  lock() {
    let tabConfig = this.refs.refScriptEditer.getCurrentTabConfig();
    tabConfig.code && Model.lockScript(tabConfig.code, (result)=> {
      message.success('锁定成功!')
      this.setState({isLock: true, isUnLock: false})
      tabConfig.taskLock = 1;
    })
  }

  /**
   * 解锁
   */
  unlock() {
    let tabConfig = this.refs.refScriptEditer.getCurrentTabConfig();
    tabConfig.code && Model.unlockScript(tabConfig.code, (result)=> {
      message.success('解锁成功!')
      this.setState({isLock: false, isUnLock: true})
      tabConfig.taskLock = 0;
    })
  }


  /**
   * 发布
   */
  publish() {
    let that = this;
    let tabConfig = that.refs.refScriptEditer.getCurrentTabConfig();
    tabConfig.code && Model.publishScript([tabConfig.code], (result)=> {
      tabConfig.taskLock = 0;
      that.setState({
        isLock: false,
        isUnLock: true
      })
      message.success('发布脚本成功!')
    })
  }

  /**
   * 后退
   */
  undo() {
    let _currentIDEEditor = this.refs.refScriptEditer.getCurrentTab();
    _currentIDEEditor.undo();
  }

  /**
   * 前进
   */
  redo() {
    let _currentIDEEditor = this.refs.refScriptEditer.getCurrentTab();
    _currentIDEEditor.redo();
  }

  /**
   * IDE选项卡切换,设置按钮是否可用
   * @param config 获取当前选项卡的配置
   * @param flag 是否需要把焦点定位在当前编辑器, true: 不需要  false:需要
   * */
  handleIDETabChange(config, flag) {
    this.resizeEditor();

    //hasTab 控制IDE顶部的按钮是否可用,如果没有Tab,全部置灰
    let newState = {hasTab: true};
    if (config) {
      newState.isLock = config.taskLock === 0 ? false : true;

      newState.isRun = config.isRun;

      //锁定的脚本, 没有权限不可以发布
      if (config.editable) {
        newState.publishDisabled = config.code ? false : true;
        newState.isUnLock = config.taskLock === 0 ? true : false;
      } else {
        newState.publishDisabled = true;
        newState.isUnLock = true;
      }

      newState.hasUndo = config.mr ? false : config.hasUndo;
      newState.hasRedo = config.mr ? false : config.hasRedo;

      if (!config.code) {
        newState.isLock = true;
        newState.isUnLock = true;
      }
    }
    this.setState({...newState}, ()=> {
      if (!flag) {
        let _currentIDEEditor = this.refs.refScriptEditer.getCurrentTab();
        if (_currentIDEEditor && _currentIDEEditor.setFocus) _currentIDEEditor.setFocus();
      }
    })
  }


  /**
   * 导出hive,SparkSql 的执行结果
   * */
  handleExportData() {
    let tabConfig = this.refs.refResultLog.getCurrentTabConfig();
    if (tabConfig.execName) {
      Model.exportTableData(tabConfig.execName);
    }
  }

  /**
   * 日志面板和编辑器面板大小修改
   * @param newSize
   */
  splitChange(newSize) {
    //$('.ace_editor').height(newSiz50- 45);
    this.resizeEditor();
  }

  /**
   * 返回脚本列表
   */
  go2List() {
    EventEmitter.dispatch(ENUM.EVENTNAME.IDE_GOTO_SCRIPTLIST)
  }

  /**
   * 渲染导出按钮
   * */
  renderExportBtn() {
    if (this.state.canExport) {
      return (
        <Icon type="download"
              style={{position:'absolute',right:'10px',top:'5px',cursor:'pointer'}}
              disabled={!this.state.canExport}
              onClick={this.handleExportData.bind(this)}/>
      )
    }
  }

  render() {

    let runDisable = this.state.hasTab ? (this.state.isRun ? true : false) : true;
    let lockDisable = this.state.hasTab ? (this.state.isLock ? true : false) : true;
    let unLockDisable = this.state.hasTab ? (this.state.isUnLock ? true : false) : true;
    let stopRunDisable = this.state.hasTab ? (this.state.isRun ? false : true) : true;

    return (
      <div className="ide-editor-right-container" {...this.props}>
        {/*工具栏 START*/}
        <div className="ide-editor-menu">
          <ScriptMeun parent={this}/>
          <AuthButton data-code="1021010" renderType="icon" title="保存" type="save"
                      className="ide-fontIcon"
                      onClick={this.saveScriptTab.bind(this)}/>

          <AuthButton data-code="1021009" renderType="icon" title="执行" type="play"
                      className="ide-fontIcon"
                      disabled={runDisable}
                      onClick={this.startExecute.bind(this)}/>

          <AuthButton data-code="1021011" renderType="icon" title="暂停" type="pause"
                      className="ide-fontIcon"
                      disabled={stopRunDisable}
                      onClick={this.stopExecute.bind(this)}/>

          <AuthButton data-code="1021012" renderType="icon" title="锁定" type="lock"
                      className="ide-fontIcon"
                      disabled={lockDisable}
                      onClick={this.lock.bind(this)}/>

          <AuthButton data-code="1021013" renderType="icon" title="解锁" type="unlock"
                      className="ide-fontIcon"
                      disabled={unLockDisable}
                      onClick={this.unlock.bind(this)}/>

          <AuthButton renderType="icon" title="后退" type="undo"
                      className="ide-fontIcon"
                      disabled={this.state.hasUndo?false:true}
                      onClick={this.undo.bind(this)}/>

          <AuthButton renderType="icon" title="前进" type="repeat"
                      className="ide-fontIcon"
                      disabled={this.state.hasRedo?false:true}
                      onClick={this.redo.bind(this)}/>

          <AuthButton data-code="1021005" renderType="icon" title="发布" type="cloud-upload"
                      className="ide-fontIcon"
                      disabled={this.state.publishDisabled}
                      onClick={this.publish.bind(this)}/>


          <AuthButton renderType="icon" title="返回列表" type="sign-out"
                      className="ide-fontIcon ide-icon-help"
                      style={{float:'right',marginRight:'5px'}}
                      onClick={this.go2List.bind(this)}/>

          <Dropdown style={{float:'right'}} className="bfd-dropdown__right">
            <DropdownHover>
              <AuthButton renderType="icon" type="question-circle"
                          className="ide-fontIcon ide-icon-help"
                          style={{float:'right'}}/>
            </DropdownHover>
            <DropdownMenu right>
              <strong style={{marginLeft:25}}>快捷键功能支持</strong>
              <ul className="ide-question-help">
                {KEYHELPS.map((item, index)=> {
                  return (
                    <li key={index}>
                      <div className="ide-question-help-key">{item.key}</div>
                      {" :"}
                      <div className="ide-question-help-remark">{item.remark}</div>
                    </li>
                  )
                })}
              </ul>
            </DropdownMenu>
          </Dropdown>

        </div>
        {/*工具栏 END*/}

        <SplitPane className="ide-editor-split-pane" minSize={0} split="horizontal" defaultSize={340}
                   onChange={this.splitChange.bind(this)}>
          {/*IDE 与 运行日志 START*/}
          <div className="ide-editor-editor">
            <ScriptEditer ref="refScriptEditer"
                          cbSaveScript={this.saveScriptByCustomBindKey.bind(this)}
                          cbTabChange={this.handleIDETabChange.bind(this)}/>
          </div>
          <div className="ide-editor-resultlog">
            {this.renderExportBtn()}
            <ResultLog ref="refResultLog"
                       cbTabChange={this.handleCanExport.bind(this)}
                       cbRunEnd={this.handleRunEnd.bind(this)}/>
          </div>
          {/*IDE 与 运行日志 END*/}
        </SplitPane>


        {/*保存脚本 START*/}
        <Modal ref="refSaveScript" lock={true}>
          <ModalHeader>
            <h4 className="modal-title">脚本保存</h4>
          </ModalHeader>
          <ModalBody>
            <SaveScriptWin data={this.state.scriptData} close={this.closeModal.bind(this)}/>
          </ModalBody>
        </Modal>
        {/*保存脚本 END*/}


        {/*脚本运行参数 START*/}
        <Modal ref="refParams" lock={true}>
          <ModalHeader>
            <h4 className="modal-title">变量赋值</h4>
          </ModalHeader>
          <ModalBody>
            <FormGenerator config={this.state.paramsFormConfig}
                           submit={this.setRunParams.bind(this)}
                           close={this.closeModal.bind(this)}/>
          </ModalBody>
        </Modal>
        {/*脚本运行参数 END*/}

      </div>
    );
  }
}

export default ScriptEditerPanel


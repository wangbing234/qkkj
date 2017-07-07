/***************************************************
 * 时间: 16/6/20 10:52
 * 作者: zhongxia
 * 说明: 脚本编辑器
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

//bfd-ui
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import Icon from 'bfd-ui/lib/Icon'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

//components
import { Tabs, TabList, Tab, TabPanel } from 'CommonComponent/component/bdostabs'
import message from 'CommonComponent/component/bdosmessage'
import List from 'CommonComponent/component/list'
import CustomMr from './CustomMr'
import SparkMr from './SparkMr'
import ACEEditor from './ACEEditor'

//other
import ENUM from 'IDERoot/enum'
import Util from 'CommonComponent/utils/CommonUtil'
import Model from 'IDERoot/model/ide'


class ScriptEditer extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      tabs: [],
      activeKey: '0'
    };

    this.handleAddEditorTab = this.handleAddEditorTab.bind(this)
    this.handleInsertCode = this.handleInsertCode.bind(this)
    this.handleUpdateTabInfo = this.handleUpdateTabInfo.bind(this)

    //在Scriptmenu.jsx, scriptList.jsx 里面触发
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_ADD_EDITOR, this.handleAddEditorTab);
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_INSERT_CODE, this.handleInsertCode);
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_UPDATE_TAB, this.handleUpdateTabInfo);
  }

  componentWillUnmount() {
    EventEmitter.remove(ENUM.EVENTNAME.IDE_ADD_EDITOR, this.handleAddEditorTab);
    EventEmitter.remove(ENUM.EVENTNAME.IDE_INSERT_CODE, this.handleInsertCode);
    EventEmitter.remove(ENUM.EVENTNAME.IDE_UPDATE_TAB, this.handleUpdateTabInfo);
  }


  /**
   * 新建脚本,获取脚本下标(eg:新建脚本0,新建脚本1...)
   * @param mode
   * @returns {*}
   */
  getScriptIndex(mode) {
    this.scriptCounts = this.scriptCounts || {};
    if (this.scriptCounts[mode] === undefined) {
      this.scriptCounts[mode] = 0;
    }
    return this.scriptCounts[mode]++;
  }

  /**
   * 更新脚本选项卡信息
   * @param param
   */
  handleUpdateTabInfo(param) {
    let panels = this.state.tabs;
    let data = param.data;
    let code = param.code;

    panels = panels.map(function (item, index) {
      if (item.uuid === data.uuid) {

        /**
         * 使用该方法合并对象, 会生成一个新的对象,
         * 则在日志面板中保存的执行成功状态,就和该对象不是同一个堆地址
         */
        //item = {...item, ...data};

        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            item[key] = data[key]
          }
        }
        item.name = data.name.split('.')[0]
        item.code = code;
        item.taskLock = 0;
        item.editable = item.editable || true;
        item._isChange = false;  //清除修改的标记
        //item._runSucess = null;  //清除执行成功的标记

        if (Array.isArray(item.otherParams)) {
          item.otherParams = item.otherParams.join(',');
        }
      }
      return item;
    })
    this.setState({tabs: panels})
    this.props.cbTabChange && this.props.cbTabChange(this.getCurrentTabConfig());
  }

  /**
   * 添加 IDE 编辑器选项卡
   * @param item
   */
  handleAddEditorTab(item) {
    let allPanel = this.state.tabs;

    //编辑
    let ideConfig = ENUM.getScriptConfig(item.typeCode);
    item = {...ideConfig, ...item}

    //Spark SQL 的数据特殊处理. sql 和 保存时的内存大小,内核参数 都放在 data.command 字段里面
    if (item.typeCode === ENUM.SCRIPTTYPE.SPARKSQL) {
      let sparkSqlData = JSON.parse(item.command || "{}");
      item = {...item, ...sparkSqlData};
      item.command = sparkSqlData.sql;
    }

    //新建
    if (!item.code) {
      if (item.typeCode === ENUM.SCRIPTTYPE.SHELL || item.typeCode === ENUM.SCRIPTTYPE.PYTHON || item.typeCode === ENUM.SCRIPTTYPE.HIVE) {
        let tplData = Model.getTaskTemplateInfo(item.typeCode);

        //生成模板
        let commandTpl = tplData.template;
        if (commandTpl.length > 0) {
          let tpl = Util.attachTplToObjData(commandTpl, {
            author: window._currentUser && window._currentUser.userName,
            time: new Date().format('yyyy-MM-dd hh:mm:ss')
          })
          item.command = tpl;
        }
      }
      let count = this.getScriptIndex(item.mode)
      item.name = `新建${item.key}${count}`; //脚本名
    }
    //编辑
    else {
      item.name = item.name.split('.')[0];
    }

    //编辑脚本,判断是否打开,如果是新增,则直接新增脚本
    let isExistTab = false;
    if (item.code) {
      let tabConfig = this.getTabByKeyAndValue(allPanel, 'code', item.code);

      //tab中已经存在该脚本
      if (tabConfig) {
        isExistTab = true;
        item = tabConfig;
      }
    }

    //IDE中未打开该脚本,新增
    if (!isExistTab) {
      //设置ref,让菜单能够获取到IDE的对象
      let _ref = `refEditor${allPanel.length}`;
      let cPanel = (
        <ACEEditor readOnly={item.editable===false}
                   mode={item.mode}
                   onSave={this.handleSaveScript.bind(this)}
                   onChange={this.handleIDEChange.bind(this)}>
          {item.command || ''}
        </ACEEditor>
      );

      //MR类型
      switch (item.typeCode) {
        case ENUM.SCRIPTTYPE.CUSTOMMR:
          cPanel = (<CustomMr data={item}/>);
          break;
        case ENUM.SCRIPTTYPE.CUSTOMSPART:
          cPanel = (<SparkMr data={item}/>);
          break;
      }

      //选项卡的配置
      item = {
        ...item,
        panel: cPanel,
        ref: _ref,
        uuid: Util.generatorUUID()
      };

      //新增一个选项卡
      allPanel.push(item);
      this.setState({tabs: allPanel, activeKey: item.uuid});
    }
    //IDE中存在该脚本,选中
    else {
      this.setState({activeKey: item.uuid});
    }

    //切换结果日志到执行日志Tab
    EventEmitter.dispatch(ENUM.EVENTNAME.IDE_LOG_CHANGE_TAB, {config: item})

    console.info('新增/编辑 IDE 选项卡:', item)

    //回调,通知主容器编辑器里面已经拥至少一个选项卡
    this.props.cbTabChange && this.props.cbTabChange(item);
  }

  /**
   * IDE 内容change
   */
  handleIDEChange() {
    let config = this.getCurrentTabConfig();
    config._isChange = true; //编辑修改过了

    //第二个参数:true:表示IDE编辑器不需要获取焦点
    this.props.cbTabChange && this.props.cbTabChange(config, true);
  }

  /**
   * 自定义保存事件[针对IDE脚本]
   */
  handleSaveScript() {
    this.props.cbSaveScript && this.props.cbSaveScript();
  }

  /**
   * 根据Key和value,获取对象数组中的 对象
   * @param allPanel
   * @param key
   * @param value
   */
  getTabByKeyAndValue(allPanel, key, value) {
    for (var i = 0; i < allPanel.length; i++) {
      var obj = allPanel[i];
      if (obj[key] && obj[key] === value) {
        return obj;
      }
    }
    return null;
  }


  /**
   * Tab选项卡切换事件
   * @param activeIndex
   */
  handleChange(activeIndex, activeKey) {
    this.setState({activeKey}, ()=> {
      //选项卡切换, 让顶部工具栏菜单是否置灰做设置.
      let config = this.getCurrentTabConfig(activeKey);
      this.props.cbTabChange && this.props.cbTabChange(this.getCurrentTabConfig(activeKey));
      //日志面板切换选项卡
      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_LOG_CHANGE_TAB, {config: config, activeKey: activeKey})
    })
  }

  /**
   * 关闭选项卡
   * @param index
   */
  closeTabHandler(activeIndex, activeKey, evt) {

    evt && evt.stopPropagation();

    let newState = {};
    let tabs = this.state.tabs;
    let closeTab;

    newState.tabs = tabs.filter((tab)=> {
      if (tab.uuid === activeKey)  closeTab = tab;
      return tab.uuid !== activeKey;
    })


    let currentTab = newState.tabs.length > 0 && newState.tabs[newState.tabs.length - 1];
    if (currentTab) {
      (newState.activeKey = currentTab.uuid);
      this.toTabHandle(currentTab);
    }
    this.setState(newState, ()=> {
      //关闭日志面板的选项卡
      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_LOG_CLOSE_TAB, {currentTab: currentTab, activeKey: activeKey})
      //停止运行
      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_STOP_RUN_INTERFACE, closeTab)
    })
  }

  /**
   * 获取当前选项卡  [在 editer/ScriptEditerPanel.jsx里面调用]
   * @returns {XML}
   */
  getCurrentTab() {
    let config = this.getTabByKeyAndValue(this.state.tabs, 'uuid', this.state.activeKey);
    if (!config) return null;
    let _ref = config.ref;
    return this.refs[_ref];
  }

  /**
   * 获取当前选项卡的一些信息 [ScriptEditorPanel.jsx 里面也有使用该方法]
   */
  getCurrentTabConfig(activeKey) {
    activeKey = activeKey || this.state.activeKey;
    let config = this.getTabByKeyAndValue(this.state.tabs, 'uuid', activeKey);
    let currentTab = this.getCurrentTab();

    if (currentTab) {
      config.hasUndo = currentTab.hasUndo && currentTab.hasUndo();
      config.hasRedo = currentTab.hasUndo && currentTab.hasRedo();
    }

    return config;
  }

  /**
   * 给当前的IDE编辑器里面 插入代码
   */
  handleInsertCode(param) {
    this.getCurrentTab() && this.getCurrentTab().insertValue(param.code)
  }


  /**
   * 跳转到指定选项卡
   */
  toTabHandle(item) {
    this.refs.refTool && this.refs.refTool.close();
    this.setState({activeKey: item.uuid}, ()=> {
      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_LOG_CHANGE_TAB, {config: item, activeKey: item.uuid})
    })
  }

  /**
   * 关闭全部
   */
  closeAll() {
    this.refs.refTool.close();
    this.setState({tabs: []});
    //关闭所有日志面板
    EventEmitter.dispatch(ENUM.EVENTNAME.IDE_CLOSEALL_LOG, {})
  }

  /**
   * 渲染选项卡的tool工具栏
   */
  renderTabClose(item, index) {
    return (
      <div style={{height:'100%',lineHeight:'25px'}}>
        <TextOverflow>
          <div style={{width:75,float:'left'}}>{item.name}</div>
        </TextOverflow>
        <Icon type="times"
              style={{float:'right',cursor:'pointer',lineHeight:'25px',marginRight:5}}
              onClick={this.closeTabHandler.bind(this,index,item.uuid)}></Icon>
      </div>
    )
  }

  /**
   * 渲染选项卡关闭某一项,或者全部关闭的工具菜单
   * @returns {XML}
   */
  renderTool() {
    if (this.state.tabs.length > 0) {
      return (
        <div className="bdos-tool">
          <Dropdown ref="refTool">
            <DropdownToggle>
              <Icon style={{width:'100%',height:'100%',cursor:'pointer'}} type="caret-down"/>
            </DropdownToggle>
            <DropdownMenu>
              <List data={this.state.tabs}
                    onClick={this.toTabHandle.bind(this)}
                    render={this.renderTabClose.bind(this)}/>
              <div className="bdos-close-all" onClick={this.closeAll.bind(this)}>关闭全部</div>
            </DropdownMenu>
          </Dropdown>
        </div>
      )
    }
  }

  /**
   * 渲染选项卡图标,是否保存,是否运行成功
   * @param tabConfig
   * @returns {XML}
   */
  renderTabTitle(tabConfig) {
    let isChangeIcon = "";
    let isRunStateIcon = "";
    let isRuningIcon = "";
    if (tabConfig._isChange) {
      isChangeIcon = <Icon className="ide-editor-title-icon" style={{color:'#3A93F2',marginRight:3}} type="edit"/>;
    }
    if (tabConfig._runSucess !== undefined && tabConfig._runSucess !== null) {
      if (tabConfig._runSucess) {
        isRunStateIcon =
          <Icon className="ide-editor-title-icon" style={{color:'#65B566'}} type="check-circle"/>;
      } else {
        isRunStateIcon =
          <Icon className="ide-editor-title-icon" style={{color:'#F92C37'}} type="times-circle"/>;
      }
    }
    if (tabConfig.isRun) {
      isRuningIcon =
        <Icon className="ide-editor-title-icon fa-spin" style={{color:'#3A93F2'}} type="spinner"/>;
    }

    return (
      <div style={{display:'flex'}}>
        {isChangeIcon}
        {isRunStateIcon}
        {isRuningIcon}
        <TextOverflow>
          <div className="ide-editor-title">
            {`${tabConfig.name}${tabConfig.suffix}`}
          </div>
        </TextOverflow>
      </div>
    )
  }

  render() {
    return (
      <Tabs dynamic autoWidth
            activeKey={this.state.activeKey}
            style={{pading:'0px'}}
            onChange={this.handleChange.bind(this)}
            handleClose={this.closeTabHandler.bind(this)}>
        <TabList>
          {this.renderTool()}
          {this.state.tabs.map((tab) => {
            return (
              <Tab key={tab.uuid} activeKey={tab.uuid}>
                {this.renderTabTitle(tab)}
              </Tab>)
          })}
        </TabList>
        {
          this.state.tabs.map((tab)=> {
            return (
              <TabPanel key={tab.uuid} activeKey={tab.uuid}>
                {React.cloneElement(tab.panel, {ref: tab.ref})}
              </TabPanel>
            )
          })
        }
      </Tabs>
    );
  }
}

export default ScriptEditer

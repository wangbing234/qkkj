/***************************************************
 * 时间: 16/6/16 10:19
 * 作者: zhongxia
 * 说明: IDE主页面, 左侧 脚本树, 右侧 脚本列表 和 IDE编辑器
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

import HSplitPane from 'CommonComponent/component/hsplitpane'

import LeftTree from './list/LeftTree'
import ScriptList from './list/ScriptList'
import ScriptEditerPanel from './editer/ScriptEditerPanel'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import Import from './modal/Import'
import Export from './modal/Export'

//枚举
import ENUM from '../enum'

//导入IDE单独的样式
import '../css/ide.less'

class MainPage extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      page: ENUM.PAGE.SCRIPTLIST
    }

    this.createScript = this.createScript.bind(this);
    this.handleExportScript = this.handleExportScript.bind(this);
    this.goToListPage = this.goToListPage.bind(this);

    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_GOTO_SCRIPTLIST, this.goToListPage);   //跳转到脚本列表
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_CREATESCRIPT, this.createScript);   //创建脚本
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_EXPORT, this.handleExportScript);   //导出脚本
  }

  componentDidMount() {
    const query = this.props.location.query || {};
    //如果是从表管理跳转过来的页面,则新建hive脚呢
    if (query.tableName) {
      this.createScript(query.dbName, query.tableName, query.type);
    }
  }

  componentWillReceiveProps(nextProps) {
    const query = nextProps.location.query || {};
    //如果是从表管理跳转过来的页面,则新建hive脚呢
    if (query.tableName) {
      this.createScript(query.dbName, query.tableName, query.type);
    }
  }

  /**
   * 组件卸载,清除事件监听
   */
  componentWillUnmount() {
    EventEmitter.remove(ENUM.EVENTNAME.IDE_GOTO_SCRIPTLIST, this.goToListPage)
    //EventEmitter.remove(ENUM.EVENTNAME.IDE_CREATESCRIPT, this.createScript)
    EventEmitter.remove(ENUM.EVENTNAME.IDE_EXPORT, this.handleExportScript)
  }

  /**
   * 跳转到脚本列表页面
   */
  goToListPage() {
    this.setState({page: ENUM.PAGE.SCRIPTLIST})
  }

  /**
   * 派发事件创建脚本
   * @param dbName 库名
   * @param tableName 表名
   * @param type 库类型
   */
  createScript(dbName, tableName, type) {
    type = type && type.toLowerCase();
    this.setState({page: ENUM.PAGE.IDE})
    let sql = "";
    //hive库
    if (type === "hive") {
      sql = `select * from ${dbName}.${tableName} limit 100;`;
      //派发事件创建脚本
      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_ADD_EDITOR, {
        typeCode: ENUM.SCRIPTTYPE.HIVE,
        command: sql
      });
    }
    //hbase库
    else if (type === "hbase") {
      sql = `hbase shell << EOF
  scan '${dbName}:${tableName}',{LIMIT=>10}
EOF`;
      //派发事件创建脚本
      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_ADD_EDITOR, {
        typeCode: ENUM.SCRIPTTYPE.SHELL,
        command: sql
      });
    }
  }

  /**
   * [给LeftTree.jsx ,ScriptList.jsx使用]
   * 打开导入弹框
   * @param treeCode 文件夹Code
   * @param treeName 文件夹名称
   */
  openImportModal(treeCode, treeName, isRightMenu) {
    this.setState({treeCode: treeCode, treeName: treeName, isRightMenu: isRightMenu})
    this.refs.mImport && this.refs.mImport.open()
  }

  /**
   * [给LeftTree.jsx ,ScriptList.jsx使用]
   * 打开导出弹框
   * @param treeCode 文件夹Code
   * @param treeName 文件夹名称
   */
  openExportModal(treeCode, treeName, isRightMenu, codes) {
    this.setState({treeCode: treeCode, treeName: treeName, isRightMenu: isRightMenu, codes: codes})
    this.refs.mExport && this.refs.mExport.open()
  }

  /**
   * 单个脚本导出
   */
  handleExportScript(param) {
    this.setState({treeCode: param.id, treeName: param.name, isRightMenu: param.isRightMenu})
    this.refs.mExport && this.refs.mExport.open()
  }

  /**
   * 关闭导入导出框
   */
  closeModal() {
    this.refs.mImport && this.refs.mImport.close()
    this.refs.mImport && this.refs.mExport.close()
  }

  /**
   * 渲染脚本列表
   * @returns {XML}
   */
  renderScriptList() {
    if (this.state.page !== ENUM.PAGE.IDE) {
      return (
        <ScriptList {...this.props}
          parent={this}
          treeCode={this.state.treeCode}
          treeName={this.state.treeName}
          isRightMenu={this.state.isRightMenu}/>);
    }
  }

  render() {
    let showIDE = (this.state.page === ENUM.PAGE.IDE);
    return (
      <div id="ide-list-container" className="ide-list-container">
        <HSplitPane allowResize={true} size={200} minSize={200} maxSize={600}>
          <div className="ide-list-left">
            <LeftTree parent={this}/>
          </div>

          <div className="ide-list-right">
            {/*这里编辑器页面使用 display:none 来隐藏, 主要是因为需要保存之前的操作, 不卸载组件*/}
            <ScriptEditerPanel {...this.props}
              style={{display:showIDE? '' : 'none'}}
              parent={this}/>

            {this.renderScriptList()}
          </div>
        </HSplitPane>
        <Modal ref="mImport" lock={true}>
          <ModalBody>
            <Import treeCode={this.state.treeCode}
                    treeName={this.state.treeName}
                    close={this.closeModal.bind(this)}/>
          </ModalBody>
        </Modal>

        <Modal ref="mExport" lock={true}>
          <ModalBody>
            <Export treeCode={this.state.treeCode}
                    treeName={this.state.treeName}
                    codes={this.state.codes}
                    close={this.closeModal.bind(this)}/>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MainPage
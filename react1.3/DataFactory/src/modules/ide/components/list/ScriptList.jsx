import React from 'react'
import ReactDOM from 'react-dom'

//BFD-UI组件库
import DataTable from 'bfd-ui/lib/DataTable'
import { Select, Option } from 'bfd-ui/lib/Select'
import confirm from 'bfd-ui/lib/confirm'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

import message from 'CommonComponent/component/bdosmessage'
//权限控制
import AuthButton from 'CommonComponent/component/authbutton'

//Ajax相关操作
import Model from 'IDERoot/model/ide'

import ENUM from 'IDERoot/enum'
import VersionScript from '../versionHistory'

import EventName from '../../../../containers/EventName'


class ScriptList extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      showScriptList: true,
      treeCode: prop.treeCode,  //目录id
      selectCodes: [], //选中的脚本
      scriptType: '',  //脚本类型
      scriptTypeData: [],  //脚本列表数据
      pageSize: 10,  //每页条数默认 10条
      scriptList: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      }
    };

    //更新脚本列表
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTLIST, this.getScriptListData.bind(this, this.state.scriptType, this.state.treeCode));
  }

  /**
   * 页面渲染到DOM节点后, 获取表格数据
   */
  componentDidMount() {
    this.getScriptListData()
    this.ajaxGetScriptTypes = Model.getScriptTypes((result)=> {
      this.setState({scriptTypeData: result.data})
    })
  }

  /**
   * 组件更新之后,的回调函数
   * 把下一个 属性  设置到状态里面
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    //是否为右键菜单导入,导出.  是则不更新TreeCode 和 TreeName
    if (!nextProps.isRightMenu && this.state.treeCode !== nextProps.treeCode) {
      this.setState({treeCode: nextProps.treeCode, treeName: nextProps.treeName})
      this.getScriptListData(this.state.scriptType, nextProps.treeCode)
    }
  }

  /**
   * 组件卸载前的操作
   */
  componentWillUnmount() {
    this.ajaxGetScriptTypes.abort();
    this.ajaxGetScriptlist.abort();
    EventEmitter.remove(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTLIST);
  }

  /**
   * 把值保存到状态
   * @param name
   * @param event
   */
  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /**
   *  脚本类型下拉刷新数据
   * @param value
   */
  handleScriptTypeChange(name, value) {
    let newState = {}
    newState[name] = value;
    this.setState(newState);
    //this.getScriptListData(value)
  }


  /**
   * 获取表格字段
   * @returns {*}
   */
  getColumns() {
    let that = this;
    return [
      {
        title: '脚本名称',
        key: 'name',
        width: '200px',
        render(text, record) {
          return (
            <TextOverflow>
              <a data-key={text}
                 style={{display:'block',width:200}}
                 href="javascript:void(0);"
                 onClick={that.editScript.bind(that,record)}>{text}</a>
            </TextOverflow>
          )
        }
      }, {
        title: '类别',
        key: 'typeName',
      }, {
        title: '所属目录',
        key: 'pname',
      }, {
        title: '当前锁定者',
        key: 'lockUser',
      }, {
        title: '创建人',
        key: 'createUser',
      },
      {
        title: '更新时间',
        key: 'updateTimeDis',
      }, {
        title: '操作',
        key: 'operation',
        width: '90px',
        render(record) {
          let lockJsx = (
            <AuthButton renderType="a" type="lock"
                        title="锁定"
                        style={{width:15}}
                        href="javascript:void(0);"
                        onClick={that.lock.bind(that,record)}>
              锁定
            </AuthButton>
          )

          if (record.taskLock === 1) {
            //已经锁定的脚本,只有返回有编辑权限的才可以解锁[创建脚本的人, 租户所有者, 超级管理员]
            let disabled = !record.editable;

            lockJsx = (
              <AuthButton renderType="a" type="unlock"
                          data-code="1021007"
                          title="解锁"
                          style={{width:15}}
                          disabled={disabled}
                          href="javascript:void(0);"
                          onClick={that.unlock.bind(that,record)}>
                解锁
              </AuthButton>
            )
          }

          return (
            <div className="myproject-list-opration">
              {lockJsx}
              <AuthButton renderType="a" type="trash"
                          data-code="1021006"
                          href="javascript:void(0);"
                          disabled={record.taskLock == "1"}
                          onClick={that.deleteScript.bind(that,record)}>
                删除
              </AuthButton>
              <AuthButton renderType="a"
                          type="code-fork"
                          data-code="1021008"
                          href="javascript:void(0);"
                          onClick={that.historyVersion.bind(that,record)}>
                历史版本
              </AuthButton>
            </div>
          );
        }
      }]
  }

  /**
   * 获取脚本列表数据
   * @param type 脚本类型
   * @param limit 每页显示条数 默认10条
   * @param pageNum 当前页数 默认第一页
   * */
  getScriptListData(type, treeCode, limit = 10, pageNum = 1) {
    this.ajaxGetScriptlist = Model.getScriptlist(type, treeCode, limit, pageNum, (result)=> {
      this.setState({scriptList: result.data, selectCodes: []})
    })
  }


  /**
   * 表格分页
   */
  onPageChange(nextPage) {
    this.getScriptListData(this.state.scriptType, this.state.treeCode, this.state.pageSize, nextPage)
  }


  /**
   * 根据脚本类型,过滤表格数据
   * @param e
   */
  search(e) {
    this.getScriptListData(this.state.scriptType)
  }


  /**
   * 跳转页面
   * @param page 跳转的页面
   * @param curInfoCode 当前的脚本code
   * */
  pageToIDE() {
    this.props.parent.setState({page: ENUM.PAGE.IDE});
  }


  /**
   * 添加脚本
   */
  addScript() {
    this.pageToIDE();
  }


  /**
   * 编辑脚本
   * @param record
   */
  editScript(record) {
    Model.getScriptInfo(record.code, (result)=> {
      this.pageToIDE()
      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_ADD_EDITOR, result.data);
    })
  }


  /**
   * 跳转到版本历史页面
   * @param record
   */
  historyVersion(record) {
    //record.href = '/ide/versionHistory?code=' + record.code
    //record.title = '版本历史'
    //this.props.history.pushState(null, record.href);
    //EventEmitter.dispatch(EventName.addTab, record)

    this.setState({showScriptList: false, code: record.code})
  }


  /**
   * 锁定脚本
   * @param record
   */
  lock(record) {
    let that = this;
    Model.lockScript(record.code, function (result) {
      message.success('锁定成功!')
      if (that) {
        that.getScriptListData(that.state.scriptType)
      }
    })
  }


  /**
   * 解锁脚本
   * @param record
   */
  unlock(record) {
    let that = this;
    Model.unlockScript(record.code, function (result) {
      message.success('解锁成功!')
      if (that) {
        that.getScriptListData(that.state.scriptType)
      }
    })
  }


  /**
   * 删除脚本,根据id
   * */
  deleteScript(record) {
    let that = this;
    confirm('确定删除该脚本?', () => {
      //标识都使用 code 来进行标识
      Model.deleteScript([record.code], function (result) {
        message.success('删除脚本成功!')
        that.getScriptListData(that.state.scriptType)
      })
    })
  }


  /**
   * 批量删除脚本
   */
  deleteScripts() {
    let that = this;
    confirm('确定批量删除脚本?', () => {
      Model.deleteScript(that.state.selectCodes, function (result) {
        message.success('批量删除脚本成功!')
        that.getScriptListData(that.state.scriptType)
      })
    })
  }


  /**
   * 发布脚本
   * */
  publishScript() {
    let that = this;
    if (that.state.selectCodes.length !== 0) {
      Model.publishScript(that.state.selectCodes, function (result) {
        message.success('发布脚本成功!')
        that.getScriptListData(that.state.scriptType)
      })
    }
  }


  /**
   * 导入
   */
  importHandler() {
    this.props.parent && this.props.parent.openImportModal(this.state.treeCode, this.state.treeName, false);
  }


  /**
   * 导出
   */
  exportHandler() {
    this.props.parent && this.props.parent.openExportModal(this.state.treeCode, this.state.treeName, false, this.state.selectCodes);
  }

  /**
   * 表格多选功能
   * @param selects 数组, 返回选中行
   */
  checkboxSelect(selects) {
    let selectCodes = [];
    selects && selects.map(function (item) {
      selectCodes.push(item.code)
    })
    this.setState({selectCodes: selectCodes})
  }

  /**
   * 返回脚本列表
   */
  backToList() {
    this.setState({showScriptList: true})
  }

  renderVersion() {
    return <VersionScript code={this.state.code} backToList={this.backToList.bind(this)}/>
  }

  renderScriptList() {
    return (
      <div className="module-container" style={{display:this.props.display,margin:0,padding:0}}>
        <div className="row">
          <div className="module-btns col-sm-8">
            <AuthButton style={{marginLeft: 2,marginRight:20}}
                        data-code="1021002" renderType="icon" type="plus-square"
                        onClick={this.addScript.bind(this)}>新增</AuthButton>
            <AuthButton style={{marginRight:20}} data-code="1021003" renderType="icon" type="mail-reply"
                        onClick={this.importHandler.bind(this)}>导入
            </AuthButton>
            <AuthButton style={{marginRight:20}} data-code="1021004" renderType="icon" type="mail-forward"
                        disabled={this.state.selectCodes.length === 0}
                        onClick={this.exportHandler.bind(this)}>导出
            </AuthButton>
            <AuthButton style={{marginRight:20}} data-code="1021005" renderType="icon" type="cloud-upload"
                        disabled={this.state.selectCodes.length === 0}
                        onClick={this.publishScript.bind(this)}>发布
            </AuthButton>
            <AuthButton style={{marginRight:20}} data-code="1021006" renderType="icon" type="trash"
                        disabled={this.state.selectCodes.length === 0}
                        onClick={this.deleteScripts.bind(this)}>删除
            </AuthButton>
          </div>

          <div className="module-search col-sm-4">
            <button className="btn btn-primary" style={{float:'right',marginLeft:'10px'}}
                    onClick={this.search.bind(this)}>查询
            </button>
            <Select style={{width:160,float:'right'}}
                    className="ide-script-list__type"
                    value={this.state.scriptType}
                    onChange={this.handleScriptTypeChange.bind(this,'scriptType')}>
              <Option value="">全部脚本类型</Option>
              {this.state.scriptTypeData && this.state.scriptTypeData.map(function (item, index) {
                return (
                  <Option key={index} value={item.code}>{item.name}</Option>
                )
              })}
            </Select>
          </div>
        </div>

        <div className="bdos-table checkbox-table" style={{marginTop:0}}>
          <DataTable column={this.getColumns()} showPage="true" howRow={10}
                     onPageChange={this.onPageChange.bind(this)}
                     data={this.state.scriptList}
                     onCheckboxSelect={this.checkboxSelect.bind(this)}/>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.showScriptList) {
      return this.renderScriptList()
    } else {
      return this.renderVersion()
    }
  }
}

export
default
ScriptList
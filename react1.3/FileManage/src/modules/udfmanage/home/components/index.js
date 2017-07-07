/***************************************************
 * 时间: 16/6/14 14:15
 * 作者: zhongxia
 *  明: 数据 源管理[目前不需 做, 产品经理还没有确定]
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
//BFD-UI组件库
import DataTable from 'bfd-ui/lib/DataTable'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'

import message from 'CommonComponent/component/bdosmessage'
import AuthButton from 'CommonComponent/component/authbutton'
//确定删除按钮
import DeleteModal from './DeleteModal'
import UdfEdit from './UdfEdit'

import Model from '../model/udfManageAjax'

/**
 * 版本历史
 */
class UdfManage extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      idFiled: 'id',
      pageSize: 10,
      pageNo: 1,
      DataList: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      },
      isCreatePage: false,  //是否为编辑页面
      udfData: {} //UDF数据, 编辑回显
    };
  }

  componentDidMount() {
    this.getTableData()
  }

  componentWillUnmount() {
    this.ajaxGetUdf.abort();
  }

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
   * 获取 格列
   * @returns {*}
   */
  getColumns() {
    let that = this;
    return [
      {
        title: 'UDF名称',
        key: 'name'
      }, {
        title: '类名',
        key: 'className'
      }, {
        title: '函数名',
        key: 'functionName',
      }, {
        title: '参数',
        key: 'args'
      }, {
        title: 'jar包',
        key: 'jarPath'
      }, {
        title: '库名',
        key: 'hiveDatabase'
      },
      {
        title: '更新时间',
        key: 'updateTimeStr'
      }, {
        title: '创建人',
        key: 'createUser'
      }, {
        title: '操作',
        key: 'operation',
        width: '150px',
        render(record) {
          return (
            <span className="myproject-list-opration">
          <AuthButton data-code="1040204" renderType="a" href="javascript:void(0);" disabled={that.getBtnDisabled()}
                      onClick={that.editHandler.bind(that,record)}>编辑</AuthButton>
          <AuthButton data-code="1040203" renderType="a" href="javascript:void(0);" style={{marginLeft:15}}
                      disabled={that.getBtnDisabled()}
                      onClick={that.delHandler.bind(that,record)}>删除</AuthButton>
          <AuthButton data-code="1040205" renderType="a" href="javascript:void(0);" style={{marginLeft:15}}
                      disabled={that.getBtnDisabled()}
                      onClick={that.saveHandler.bind(that,record)}>另存为</AuthButton>
        </span>
          );
        }
      }
    ]
  }

  /**
   * 获取 格数据
   * @param udfName
   * @param pageNo
   */
  getTableData(udfName, pageNo) {
    let that = this;
    let param = {
      pageNo: pageNo || that.state.pageNo,
      pageSize: that.state.pageSize,
      searchName: udfName,
    }
    this.ajaxGetUdf = Model.getUdf(param, function (result) {
      that.setState({DataList: result.data, selectIds: ""})
    })
  }

  /**
   * 文件搜索
   */
  searchHandler(e) {
    if (e.keyCode) {
      e.keyCode === 13 && this.getTableData(this.state.udfName)
    }
    else {
      this.getTableData(this.state.udfName)
    }
  }

  /**
   * 创建 源
   */
  createResource() {
    this.setState({isCreatePage: true, udfData: {}})
  }

  /**
   * 编辑
   */
  editHandler(item) {
    let data = {...item};
    this.setState({isCreatePage: true, udfData: data})
  }

  /**
   * 另存为
   */
  saveHandler(item) {
    let data = {...item};
    data.isOtherSave = true; //为另存为
    this.setState({isCreatePage: true, udfData: data})
  }

  /**
   * 关闭编辑页面
   * @param item
   */
  close() {
    this.setState({isCreatePage: false, udfData: {}})
  }

  /**
   * 删除UDF
   * @param item
   */
  delHandler(item) {
    let ids = (item && item.id) || this.state.selectIds;
    if (ids !== "") {
      this.setState({udfId: ids})
      this.refs.modal.open()
    }
  }

  /**
   * 关闭删除UDF的确定框
   */
  closeWin() {
    this.refs.modal.close()
    //this.setState({selectIds: ""})
  }


  /**
   *  格翻页
   */
  onPageChange(currentPage) {
    this.setState({pageNo: currentPage})
    this.getTableData(this.state.udfName, currentPage);
  }

  /**
   *  格多选功能
   * @param selects 数组, 返回选中
   */
  checkboxSelect(selects) {
    let selectIds = '';
    selects && selects.map((item)=> {
      selectIds += `${item[this.state.idFiled]},`;
    })
    if (selectIds.length > 0) {
      selectIds = selectIds.substr(0, selectIds.length - 1);
    }
    this.setState({selectIds: selectIds})
  }

  /**
   * 根据用户类型,判断是否有权限
   * @returns {boolean}
   */
  getBtnDisabled() {
    const userType = window._currentUser && window._currentUser.userType || "";
    let addDisabled = false;
    //userType: 0 超级管理员 1 管理员 2 租户所有者 3 普通用户
    if (userType !== 2 && userType !== 3) {
      addDisabled = true;
    }
    return addDisabled;
  }

  /**
   * 渲染创建/编辑页面
   */
  renderCreatePage() {
    return <UdfEdit parent={this} data={this.state.udfData}/>
  }

  /**
   * 渲染操作按钮
   */
  renderBtns() {
    if (!this.getBtnDisabled()) {
      return (<div className="module-btns" style={{lineHeight:'30px'}}>
        <AuthButton data-code="1040202" renderType="icon" type="plus-square"
                    style={{marginRight:20}}
                    disabled={this.getBtnDisabled()}
                    onClick={this.createResource.bind(this)}>新增
        </AuthButton>
        <AuthButton disabled={this.getBtnDisabled()||this.state.selectIds==="" || this.state.selectIds === undefined}
                    data-code="1040203"
                    renderType="icon" type="trash"
                    onClick={this.delHandler.bind(this)}>删除
        </AuthButton>
      </div>)
    }
  }

  /**
   * 渲染列 页面
   */
  renderListPage() {
    return (
      <div className="module-container" style={{display:this.props.display}}>
        <div style={{lineHeight: '30px',width: '100%',height: '30px',margin: '10px 0'}}>
          <div className="module-search clearfix" style={{float:'right'}}>
            <input style={{float:'left'}}
                   className="form-control"
                   placeholder="UDF名称/创建人/函数名"
                   value={this.state.udfName}
                   onKeyDown={this.searchHandler.bind(this)}
                   onChange={this.handleChange.bind(this,'udfName')}/>

            <button style={{marginLeft:15,float:'left'}} className="btn btn-sm btn-primary"
                    onClick={this.searchHandler.bind(this)}>查询
            </button>
          </div>

          {this.renderBtns()}
        </div>
        <div className="module-table checkbox-table" style={{marginTop:0}}>
          <DataTable column={this.getColumns()} showPage="true" howRow={this.state.pageSize} data={this.state.DataList}
                     onPageChange={this.onPageChange.bind(this)}
                     onCheckboxSelect={this.checkboxSelect.bind(this)}/>
        </div>
        <Modal ref="modal">
          <ModalBody>
            <DeleteModal udfId={this.state.udfId}
                         callback={this.getTableData.bind(this)}
                         closeWin={this.closeWin.bind(this)}/>
          </ModalBody>
        </Modal>
      </div>
    )
  }

  render() {
    let page = this.renderListPage();

    //跳转到创建页面
    if (this.state.isCreatePage) {
      page = this.renderCreatePage();
    }
    return (
      <div className="udfmanage">
        {page}
      </div>
    );
  }
}

export default UdfManage
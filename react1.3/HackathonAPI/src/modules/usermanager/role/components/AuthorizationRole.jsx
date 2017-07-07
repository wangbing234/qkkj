/***************************************************
 * 时间: 16/7/6 20:08
 * 作者: zhongxia
 * 说明: 授权页面
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

import DataTable from 'bfd-ui/lib/DataTable'
import message from 'bfd-ui/lib/message'
import confirm from 'bfd-ui/lib/confirm'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'

import Model from 'model/userManager'

let that;

const columns = [
  {
    title: 'API URL',
    key: 'apiUrl'
  }, {
    title: '别名',
    key: 'aliasName',
  }
]


class AuthorizationRole extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      idField: 'id',
      pageSize: 99999,
      currentPage: 1,
      oldApiIds: '',
      selectIds: '',
      apiUrl: '',
      ...prop.data
    };
  }

  componentDidMount() {
    this.getTableData()
  }

  componentWillUnmount() {
    that = null;
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
   * 表格多选功能
   * @param selects 数组, 返回选中行
   */
  checkboxSelect(selects) {
    let delIds = '';

    selects && selects.map(function (item, index) {
      let id = item[that.state.idField];
      delIds += `${id},`;
    })
    if (delIds.length > 0) {
      delIds = delIds.substr(0, delIds.length - 1);
    }

    that.setState({selectIds: delIds})
  }

  /**
   * 获取表格数据
   * @param userName 用户名
   */
  getTableData(currentPage) {
    console.log("getTableData currentPage", currentPage)
    let param = {
      roleId: that.state.id,
      apiUrl: that.state.apiUrl,
      pageSize: that.state.pageSize,
      currentPage: currentPage || that.state.currentPage
    }
    Model.authRole(param, function (result) {
      let oldApiIds = that.getSelectedId(result.data.totalList);
      that.setState({
        tbData: result.data,
        oldApiIds: oldApiIds
      })
    })
  }

  /**
   * 过滤出出事选中的id
   */
  getSelectedId(data) {
    let selectedArr = [];
    data && data.map(function (item, index) {
      if (item.isSelect) {
        selectedArr.push(item.id)
      }
    })
    console.log("selectedArr.join(',');", selectedArr.join(','))
    return selectedArr.join(',');
  }

  /**
   * 搜索功能
   */
  search() {
    that.getTableData()
  }

  /**
   * 提交
   */
  submit() {
    console.log("selectIds", that.state.selectIds)
    Model.grantRole({
      roleId: that.state.id,
      oldApiIds: that.state.oldApiIds,
      newApiIds: that.state.selectIds
    }, function (result) {
      console.log("result", result)
      message.success("授权成功!")
      that.props.parent && that.props.parent.getTableData();
      that.closePage()
    })
  }

  /**
   * 关闭页面
   */
  closePage() {
    that.props.parent && that.props.parent.setState({pageIndex: 0})
  }

  /**
   * 表格翻页
   */
  onPageChange(currentPage) {
    that.setState({currentPage: currentPage})
    console.log("currentPage", currentPage)
    that.getTableData(currentPage);
  }

  render() {
    that = this;
    const style = {
      center: {
        marginTop: 20,
        marginLeft: 300
      }
    }
    return (
      <div className="module-container" style={{display:this.props.display}}>
        <div style={{marginBottom: 10,height:30}}>
          <div className="module-search" style={{margin:0,textAlign:'right'}}>
            <button className="btn btn-sm btn-primary"
                    style={{float:'right'}}
                    onClick={this.search}>查询
            </button>
            <input style={{float:'right'}}
                   className="form-control"
                   placeholder="请输入关键字"
                   value={this.state.apiUrl}
                   onChange={this.handleChange.bind(this,'apiUrl')}/>
          </div>
        </div>

        <div className="module-table table-checkbox not-operator-col" style={{marginTop:0}}>
          <DataTable column={columns} showPage="false"
                     howRow={that.state.pageSize}
                     data={this.state.tbData}
                     onPageChange={this.onPageChange.bind(this)}
                     onCheckboxSelect={this.checkboxSelect}/>
        </div>

        <div style={style.center}>
          <button type="button"
                  className="btn btn-sm btn-primary" onClick={this.submit}>提交
          </button>
          <button type="button"
                  style={{marginLeft:30}}
                  className="btn btn-sm btn-default" onClick={this.closePage}>取消
          </button>
        </div>
      </div>
    )
  }
}

export default AuthorizationRole
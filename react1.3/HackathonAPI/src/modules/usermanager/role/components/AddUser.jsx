/***************************************************
 * 时间: 16/7/6 20:08
 * 作者: zhongxia
 * 说明: 角色列表里面的添加用户
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

import Transfer from 'bfd-ui/lib/Transfer'
import message from 'bfd-ui/lib/message'

import Model from 'model/userManager'

let that;
class AddUser extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      sourceData: [],
      targetData: [],
      ...prop.data
    };
  }

  componentDidMount() {
    that.getUserList()
  }

  componentWillUnmount() {
    that = null
  }

  /**
   * 获取表格数据
   * @param userName 用户名
   */
  getUserList() {
    //获取左边用户
    Model.getAllUser({roleId: that.state.id}, function (result) {
      that.setState({
        sourceData: result.data
      })
    })

    //获取右边用户
    Model.getRoleUser({roleId: that.state.id}, function (result) {
      that.setState({
        targetData: result.data,
        oldUsers: that.getSelectedId(result.data)
      })
    })
  }

  /**
   * 过滤出出事选中的id
   */
  getSelectedId(data) {
    let selectedArr = [];
    data && data.map(function (item, index) {
      selectedArr.push(item.id)
    })
    return selectedArr.join(',');
  }

  submit() {
    let param = {
      roleId: that.state.id,
      oldUsers: that.state.oldUsers,
      newUsers: that.getSelectedId(that.state.targetData)
    }
    Model.addUserRole(param, function (result) {
      console.log("result", result)
      message.success("赋予用户角色权限成功!!")
      that.props.parent && that.props.parent.getTableData();
      that.closePage()
    })
  }


  /**
   * 穿梭框查询
   * @param label
   * @param keyValue
   * @returns {boolean}
   */
  handleSearch(label, keyValue) {
    return label.indexOf(keyValue) != -1;
  }

  /**
   * 穿梭框 change 事件
   * @param sData 左侧数组
   * @param tData 右侧数组
   */
  changeUser(sData, tData) {
    that.setState({
      sourceData: sData,
      targetData: tData,
    })
  }

  closePage() {
    that.props.parent && that.props.parent.setState({pageIndex: 0})
  }

  render() {
    that = this;
    const style = {
      center: {
        marginLeft: 200,
        marginTop: 20,
      },
      transferDiv: {
        height: 250,
        width: 700
      }
    }

    return (
      <div className="bdos-edit-form">
        <div style={style.transferDiv}>
          <Transfer height={200}
                    title={"已赋予该角色的用户列表"}
                    sdata={that.state.sourceData}
                    tdata={that.state.targetData}
                    onChange={that.changeUser}
                    onSearch={that.handleSearch}/>
        </div>
        <div style={style.center}>
          <button type="button"
                  className="btn btn-sm btn-primary" onClick={that.submit}>提交
          </button>
          <button type="button"
                  style={{marginLeft:30}}
                  className="btn btn-sm btn-default" onClick={that.closePage}>取消
          </button>
        </div>
      </div>
    )
  }
}

export default AddUser
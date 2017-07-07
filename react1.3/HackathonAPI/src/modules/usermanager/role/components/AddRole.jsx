/***************************************************
 * 时间: 16/6/24 10:51
 * 作者: zhongxia
 * 说明: 添加角色
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'bfd-ui/lib/message'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'

import Model from 'model/userManager'

let that;
class AddRole extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      enable: "1",
      ...prop.data
    };

    this.rules = {
      roleName(val){
        if (!val) return '角色名称不能为空!'
      }
    }
  }

  componentWillUnmount() {
    that = null;
  }

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  closePage() {
    that.props.parent && that.props.parent.setState({pageIndex: 0})
  }

  addOrEditRole() {
    if (that.refs.form.validate(that.state)) {
      if (that.state.id) {
        Model.updateRole(that.state, function (result) {
          console.log("result", result)
          message.success("更新角色成功!")
          that.props.parent && that.props.parent.getTableData();
          that.closePage()
        })
      } else {
        Model.addRole(that.state, function (result) {
          console.log("result", result)
          message.success("创建角色成功!")
          that.props.parent && that.props.parent.getTableData();
          that.closePage()
        })
      }

    }
  }


  render() {
    that = this;
    const style = {
      width: {
        width: 350,
        display: 'inline-block'
      },
      center: {
        marginLeft: 100
      },
      textarea: {
        width: 350,
        height: 75
      }
    }

    return (
      <div className="bdos-edit-form">
        <Form
          ref="form"
          data={this.state}
          rules={this.rules}>
          <FormItem label="角色名称" required name="roleName">
            <RestrictInput type="text"
                           style={style.width}
                           className="form-control"
                           value={this.state.roleName}
                           restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_24}
                           tipString="支持中文、字母、数字、下划线，长度不大于24个字符"
                           onChange={that.handleChange.bind(that,'roleName')}/>
          </FormItem>

          <FormItem label="角色描述" name="comment">
          <textarea className="form-control"
                    style={style.textarea}
                    value={this.state.comment}
                    onChange={this.handleChange.bind(this,'comment')}>
          </textarea>
          </FormItem>

          <div style={style.center}>
            <button type="button"
                    className="btn btn-sm btn-primary" onClick={this.addOrEditRole}>确定
            </button>
            <button type="button"
                    style={{marginLeft:30}}
                    className="btn btn-sm btn-default" onClick={this.closePage}>取消
            </button>
          </div>
        </Form>
      </div>
    )
  }
}

export default AddRole
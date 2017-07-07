/***************************************************
 * 时间: 16/4/29 11:27
 * 作者: xiaodong.huang
 * 说明: 新建文件夹,重命名文件夹
 *  1. 使用BFD-UI组件 和 相关的验证方法
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form'

import Model from '../model/fileManageAjax'
import validate from '../validate'

class DirForm extends React.Component {
  constructor(prop) {
    super(prop)

    let that = this;

    this.state = {
      ...this.props.data,
      oldFileName: this.props.data && this.props.data.fileName,
      validateState: false,
      path: this.props.path,
      flag: false
    }


    this.rules = {
      fileName(val) {
        return validate.mkdir(that.state.path, val, 2, 30, that.state.flag)
      }
    }
  }

  handleChange(name, event) {
    const newState = {}
    if (event && event.target) {
      newState[name] = name === 'checked' ? event.target.checked : event.target.value
    } else {
      newState[name] = event
    }
    newState[name] = newState[name].replace(' ', ''); //不能输入空格
    this.setState(newState)
  }

  /**
   * 验证文件名是否重名
   * @param key
   */
  validateName(flag) {
    this.setState({flag: flag})
  }

  /**
   * submit按钮提交操作
   * 1. 验证有一个是判断文件名是否存在, 需要后端请求接口验证 [不实时验证]
   * 2. 有文件名长度,字符等验证 [实时验证]
   * 由于 BFD-UI表单错误信息提示 需要在 验证方法里面方法, 因此这里加了 flag 用来判断需不需要验证 文件名是否存在
   */
  handleSubmit(e) {
    if (this.refs.form.validate(this.state)) {    // 验证通过
      // 判断文件名是否文件
      if (!Model.checkAsyncFileExist(this.state.path, this.state.fileName)) {
        this.props.submitHandler && this.props.submitHandler(this.state)
      }
    }
  }

  render() {
    return (
      <Form ref="form" data={this.state} rules={this.rules}>
        <FormItem required label="文件夹名称" name="fileName">
          <input type="text" className="form-control" placeholder="请输入文件夹名称"
                 style={{width:200, display: 'inline-block'}}
                 value={this.state.fileName}
                 onBlur={this.validateName.bind(this,true)}
                 onFocus={this.validateName.bind(this,false)}
                 onChange={this.handleChange.bind(this, 'fileName')}/>
        </FormItem>

        <div className="newDir-tip" style={{marginTop:15}}>只能输入中文、大小写字母、数字、下划线、中划线长度2-30个字符</div>

        <div style={{textAlign: 'center'}}>
          <button type="button"
                  className="btn btn-sm btn-primary"
                  style={{marginRight: 10}}
                  onClick={this.handleSubmit.bind(this)}>确定
          </button>
          <button type="button" className="btn btn-sm btn-default"
                  onClick={this.props.close}>取消
          </button>
        </div>
      </Form>
    )
  }
}

export default DirForm


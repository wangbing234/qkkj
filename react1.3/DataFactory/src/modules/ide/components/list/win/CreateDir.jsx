/***************************************************
 * 时间: 16/6/16 10:47
 * 作者: zhongxia
 * 说明: 脚本树右键菜单, 新建脚本文件夹
 ***************************************************/
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
//组件库
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'CommonComponent/component/bdosmessage'
//自定义组件
import RestrictInput from 'CommonComponent/component/restrictinput'
//验证类
import RestrictConst from 'CommonComponent/utils/RestrictConst'
// Ajax 相关操作
import Model from 'IDERoot/model/ide'

class CreateDir extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      treeName: '',
      pid: prop.data.pid,
      id: prop.isEdit ? prop.data.id : ''  //编辑则把id 传过去, 不编辑则不传id
    };

    this.noticeMsg = prop.isEdit ? '修改脚本名称成功!' : '新增脚本文件夹成功';

    this.rules = {
      treeName: (val)=> {
        if (!val) return '文件夹名称不能为空!'

        //实时验证目录名称是否重复
        if (this.state.realTimeValiDateName) {
          if (Model.validateDir(this.state.id, this.state.pid, val)) {
            return '文件夹名称重复，请重新输入!'
          }
        }
      }
    }

    this.closeModal = this.closeModal.bind(this)
    this.createDirHandler = this.createDirHandler.bind(this)
  }

  componentDidMount() {
    //编辑,则根据id初始化数据
    if (this.props.isEdit) {
      this.setState({...this.props.data})
    }
    if (this.refs.refFirstInput) {
      ReactDOM.findDOMNode(this.refs.refFirstInput).focus();
    }
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
   * 创建文件夹
   */
  createDirHandler() {
    let that = this;
    if (that.refs.form.validate(that.state)) {
      let pid = that.state.pid === "0" ? '' : that.state.pid;
      Model.createDir(that.state.id, pid, that.state.treeName, function (result) {
        message.success(that.noticeMsg)
        that.props.callback()
      })
      that.closeModal()
    }
  }

  /**
   * 验证文件名是否重名
   * @param key
   */
  validateName(flag) {
    this.setState({realTimeValiDateName: flag})
  }

  /**
   * 关闭窗口
   */
  closeModal() {
    this.props.closeWin && this.props.closeWin()
  }

  render() {
    return (
      <Form ref="form" rules={this.rules} data={this.state}>
        <FormItem label="名称" required name="treeName">
          <RestrictInput ref="refFirstInput" type="text"
                         style={{width:200,display:'inline-block'}}
                         className="form-control"
                         value={this.state.treeName}
                         restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_16}
                         tipString="名称只能包含中文、字母、数字、下划线，长度不大于16个字符"
                         onBlur={this.validateName.bind(this,true)}
                         onFocus={this.validateName.bind(this,false)}
                         onChange={this.handleChange.bind(this,'treeName')}/>
        </FormItem>

        <div style={{textAlign:'center'}}>
          <button type="button"
                  style={{marginRight: '15'}}
                  className="btn btn-sm btn-primary"
                  onClick={this.createDirHandler}>保存
          </button>
          <button type="button"
                  className="btn btn-sm btn-default"
                  onClick={this.closeModal}>取消
          </button>
        </div>
      </Form>
    );
  }
}

export default CreateDir
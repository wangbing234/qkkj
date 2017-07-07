/***************************************************
 * 时间: 2016/8/3 16:36
 * 作者: bing.wang
 * 说明: 
 *
 ***************************************************/
import React, { PropTypes } from 'react'
//组件库
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'bfd-ui/lib/message'
//自定义组件
import CanvasAjax from '../../modelcanvas/ajax/AjaxReq'
import RestrictInput from 'CommonComponent/component/restrictinput'
//验证类
import RestrictConst from 'CommonComponent/utils/RestrictConst'

let that;
class CreateDir extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {...this.props.node};
    this.rules = {
      name(val) {
        if (!val) return '文件夹名称不能为空!'
        return "";
      }
    }
  }

  componentDidMount() {
    this.state.editor=this.props.editor;
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
   * 创建文件夹
   */
  submit(fun) {
    let that = this;
    let trName=String(this.state.name).toLowerCase();
    if(this.state.editor==true)
    {
      CanvasAjax.renameTreeNode({code:this.state.code,treeName:trName,type:this.state.type},(data)=>{
        fun(this.state);
      })
    }
    else{
      CanvasAjax.addTreeNode({pidCode:this.state.code,treeName:trName},(data)=>{
        fun(this.state);
      })
    }

  }

  /**
   * 验证文件名是否重名
   * @param key
   */
  doVaildate(flag) {
    return that.refs.form.validate(that.state)
  }

  render() {
    that = this;
    return (
      <Form ref="form" rules={this.rules} data={this.state}>
        <FormItem label="名称" required name="name">
          <RestrictInput type="text"
                         style={{width:200,display:'inline-block'}}
                         className="form-control"
                         value={this.state.name}
                         restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_16}
                         tipString="名称只能包含中文、字母、数字、下划线，长度不大于16个字符"
                         onChange={that.handleChange.bind(that,'name')}
          />
        </FormItem>
      </Form>
    );
  }
}

export default CreateDir
/***************************************************
 * 时间: 7/20/16 16:20
 * 作者: zhongxia
 * 说明:
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
//bfd-ui components
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'bfd-ui/lib/message'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { FormSelect, Option } from 'bfd-ui/lib/FormSelect'

//custom components
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import BaseValidate from 'CommonComponent/utils/BaseValidate'

//import Model from 'model/resourceConfig'   //TODO:Ajax相关操作类

class FormPage extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      formData: {},   //表单值存放对象
      ...prop.data
    };

    this.rules = {
      sourceName(value){
        return BaseValidate.validateInput({label: "数据源", value: value, isRequired: true});
      },
      aliasName(value){
        return BaseValidate.validateInput({label: "别名", value: value, isRequired: true});
      }
    }
  }

  /**
   * 虚拟DOM渲染到真实DOM之后, 回显数据
   */
  componentDidMount() {
    let that = this;
    //回显数据
    let id = that.state.id;
    id && Model.view(id, function (result) {
      that.setState({...result.data})
    })
  }


  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = this.state.formData || {};
    //针对 多选框, 文本框
    if (event && event.target) {
      newState[name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    this.setState({formData: newState});
  }

  /**
   * 关闭页面
   */
  close(flag) {
    const parent = this.props.parent;
    if (parent) {
      //重新加载列表数据
      if (flag) {
        parent.getTable && parent.getTable();
      }
      parent.close && parent.close();
    }
  }

  /**
   * 添加或者更新
   */
  submit() {
    const that = this;
    const form = this.refs.form;
    if (form.validate()) {
      console.log("this.state", this.state)
      let data = this.state.formData;
      if (that.state.id) {
        //TODO:编辑
        Model.update(data, function (result) {
          console.log("result", result)
          message.success("新增资源配置成功!")
          that.close(true)
        })
      }
      else {
        //TODO:添加
        Model.add(data, function (result) {
          console.log("result", result)
          message.success("新增资源配置成功!")
          that.close(true)
        })
      }
    }
  }


  render() {
    const style = {
      width: {
        width: 200,
        display: 'inline-block'
      },
      center: {
        marginLeft: 100
      }
    }

    return (
      <div className="bdos-edit" style={{padding:20}}>
        <Form
          ref="form"
          className="bdos-form"
          data={this.state.formData}
          rules={this.rules}>

          <FormItem required label="数据源" name="sourceName" help="请输入用户">
            <input type="text"
                   style={style.width}
                   className="form-control"
                   value={this.state.formData.sourceName}
                   onChange={this.handleChange.bind(this,'sourceName')}/>
            GB
          </FormItem>

          <FormItem required label="别名" name="aliasName">
            <input type="text"
                   style={style.width}
                   className="form-control"
                   disabled={this.state.id?true:false}
                   value={this.state.formData.aliasName}
                   onChange={this.handleChange.bind(this,'aliasName')}/>
          </FormItem>

          <FormItem label="类型" name="type">
            <FormSelect style={style.width}
                        value={this.state.formData.type}
                        disabled={this.state.id?true:false}
                        onChange={this.handleChange.bind(this,'type')}>
              <Option value={0}>mysql</Option>
              <Option value={1}>hbase</Option>
            </FormSelect>
          </FormItem>


          <div style={style.center}>
            <button type="button"
                    style={{margin:'0 30px'}}
                    className="btn btn-sm btn-primary" onClick={this.submit.bind(this)}>确定
            </button>

            <button type="button"
                    className="btn btn-sm btn-default" onClick={this.close.bind(this)}>取消
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

export default FormPage
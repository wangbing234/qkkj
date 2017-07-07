import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import AutoComplete from 'bfd-ui/lib/AutoComplete'
import RestrictInput from 'CommonComponent/component/restrictinput'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import { Select2 ,Option2} from 'bfd-ui/lib/Select2'
import  JavaDircory from "../../../../../common/JavaDircory"
let that;
const Win = React.createClass({
  //初始化表单数据。
  getInitialState() {
    //this.rules = {
    //  fileFormat(validateVal) {
    //    return BaseValidate.validateInput({isRequired: true, label: "数据存储格式", value: validateVal});
    //  },
    //  storeType(validateVal) {
    //    return BaseValidate.validateInput({isRequired: true, label: "储存类型", value: validateVal});
    //  },
    //  field(validateVal) {
    //    return BaseValidate.validateInput({isRequired: true, label: "列分割符", value: validateVal});
    //  }
    //}
    this.disabled=this.props.isEdit?{}:{disabled:true};
    return {
      ...this.props.data
    }
  },
  /**
   * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
   * @returns {*}
   */
  getData() {
    return this.state;
  },

  /**
   *验证
   * @param name
   * @param event
   */
  vaildate()
  {
    const obj = this.refs._from.validate(this.state);
    if (obj) {    //验证通过
      console.log('表单验证通过',obj);
      return true;
    } else {              //验证失败
      console.log('表单验证失败');
    }
    return false;
  },


  /**
   * 公用处理修改
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
    this.setState({...newState, validateState: false});
  },
  render() {
    that = this;

    return (
        <Form horizontal className="popUpWinStyle"  ref="_from" labelWidth={130}  rules={this.rules}>
          <FormItem label="数据存储格式"  labelWidth="160"  name="fileFormat">
            <Select2 value={that.state.fileFormat} {...this.disabled}  {...this.props.iDisabled}
                     onChange={that.handleChange.bind(this,'fileFormat')} placeholder="请选择">
              {
                JavaDircory.FILE_FORMAT.map((item, index)=> {
                  return <Option2 key={index} value={item}>{item}</Option2>
                })
              }
            </Select2>
          </FormItem>
          <FormItem label="储存类型"  name="storeType">
            <Select2 value={that.state.storeType} {...this.disabled}  {...this.props.iDisabled}
                     onChange={that.handleChange.bind(this,'storeType')} placeholder="请选择">
              {
                JavaDircory.STORE_FORMAT.map((item, index)=> {
                  return <Option2 key={index} value={item}>{item}</Option2>
                })
              }
            </Select2>
          </FormItem>
          <FormItem label="列分割符"  name="field">
            <AutoComplete value={that.state.field} {...this.disabled}  {...this.props.iDisabled} search={false}
                     onChange={that.handleChange.bind(this,'field')} placeholder="请选择" source={JavaDircory.FIELD_SPILD}>
            </AutoComplete>
          </FormItem>
          <FormItem label="列转义字符"  name="escape"  >
            <RestrictInput className="form-control common-form-input" type="text" {...this.disabled} {...this.props.iDisabled}
                           tipString = "只能输入中文字母、数字、下划线、长度小于16个字符"
                           value={this.state.escape} maxLength="16"
                           onChange={this.handleChange.bind(this,'escape')}/>
          </FormItem>
          <FormItem label="collection分隔符"  name="colelction"  >
            <RestrictInput className="form-control common-form-input" type="text" {...this.disabled} {...this.props.iDisabled}
                           tipString = "只能输入中文字母、数字、下划线、长度小于16个字符"
                           value={this.state.colelction} maxLength="16"
                           onChange={this.handleChange.bind(this,'colelction')}/>
          </FormItem>
          <FormItem label="map-kv分隔符"  name="mapkey" >
            <RestrictInput className="form-control common-form-input" type="text" {...this.disabled} {...this.props.iDisabled}
                           tipString = "只能输入中文字母、数字、下划线、长度小于16个字符"
                           value={this.state.mapkey} maxLength="16"
                           onChange={this.handleChange.bind(this,'mapkey')}/>
          </FormItem>
        </Form>
    );
  }
});

export default Win;
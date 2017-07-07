import React from 'react'
import {FormCategory,FormCategoryItem} from 'Base/FormCategory'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import FormInput from 'bfd-ui/lib/FormInput'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import { FormSelect, Option } from 'bfd-ui/lib/FormSelect'
import message from 'bfd-ui/lib/message'

class FormCategoryDemo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
    this.rules = {
      name(v) {
        if (!v) return '请填写用户群'
      },
      date(v) {
        if (!v) return '日期不能为空'
      }
    }
  }

  handleDateSelect(date) {
    const formData = this.state.formData
    formData.date = date
    this.setState({formData})
  }

  handleSave() {
    console.log(this.state.formData)
    this.refs.form.save()
  }

  handleSuccess(res) {
    console.log(res)
    message.success('保存成功！')
  }

  render() {
    return (<div className="bdos-edit">
      <div className="bdos-edit-nav">角色管理</div>
      <Form
        ref="form"
        action="/api/form"
        rules={this.rules}
        data={{}}
        onSuccess={this.handleSuccess}>
        <FormCategory>
          <FormCategoryItem name="基本信息">
            <FormItem label="用户群" required name="name" help="5个字符以内">
              <FormInput style={{width: '200px'}}></FormInput>
            </FormItem>
            <FormItem label="品牌偏好" name="brand">
              <FormSelect style={{width: '200px'}}>
                <Option>请选择</Option>
                <Option value={0}>小米</Option>
                <Option value={1}>苹果</Option>
              </FormSelect>
            </FormItem>

            <FormItem label="用户群" required name="name" help="5个字符以内">
              <FormInput style={{width: '200px'}}></FormInput>
            </FormItem>
            <FormItem label="品牌偏好" name="brand">
              <FormSelect style={{width: '200px'}}>
                <Option>请选择</Option>
                <Option value={0}>小米</Option>
                <Option value={1}>苹果</Option>
              </FormSelect>
            </FormItem>

          </FormCategoryItem>

          <FormCategoryItem name="基本信息">
            <FormItem label="选择日期" required name="date">
              <FormInput style={{width: '200px'}}></FormInput>
            </FormItem>
            <FormItem label="描述" name="desc" help="500个字符以内">
              <FormTextarea></FormTextarea>
            </FormItem>
          </FormCategoryItem>

          <FormCategoryItem name="基本信息">
            <FormItem label="选择日期" required name="date">
              <FormInput style={{width: '200px'}}></FormInput>
            </FormItem>
            <FormItem label="描述" name="desc" help="500个字符以内">
              <FormTextarea></FormTextarea>
            </FormItem>
          </FormCategoryItem>

          <FormCategoryItem name="基本信息">
            <FormItem label="选择日期" required name="date">
              <FormInput style={{width: '200px'}}></FormInput>
            </FormItem>
            <FormItem label="描述" name="desc" help="500个字符以内">
              <FormTextarea></FormTextarea>
            </FormItem>
          </FormCategoryItem>

          <FormCategoryItem name="基本信息">
            <FormItem label="选择日期" required name="date">
              <FormInput style={{width: '200px'}}></FormInput>
            </FormItem>
            <FormItem label="描述" name="desc" help="500个字符以内">
              <FormTextarea></FormTextarea>
            </FormItem>
          </FormCategoryItem>
        </FormCategory>
        <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary" onClick={this.handleSave}>保存
        </button>
      </Form>
    </div>);
  }
}

export default FormCategoryDemo
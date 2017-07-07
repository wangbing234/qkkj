/***************************************************
 * 时间: 2016/7/20 10:53
 * 作者: lijun.feng
 * 说明: 功能授权表单
 ***************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import AdminEnum from 'AdminEnum'
import AdminUtils from 'AdminUtils'
import AjaxReq from '../../../model/AjaxReq'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import TableTree from 'bfd-ui/lib/TableTree'
let breadArr = [{
  text: '权限审批',
  url:''//如果不需要跳转url可以为空或不写url
},{
  text: '功能权限审批',
  url:''
}];
const AUTH_TYPE=[{name:"功能权限",value:0},{name:"数据权限",value:1},{name:"资源权限",value:2}];
const APPLY_STATUS=[{name:"未审核",value:0},{name:"同意",value:1},{name:"驳回",value:2}];
let that;
let isSee;
let data = {
  "totalList": [
    {
      "function": "文件管理"
    }, {
      "function": "监控中心"
    }],
  "currentPage": 1,
  "totalPageNum": 2
};
class AuthoritySPFunc extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
    isSee = this.props.isSee;
    this.state = {  ...this.props.data };
    this.rules = {
      approveOpition: value => {
        return BaseValidate.validateInput({label: "审批意见", maxLength: 255, value: value});
      }
    };

    this.functionColumns = [ {
      title: "功能名称",
      key:"checked",
      render(item) {
        return <Checkbox disabled={true}  checked={item.checked}>{item.name}</Checkbox>
      }
    }];
  }

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
  }


  componentDidMount() {

  }

  handleSubmit(item,e) {
    if (this.refs.form.validate(this.state)) {
      var info19 = {
        applyId:this.state.id,
         status:item,
        approveOpition: this.state.approveOpition
      };
      //请求后台
      AjaxReq.approval(info19, (result)=> {
        this.props.cancel(true);
      });
      console.log('表单验证通过');
    } else {
      console.log('表单验证失败');
    }
    if (e) e.preventDefault();
  }

  getColumns() {
    return this.props.isFun=="true"?[{ title: '功能',key: 'name'}]:[{ title: '资源',key: 'name'}];
  }

  renderSeeDetail() {
    let comp;
    if (isSee) {
      comp = <div>
        <FormItem label="审批人" name="approverName">
          <RestrictInput type="text" value={this.state.approverName} className="form-control common-form-input"
                         disabled={true}
          />
        </FormItem>
        <FormItem label="审批时间" name="approveTime" required>
          <RestrictInput type="text" value={this.state.approveTime} className="form-control common-form-input"
                         disabled={true}
          />
        </FormItem>
      </div>;
    }
    return comp;
  }

  renderFooter() {
    let comp;
    if (!isSee) {
      comp = <div style={{display:'inline-block'}}>
        <button type="button" className="btn btn-sm btn-primary common-margin-right" onClick={that.handleSubmit.bind(this,1)}>同意
        </button>
        <button type="button" className="btn btn-sm btn-primary common-margin-right" onClick={that.handleSubmit.bind(this,2)}>驳回
        </button>
      </div>;
    }
    return comp;
  }

  render() {
    that = this;
    let column = this.getColumns();
    let seeDetailComp = this.renderSeeDetail();
    let footer = this.renderFooter();
    let data = [];
    if(this.state.approveDetails){
      data = JSON.parse(this.state.approveDetails);
    }
    return (<div>
      <EditPanel history={this.props.history} breadCrumbList={breadArr} onChange={this.props.cancel}>
        <Form ref="form" rules={this.rules}>
          <FormItem label="处理状态" name="status" style={{color:'red'}}>
            <div style={{lineHeight:'30px'}}>{AdminUtils.getStatusStr(this.state.status)}</div>
          </FormItem>
          <FormItem label="申请名称" name="applyName">
            <RestrictInput type="text" value={this.state.applyName} className="form-control common-form-input"
                           disabled={true}
            />
          </FormItem>
          <FormItem label="申请人" name="applyerName">
            <RestrictInput type="text" value={this.state.applyerName} className="form-control common-form-input"
                           disabled={true}
            />
          </FormItem>
          <FormItem label="申请类型" name="applyType">
            <Select value={this.state.applyType} className="common-select" disabled={true}>
              {AUTH_TYPE.map((item,index)=>{return (<Option key={item.value} value={item.value}>{item.name}</Option>)})}
            </Select>
          </FormItem>
          <FormItem label="申请时间" name="applyTime" required>
            <RestrictInput type="text" value={this.state.applyTime} className="form-control common-form-input"
                           disabled={true}
            />
          </FormItem>

          <FormItem label="申请理由" name="applyReason">
            <RestrictTextarea value={this.state.applyReason} className="form-control common-textarea"
                              disabled={true}/>
          </FormItem>
          <FormItem label="申请内容" name="comment">
            <div className="module-table onlyOneColumn" style={{width:'405px'}}>
              <TableTree  columns={this.functionColumns} data={data}/>
            </div>
          </FormItem>
          {seeDetailComp}
          <FormItem label="审批意见" name="approveOpition">
            <RestrictTextarea value={this.state.approveOpition} className="form-control common-textarea"
                              onChange={this.handleChange.bind(this,"approveOpition")}/>
          </FormItem>
        </Form>
        <div style={{marginLeft:'120px'}}>
          {footer}
          <button type="button" className="btn btn-sm btn-default" onClick={this.props.cancel}>取消</button>
        </div>
      </EditPanel>
      </div>
    );
  }
}

export default AuthoritySPFunc;

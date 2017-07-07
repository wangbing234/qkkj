/***************************************************
 * 时间: 2016/7/20 11:06
 * 作者: lijun.feng
 * 说明: 数据授权表单
 ***************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { MultipleSelect} from 'bfd-ui/lib/MultipleSelect'
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import DataTable from 'bfd-ui/lib/DataTable'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import AdminEnum from 'AdminEnum'
import AdminUtils from 'AdminUtils'
import ConfirmAddPolicy from '../pops/ConfirmAddPolicy'
import AddToHavePolicy from '../pops/AddToHavePolicy'
import ConstUtil from '../../../../../common/model/ConstUtil'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import AjaxReq from '../../../model/AjaxReq'
const AUTH_TYPE=[{name:"功能权限",value:0},{name:"数据权限",value:1},{name:"资源权限",value:2}];


let breadArr = [{
  text: '权限审批',
  url:''//如果不需要跳转url可以为空或不写url
},{
  text: '数据权限审批',
  url:''
}];
const SP_FORM_DATA_AUTH = 'sp_form_data_auth';//数据权限列表
const ADD_TO_HAVE_POLICY = 'add_to_have_policy';//加入到已经有的策略
let that;
let isSee;



class AuthoritySPData extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
    this.viewModel=SP_FORM_DATA_AUTH;
    let approveObject = JSON.parse(this.props.data.approveDetails);//转换过的json
    isSee = this.props.isSee;

    let tState={
      approveOpition:"",
      ...this.props.data,
      ...approveObject,
      tenantId:window._currentUser.tenantId
      //policyName:this.getPolicyName()
    };
    this.state = tState;

    this.rules = {
      approveOpition: value => {
        return BaseValidate.validateInput({ label: "审批意见", maxLength:255,value: value});
      }
    };

    this.hiveList=[];
  }

  componentDidMount() {
    if(this.state.resourceType!="hdfs")
      this.queryResource();
  }

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
  }


  /**
   * 查询资源
   */
  queryResource()
  {
    let dbType = this.state.resourceType;
    let that=this;
    AjaxReq.listResourceByType(dbType,(data) => {
      that.hiveList=data;
      that.setState({});
    })
  }

  /**
   * 审批提交
   * @param item
     */
  handleSubmit(item)  {
    if (this.refs.form.validate(this.state)) {
          this.approvalInfo(item);
     }
  }

  /**
   * 审批信息
   * @param item
     */
  approvalInfo(item){
    var info19 = {
      applyId:this.props.data.id,
      status:item,
      approveOpition: this.state.approveOpition
    };
    //请求后台
    AjaxReq.approval(info19, (result)=> {
      this.refs.confirmModal.cancelHandler();
      this.props.cancel(true);
    });
  }

  confirmAddPolicy(){
    if (this.refs.form.validate(this.state)) {
      console.log('表单验证通过');
      this.refs.confirmModal.open();
    } else {
      console.log('表单验证失败');
    }

  }

  addToHivePolicy(){
    if (this.refs.form.validate(this.state)) {
      console.log('表单验证通过');
      this.viewModel=ADD_TO_HAVE_POLICY;
      this.setState()
    } else {
      console.log('表单验证失败');
    }

  }


  formatNum(num){
    if (num >= 1 && num <= 9) {
      num = "0" + num;
    }
    return num;
  }

  getTimes(){
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + this.formatNum(date.getMonth() + 1) + this.formatNum(date.getDate())
       + this.formatNum(date.getHours()) + this.formatNum(date.getMinutes())
      + this.formatNum(date.getSeconds());
    return currentdate;


}

  /**当为hdfs数据审批时，
   	如用户申请时已填写申请名称，则显示用户填写的策略名称，可修改
   	如用户未填写，则系统按规则生成策略名称，可修改。
   	规则为：租户ID+数据类型+时间（年月日时分秒）
   **/
  getPolicyName(){
    return `${this.getTimes()}`;
  }

  getAsArray(obj){
    let _array=  obj instanceof Array?obj:[obj];
    return _array;
  }

  /**
   * 处理权限类型选择状态
   */
  handerAccess():void
  {
    this.accesses && this.accesses.map((item1,index)=>{
      this.state.authorityList.map((item,index)=>{
        if(item1.type == item.type && item.isAllowed)
        {
          item1.isAllowed=true;
          return;
        }
      });
    });
  }


  /**
   * 通过数据权限类型渲染数据
   * */
  renderByDataType() {
    let resultHive;
    switch (this.state.resourceType) {
      case 'hive':
          if(this.props.data.viewType=="telantSp")
          {
            this.accesses=$.extend(true,[],ConstUtil.ACCESSES_DATA_HIVE);
            this.handerAccess();
            resultHive= <div>
              <FormItem label="表名" required name="table">
                <MultipleSelect values={that.state.table} className="common-select" tagable disabled={true}>
                </MultipleSelect>
              </FormItem>
              <FormItem label="列名" required name="column">
                <MultipleSelect values={that.state.column} className="common-select" tagable disabled={true}>
                </MultipleSelect>
              </FormItem>

              <FormItem label="权限类型" required name="authorityList">
                <CheckBoxAll ref="accessesBox" key="type" value="type" disabled={true} list={this.accesses}
                             checkedField="isAllowed"/>
              </FormItem>
            </div>
          }
        return (
            <div>
              <FormItem label="hive源" name="resourceId">
                <Select value={this.state.resourceId} className="common-select" disabled={true}>
                  {this.hiveList.map((item, index)=> {
                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                  })}
                </Select>
              </FormItem>
              <FormItem label="数据库" name="database">
                <MultipleSelect defaultValues={this.getAsArray(this.state.database)} tagable className="common-select"
                                onChange={this.handleChange.bind(this,"database")} disabled={true}>
                </MultipleSelect>
              </FormItem>
              {resultHive}
            </div>
        );
        break;
      case 'hbase':
        if(this.props.data.viewType=="telantSp") {
          this.accesses=$.extend(true,[],ConstUtil.ACCESSES_DATA_HBASE);
          this.handerAccess();
          resultHive =
              <div>
            <FormItem label="表名" required name="table">
              <MultipleSelect values={that.state.table} className="common-select" tagable disabled={true}>
              </MultipleSelect>
            </FormItem>
            <FormItem label="列簇" required name="column-family">
              <MultipleSelect values={that.state["columnFamily"]} className="common-select" tagable disabled={true}>
              </MultipleSelect>
            </FormItem>
              <FormItem label="列名" required name="column">
                <MultipleSelect values={that.state.column} className="common-select" tagable disabled={true}>
                </MultipleSelect>
              </FormItem>
            <FormItem label="权限类型" required name="authorityList">
              <CheckBoxAll ref="accessesBox" key="type" value="type" list={this.accesses} disabled={true}
                           checkedField="isAllowed"/>
            </FormItem>
          </div>
        }
        return (
            <div>
              <FormItem label="HBase源" name="resourceId">
                <Select value={this.state.resourceId} className="common-select" disabled={true}>
                  {this.hiveList.map((item, index)=> {
                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                  })}
                </Select>
              </FormItem>
              <FormItem label="数据库" name="database">
                <MultipleSelect defaultValues={this.getAsArray(this.state.database)} tagable className="common-select"
                                onChange={this.handleChange.bind(this,"database")} disabled={true}>
                </MultipleSelect>
              </FormItem>
              {resultHive}
            </div>);

        break;
      case 'hdfs':
        this.accesses=$.extend(true,[],ConstUtil.ACCESSES_DATA_HDFS);
        this.handerAccess();
        return (
            <div>
              <FormItem label="文件目录" name="path" required>
                <MultipleSelect values={that.state.path}  className="common-select" tagable disabled={true}
                                onChange={this.handleChange.bind(this,'path')}>
                </MultipleSelect>
              </FormItem>

              <FormItem label="权限类型" required name="authorityList">
                <CheckBoxAll ref="accessesBox" key="type" value="type" list={this.accesses} checkedField="isAllowed" disabled={true}/>
              </FormItem>
              </div>);
        break;
    }
  }

  renderSeeDetail(){
    let comp;
    if(isSee){
      comp = <div>
        <FormItem label="审批人" name="approverName">
          <RestrictInput type="text" value={this.state.approverName} className="form-control common-form-input" disabled={true}  />
        </FormItem>
        <FormItem label="审批时间" name="approveTime" required>
          <RestrictInput type="text" value={this.state.approveTime} className="form-control common-form-input" disabled={true} />
        </FormItem>
      </div>;
    }
    return comp;
  }

  /**
   * 底部，是否有加到已有策略，只有hdfs才有
   * */
  renderFooter(){
    let resouceType;
    if(this.props.data.viewType=="telantSp" ||  this.state.resourceType=="hdfs")
    {
      resouceType= <div className="btn-group" style={{marginRight:'10px'}}>
        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
          同意 <span className="caret"/>
        </button>
        <ul className="dropdown-menu" role="menu">
          <li><a href="javascript:void(0);"  onClick={this.confirmAddPolicy.bind(this)}>新增策略</a></li>
          <li><a href="javascript:void(0);"  onClick={this.addToHivePolicy.bind(this)}>加到已有策略中</a></li>
        </ul>
      </div>
    }
    else {
      resouceType=  <button type="button" className="btn btn-primary"  data-toggle="dropdown"  onClick={that.handleSubmit.bind(this,1)}>
          同意
        </button>
    }
    if(!isSee){
      return  <div style={{display:'inline-block'}}>
                {resouceType}
                <button type="button" className="btn btn-sm btn-primary common-margin-right" style={{marginLeft: 10}}
                        onClick={that.handleSubmit.bind(this,2)}>驳回
                </button>
              </div>;
    }
    return null;
  }

  renderAddToHavePolicy(){
    return <AddToHavePolicy cancel={that.props.cancel} {...this.state}/>
  }

  renderSp(){
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
                <Select value={this.state.applyType} className="common-select" disabled={true} >
                  {AUTH_TYPE.map((item,index)=>{return (<Option key={item.value} value={item.value}>{item.name}</Option>)})}
                </Select>
              </FormItem>
              <FormItem label="申请时间" name="applyTime" required>
                <RestrictInput type="text" value={this.state.applyTime} className="form-control common-form-input"
                               disabled={true}
                />
              </FormItem>
              <FormItem label="策略名称" name="policyName">
                <RestrictInput type="text" value={this.state.policyName} className="form-control common-form-input"
                               disabled={this.state.dataType != 'hdfs'}
                />
              </FormItem>
              {this.renderByDataType()}

              <FormItem label="申请理由" name="applyReason">
                <RestrictTextarea value={this.state.applyReason} className="form-control common-textarea"
                                  disabled={true}/>
              </FormItem>
              {this.renderSeeDetail()}
              <FormItem label="审批意见" name="approveOpition">
                <RestrictTextarea value={this.state.approveOpition} className="form-control common-textarea"
                                  onChange={this.handleChange.bind(this,"approveOpition")}/>
              </FormItem>
            </Form>
            <div style={{marginLeft:'120px'}}>
              {this.renderFooter()}
              <button type="button" className="btn btn-sm btn-default" onClick={this.props.cancel}>取消</button>
            </div>
          </EditPanel>
          {/*弹出框*/}
          <ConfirmAddPolicy ref="confirmModal" {...this.state}  handleSubmit={that.handleSubmit.bind(this,1)}/>
        </div>
    );
  }

  render() {
    that = this;
    let comp;
    if(this.viewModel == SP_FORM_DATA_AUTH){
      comp = this.renderSp();
    }else if (this.viewModel == ADD_TO_HAVE_POLICY){
      comp = this.renderAddToHavePolicy();
    }

    return (<div> {comp}  </div>)
  }
}

export default AuthoritySPData;

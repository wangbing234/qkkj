import React from 'react'
import message from 'CommonComponent/component/bdosmessage'
import BaseInfo from './steps/BaseInfo.jsx'
import FunctionAuthority from './common/FunctionAuthority.jsx'
import ResourceAuthority from './common/ResourceAuthority.jsx'
import DataAuthority from './common/DataAuthority.jsx'
import { Steps, Step } from 'bfd-ui/lib/Steps'
import AjaxReq from '../model/AjaxReq'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import EventName from 'EventName'

const steps = [{title: "租户基本信息"}, {title: "指定所有者"}, {title: "授权"}];
let that;
let breadArr = [{
  text: '租户管理',
  url:''//如果不需要跳转url可以为空或不写url
},{
  text: '新增租户',
  url:''
}];
class EditPage extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    this.state = {currentStep: 0,roleId:'',tenantId:''};
  }

  handleSubmit() {
    let isSuccess;
    switch (this.state.currentStep) {
      case 0:
        isSuccess = this.refs.baseInfo.validate();//测试注掉
        if(isSuccess){//验证通过，保存信息
          isSuccess = this.saveBaseInfo();
        }
        //this.next();
        break;
      case 1:
        isSuccess = true;
        this.refs.functionAuthority.handleSubmit();
        break;
      case 2:
        isSuccess = true;
        this.refs.dataAuthority.handleSubmit();
        break;
      case 3:
        isSuccess = true;
        break;
    }

  }

  next(step=null){
    let value = (step!=null?step:this.state.currentStep+1) ;
    switch(value){
      case 2:
        this.setState({
          currentStep: value
        });
        break;
      case 3:
        break;
    }
    if (value == 4) {
      //value = 0;
      this.props.cancel();
    }
    this.setState({
      currentStep: value
    })
  }

  saveBaseInfo(){
    let data = this.refs.baseInfo.getFormData();
    AjaxReq.addTenantBaseInfo(data,(result)=>{
      message.success("新增租户成功");
      that.setState({roleId:result.roleId,tenantId:result.tenantId});
      //发送事件
      //EventEmitter.dispatch(EventName.ADD_TENANT);
      that.next();
    });
  }

  handleStepClick(index, title) {
    /*console.log("step:", index, title);
    that.next(index);*/
  }

  componentDidMount() {

  }

  renderStepContent() {
    let comp;
    switch (this.state.currentStep) {
      case 0:
        comp = <BaseInfo ref="baseInfo"/>;
        break;
      case 1:
        comp = <div style={{width:'900px',marginLeft:'200px'}}>
          <FunctionAuthority ref="functionAuthority" roleId={this.state.roleId} next={this.next.bind(this)}/>
        </div>;
        break;
      /*case 2:
        comp = <ResourceAuthority ref="resourceAuthority"/>;
        break;*/
      case 2:
        comp = <DataAuthority ref="dataAuthority" roleId={this.state.roleId} tenantId={this.state.tenantId} cancel={this.props.cancel}/>;
        break;
    }
    return comp;
  }

  render() {
    that = this;
    let leftWidth;
    let comp = this.renderStepContent();
    switch(this.state.currentStep){
      case 0:
        leftWidth = '272px';
        break;
      case 1:
        leftWidth = '220px';
        break;
      case 2:
        leftWidth = '272px';
        break;
    }

    return (<div>
      <div>
        <EditPanel history={this.props.history} breadCrumbList={breadArr} onChange={this.props.cancel}>
          <div style={{width:'900', height:50,margin:'40px auto 40px auto'}}>{/*marginTop:40,marginBottom:40*/}
            <Steps current={this.state.currentStep} onStepClick={this.handleStepClick}>
              <Step title="租户基本信息"/>
              <Step title="功能授权"/>
              {/*<Step title="资源授权"/>*/}
              <Step title="数据授权"/>
            </Steps>
          </div>
          <div style={{marginTop:'15px',marginBottom:'20px'}}>
            {comp}
          </div>

          <button type="button" style={{marginLeft:leftWidth,marginRight:'10px'}} className="btn btn-sm btn-primary" onClick={this.handleSubmit.bind(this)}>提交</button>
          <button type="button" className="btn btn-sm btn-default" onClick={this.props.cancel}>取消</button>
        </EditPanel>
      </div>
    </div>)
  }
}

module.exports = EditPage;

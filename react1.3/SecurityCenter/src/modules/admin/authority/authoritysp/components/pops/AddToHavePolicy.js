/***************************************************
 * 时间: 2016/7/20 11:05
 * 作者: lijun.feng
 * 说明: hdfs审批表单-添加到已有策略
 ***************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'
import FormFooter from 'CommonComponent/component/formfooter'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import AdminEnum from 'AdminEnum'
import AdminUtils from 'AdminUtils'
import EditHdfsPolicy from './EditHdfsPolicy'
import AjaxReq from '../../../model/AjaxReq'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import AdminHdfsForm from '../../../datapolicy/components/hdfsTable'
import TelentHdfsForm from '../../../../../owner/authority/datapolicy/components/hdfsTable'
import TelentHbaseTable from '../../../../../owner/authority/datapolicy/components/hbaseTable'
import TelentHiveTable from '../../../../../owner/authority/datapolicy/components/hiveTable'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import message from 'CommonComponent/component/bdosmessage'

let breadArr = [{
  text: '用户管理',
  url: ''//如果不需要跳转url可以为空或不写url
}, {
  text: '创建用户',
  url: ''
}];
let that;
let data = {
  "totalList": [
    {
      "policyName": 'hive-slfsf',
      "fileCatalog": 'tag1'
    }, {
      "policyName": 'hive-faf',
      "fileCatalog": 'tag2'
    }],
  "currentPage": 1,
  "totalPageNum": 2
};
class AddToHavePolicy extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
    this.selectList=[];
  }

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
  }


  componentDidMount() {

  }

  search() {

  }

  editUI() {
    this.refs.editHdfsPolicyModal.open();
  }


    /**
     * 提交
     * @param e
     */
  handleSubmit(e) {
    if (e) {
      e.preventDefault()
    }
    let policyIds=this.getSelectIds(this.refs.dataFormValue.getSelectList());
      if(policyIds && policyIds.length!=0)
      {
        let parmas={applyId:this.props.id,status:1,approveOpition:this.props.applyOpinion,policyIds:policyIds.join(",")}
        AjaxReq.addHasPolicyToThis(parmas,(data)=>{
          that.props.cancel(true);
        })
      }
  }

  /**
   * 获取选中的id
   * @param item
   * @returns {*}
     */
  getSelectIds(item)
  {
    let stringArray= CommonUtil.getStringArrayByObjectArray(item,"id")
    if(stringArray.length==0)
    {
      message.danger("请选择列表！");
    }
    return stringArray;
  }


  /**
   * 通过当前审批页面或对于策略页面
   * @returns {*}
     */
  getFormByDataType()
  {
    let _resourceType=this.props.resourceType;
    let applyerNameForm=<div>申请人：{this.props.applyerName}</div>;
    if(this.props.viewType=="telantSp")//租户
    {
      if(_resourceType=="hdfs"){
        return <TelentHdfsForm ref="dataFormValue" viewType="telantSp" applyerNameForm={applyerNameForm}/>
      }
      else  if(_resourceType=="hive"){
        return <TelentHiveTable ref="dataFormValue" viewType="telantSp" applyerNameForm={applyerNameForm}/>
      }
      else  if(_resourceType=="hbase"){
        return <TelentHbaseTable ref="dataFormValue" viewType="telantSp" applyerNameForm={applyerNameForm}/>
      }
    }//超级管理员的，权限审批
    else if(_resourceType=="hdfs"){
        return <AdminHdfsForm  ref="dataFormValue" cancel={this.cancleHandler} viewType="adminSp" applyerNameForm={applyerNameForm} resources={["path"]}/>
     }
    return null;
  }


  render() {
    that = this;
    let formByDataType=this.getFormByDataType();
    return ( <div className="module-container">
          {formByDataType}
                    <div style={{marginTop:'10px'}}>
                      选择策略将申请人加入到所选策略中
                    </div>
                    <div style={{marginLeft:'120px',marginTop:'25px',marginBottom:'15px'}}>
                      <button type="button" className="btn btn-sm btn-primary common-margin-right"
                              onClick={that.handleSubmit.bind(this)}>提交
                      </button>
                      <button type="button" className="btn btn-sm btn-default" onClick={this.props.cancel}>返回</button>
                    </div>
                    <EditHdfsPolicy ref="editHdfsPolicyModal"/>
              </div>
    );
  }
}

export default AddToHavePolicy;

import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import message from 'CommonComponent/component/bdosmessage'
import IconButton from 'CommonComponent/component/iconbutton'
import AuthButton from 'CommonComponent/component/authbutton'
import SeeTenant from 'SeeTenant'
import SeeUser from 'SeeUser'
import SeeRole from 'SeeRole'
import RestrictInput from 'CommonComponent/component/restrictinput'
import AdminEnum from 'AdminEnum'
import AjaxReq from '../../model/AjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import CommonModalWin from 'CommonModalWin'
import SeeAll from 'SeeAll'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTableCache from 'bfd-ui/lib/DataTableCache'
import HdfsFormContent from './form/hdfsFormContent'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
var that;

class Hdfs extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
    this.selectList=[];
    this.page = 1;
    this.state = {
      tenantId:''
    }
  }

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
  }


  componentDidMount() {
    this.search();
  }

  componentWillUnmount(){
    that = null;
    if(this.listAjax){
      this.listAjax.abort();
      this.listAjax = null;
    }
  }

  /**查询**/
  search() {
    let that = this;
    var parms = {
      policyName: $.trim(this.state.policyName),
      resourceType: "hdfs",
      tenantId:this.state.tenantId,
      currentPage: this.page,
      pageSize: AdminEnum.PAGE_SIZE
    };
    this.listAjax = AjaxReq.queryPolicy(parms, (data)=> {
      if(that){
        that.fiterData(data.data);
      }
    });
  }

  fiterData(item) {
    item.totalList.map((item, index)=> {
      item = AdminAuthorityStateTranfer.jsonTOState(item)
    });
    that.setState({data: item});
  }

  /**新增策略**/
  addPolicy() {
    this.props.addForm();
  }

  /**column 编辑策略**/
  editUI(data) {
    if(that.props.viewType=="adminSp")
    {
      that.refs._modal.setState({data:data,...{resources:["path"]}});
      that.refs._modal.refs._modal.open();
    }
    else {
      that.props.editForm('hdfs',AdminEnum.EDIT_UI,data);
    }

  }

  /**column 查看策略**/
  seeUI(data) {
    that.props.editForm('hdfs',AdminEnum.SEE_UI,data);
  }

  /**删除策略**/
  del(data) {
    let configMsg = '确定删除这条策略吗';
    if (data.tenantId && data.tenantId.length > 0) {
      configMsg = '此策略已授权租户，如果删除权限将不可用，是否确定删除?'
    }
    confirm(configMsg, () => {
      let params = {id: data.id};
      AjaxReq.deletePolicy(params, (data)=> {
        message.success('删除成功');
        that.search();
      });
    })
  }

  /**column 查看租户**/
  seeTenantUI(data) {
    //弹出查看用户界面
    that.refs.seeTenantModal.setData(data);
    that.refs.seeTenantModal.open();
  }

  /**保存后，刷新列表数据**/
  getList() {
    this.search();
  }

  onPageChange(page){
    this.page = page;
    this.search();
  }

  seeMoreModal(text,title){
    this.setState({title:title});
    this.refs.seeAllModal.setData(text);
    this.refs.seeAllModal.open();
  }

  getColumns(flag) {
    let that=this;
    let columnArray= [
      {
        title: '策略名称',
        key: 'policyName',
        width:'280px',
        render(text, record) {
          return <a href="javascript:void(0);" onClick={that.seeUI.bind(that,record)}>{text}</a>;
        }
      }, {
        title: '文件目录',
        key: 'path',
        render:(text,record)=>{
          let dString=record.path?record.path.join(" , "):"";
          return  <TextOverflow>
            <div style={{maxWidth:'200px'}}>{dString}</div>
          </TextOverflow>;
        }
      }, {
        title: '租户',
        key: 'tenantName',
        render(text, record) {
          return (
            <AuthButton renderType="a" onClick={that.seeTenantUI.bind(that,text)} title="查看租户">查看租户</AuthButton>);
        }
      }, {
        title: '创建时间',
        key: 'createTime',
        render:(text)=>{
          let date = text?new Date(text).format("yyyy-MM-dd hh:mm:ss"):'';
          return <span>{date}</span>
        }
      }, {
        title: '变更时间',
        key: 'updateTime',
        render:(text)=>{
          let date = text?new Date(text).format("yyyy-MM-dd hh:mm:ss"):'';
          return <span>{date}</span>
        }
      },
      {
        title: '操作',
        key: 'operation',
        render(record, text)
        {
          let delePolicyForm;
          //权限审批
          if(that.props.viewType!="adminSp")
          {
            delePolicyForm= <AuthButton renderType="a" onClick={that.del.bind(that,record)} title="删除">删除</AuthButton>
          }
          return ( <div>
                    <AuthButton renderType="a" onClick={that.editUI.bind(that,record)} title="编辑">编辑</AuthButton>
                    {delePolicyForm}
                  </div>);
        }
      }
    ];

    if(flag)
    {
      columnArray.splice(columnArray.length-1,1);
    }

    return columnArray;
  }

  /**
   * 表格数据修改
   * @param value
   * @param item
   * @param key
   */
  /*复选框change 处理*/
  handleCheckboxSelect(selectItems) {
    this.selectList = selectItems;
    this.setState();
  }

  getSelectList(){
    return this.selectList;
  }


  render() {
    that = this;
    let tenantArr = this.props.tenantArr;
    if(!this.props.tenantArr){
      tenantArr = [];
    }
    let addPolicyForm;
    //权限审批
    if(this.props.viewType=="adminSp")
    {
      addPolicyForm= this.props.applyerNameForm;
    }
    else{
      addPolicyForm= <IconButton
          data-code="" renderType="icon"
          type="plus-square" onClick={this.addPolicy.bind(this)}>新增策略</IconButton>
    }


    //审批模块增加策略
    let dataTable;
    if(this.props.viewType=="adminSp") {
      dataTable= <DataTableCache data={this.state.data} column={this.getColumns(true)}  onCheckboxSelect={this.handleCheckboxSelect.bind(this)} howRow={AdminEnum.PAGE_SIZE} onPageChange={that.onPageChange.bind(this)} showPage="true"/>
    }
    else {
      dataTable= <DataTable data={this.state.data} column={this.getColumns()}  howRow={AdminEnum.PAGE_SIZE} onPageChange={that.onPageChange.bind(this)} showPage="true"/>
    }

    return (<div className="module-container authoirty-list" style={{paddingBottom:'20px'}}>
      <div className="module-search" style={{height:'30px'}}>

        <div className="common-left">
             {addPolicyForm}
        </div>
        <div className="common-right">
            <button type="button" className="btn btn-sm btn-primary common-right"
                    onClick={this.onPageChange.bind(this,1)}>查询
            </button>
            <RestrictInput type="text" className="form-control common-input common-right"
                           placeholder="请输入策略名称"
                           onChange={this.handleChange.bind(this,"policyName")}/>
          <Select value={this.state.tenantId} className="common-margin-right common-right"
                  onChange={this.handleChange.bind(that,'tenantId')} searchable>
            {
              tenantArr.map(function (item, index) {
                return (<Option key={index}
                                value={item.id}>{item.tenantName}</Option>);
              })
            }
          </Select>
        </div>
      </div>
      <div className="module-table">
        {dataTable}
      </div>
      {/*超级管理员弹窗*/}
      <SeeTenant ref="seeTenantModal"/>
      <CommonModalWin title="策略基本信息" ref="_modal"  Child={HdfsFormContent} className="modalWidth800"/>
      <SeeAll ref="seeAllModal" title={this.state.title}/>
    </div>)
  }
}

export default Hdfs;

/***************************************************
 * 时间: 2016/7/20 10:54
 * 作者: lijun.feng
 * 说明: 权限审批入口文件
 ***************************************************/
import React from 'react'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import DataTable from 'bfd-ui/lib/DataTable'
import AuthButton from 'CommonComponent/component/authbutton'
import AuthorityForm from './AuthoritySPForm'
import RestrictInput from 'CommonComponent/component/restrictinput'
import AdminEnum from 'AdminEnum'
import AjaxReq from '../../model/AjaxReq'

let that;
let record;
//审批状态（0待审批，1 同意，2 驳回）
const statusArr = [
  {id: '', name: '全部状态'},
  {id: '0', name: '待审批'},
  {id: '1', name: '已同意'},
  {id: '2', name: '已拒绝'}];

//申请类型 （0 功能权限1数据权限 2 资源权限）

class AuthoritySpMain extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    this.typeArr = [ {id: '', name: '全部类型'},{id: AdminEnum.FUNC_AUTHORITY, name: '功能权限'},{id: AdminEnum.DATA_AUTHORITY, name: '数据权限'}];
    //租户的需要
    if(this.props.viewType=="telantSp"){
      this.typeArr.push({id:AdminEnum.RESOURCE_AUTHORITY, name: '资源权限'});
    }

    this.page = 1;
    this.state = {
      data: {totalList: []},
      pageStatus: AdminEnum.LIST_UI,//当前页面的切换状态
      status: '0',
      applyType: '',
      applyName: ''
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

  /**
   * 此回调方法是点击切换分页时触发，可以在此方法体内发送Ajax请求数据，来替代组件的url属性
   * @param page 当前页
   */
  onPageChange(page) {
    this.page = page;
    this.search();
  }

  cancelHandler(flag,e) {
    this.setState({pageStatus: AdminEnum.LIST_UI});
    if(flag==true)
      this.search();
  }


  authoritySp(data) {
    let that=this;
    AjaxReq.approvalInfo({applyId:data.id},(data)=>{
      record = $.extend(true,{},data.data);
      that.setState({pageStatus: AdminEnum.APPROVAL_UI});
    })
  }

  search() {
    let that = this;
    let params = {
      status: this.state.status,
      applyType: this.state.applyType,
      applyName: this.state.applyName,
      currentPage: this.page,
      pageSize: AdminEnum.PAGE_SIZE
    };

    params.approveType=(this.props.viewType=="telantSp"?0:1);
    this.listAjax = AjaxReq.getApprovalList(params, (result)=> {
      if(that){
        this.setState({data: result.data});
      }
    })
  }

  getColumns() {
    let columnArray=[
      {
        title: '申请名称',
        key: 'applyName',
        render(item, record) {
          return <a href="javascript:void(0);" onClick={that.authoritySp.bind(that,record)}>{item}</a>;
        }
      }, {
        title: '申请类型',
        key: 'applyType',
        render(item, record){
          //申请类型 （0 功能权限1数据权限 2 资源权限）
          let typeName;
          switch (item) {
            case 0:
              typeName = '功能权限';
              break;
            case 1:
              typeName = '数据权限';
              break;
            case 2:
              typeName = '资源权限';
              break;
          }
          return typeName;
        }
      }, {
        title: '申请人',
        key: 'applyerName'
      }, {
        title: '申请时间',
        key: 'applyTime'
      }, {
        title: '审批人',
        key: 'approverName',
        render:((text)=>{
          return text?text:'--------'
        })
      }, {
        title: '审批时间',
        key: 'approveTime',
        render:((text)=>{
          return text?text:'--------'
        })
      },
      {
        title: '状态',
        key: 'status',
        render(item, record){
          var color = '#0099FF';
          var mapText = "待审批";
          switch (item) {
            case 0:
              color = '#0099FF';
              mapText = "待审批";
              break;
            case 1:
              color = '#006600';
              mapText = "已同意";
              break;
            case 2:
              color = '#FF0000';
              mapText = "已拒绝";
              break;
          }
          return (<span style={{color:color}}>{mapText}</span>);
        }
      }, {
        title: '操作',
        key: 'operation',
        render(record, item) {
          let oper;
          let status = record.status;
          let renderTypeStr;
          let typeStr;
          let imgSource;
          //根据状态判断审批或查看详情，如果待审批
          if (status == 0) {
            oper = '审批';
            renderTypeStr = 'img';
            imgSource = './src/common/img/approval.png';
          } else if (status == 1 || status == 2) {
            oper = '查看详情';
            renderTypeStr = 'icon';
            typeStr = 'eye';
          }
          return (<span>
            <AuthButton renderType="a" onClick={that.authoritySp.bind(that,record)} title={oper}>{oper}</AuthButton>
      </span>);
        }
      }];

    if(this.props.viewType!="telantSp"){
      columnArray.splice(3, 0, {
        title: '租户',
        key: 'tenantName'
      });
    }

    return columnArray;
  }

  /**
   * 渲染表格
   * @returns {XML}
   */
  renderTable() {
    return (
      <div className="module-container">
        <div className="module-search" style={{height:'30px'}}>
          <div className="common-right">
            <Select value={this.state.status} className="common-margin-right"
                    onChange={this.handleChange.bind(this,'status')}>
              {
                statusArr.map(function (item, index) {
                  return (<Option key={index}
                                  value={item.id}>{item.name}</Option>);
                })
              }
            </Select>
            <Select value={this.state.applyType} className="common-margin-right"
                    onChange={this.handleChange.bind(this,'applyType')}>
              {
                this.typeArr.map(function (item, index) {
                  return (<Option key={index}
                                  value={item.id}>{item.name}</Option>);
                })
              }
            </Select>
            <button type="button" className="btn btn-sm btn-primary common-right" onClick={this.onPageChange.bind(this,1)}>查询
            </button>
            <RestrictInput type="text" className="form-control common-input common-right"
                           onChange={this.handleChange.bind(this,"applyName")}/>

          </div>
        </div>
        <div className="module-table">
          <DataTable data={this.state.data} column={this.getColumns()} onPageChange={this.onPageChange.bind(this)} showPage="true"
                     howRow={AdminEnum.PAGE_SIZE}/>
        </div>
      </div>
    );
  }

  /**
   * 渲染表单
   * @returns {XML}
   */
  renderForm() {
    return (  <AuthorityForm ref="form" viewType={this.props.viewType} data={record} cancel={this.cancelHandler.bind(this)}/> );
  }

  render() {
    that = this;
    let comp;
    if (this.state.pageStatus == AdminEnum.LIST_UI) {
      comp = this.renderTable();

    } else if (this.state.pageStatus == AdminEnum.APPROVAL_UI) {
      comp = this.renderForm();
    }
    return (<div className="authority-sp"> {comp}  </div>)
  }
}

export default AuthoritySpMain;

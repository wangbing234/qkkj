import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable';
import RestrictInput from 'CommonComponent/component/restrictinput'
import AuthButton from 'CommonComponent/component/authbutton'
import AdminEnum from 'AdminEnum'
import AjaxReq from '../../model/AjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import SeeAll from 'SeeAll'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import { Select, Option } from 'bfd-ui/lib/Select2'

var that;

class Hive extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
    this.page = 1;
    this.state = {
      viewType: AdminEnum.LIST_UI,
      policyName: '',
      tenantId:'',
      data: {totalList: []}
    };
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

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
  }

  /**查询**/
  search() {
    let that = this;
    var parms = {
      policyName: $.trim(this.state.policyName),
      resourceType: "hive",
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
    let that = this;
    item.totalList.map((item, index)=> {
      item = AdminAuthorityStateTranfer.jsonTOState(item)
    });
    that.setState({data: item});
  }

  /**
   * 表单取消事件
   */
  cancleHandler() {
    that.setState({viewType: AdminEnum.LIST_UI})
  }

  /**保存后，刷新列表数据**/
  getList() {
    this.setState({viewType: AdminEnum.LIST_UI});
    this.search();
  }


  /**
   * 超级管理员
   * **/
  editClick(data) {
    that && that.props.editForm('hive',AdminEnum.EDIT_UI,data);
  }

  seeUI(data) {
    that && that.props.editForm('hive',AdminEnum.SEE_UI,data);
  }


  onPageChange(page){
    this.page = page;
    this.search();
  }

  getColumns() {
    return [
      {
        title: '策略名称',
        key: 'policyName',
        width:'280px',
        render(text, record) {
          return <a href="javascript:void(0);" style={{maxWidth:'280px'}} onClick={that.seeUI.bind(that,record)}>{text}</a>;
        }
      }, {
        title: '数据库名',
        key: 'database',
        width:'220px',
        render:(text,record)=>{
          let dString=record.database?record.database.join(" , "):"";
          return  <TextOverflow>
            <div style={{maxWidth:'220px'}}>{dString}</div>
          </TextOverflow>;
        }
      }, {
        title: '租户',
        key: 'tenantName',
        render:(text,record)=>{
          let dString=record.tenantName?record.tenantName.join(" , "):"";
          return  <TextOverflow>
            <div style={{maxWidth:'300px'}}>{dString}</div>
          </TextOverflow>;
        }
      }, {
        title: '创建时间',
        key: 'createTime',
        width:'160px',
        render:(text)=>{
          let date = text?new Date(text).format("yyyy-MM-dd hh:mm:ss"):'';
          return <span>{date}</span>
        }
      }, {
        title: '变更时间',
        key: 'updateTime',
        width:'160px',
        render:(text)=>{
          let date = text?new Date(text).format("yyyy-MM-dd hh:mm:ss"):'';
          return <span>{date}</span>
        }
      }, {
        title: '操作',
        key: 'operation',
        render(record, text) {
          return (<span>
            <AuthButton renderType="a" onClick={that.editClick.bind(that,record)} title="编辑">编辑</AuthButton>
      </span>);
        }
      }];
  }

  seeMoreModal(text,title){
    this.setState({title:title});
    this.refs.seeAllModal.setData(text);
    this.refs.seeAllModal.open();
  }


  render() {
    that = this;
    let column = this.getColumns();
    let tenantArr = this.props.tenantArr;
    if(!this.props.tenantArr){
      tenantArr = [];
    }
    return (<div className="module-container" style={{paddingBottom:'20px'}}>
      <div className="module-search" style={{height:'30px'}}>
        <button type="button" className="btn btn-sm btn-primary common-right" onClick={this.onPageChange.bind(this,1)}>查询
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
      <div className="module-table">
        <DataTable data={this.state.data} column={column} howRow={AdminEnum.PAGE_SIZE} onPageChange={that.onPageChange.bind(this)} showPage="true"/>
      </div>
      <SeeAll ref="seeAllModal" title={this.state.title}/>
    </div>);
  }
}

export default Hive;

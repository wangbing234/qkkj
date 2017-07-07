import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import RestrictInput from 'CommonComponent/component/restrictinput'
import AuthButton from 'CommonComponent/component/authbutton'
import SeeTenant from 'SeeTenant'
import AdminEnum from 'AdminEnum'
import AjaxReq from '../../model/AjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import SeeAll from 'SeeAll'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
let that;

class HBase extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
    this.page = 1;
    this.state = {
      tenantId:'',
      data: {totalList: []}
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
      resourceType: "hbase",
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

  editUI(data) {
    that.props.editForm('hbase',AdminEnum.EDIT_UI,data);
  }

  seeUI(data) {
    that.props.editForm('hbase',AdminEnum.SEE_UI,data);
  }

  /**保存后，刷新列表数据**/
  getList(){
    this.search();
  }

  seeAllDb(text){
    this.refs.modal.setData(text);
     this.refs.modal.open();
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
          return <a href="javascript:void(0);" onClick={that.seeUI.bind(that,record)}>{text}</a>;
        }
      }, {
        title: '命名空间',
        key: 'database',
        render:(text,record)=>{
          let dString=record.database?record.database.join(" , "):"";
          return  <TextOverflow>
            <div style={{maxWidth:'280px'}}>{dString}</div>
          </TextOverflow>;
        }
      }, {
        title: '租户',
        key: 'tenantName',
        render:(text,record)=>{
          let dString=record.tenantName?record.tenantName.join(" , "):"";
          return  <TextOverflow>
            <div style={{maxWidth:'280px'}}>{dString}</div>
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
        title: '更新时间',
        key: 'updateTime',
        width:'160px',
        render:(text)=>{
          let date = text?new Date(text).format("yyyy-MM-dd hh:mm:ss"):'';
          return <span>{date}</span>
        }
      }, {
        title: '操作',
        key: 'operation',
        render(record,text) {
          return (<span>
            <AuthButton renderType="a" onClick={that.editUI.bind(that,record)} title="编辑">编辑</AuthButton>
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
          <div className="module-table">
            <DataTable data={this.state.data} column={column} onPageChange={that.onPageChange.bind(this)}
                       showPage="true" howRow={AdminEnum.PAGE_SIZE}/>
          </div>
      <SeeAll ref="seeAllModal" title={this.state.title}/>
    </div>)
  }

}

export default HBase;


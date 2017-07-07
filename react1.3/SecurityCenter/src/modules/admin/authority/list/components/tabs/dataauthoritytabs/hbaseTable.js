import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import SeeHbasePolicy from './pops/SeeHbasePolicy'
import RestrictInput from 'CommonComponent/component/restrictinput'
import AdminEnum from 'AdminEnum'
import AjaxReq from '../../../../model/AjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import SeeAll from 'SeeAll'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import { Select ,Option} from 'bfd-ui/lib/Select2'

let that;

class Hive extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
    this.page = 1;
    this.formData = {};
    this.state = {
      policyName:'',
      tenantId:'',
      resourceType:'hbase',
      data:{totalList:[]}
    }
  }

  edit() {
    this.props.itemClick();
  }

  del() {
    confirm('此策略已授权用户/角色，如果删除权限将不可用，是否确定删除？', () => {
      console.log('删除操作');
    })
  }

  authority() {
    this.props.itemClick();
  }

  seePolicy(data) {
    //调用数据策略里的
    this.formData = data;
    this.setState({});
    this.refs.modal.open();
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
      resourceType: this.state.resourceType,
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

  onPageChange(page){
    this.page = page;
    this.search();
  }

  getColumns() {
    return [
      {
        title: '策略名称',
        key: 'policyName',
        width:"370px",
        maxWidth:"370px",
        render(text, record){
          return <TextOverflow>
            <a style={{display:"block",maxWidth:'98%'}} href="javascript:void(0)" onClick={that.seePolicy.bind(that,record)}>{text}</a>
          </TextOverflow>
        }
      }, /*{
        title: 'hbase源',
        key: 'resourceName'
      },*/ {
        title: '命名空间',
        key: 'database',
        maxWidth:"340px",
        render:(text,record)=>{
          let dString=record.database?record.database.join(" , "):"";
          return  <TextOverflow>
            <div style={{maxWidth:'98%'}}>{dString}</div>
          </TextOverflow>;
        }
      }, {
        title: '租户',
        key: 'tenantName',
        maxWidth:'400px',
        render(text, record) {
          let dString=record.database?record.database.join(" , "):"";
          return  <TextOverflow>
            <div style={{maxWidth:'98%'}}>{dString}</div>
          </TextOverflow>;
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
    return (<div style={{paddingBottom:'20px'}}>
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
        <DataTable data={this.state.data} column={column} onPageChange={that.onPageChange.bind(this)}
                   showPage="true" howRow={AdminEnum.PAGE_SIZE}/>
      </div>
      <SeeHbasePolicy ref="modal" data={this.formData}/>
      <SeeAll ref="seeAllModal" title={this.state.title}/>
    </div>)
  }
}

export default Hive;


import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import SeeHivePolicy from './pops/SeeHivePolicy'
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
      data:{totalList:[]}
    }
  }

  edit() {
    this.props.itemClick();
  }

  del() {
    confirm('此策略已授权，如果删除会导致不可用，是否确认删除？', () => {
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
    item.totalList.map((item, index)=> {
      item = AdminAuthorityStateTranfer.jsonTOState(item)
    });
    that.setState({data: item});
  }

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
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
            <a style={{display:"block",maxWidth:'98%'}}
               href="javascript:void(0)" onClick={that.seePolicy.bind(that,record)}>{text}</a>
          </TextOverflow>
        }
      }, /*{
        title: 'hive源',
        key: 'resourceName'
      }, */{
        title: '数据库',
        maxWidth:"340px",
        key: 'database',
        render:(text,record)=>{
          let dString=record.database?record.database.join(" , "):"";
          return  <TextOverflow>
            <div style={{maxWidth:'98%'}}>{dString}</div>
          </TextOverflow>;
        }
      }, {
        title: '租户',
        maxWidth:'400px',
        key: 'tenantName',
        render(text, record) {
          let dString=record.tenantName?record.tenantName.join(" , "):"";
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
        <button type="button" className="btn btn-sm btn-primary common-right" onClick={this.onPageChange.bind(this,1)}>查询</button>
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
        <DataTable data={this.state.data} column={column} howRow={AdminEnum.PAGE_SIZE} showPage="true" onPageChange={that.onPageChange.bind(this)}/>
      </div>
      <SeeHivePolicy ref="modal" data={this.formData}/>
    </div>)
  }
}

export default Hive;

import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
//import {BreadCrumb} from 'CommonComponent'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import RestrictInput from 'CommonComponent/component/restrictinput'
//import AjaxReq from '../../../../model/AjaxReq'

let that;
const resultArr = ['成功', '拒绝'];
//SELECT、updata、user
const askTypeArr = ['SELECT','updata','user'];

const data = {
  "totalList": [{
    "userName": "zhangsan",
    "result": "success",
    "loginType": "userName/pwd",
    "ip": "192.187.12.98",
    "userAgent": "Mozilla",
    "loginTime": "2016-2-24"
  }]

};
class LoginAudit extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    this.state = {
      date: '',
      userName: '',
      ipName: '',
      result: '',
      askType: ''
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
  }

  search() {
    /*this.listAjax = AjaxReq.queryPolicy(parms, (data)=> {
     that.fiterData(data.data);
     });*/
  }

  getColumns() {
    return [{
      title: '用户',
      key: 'userName'
    }, {
      title: '结果',
      key: 'result'
    }, {
      title: '登录类型',
      key: 'loginType'
    }, {
      title: 'IP',
      key: 'ip'
    }, {
      title: 'User Agent',
      key: 'userAgent'
    }, {
      title: '登录时间',
      key: 'loginTime',
      render:(text)=>{
        let date = text?new Date(text).format("yyyy-MM-dd hh:mm:ss"):'';
        return <span>{date}</span>
      }
    }];
  }


  render() {
    that = this;
    let column = this.getColumns();
    return (
      <div className="module-container user-audit">
        <div className="module-search" style={{height:'30px'}}>
          <div className="module-search-right">
            <button className="btn btn-sm btn-primary common-right" onClick={that.search.bind(that)}>查询</button>
            <DateRange onSelect={that.handleChange.bind(that,'timeRange')} className="common-margin-right common-right" />
            <RestrictInput type="text" value={that.state.userName} className="form-control common-input common-right"
                           onChange={that.handleChange.bind(that,"userName")} placeholder="请输入ip"/>
            <Select value={that.state.tenant} className="common-margin-right common-right"
                    onChange={that.handleChange.bind(that,'tenant')} placeholder="选择结果">
              {
                resultArr.map(function (item, index) {
                  return (<Option key={index}
                                  value={item}>{item}</Option>);
                })
              }
            </Select>
            <Select value={that.state.tenant} className="common-margin-right common-right"
                    onChange={that.handleChange.bind(that,'tenant')} placeholder="请选择登录类型">
              {
                resultArr.map(function (item, index) {
                  return (<Option key={index}
                                  value={item}>{item}</Option>);
                })
              }
            </Select>
            <RestrictInput type="text" value={that.state.userName} className="form-control common-input common-right"
                           onChange={that.handleChange.bind(that,"userName")} placeholder="请输入用户关键字"/>
          </div>
        </div>

        <div className="module-table">
          <DataTable data={data} column={column}/>
        </div>
      </div>
    );
  }
}

export default LoginAudit;
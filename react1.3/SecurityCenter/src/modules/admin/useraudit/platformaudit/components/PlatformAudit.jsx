import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
//import {BreadCrumb} from 'CommonComponent'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import RestrictInput from 'CommonComponent/component/restrictinput'
import AjaxReq from '../../model/AjaxReq'
import AdminEnum from 'AdminEnum'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

let that;
const resultArr = [{name:'全部结果',value:''},{name:'成功',value:'1'},{name:'失败',value:'0'}];
//SELECT、updata、user
class PlatformAudit extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    this.page = 1;
    this.state = {
      data:{totalList:[]},
      startTime:(new Date()).getTime()-24*60*60*1000,
      endTime:(new Date()).getTime()+24*60*60*1000
    }
  }

  handleChange(dataField, evt,end) {
    let value = evt && evt.target ? evt.target.value : evt;
    if(dataField == 'timeRange') {
      this.setState({startTime: evt, endTime: end})
    } else {
      this.setState({[dataField]: value});
    }
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

  search() {
    let that = this;
    let startTimeStr = this.state.startTime?new Date(this.state.startTime).format("yyyy-MM-dd hh:mm:ss"):'';
    let endTimeStr = this.state.endTime?new Date(this.state.endTime).format("yyyy-MM-dd hh:mm:ss"):'';
    let params = {startTime:startTimeStr,endTime:endTimeStr,requestUser:$.trim(this.state.requestUser),application:$.trim(this.state.application),accessResult:this.state.accessResult,requestIp:$.trim(this.state.requestIp),requestPath:$.trim(this.state.requestPath),currentPage:this.page,pageSize:AdminEnum.PAGE_SIZE};
    this.listAjax = AjaxReq.getPlateformAuditList(params, (result)=> {
      if(that){
        that.setState({data:result.data});
      }
    });
  }

  /**
   * 此回调方法是点击切换分页时触发，可以在此方法体内发送Ajax请求数据，来替代组件的url属性
   * @param page 当前页
   */
  onPageChange(page) {
    this.page = page;
    this.search();
  }

  getColumns() {
    return [ {
      title: '模块名称',
      key: 'application',
      width:'90px'
    },{
      title: '用户',
      width:'80px',
      key: 'requestUser'
    },  {
      title: '操作',
      key: 'requestPath',
      width:'200px',
      render:(text)=>{
        return   <TextOverflow>
          <div href="javascript:void(0)" style={{width:'200px'}}>
            {text}
          </div>
        </TextOverflow>

      }
    },{
      title: '操作的详细信息',
      key: 'requestContent',
      width:'200px',
      render:(text)=>{
        return   <TextOverflow>
          <div href="javascript:void(0)" style={{width:'200px'}}>
            {text}
          </div>
        </TextOverflow>

      }
    }, {
      title: '事件时间',
      width:'150px',
      key: 'eventTime',
      render:(text)=>{
        let date = text?(new Date(text).format("yyyy-MM-dd hh:mm:ss")):'';
        return <span>{date}</span>
      }
    },{
      title: '请求http头信息',
      key: 'requestUa',
      width:'140px',
      render:(text)=>{
        return   <TextOverflow>
          <div href="javascript:void(0)" style={{width:'140px'}}>
            {text}
          </div>
        </TextOverflow>

      }
    },{
      title: '客户端IP',
      width:'80px',
      key: 'requestIp'
    }, {
      title: '结果',
      key: 'accessResult',
      width:'50px',
      render:(text)=>{
        let result;
        let color;
        if(text == 0){
          result = '失败';
          color = 'red-color';
        }else {
          result = '成功';
          color = 'green-color';
        }
        return <span className={color}>{result}</span>
      }
    }];
  }


  render() {
    that = this;
    let column = this.getColumns();
    return (
      <div className="module-container user-audit" style={{minWidth:'1060px'}}>
        <div className="module-search" style={{height:'30px',marginLeft: -50}}>
          <div className="module-search-right">
            <button className="btn btn-sm btn-primary common-right" onClick={that.onPageChange.bind(this,1)}>查询</button>
            <DateRange onSelect={that.handleChange.bind(that,'timeRange')} start={this.state.startTime} end={this.state.endTime}
                       className="common-margin-right" />
            <Select value={that.state.accessResult} style={{width:'135px'}} className="common-margin-right common-right"
                    onChange={that.handleChange.bind(that,'accessResult')} placeholder="选择结果">
              {
                resultArr.map(function (item, index) {
                  return (<Option key={index}
                                  value={item.value}>{item.name}</Option>);
                })
              }
            </Select>
            <RestrictInput type="text" value={that.state.requestPath} className="form-control common-input common-right"
                           style={{width:'120px'}} placeholder="请输入操作"
                           onChange={that.handleChange.bind(that,"requestPath")} />
            <RestrictInput type="text" value={that.state.requestIp} className="form-control common-input common-right"
                           style={{width:'120px'}} placeholder="请输入ip"
                           onChange={that.handleChange.bind(that,"requestIp")} />
            <RestrictInput type="text" value={that.state.application} className="form-control common-input common-right"
                           style={{width:'120px'}} placeholder="请输入模块名称"
                           onChange={that.handleChange.bind(that,"application")} />
            <RestrictInput type="text" value={that.state.requestUser} style={{width:'100px'}} className="form-control common-input common-right"
                           onChange={that.handleChange.bind(that,"requestUser")} placeholder="请输入用户"/>
          </div>
        </div>

        <div className="module-table">
          <DataTable data={this.state.data} column={column} showPage="true" onPageChange={this.onPageChange.bind(this)}
                     howRow={AdminEnum.PAGE_SIZE}/>
        </div>
      </div>
    );
  }
}

export default PlatformAudit;
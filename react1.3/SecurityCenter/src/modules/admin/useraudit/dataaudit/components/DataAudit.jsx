import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import RestrictInput from 'CommonComponent/component/restrictinput'
import AjaxReq from '../../model/AjaxReq'
import AdminEnum from 'AdminEnum'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

let that;
const resourceTypeArr = [{name:'全部资源类型',value:''},{name:'Hive',value:'3'},{name:'HBase',value:'2'},{name:'HDFS',value:'1'}];
const resultArr = [{name:'全部结果',value:''},{name:'成功',value:'1'},{name:'失败',value:'0'}];
//SELECT、updata、user
class DataAudit extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    this.page = 1;
    this.state = {
      repoType:'',
      accessResult:'',
      data:{totalList:[]},
      startTime:(new Date()).getTime()-24*60*60*1000,
      endTime:(new Date()).getTime()+24*60*60*1000
    }
  }

  handleChange(dataField, evt,end) {
    let value = evt && evt.target ? evt.target.value : evt;
    if(dataField == 'timeRange'){
      this.setState({startTime:evt,endTime:end})
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
    let params = {startTime:startTimeStr,endTime:endTimeStr,requestUser:$.trim(this.state.requestUser),accessResult:this.state.accessResult,clientIp:$.trim(this.state.clientIp),repoType:this.state.repoType,currentPage:this.page,pageSize:AdminEnum.PAGE_SIZE};
    this.listAjax = AjaxReq.getDataAuditList(params, (result)=> {
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
    return [{
      title: '资源类型',
      key: 'repoType',
      width:'100px',
      render:(text)=>{
        let result;
        switch (text){
          case 1:
            result = 'HDFS';
            break;
          case 2:
            result = 'HBase';
            break;
          case 3:
            result = 'Hive';
            break;
        }
        return <span>{result}</span>
      }
    }, {
      title: '资源名称',
      key: 'resourcePath',
      render:(text)=>{
        return   <TextOverflow>
          <div style={{maxWidth:300}}>
            {text}
          </div>
        </TextOverflow>

      }
    },{
      title: '用户',
      key: 'requestUser',
      width:'100px'
    }, {
      title: '事件时间',
      key: 'eventTime',
      width:'200px',
      render:(text)=>{
        let date = text ? (new Date(text).format("yyyy-MM-dd hh:mm:ss")) : "";
        return <span>{date}</span>
      }
    },  {
      title: '访问类型',
      key: 'accessType'
    }, {
      title: '客户端IP',
      width:'140px',
      key: 'clientIp'
    }, {
      title: '结果',
      key: 'accessResult',
      width:'60px',
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
    return (
      <div className="module-container user-audit" style={{minWidth:'1060px'}}>
        <div className="module-search" style={{height:'30px'}}>
          <div className="module-search-right">
            <button className="btn btn-sm btn-primary common-right" onClick={that.onPageChange.bind(that,1)}>查询</button>

            <Select value={that.state.repoType} className="common-margin-right common-right" style={{width:'135px'}}
                    onChange={that.handleChange.bind(that,'repoType')} placeholder="全部资源类型">
              {
                resourceTypeArr.map(function (item, index) {
                  return (<Option key={index}
                                  value={item.value}>{item.name}</Option>);
                })
              }
            </Select>
            <Select value={that.state.accessResult} className="common-margin-right common-right" style={{width:'135px'}}
                    onChange={that.handleChange.bind(that,'accessResult')} placeholder="全部结果">
              {
                resultArr.map(function (item, index) {
                  return (<Option key={index}
                                  value={item.value}>{item.name}</Option>);
                })
              }
            </Select>
            <RestrictInput type="text" value={that.state.requestUser} className="form-control common-input common-right" style={{width:'130px'}}
                           onChange={that.handleChange.bind(that,"requestUser")} placeholder="请输入用户"/>
            <RestrictInput type="text" value={that.state.clientIp} className="form-control common-input common-right" style={{width:'130px'}}
                           onChange={that.handleChange.bind(that,"clientIp")} placeholder="请输入ip"/>

            <DateRange onSelect={that.handleChange.bind(that,'timeRange')} start={this.state.startTime} end={this.state.endTime} className="common-margin-right" />
          </div>
        </div>

        <div className="module-table">
          <DataTable data={this.state.data} column={this.getColumns()} showPage="true" onPageChange={this.onPageChange.bind(this)} howRow={AdminEnum.PAGE_SIZE}/>
        </div>
      </div>
    );
  }
}

export default DataAudit;
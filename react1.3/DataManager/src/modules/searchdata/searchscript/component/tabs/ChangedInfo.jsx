import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import { FormItem } from 'bfd-ui/lib/Form'
import {LabelSelect} from 'CommonComponent'
import AjaxReq from './../../model/AjaxReq'
import message from 'CommonComponent/component/bdosmessage'

const columns = [
    {title:'序号',key:'index'},
    {title:'变更时间',key:'createTime'},
    {title:'版本号',key:'version'},
    {title:'变更人',key:'createUser'},
    {title:'描述',key:'remark'}
];

class ChangedInfo extends React.Component{

  constructor(prop) {
    super(prop);
    this.state = {
        data:{
            "totalList":[
                //{
                //    "id":55,
                //    "taskCode":"0e50189c429e4c38af8623cdd6f160cf",
                //    "version":16,
                //    "remark":"",
                //    "createUser":"",
                //    "createTime":"2016-07-14 14:15:42"
                //}
            ]
        },
        endDate : (new Date()).getTime(),
        startDate : (new Date()).getTime()-7*24*60*60*1000,
        currentPage: 1, //默认页码
        pageSize: 10 // 默认1页数量
    }
  }

    componentDidMount() {
        this.getData();
        //this.setState({data:arr,nullLine: this.fillNullLine()});
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }

    getData() {
        let that = this;
        //todo:start end???接口有待调试
        let start = new Date(Number(this.state.startDate)).format("yyyy-MM-dd");
        let end = new Date(Number(this.state.endDate)).format("yyyy-MM-dd");
        let param = {taskCode:this.props.taskCode, pageNum:this.state.currentPage, limit:this.state.pageSize, startTime: start, endTime: end}
        AjaxReq.getTaskHistory(param, function(result) {
          if(!that.isUnmount){
            if( result.data){
              that.setState({
                data: result.data
              });
            } else if(!result.data){
              that.setState({
                data: {totalList:[]}
              });
            }
          }
        });
    }

    //点击DataRange
    handleSelect(start, end){
        let that = this;
        if(start && end){
            if ((end - start) > 30*24*60*60*1000){
                message.danger("开始时间、结束时间区间间隔不能超过30天");
            } else {
                message.close();
                //查询后台数据
                this.setState({currentPage:1, pageSize:10, startDate:start, endDate: end},
                    function () {
                        that.getData();
                    });
            }
        }
    }

    //换页
    onPageChange(page){
        let that = this;
        that.setState({
                currentPage: page
            }, // 刷新当前state状态下的列表
            function(){that.getData()});
    }

    render(){
        return (
            <div className="search-tableInfo-ddl-div">
                <DateRange start={this.state.startDate} end={this.state.endDate} onSelect={this.handleSelect.bind(this)} />
                <div className="module-table">
                    <DataTable style={{marginTop:20}} column={columns} data={this.state.data} showPage="true" onPageChange={this.onPageChange.bind(this)}   howRow={10}/>
                </div>
            </div>);
    }
}

export default ChangedInfo;
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import message from 'CommonComponent/component/bdosmessage'
import AjaxReq from '../../model/AjaxReq'
import ENUM from 'ENUM'

let data = {totalList:[
    {id:"1",changedTime:"2016-02-12",version:"v1.3",changer:"user1",desc:""},
    {id:"2",changedTime:"2016-02-15",version:"v1.3",changer:"user1",desc:""},
    {id:"3",changedTime:"2016-02-17",version:"v1.3",changer:"user2",desc:""},
    {id:"4",changedTime:"2016-02-19",version:"v1.3",changer:"user1",desc:""}],
    "currentPage": 1,
    "totalPageNum": 2
};
let that;
class ChangedInfo extends React.Component{

    constructor(prop) {
        super(prop);
        that = this;
        this.currentPage = 1;
        this.state = {}
    }

    handleSelect(start,end) {
        if(start && end){
            if ((end - start) > 10*24*60*60*1000){
                message.danger("开始时间、结束时间区间间隔不能超过10天");
            } else {
                message.close();
                //查询后台数据
            }
        }
    }

    componentDidMount(){
        this.search();
    }

    /**查询**/
    search(){
        let param = {projectCode: that.props.projectCode,processKey:that.props.processKey, currentPage:that.currentPage,pageSize:ENUM.PAGE_SIZE};
        AjaxReq.getWfChangeInfo(param, (result) => {
            if(that){
                that.setState({data: result})
            }

        })
    }

    getColumn(){
        return [
            {title:'序号',key:"id"},
            {title:'变更时间',key:"updateTime",
                render(text){
                    if(text){
                        return new Date(text).format("yyyy-MM-dd hh:mm:ss");
                    }
                    return '';
                }},
            {title:'版本号',key:"version"},
            {title:'变更人',key:"updateUser"},
            {title:'描述',key:"remark"}];
    }

    render(){
        that = this;
        let column = this.getColumn();
        return (<div>
            <DateRange start={this.state.start} onSelect={this.handleSelect} />
            <div className="module-table">
                <DataTable column={column} data={this.state.data}  onPageChange={this.onPageChange} showPage="true" howRow={10}/>
            </div>

        </div>);
    }
}

export default ChangedInfo;
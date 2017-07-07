import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { DateRange } from 'bfd-ui/lib/DatePicker'

let that;
let columns;
let data = {totalList:[
    {id:"1",startTime:"2016-02-12",endTime:"2016-02-22",runningTime:"40"},
    {id:"2",startTime:"2016-02-15",endTime:"2016-02-24",runningTime:"20"},
    {id:"3",startTime:"2016-02-17",endTime:"2016-02-25",runningTime:"50"},
    {id:"4",startTime:"2016-02-19",endTime:"2016-02-26",runningTime:"60"}],
    "currentPage": 1,
    "totalPageNum": 2
};

class RunningInfo extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {}
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }

    fillColumns(){
       columns = [
            {title:'序号',key:"id"},
            {title:'开始时间',key:"startTime"},
            {title:'结束时间',key:"endTime"},
            {title:that.props.runningTime_title,key:"runningTime"}]
    }

    handleSelect(){
        this.setState({ start })
    }

    onPageChange(){}

    render(){
        that = this;
        this.fillColumns();
        return (<div>
            <DateRange start={this.state.start} onSelect={this.handleSelect} />
            <DataTable column={columns} data={data}  onPageChange={this.onPageChange} showPage="true" howRow={10}/>
        </div>);
    }
}

export default RunningInfo;
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { DateRange } from 'bfd-ui/lib/DatePicker'
const columns = [
    {title:'序号',key:"id"},
    {title:'变更时间',key:"changedTime"},
    {title:'版本号',key:"version"},
    {title:'变更人',key:"changer"},
    {title:'描述',key:"desc"}];

let data = {totalList:[
    {id:"1",changedTime:"2016-02-12",version:"v1.3",changer:"user1",desc:""},
    {id:"2",changedTime:"2016-02-15",version:"v1.3",changer:"user1",desc:""},
    {id:"3",changedTime:"2016-02-17",version:"v1.3",changer:"user2",desc:""},
    {id:"4",changedTime:"2016-02-19",version:"v1.3",changer:"user1",desc:""}],
    "currentPage": 1,
    "totalPageNum": 2
};
class ScriptChangedInfo extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {}
    }

    handleSelect(){
        this.setState({ start })
    }

    onPageChange(){}

    render(){
        return (<div>
            <DateRange start={this.state.start} onSelect={this.handleSelect} />
            <DataTable column={columns} data={data}  onPageChange={this.onPageChange} showPage="true" howRow={10}/>
        </div>);
    }
}

export default ScriptChangedInfo;
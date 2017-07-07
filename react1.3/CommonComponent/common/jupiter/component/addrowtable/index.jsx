import React from "react"
import DataTable from 'bfd-ui/lib/DataTable'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import ValidateTable from '../validatetable'
import './style.less'

let that;
class AddRowTable extends React.Component{
    constructor(props){
        super(props);
        that = this;
        this.showPage = false;
        this.state = {data:this.props.data};
    }
    addItem() {
        let item = {};
        var data = this.state.data;
        data.totalList.push(item);
        data.totalPageNum++;
        if(data.totalList.length > this.refs.theTable.props.howRow){
            this.showPage = "true";
        }
        this.setState({data: data});
        if(this.props.addItem){
            this.props.addItem();
        }
    }

    validate(){
        return this.refs.theTable.validate();
    }

    componentWillReceiveProps(nextProps){
        this.setState({data:nextProps.data})
    }
    rowClick(item,e){
        console.log("item----",item);
    }
    
    render(){
        let reqSpan=null;
        if(!this.props.notRequire)
            reqSpan= <span className="red">*请至少添加一条配置</span>;
        let addBtn = !this.props.isCanAdd?<button type="button" className="btn btn-sm btn-primary"
                                                 onClick={this.addItem.bind(this)}>添加</button>:null;
        return (<div className="rowTable module-edit-container">
            <ValidateTable ref="theTable" data={this.state.data}
                           column={this.props.column} showPage={this.showPage}
                           howRow={this.props.howRow?this.props.howRow:10}></ValidateTable>
            <div className="row center" style={{marginLeft:10}}>
                {addBtn}
                {reqSpan}
            </div>
        </div>);
    }
}
export default AddRowTable
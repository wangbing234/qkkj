import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import AjaxReq from './../../model/AjaxReq'

const columns = [
    {title:'序号',key:'index'},
    {title:'分区名',key:'part_name'},
    {title:'文件数',key:'numFiles'},
    {title:'存储量',key:'totalSize'},
    {title:'记录数',key:'numRows'}];

class PartitionInfo extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            data: {
                totalList: []
            },
            currentPage: 1,
            pageSize: 10
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }

    // 获取表格数据
    getData() {
        let that = this;
        let param = {database:this.props.table.database, tableName:this.props.table['table_name'], limit:this.state.pageSize, pageNum:this.state.currentPage}
        AjaxReq.getPatitionsInfo(param, function(result){
            if(!that.isUnmount){
                if( result.data) {
                    that.setState({
                        data: result.data
                    });
                } else if(!result.data) {
                    that.setState({
                        data: {totalList:[]}
                    });
                }
            }
        });
    }

    onPageChange(){
        let that = this;
        that.setState({
                currentPage: page
            }, // 刷新当前state状态下的列表
            function(){that.getData()});
    }

    render(){
        return (
            <div className="module-table">
                <DataTable column={columns} data={this.state.data}  onPageChange={this.onPageChange.bind(this)} showPage="true" howRow={10}/>
            </div>);
    }
}

export default PartitionInfo;
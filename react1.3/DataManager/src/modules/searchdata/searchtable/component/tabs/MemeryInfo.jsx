import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import AjaxReq from './../../model/AjaxReq'

const columns = [
    {title:'物理存储量',key:'total_storage_str'},
    {title:'今日新增量',key:'append_storage_str'},
    {title:'是否分区表',key:'part_table'},
    {title:'DDL最后变更时间',key:'ddl_time_str'},
    {title:'数据最后变更时间',key:'data_time_str'}];

class MemeryInfo extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            data: {
                totalList: []
            }
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
        let param = {project_code:'', data_base:this.props.table.database, table:this.props.table['table_name']};
        AjaxReq.getStoreInfo(param, function(result){
            if(!that.isUnmount){
                if ( result.data){
                    that.setState({
                        data: {
                            totalList : [result.data]
                        }
                    });
                } else if(!result.data){
                    that.setState({
                        data: {
                            totalList : []
                        }
                    });
                }
            }
        });
    }

    onPageChange(){}

    render(){
        return (<div className="module-table"><DataTable column={columns} data={this.state.data}  onPageChange={this.onPageChange} showPage="false" howRow={10}/></div>);
    }
}

export default MemeryInfo;
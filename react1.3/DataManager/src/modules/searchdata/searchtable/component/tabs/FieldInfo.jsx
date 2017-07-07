/****************************************
 * 时间: 16/8/8
 * 作者: liujingjing
 * 说明: 字段信息
 *
 ****************************************/
import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import AjaxReq from './../../model/AjaxReq'
import TextOverflow from 'bfd-ui/lib/TextOverflow'


class FieldInfo extends React.Component{

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
        this.getData(this.props.table?this.props.table.database:'', this.props.table?this.props.table['table_name']:'');
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }

    /*componentWillReceiveProps(nextProps){
        this.getData(nextProps.table?nextProps.table.database:'', nextProps.table?nextProps.table['table_name']:'')
    }*/

    // 获取表格数据
    getData(database, tableName) {
        let that = this;
        let param = {database, tableName, limit:this.state.pageSize, pageNum:this.state.currentPage};
        AjaxReq.getColumnsInfo(param, function(result){
            if(!that.isUnmount){
                if(result.data){
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

    // 换页
    onPageChange(page){
        let that = this;
        that.setState({
                currentPage: page
            }, // 刷新当前state状态下的列表
            function(){that.getData(this.props.table?this.props.table.database:'', this.props.table?this.props.table['table_name']:'')});
    }

    getColumns(){
        return [
            {title:'序号',key:'index'},
            {title:'字段名',key:'column_name'},
            {title:'字段类型',key:'type_name'},
            {title:'是否分区字段',key:'isPartition'},
            {title:'描述',key:'comment',
                render:((text,record)=>{
                    return <TextOverflow>
                        <div style={{maxWidth:'200px'}}>{text}</div>
                    </TextOverflow>;
                })
            }
        ];
    }

    render(){
        return(
            <div>
                <div className="module-table">
                <DataTable column={this.getColumns()} data={this.state.data} showPage="true"  onPageChange={this.onPageChange.bind(this)}  howRow={10}/>
                </div>
            </div>);
    }
}

export default FieldInfo;
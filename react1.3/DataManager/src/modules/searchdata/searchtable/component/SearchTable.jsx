import React from 'react'
import SearchTableList from './SearchTableList'
import LeftTree from './LeftTree.jsx'
import TableInfoForm from './TableInfoForm';
import EventName from 'EventName'
import AjaxReq from './../model/AjaxReq'
import confirm from 'bfd-ui/lib/confirm'
import '../css/style.less'

let that;

class SearchTable extends React.Component{

    constructor(prop) {
        super(prop);
        this.isReturnFirst = false;
        this.state = {
            projectCode:''
        }
    }

    //接收首页跳转过来数据
    componentWillReceiveProps(nextProps){
        this.externalSeeTable(nextProps.location.state);
    }

    componentDidMount(){
        this.externalSeeTable(this.props.location.state);
    }

    componentWillUnmount(){
        this.isUnmount = true;
    }

    /**数据全景跳转过来查看表详情**/
    externalSeeTable(data){
        if(data){
            if(data.table){
                this.refs.searchList.openTableDetail(data.table);// 点击首页表名称链接
            }else if(data.projectCode){//点击项目Top5进入，查询某个项目下的表
                this.setState({projectCode:data.projectCode},()=>{
                    this.refs.searchList.projectCode = data.projectCode;
                    this.refs.searchList.externalSeeTable();
                    this.refs.searchTbTree.getLeftTreeList();
                })

            }
        }
    }

    render(){
        that = this;
        return (<div className="module-container search-data">
            <div>
                <div style={{width:'20%',float:'left', position:'relative'}}>
                    <LeftTree ref="searchTbTree" projectCode={this.state.projectCode}/>
                </div>
                <div style={{width:'78%',float:'left'}}>
                    <SearchTableList ref="searchList"/>
                </div>
            </div>
        </div>);
    }
}

export default SearchTable;
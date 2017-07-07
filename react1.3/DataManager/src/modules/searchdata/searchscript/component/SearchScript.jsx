import React from 'react';
import EventName from 'EventName'

import SearchScriptList from './SearchScriptList'
import ScriptInfoForm from './ScriptInfoForm';
import LeftTree from './LeftTree.jsx'

let that;

class SearchScript extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            projectCode: '',
            ...prop.location.state,//获取location后的参数,projectCode
            taskCode: ''
        };
    }

    componentDidMount(){
        this.externalSeeScript(this.props.location.state);
    }

    // 首页点击项目top5表一列/首页左侧导航进入更新状态
    componentWillReceiveProps(nextProps){
        this.externalSeeScript(nextProps.location.state);
    }

    /**数据全景跳转过来查看脚本详情**/
    externalSeeScript(data){
        if(data){
            if(data.taskCode) {// 点击首页表名称链接
                this.refs.searchScript.openScriptDetail(data.taskCode);
            }else if (data.projectCode){//点击项目Top5进入，查询某个项目下的脚本
                this.setState({projectCode:data.projectCode},()=>{
                    this.refs.searchScript.externalSeeScript(data.projectCode);
                })
            }
        }
    }

    render(){
        that = this;
        return (<div className="module-container search-data">
            <div>
                <div style={{width:'20%',float:'left', position:'relative'}}>
                    <LeftTree projectCode={this.state.projectCode}/>
                </div>
                <div style={{width:'78%',float:'left'}}>
                    <SearchScriptList ref="searchScript"/>
                </div>
            </div>
        </div>);
    }
}

export default SearchScript;
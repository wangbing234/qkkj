/****************************************
 * 时间: 16/7/28
 * 作者: liujingjing
 * 说明: 查找脚本左侧树
 *
 ****************************************/

import React from "react";
import Tree from 'bfd-ui/lib/Tree'
import AjaxReq from './../model/AjaxReq'
import EventName from 'EventName'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

let that;

class LeftTree extends React.Component {

    constructor(prop) {
        super(prop);
        this.state = {
            data: [{name: '正在加载数据'}]
        };
        // 监听切换租户事件
        EventEmitter.subscribe(EventName.CHANGE_TENANT, this.getLeftTreeList.bind(this));
    }

    componentDidMount() {
        this.getLeftTreeList();
    }

    componentWillUnmount() {
        this.isUnmount = true;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.data!=nextState.data;
    }

    // 从接口获取树列表数据
    getLeftTreeList() {
        let that = this;
        let param = {tenant: window.currentTenant};
        AjaxReq.getLeftTreeList(param, function(result) {
            if(!that.isUnmount){
                if ( result.data) {
                    EventEmitter.dispatch(EventName.UPDATE_SEARCH_SCRIPT_INFO,that.props.projectCode);
                    [result.data].map(function(item){
                        item.name = item.name + "(" + item.count + ")";
                        if (item.children){
                            item.children.map(function(item){
                                if(item.project_code == that.props.projectCode){
                                    item.active = true;
                                }
                                item.name = item.project_code + "(" + item.script_count + ")";
                            });
                        }
                    });
                    // 更新state
                    that.setState({
                        data: [result.data]
                    });
                } else if (!result.data){
                    // 更新state
                    that.setState({
                        data: [{name: '暂无数据'}]
                    });
                }
            }
        })
    }

    handleActive(data) {
        if(data[0].name!='暂无数据'&&data[0].name!='正在加载数据'){
            let projectCode = '';
            switch (data.length) {
                case 1:// All
                    break;
                case 2:// 项目级传项目代码
                    projectCode = data[1].project_code;
                    break;
            }
            /*if(this.props.hasOwnProperty('onClick')){
                this.props.onClick(projectCode);
            }*/

            EventEmitter.dispatch(EventName.UPDATE_SEARCH_SCRIPT_INFO, projectCode);
        }
    }

    /**
     * 树节点渲染
     * @param item
     */
    treeRender(item) {
        return <TextOverflow><div>{item.name}</div></TextOverflow>;
    }

    render() {
        that = this;
        return (
          <div className="tree-border">
              <Tree data={this.state.data} render={this.treeRender.bind(this)} onActive={this.handleActive.bind(this)} getIcon={data => data.children ? 'folder-open' : 'folder'}/>
          </div>
        );
    }
}

export default LeftTree;

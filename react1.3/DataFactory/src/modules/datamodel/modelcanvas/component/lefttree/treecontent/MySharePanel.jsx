/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:公用扇形tab
 *
 ***************************************************/

import Tree from 'bfd-ui/lib/Tree/Tree'
import React from 'react';
import Ajax from '../../../ajax/AjaxReq'
import CommonTree from '../../../../common/CommonTree';
class TreePanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {shareTables:[]};
    }

    componentDidMount()
    {
        this.loadInterval = setInterval(this.getShareTables(),100);
    }

    componentWillUnmount() {
        this.loadInterval && clearInterval( this.loadInterval );
        this.loadInterval = false;
    }

    /**
     * 点击标题
     */
    titleClick()
    {

    }


    /**
     * 树节点渲染
     * @param item
     */
    treeRender(item) {
        let propData = {
            "data-code": item.code,
            "data-tabletype": item.tableType,
            "data-type": item.type,
            "data-tablename": item.tableName,
            "data-database": item.database,
            "data-projectcode": item.projectCode
        }
        if (item.type==4) {
            return <span draggable className="dragNodeTree4" {...propData}
                         onDragStart={CommonTree.handleDragStart.bind(this,item,3)}>
                    {item.name}</span>;
        }
        //叶子节点,脚本树
        else {
            return <span>{item.name}</span>
        }
    }

    /**
     * 查询第几页
     * @param page 第几页
     */
    getShareTables() {
        let that=this;
        Ajax.getShareTables((data) => {
            if(that.loadInterval){
                that.setState({shareTables:data});
            }
        })
    }




    /**
     * 增加修改方法，不然组件报错
     * @param data
     */
    onChangeHander(data)
    {
        console.log("tree chanage",data);
    }

    /**
     * 双击脚本树打开脚本
     * @param evt
     */
    onDoubleClickHander(evt) {
        let dataType = evt.target.getAttribute('data-type');
        //如果是双击表
        if (dataType == "4") {
            let tableName = evt.target.getAttribute('data-tablename');
            let code = evt.target.getAttribute('data-code');
            let tableType = evt.target.getAttribute('data-type');
            let database = evt.target.getAttribute('data-database');
            let projectcode = evt.target.getAttribute('data-projectcode');
            this.props.owner.viewTableByCode({iconType:3,code,tableName,projectCode,database,tableType:tableType||1});
        }
    }

    render(){
        let tprops = {...this.props};
        let buttonBar;
        if(tprops.buttonString)
        {
            buttonBar= (<a style={{float:"right",marginRight:"10px"}} href="javascript:void(0);"
                           onClick={this.titleClick.bind(this)}>{tprops.buttonString}</a>);
        }

        return (<div className="panel-body dragTree" id={this.props.format} style={{height:"100%"}}>
                    <Tree data={this.state.shareTables}
                          getIcon={CommonTree.getIcon}
                          onDoubleClick={this.onDoubleClickHander.bind(this)}
                          render={this.treeRender.bind(this)}
                          onChange={this.onChangeHander.bind(this)}/>
                </div>
        );
    }
}

export default TreePanel
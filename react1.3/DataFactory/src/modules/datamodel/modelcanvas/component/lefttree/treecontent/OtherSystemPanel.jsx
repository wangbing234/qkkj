/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:公用扇形tab
 *
 ***************************************************/

import Tree from 'bfd-ui/lib/Tree/Tree'
import React from 'react';
import Ajax from '../../../ajax/AjaxReq'
import JavaDircory from '../../../common/JavaDircory'
import CommonTree from '../../../../common/CommonTree';
import CommonUtil from 'CommonComponent/utils/CommonUtil'
class TreePanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }


    componentDidMount()
    {
        this.loadInterval = setTimeout(this.listImportTree(),100);
        EventEmitter.remove(JavaDircory.LIST_IMPORTTREE_QUERY);
        EventEmitter.subscribe(JavaDircory.LIST_IMPORTTREE_QUERY,this.listImportTree.bind(this))
    }

    componentWillUnmount() {
        //this.loadInterval && clearInterval( this.loadInterval );
        //this.loadInterval = false;
    }

    /**
     * 点击标题
     */
    titleClick()
    {
        this.props.owner.refs.projectModelWin.refs._modal.open();
    }


    /**
     * 查询第几页
     * @param page 第几页
     */
    listImportTree(e) {
        let that = this;
        Ajax.listImportTree((data) => {
            CommonUtil.spreadTree(data);
                that.setState({importTree:data});
        })
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
            "data-tablecode": item.tableCode,
            "data-projectcode": item.projectCode
        }
        //脚本文件才可以拖拽
        if (item.type==4) {
            return <span draggable className="dragNodeTree4" {...propData}  onDragStart={CommonTree.handleDragStart.bind(this,item,2)}>
                    {item.name}</span>;
        }
        //叶子节点,脚本树
        else {
            return <span>{item.name}</span>
        }
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
            let tablecode = evt.target.getAttribute('data-tablecode');
            let tabletype = evt.target.getAttribute('data-tabletype');
            let code = evt.target.getAttribute('data-code');
            let projectCode = evt.target.getAttribute('data-projectcode');
            this.props.owner.viewTableByCode({iconType:2,code:tablecode,tableName,projectCode,tableType:dataType||1});
        }
    }


    /**
     * 增加修改方法，不然组件报错
     * @param data
     */
    onChangeHander(data)
    {
        console.log("tree chanage",data);
    }


    render(){
        let tprops = {...this.props};
        let buttonBar;
        if(tprops.buttonString)
        {
            buttonBar= (<a style={{float:"right",marginRight:"10px"}} href="javascript:void(0);"
                           onClick={this.titleClick.bind(this)}>{tprops.buttonString}</a>);
        }

        return (
                        <div className="panel-body dragTree" id={this.props.format} style={{height:"100%"}}>
                            <Tree data={this.state.importTree}
                                  render={this.treeRender.bind(this)}
                                  getIcon={CommonTree.getIcon}
                                  onDoubleClick={this.onDoubleClickHander.bind(this)}
                                  onChange={this.onChangeHander.bind(this)}/>
                        </div>
        );
    }
}

export default TreePanel
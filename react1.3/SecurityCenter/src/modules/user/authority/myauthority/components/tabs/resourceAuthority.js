/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:资源权限页面
 *
 ***************************************************/
import React from 'react'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import   Ajax from  "../../ajax/AjaxReq"
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import FunctionAndResourceForm from './FunctionAndResourceForm'
import {FormFooter} from 'CommonComponent'
import CommonDetailWin from 'CommonModalWin'
import TableTree from 'bfd-ui/lib/TableTree'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import update from 'react-update'
import get from 'lodash/get'
import message from 'CommonComponent/component/bdosmessage'
import ConstType  from '../../../utils/ConstType'
import TreeUtil from '../../../../../common/tree/TreeUtil'

let that;

class ResourceAuthority extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
        this.state = {visible: false,data:[]};
        this.update = update.bind(this);
        this.pathObject={};
        this.columns = [
            {
                title: "资源名称",
                key:"checked",
                render(item,path) {
                    let isHasAuthStatus=TreeUtil.getItemDisabled(item);
                    that.pathObject[item.id]=path;
                    return <Checkbox checked={item.checked || isHasAuthStatus} disabled={item.authStatus!=2 || that.props.viewType=="owner" || isHasAuthStatus} onChange={that.dataGridHandleChange.bind(that,item,this.key,path)}>{item.name}</Checkbox>
                }
            }, {
                title: "授权状态",
                key: 'state',
                render(text) {
                    var renderText = "";
                    switch (text.authStatus) {
                        case 0:
                            renderText = <span style={{color:'#BCBCBC'}}>已授权</span>;
                            break;
                        case 1:
                            renderText = <span style={{color:'#006600'}}>审批中</span>;
                            break;
                        case 2:
                            renderText = <span style={{color:'#000000'}}>未授权</span>;
                            break;
                        default:
                            renderText = <span style={{color:'#000000'}}>未授权</span>;
                            break;
                    }
                    if(text.children && text.children instanceof Array && text.children.length>0)
                        renderText = "- -";
                    return renderText;
                }
            }];

    }

    componentDidMount() {
        that.queryResourceTree();
    }

    /**
     * 处理申请
     */
    handlerApply() {
        let emPath=[];
        let cloneData = TreeUtil.getSelectTableData(this.state.data,this.pathObject);
        for (let obj of this.state.data) {
            if(obj.children && obj.children.length==0)
                emPath.push(obj.id);
        }
        if(this.props.viewType=="owner") //如果是租户
        {
            //只需要未授权的
            cloneData=cloneData.filter(item =>(item.authStatus==2))
        }
        else {//普通用户
            //排除已经授权的
            cloneData=cloneData.filter(item =>(item.authStatus!=0))
            cloneData=cloneData.filter(item =>((item.children && item.children.length>0) || emPath.indexOf(item.id)>=0))
        }

        if(cloneData && cloneData.length>0) {
            this.refs._modalHive.setState({applyType: 2, data: cloneData});
            this.refs._modalHive.refs._modal.open();
        }
        else {
            message.danger("请选择未授权的数据！");
        }
    }

    /**
     * 删除没用的数组
     * @param cloneData
     * @param parent
     * @returns {*}
     */
    deleteNoUseData(cloneData,parent)
    {
        if(parent)
        {
            parent.children=cloneData.filter(item => (item.checked && item.authStatus==2));
        }
        else {
            cloneData=cloneData.filter(item => (item.checked && item.authStatus==2))
        }
        for (let obj of cloneData) {
            if(obj.children && obj.children.length>0)
            {
                this.deleteNoUseData(obj.children,obj)
            }
        }
        return cloneData;
    }

    /**
     * 表格数据改变
     * @param item
     * @param key
     * @param e
     */
    dataGridHandleChange(item,key,path,e){
        item[key] = e.target.checked;
        this.handleSelect(this.state.data,item,path,e.target.checked);
        this.setState({});
    }

    handleSelect(data, item, path, checked) {
        // 所有子级节点是否选中
        this.updateChildren(item, ['data', ...path], checked);
        // 所有父级节点是否选中
        this.updateParent(data, ['data', ...path.slice(0, -2)], checked);
    }

    updateParent(data, path, checked) {
        if (path.length <= 1) return
        const parent = get(data, path.slice(1));
        checked = parent.children.filter(item =>(item.checked)).length >= 1
        data = this.update('set', [...path, 'checked'], checked)
        this.updateParent(data, path.slice(0, -2), checked)
    }

    updateChildren(item, path, checked) {
        if (!item || !item.children) return
        path = path = [...path, 'children']
        item.children.forEach((item, i) => {
            if (item.checked !== checked && item.authStatus==2) {
                this.update('set', [...path, i, 'checked'], checked)
            }
            this.updateChildren(item, [...path, i], checked)
        })
    }

    /**
     * 查询资源树
     */
    queryResourceTree() {
        if(this.props.viewType=="owner")
        {
            Ajax.viewTenantOwnerMyResourceTree(null,(data) => {
                that.setState({data: data.data});
            })
        }
        else {
            Ajax.viewMyResourceTree(null,(data) => {
                that.setState({data: data.data});
            })
        }

    }


    //提交申请
    submitApply(state) {
        let authApprove = {
                    applyName: state.applyName,
                    applyType: state.applyType,
                    details: JSON.stringify(state.data),
                    applyReason: state.applyReason,
                    approveType:this.props.viewType=="owner"?1:0
            }
        Ajax.applyAuth(authApprove, (data) => {
            EventEmitter.dispatch(ConstType.REFRESH_MY_APPLY);
            that.refs._modalHive.refs._modal.close();
            that.queryResourceTree();
        })
    }

    /**
     * 用户渲染
     * @returns {XML}
     */
    renderUser() {
        return (
            <div>
                 <div style={{marginTop:20}}>
                <button className="btn btn-primary" onClick={this.handlerApply.bind(this)}>
                    批量申请
                </button>
            </div>
                <CommonDetailWin title="资源权限-权限申请" ref="_modalHive" Child={FunctionAndResourceForm}  className="width700"
                                 submit={this.submitApply.bind(this)}/>
            </div>)
    }

    render() {
        let userView;
        if(CommonUtil.getCurrentUserType()==window.BFD.ENUM.UserType.USER){
            userView = this.renderUser();
        }
        return (
            <div className="module-container" style={{paddingBottom:'20px'}}>
                <div className="module-table">
                    <TableTree columns={this.columns} data={this.state.data}/>
                </div>
                {userView}
            </div>)
    }
}

export default ResourceAuthority;

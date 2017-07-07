/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:功能权限页面
 *
 ***************************************************/
import React from 'react'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import TableTree from 'bfd-ui/lib/TableTree'
import FunctionAndResourceForm from './FunctionAndResourceForm';
import {FormFooter} from 'CommonComponent'
import CommonModalWin from 'CommonModalWin'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import   Ajax from  "../../ajax/AjaxReq"
import message from 'CommonComponent/component/bdosmessage'
import update from 'react-update'
import get from 'lodash/get'
import TreeUtil from '../../../../../common/tree/TreeUtil'
import ConstType  from '../../../utils/ConstType'
let that;

class FunctionAuthority extends React.Component {
    constructor(prop) {
        super(prop);
        this.pathObject={};
        this.state = {
            visible: false,data:[]
        };
        this.update = update.bind(this);
        that = this;
        this.columns = [
            {
                title: "功能名称",
                key:"checked",
                render(item,path) {
                    that.pathObject[item.id]=path;
                    let isHasAuthStatus=TreeUtil.getItemDisabled(item);
                    return <Checkbox checked={item.checked || isHasAuthStatus} disabled={item.authStatus!=2 || isHasAuthStatus}
                                     onChange={that.dataGridHandleChange.bind(that,item,this.key,path)}>{item.name}</Checkbox>
                }
            }, {
                title: "授权状态",
                key:"authStatus",
                render(text) {
                    var renderText = "";
                    switch (text.authStatus) {
                        case 0:
                            renderText = <span style={{color:'#BCBCBC'}}>已授权</span>;
                            break;
                        case 1:
                            renderText = <span style={{color:'#006600'}}>待审批</span>;
                            break;
                        case 2:
                            renderText = <span style={{color:'#000000'}}>未授权</span>;
                            break;
                        default:
                            renderText = "- -";
                            break;
                    }
                    if(text.children && text.children instanceof Array && text.children.length>0)
                        renderText = "- -";
                    return renderText;
                }
            }];
    }

    componentDidMount() {
       this.initTreeNode();
    }

    /**
     * 初始化权限树
     */
    initTreeNode(){
        if(this.props.viewType=="owner")
        {
            that.viewTenantOwnerFunctionTree();
        }
        else{
            that.viewMyFunctionTree();
        }
    }

    /**
     * 查看租户功能树
     */
    viewTenantOwnerFunctionTree(){
        Ajax.viewTenantOwnerFunctionTree(null,(data) => {
            //let rData=data.data.totalList;
            let rData=data.data;
            rData.map((item,index)=>{
                item.name=item.name;
                item.checked= (item.authStatus==0||item.authStatus==1)
            });
            CommonUtil.spreadTree(rData);
            that.setState({data:rData});
        })
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
        checked = parent.children.filter(item => (item.checked)).length >= 1
        debugger
        data = this.update('set', [...path, 'checked'], checked)
        this.updateParent(data, path.slice(0, -2), checked)
    }

    updateChildren(item, path, checked) {
        if (!item || !item.children) return
        path = path = [...path, 'children']
        item.children.forEach((item, i) => {
            if (item.checked !== checked && item.authStatus==2 ) {
                this.update('set', [...path, i, 'checked'], checked)
            }
            this.updateChildren(item, [...path, i], checked)
        })
    }

    /**
     * 申请，新建策略
     */
    handlerApply() {
        let applyData = this.getTableData();
        if(applyData && applyData.length>0)
        {
            this.refs._modalHive.setState({applyType:0,data:applyData});
            this.refs._modalHive.refs._modal.open();
        }
        else {
            message.danger("请选择未授权的数据！");
        }
    }


    /**
     * 获取表数据
     */
    getTableData(){
        let emPath=[];
        let cloneData=TreeUtil.getSelectTableData(this.state.data,this.pathObject);
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
      return   cloneData;
    }





    //获取
    viewMyFunctionTree() {
        Ajax.viewMyFunctionTree(null,(data) => {
            CommonUtil.spreadTree(data.data);
            that.setState({data: data.data});
        })
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
            this.refs._modalHive.refs._modal.close();
            this.initTreeNode();
        })
    }



    render() {
        that=this;
        return (
            <div className="module-container" style={{paddingBottom:'20px'}}>
                <div className="module-table">
                    <TableTree columns={this.columns} data={this.state.data}/>
                </div>
                <div style={{marginTop:20}}>
                    <button className="btn btn-primary"
                            onClick={this.handlerApply.bind(this)}>批量申请
                    </button>
                </div>
                <CommonModalWin title="功能权限-权限申请" ref="_modalHive" className="width700" Child={FunctionAndResourceForm}
                                submit={this.submitApply.bind(this)}/>
            </div>)
    }
}

export default FunctionAuthority;

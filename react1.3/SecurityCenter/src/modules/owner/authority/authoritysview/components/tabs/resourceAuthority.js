/***************************************************
 * 时间: 2016/7/21 15:44
 * 作者: bing.wang
 * 说明: 资源权限页面
 *
 ***************************************************/
import React from 'react'
import SeeUser from 'SeeUser'
import SeeRole from 'SeeRole'
import DataTable from 'bfd-ui/lib/DataTable'
import Ajax from '../../ajax/AjaxReq'
import TableTree from 'bfd-ui/lib/TableTree'
import AuthButton from 'CommonComponent/component/authbutton'
import { SelectTree } from 'bfd-ui/lib/Tree'

class ResourceAuthority extends React.Component{
    constructor(prop){
        super(prop);
        this.state = {data:[]};
    }

    componentDidMount() {
        this.getDataByUrl();
    }

    /**
     * 查询租户资源树
     */
    getDataByUrl() {
        let that=this;
        Ajax.viewTenantOwnerResourceTree(null,(data) => {
            that.setState({data:data.data});
        });
    }

    /**
     * 查看用户
     */
    seeuser(){
       this.refs.usermodal.open();
    }

    /**
     * 查看角色
     */
    seerole(){
       this.refs.rolemodal.open();
    }

    /**
     * 查看用户
     * @param type
     * @param data
     */
    viewHander(type,data){
        if(type=="user")
        {
           /* this.refs.usermodal.open();
            this.refs.usermodal.setState({users:data.users});*/
            this.getUsers(data.id);
        }

        else{
           /* this.refs.rolemodal.open();
            this.refs.rolemodal.setState({roles:data.roles});*/
            this.getRoles(data.id);
        }
    }

    getRoles(id){
        let that = this;
        let param = {resourceId:id};
        Ajax.getRoles(param,(data) => {
            that.refs.rolemodal.open();
            that.refs.rolemodal.setData(data);
        });
    }

    getUsers(id){
        let that = this;
        let param = {resourceId:id};
        Ajax.getUsers(param,(data) => {
            that.refs.usermodal.open();
            that.refs.usermodal.setData(data);
        });
    }

    getColumn(){
        return [
            {
                title: "资源名称",
                key:"name"
            }, {
                title: "授权用户",
                key:"user",
                render:(record,text)=>{
                    let userForm="- -";
                    if(!record.children || record.children.length==0)
                    {
                        userForm=<AuthButton renderType="a" type="eye" onClick={this.viewHander.bind(this,"user",record)} title="查看用户">查看用户</AuthButton>
                    }
                    return  userForm;
                }
            },{
                title: "授权角色",
                key:"role",
                render:(record,text)=>{
                    let userForm="- -";
                    if(!record.children || record.children.length==0)
                    {
                        userForm=<AuthButton renderType="a" type="eye" onClick={this.viewHander.bind(this,"role",record)} title="查看角色">查看角色</AuthButton>
                    }
                    return userForm;
                }
            }];
    }

    render() {
        return (<div className="module-container" style={{paddingBottom:'20px'}}>
            {/*<SelectTree data={this.state.data}  render={item => `${item.name}`} />*/}
            <div className="module-table">
                <TableTree columns={this.getColumn()} data={this.state.data}/>
            </div>
            <SeeUser ref="usermodal"/>
            <SeeRole ref="rolemodal"/>
      </div>);
    }
}

module.exports = ResourceAuthority;

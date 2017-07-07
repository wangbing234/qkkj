/***************************************************
 * 时间: 2016/7/21 16:38
 * 作者: bing.wang
 * 说明: 角色基本信息
 *
 ***************************************************/
import React from 'react'
import Transfer from 'bfd-ui/lib/Transfer'
import Ajax from '../../ajax/AjaxReq'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
let sourceData = [];

let that;
class RoleUserInfo  extends React.Component{
    constructor(prop) {
        super(prop);
        this.state = {targetData:((this.props.data && this.props.data.roles) ?this.props.data.roles:[])};
    }

    componentDidMount() {
        var info16={ "tenantId":window._currentUser.tenantId};//租户id
        Ajax.listRolesByTenant(info16,that.getAllUsersSuccess);
    }

    doVaildate(){
        return true;
    }

    //删除的增加的
    getData()
    {
        return that.state.targetData;
    }


    getAllUsersSuccess(data)
    {
        sourceData= CommonUtil.removeFormOtherArray(data.data,that.state.targetData,"id");
        that.setState();
    }

    render() {
        that=this;
        return (
                <div style={{height:310}}>
                      <Transfer height={200} title={"已选的角色"} sdata={sourceData} tdata={this.state.targetData} render={item => `${item.roleName}`} />
                </div>

        );
    }
}

module.exports = RoleUserInfo;
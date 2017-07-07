/***************************************************
 * 时间: 2016/7/21 16:41
 * 作者: bing.wang
 * 说明:用户信息选择
 *
 ***************************************************/
import React from 'react'
import Transfer from 'bfd-ui/lib/Transfer'
import Ajax from '../../ajax/AjaxReq'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

let that;
class RoleUserInfo  extends React.Component{

    constructor(prop) {
        super(prop);
        let _targetData=((this.props.data && this.props.data.users)?this.props.data.users:[]);
        _targetData.map(function(item,index){
            if(!item.id)
                item.id=item.userName;
        })
        this.state = {sourceData:[],targetData:((this.props.data && this.props.data.users)?this.props.data.users:[])};
    }

    componentDidMount() {
        var info11={ "tenantId":window._currentUser.tenantId};//租户id
        let that=this;
        if(this.props.clazz=="BaseTableEditor")
        {
            Ajax.listUsersByTenant(info11,function(data):void{
                that.getAllUsersSuccess(data.data);
            });
        }
        else {
            Ajax.listUsersByTenant(info11,function(data):void{
                that.getAllUsersSuccess(data.data);
            });
        }

    }

    /**
     * 验证
     * @returns {boolean}
     */
    doVaildate(){
        return true;
    }

    /**
     * 获取数据
     * @returns {*}
     */
    getData()
    {
        return that.state.targetData;
    }

    /**
     * 获取所有用户成功处理
     * @returns {*}
     */
    getAllUsersSuccess(data)
    {
        this.state.sourceData= CommonUtil.removeFormOtherArray(data,that.state.targetData,"userName");
        that.setState();
    }


    render() {
        that=this;
        return (
                <div style={{height:310}}>
                      <Transfer height={200} title={"已选的用户"} sdata={this.state.sourceData} tdata={this.state.targetData}  render={item => `${item.userName}`}/>
                </div>

        );
    }
}

module.exports = RoleUserInfo;
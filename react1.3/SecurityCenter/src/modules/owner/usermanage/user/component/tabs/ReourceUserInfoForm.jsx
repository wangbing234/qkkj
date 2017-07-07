/***************************************************
 * 时间: 2016/7/21 16:02
 * 作者: bing.wang
 * 说明:资源用户配置
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { SelectTree } from 'bfd-ui/lib/Tree'
import update from 'react-update'
import get from 'lodash/get'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import Ajax from '../../ajax/AjaxReq'
let that;
class AuthorizeForm  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            data:  []
        };
        this.update = update.bind(this)
    }


    /**
     * 步骤使用
     */
    vaildate(){
        if(that.props.operatorType=="role")
        {
            that.saveFunction((data)=>{
                that.props.parent.nextStep();
            })
        }
        else {
            that.saveFunction((data)=>{
                that.props.cancelAddQueryUser(that.state);
            })
        }
    }

    componentDidMount() {
        that.getFunTree();
    }

    //获取
    getFunTree() {
        var info4;
        if(this.props.operatorType=="role") {
            var info4 = {roleId: this.props.data ? this.props.data.id : this.props.stepData.step0.roleId};
            Ajax.viewRoleResourceTree(info4, (data) => {
                that.state.oldData = $.extend({}, data.data, true);
                that.setState({data: data.data});
            });
        }
        //用户
        else{
            info4={ userName:this.props.data?this.props.data.userName:this.props.stepData.step0.user.userName};
            Ajax.viewUserResourceTree(info4, (data) => {
                that.state.oldData = $.extend({}, data.data, true);
                that.setState({data: data.data});
            });
        }
    }

    //submit按钮提交操作
    handleSubmit(e) {
       return that.state;
    }


    saveFunction(fun){
        if(this.props.operatorType=="role")
        {
            let _data=this.getData();
            var info7={
                "roleId":this.props.data?this.props.data.id:this.props.stepData.step0.roleId,
                "resourceIds":_data
            };
            let that=this;
            Ajax.assignRoleResourceTree(info7,(data) => {
                fun();
            });
        }
        else {
            let dataArray=this.getData();
            var info10={
                "userName":this.props.data?this.props.data.userName:this.props.stepData.step0.user.userName,
                "resourceIds":dataArray
            };
            let that=this;
            Ajax.assignUserResourceTree(info10,(data) => {
                fun();
            });
        }
    }

     //获取数据
    getData(e) {
        let arrayIds=[];

        CommonUtil.getCheckTreeByCode(this.state.data,true,arrayIds);
        return arrayIds;
    }

    updateChildren(item, path, checked) {
        if (!item || !item.children) return
        path = path = [...path, 'children']
        item.children.forEach((item, i) => {
            if (item.checked !== checked) {
                this.update('set', [...path, i, 'checked'], checked)
            }
            this.updateChildren(item, [...path, i], checked)
        })
    }

    updateParent(data, path, checked) {
        if (path.length <= 1) return
        const parent = get(data, path.slice(1));
        checked = parent.children.filter(item =>(item.checked)).length >= 1
        data = this.update('set', [...path, 'checked'], checked)
        this.updateParent(data, path.slice(0, -2), checked)
    }

    handleSelect(data, item, path, checked) {
        // 所有子级节点是否选中
        this.updateChildren(item, ['data', ...path], checked)
        // 所有父级节点是否选中
        this.updateParent(data, ['data', ...path.slice(0, -2)], checked)
    }

    componentDidUpdate(){
        if(this.props.type=="readOnly")
        {
            $("#reourceUserInfoForm  input:checkbox").attr("disabled","true");
        }
    }

    render() {
        that=this;
        let divStyle={marginLeft:20};
        if(this.props.style){
            divStyle = this.props.style;
        }
        return (
                <div style={divStyle} id="reourceUserInfoForm">
                    { /** <Checkbox>选择本租户所有资源，包含未来创建的资源</Checkbox>**/}
                    <SelectTree data={this.state.data}
                                    onChange={data => this.update('set', 'data', data)}
                                    onSelect={this.handleSelect.bind(this)}
                        />
                </div>);
    }
}

export default AuthorizeForm;
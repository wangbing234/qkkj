import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import {Modal,ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import message from 'CommonComponent/component/bdosmessage'
import FormFooter from 'CommonComponent/component/formfooter'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import AjaxReq from '../../model/AjaxReq'

const tenantArr = [
    {id: '', name: '全部'},
    {id: 1, name: '管理员'},
    {id: 2, name: '其它'}
];

let that;
class ChangeTenant  extends React.Component{

    constructor(prop) {
        super(prop);
        that = this;
        this.state = {
            tenantArr:[{id: '', userName: '全部'}]
            //...this.props.data
        };

        this.rules = {
            newUserName:value => {
                return BaseValidate.validateInput({isRequired:true,label:"租户所有者",value:value});
            }
        };
    }
    componentDidMount(){
        //查询租户下的所有用户
        //this.getAllUserByTenant();
    }


    getAllUserByTenant(data){
        this.currentUser = data.newUserName;
        let obj = {tenantId:data.id};
        AjaxReq.getUsersByTenantId(`data=${JSON.stringify(obj)}`,(result)=>{
            this.setState({...data,tenantArr:result});
            this.refs.modal.open();
        })

    }

    handleChange(dataField,evt){
        let value = evt && evt.target?evt.target.value:evt;
        this.setState({[dataField]: value});
    }


    open(){
        this.refs.modal.open();
    }

    close(){
        this.refs.modal.close();
    }

    //submit按钮提交操作
    handleSubmit(e) {
        if (e) {
            e.preventDefault()
        }

        if (this.refs.form.validate(this.state)) {
            console.log('表单验证通过');
            if(this.currentUser == this.state.newUserName){
                message.danger('没有进行变更操作');
            } else {
                let data = {id:this.state.id,oldUserId:this.state.oldUserId,oldUserName:this.state.oldUserName,newUserName:this.state.newUserName};
                AjaxReq.changeTenantOwner(data,(result) => {
                    message.success(result.msg);
                    that.props.cancel();
                    that.close();
                });
            }

        } else {
            console.log('表单验证失败');
        }
    }


    handleCancel(e) {
        e.preventDefault();
        this.props.close();
    }


    render(){
        that = this;
        return(<div>
                <Modal  ref="modal" >
                    <ModalHeader>
                        <h4>变更租户所有者</h4>
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Form ref="form" rules={this.rules}>
                                <FormItem label="租户ID" name="tenantId">
                                    <div style={{lineHeight:'30px'}}>{this.state.tenantId}</div>
                                </FormItem>
                                <FormItem label="租户名称" name="tenantName">
                                    <div style={{lineHeight:'30px'}}>{this.state.tenantName}</div>
                                </FormItem>
                                <FormItem label="租户所有者" name="newUserName" required>
                                    <Select name="selectOwner" value={this.state.newUserName} style={{width:'280px'}}
                                             onChange={this.handleChange.bind(this,'newUserName')}>
                                        {
                                            this.state.tenantArr.map(function (item, index) {
                                                return (<Option key={index}
                                                                value={item.userName}>{item.userName}</Option>);
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Form>
                        </div>
                        <FormFooter className="common-center"  submitClick={this.handleSubmit.bind(this)} cancelClick={this.close.bind(this)}/>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}

export default ChangeTenant;
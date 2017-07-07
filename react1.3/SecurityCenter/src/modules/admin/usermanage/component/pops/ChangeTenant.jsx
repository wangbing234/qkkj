import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import {Modal,ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import FormFooter from 'CommonComponent/component/formfooter'
import AjaxReq from '../../model/AjaxReq'
import message from 'CommonComponent/component/bdosmessage'


const tenantArr = [
    {id: '', name: '全部'},
    {id: 1, name: '管理员'},
    {id: 2, name: '其它'}
];

class ChangeTenant  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
        };
        this.rules = {

        };
    }

    //查询租户list
    getTenantList() {
        let that = this;
        this.tenantListAjax = AjaxReq.getTenantList((result) => {
            if (result && result.length > 0) {
                result.unshift({id: '', tenantName: '全部租户'});
                if (that) {
                    that.setState({tenantArr: result})
                }
            }
        })
    }

    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.setState({[dataField]: value});
    }

    setData(data){
        this.setState({
            userId: data.id,
            userName: data.userName,
            oldTenantId: data.tenantId,
            newTenantId: data.tenantId
        });
        this.currentTenant = data.tenantId;
        this.getTenantList();
    }


    changeTenant(){//变更租户不是每个都有的，有租户的才能变更this
        if(this.currentTenant == this.state.newTenantId){
            message.danger('没有进行变更操作');
        }else {
            this.props.changeTenant(this.state);
        }
    }

    open(){
        this.refs.modal.open();
    }

    close(){
        this.refs.modal.close();
    }

    //submit按钮提交操作
    handleSubmit(e) {
        //调用变更租户访求
        this.changeTenant();
    }

    handleCancel() {
        this.props.close();
    }


    render(){
        let curArr = this.state.tenantArr?this.state.tenantArr:this.props.tenantArr;
        return(<div className="usermanage-admin change-tenant">
                <Modal  ref="modal" >
                    <ModalHeader>
                        <h4>变更租户</h4>
                    </ModalHeader>
                    <ModalBody>
                        <div style={{marginLeft:'-30px'}}>
                            <Form>
                                <FormItem name="userName">
                                    <label>用户:</label><span style={{marginLeft:'5px'}}>{this.state.userName}</span>
                                </FormItem>
                                <FormItem name="newTenantId">
                                    <Select  value={Number(this.state.newTenantId)} style={{width:'280px'}}
                                             onChange={this.handleChange.bind(this,'newTenantId')}>
                                        {
                                            curArr.map(function (item, index) {
                                                return (<Option key={index}
                                                                value={item.id}>{item.tenantName}</Option>);
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem name="becareful">
                                    <label>注意:</label><span style={{marginLeft:'5px'}}>租户变更完后，用户重新登录后生效</span>
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
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextArea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import AjaxReq from '../../model/AjaxReq'
const roleArr = [
    {id: 1, name: '管理员'},
    {id: 2, name: '其它'}
];

let that;
let choose = {id:'',queueName:'请选择'};

class TenantBaseInfo extends React.Component {

    constructor(prop) {
        super(prop);
        that = this;
        this.isIdRepeat = false;
        this.isNameRepeat = false;
        this.queueArr = [choose];
        this.state = {
            id:'',
            tenantId:'',
            tenantName:'',
            queueId:'',
            comment:'',
            ...this.props.data

        };
        this.tenantName = this.props.data ? this.props.data.tenantName : '';
        this.rules = {
            tenantId: value => {
                let msg = BaseValidate.validateInput({isRequired: true, label: "租户ID", value: value,regExp:RestrictConst.NUM_START_STRING_UNDERLINE_16});
                if(this.isIdRepeat){
                    msg = "租户ID已存在，请重新输入";
                }
                return msg;
            },
            tenantName: value => {
                let msg = BaseValidate.validateInput({isRequired: true, label: "租户名称", value: value,regExp:RestrictConst.NUM_STRING_CHARS_UNDERLINE_16});
                if(this.isNameRepeat){
                    msg = "租户名称已存在，请重新输入";
                }
                return msg;
            },
            queueId: value => {//把0当成空了
                return BaseValidate.validateInput({isRequired: true, label: "队列等级", value: String(value)});
            },
            comment: value => {
                return BaseValidate.validateInput({label: "租户描述", value: String(value),maxLength:255});
            }

        };
    }

    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.setState({[dataField]: value});
        switch(dataField){
            case 'queueId':
                this.refs.queueId.validate(value);
            break;
            case 'tenantId':
              this.isIdRepeat = false;
            break;
            case 'tenantName':
              this.isNameRepeat = false;
            break;
        }
    }

    componentDidMount(){
        this.getQueueList();
    }

    getQueueList(){
        //id: 0 name: "队列0" queue: "root.default"
        AjaxReq.getQueueList((result) => {
            if(result && result.length > 0){
                result.unshift(choose);
                this.queueArr = result;
                that.setState({});
            }
        })
    }

    isExistTenantId(evt){
        let id = evt.target.value;
        let data = {tenantCode:id};
        AjaxReq.isExistsTenant(data,(result) => {
            if(result.data){
                this.isIdRepeat = true;
            } else{
                this.isIdRepeat = false;
            }
            this.refs.tenantId.validate( id );
        })
    }

    isExistTenantName(evt){
        let name = evt.target.value;
        if (name != this.tenantName){
            let data = {tenantName:name};
            AjaxReq.isExistsTenant(data,(result) => {
                if(result.data){
                    this.isNameRepeat = true;
                } else{
                    this.isNameRepeat = false;
                }
                this.refs.tenantName.validate( name );
            })
        }
    }

    validate(){
        return this.refs.form.validate(this.state);
    }

    getFormData(){
        return this.state;
    }

    render() {
        that = this;
        return (<div>
            <Form ref="form" rules={this.rules}>
                            <FormItem label="租户编码" required ref="tenantId" name="tenantId">
                                <RestrictInput type="text" value={this.state.tenantId} className="form-control common-form-input"
                                               onChange={this.handleChange.bind(this,"tenantId")}
                                               restrict={RestrictConst.NUM_START_STRING_UNDERLINE_16} disabled={this.props.isEdit || this.props.disabled}
                                               tipString="只能输入字母、数字、下划线，且必须以字母开头；长度不超过16个字符；注意：租户ID提交后不能修改"
                                               onBlur = {this.isExistTenantId.bind(this)}
                                />
                            </FormItem>

                            <FormItem label="租户名称" ref="tenantName" name="tenantName" required>
                                <RestrictInput type="text" value={this.state.tenantName} className="form-control common-form-input"
                                               onChange={this.handleChange.bind(this,"tenantName")}
                                               restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_16}
                                               tipString="只能输入中文、字母、数字、下划线，长度不超过16个字符"
                                               onBlur = {this.isExistTenantName.bind(this)}
                                               disabled={this.props.disabled}/>
                            </FormItem>

                            <FormItem label="队列等级" ref="queueId" name="queueId" required>
                                <Select  value={this.state.queueId} className="common-select"
                                         onChange={this.handleChange.bind(this,'queueId')}
                                         disabled={this.props.disabled}>
                                    {
                                        this.queueArr.map(function (item, index) {
                                            return (<Option key={index}
                                                            value={item.id}>{item.queueName}</Option>);
                                        })
                                    }
                                </Select>
                            </FormItem>

                            <FormItem label="租户描述" name="comment">
                                <RestrictTextArea value={this.state.comment} className="form-control common-textarea"
                                               onChange={this.handleChange.bind(this,"comment")} type="textarea"
                                               disabled={this.props.disabled}/>
                            </FormItem>


            </Form>
            </div>
        );
    }
}

export default TenantBaseInfo;
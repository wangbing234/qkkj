import React from 'react'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Select ,Option} from 'bfd-ui/lib/Select'
import FormFooter from 'CommonComponent/component/formfooter'
const labelDataSource = [{type:1,name:'最新'},{type:2,name:'v1.0'},{type:3,name:'v1.1'}];
let isSuccess;
const Export = React.createClass({
    open(){
        this.refs.modal.open();
    },
    handleSelectChange(dataField,value){
        this.setState({[dataField]:value});
    },
    handleCheckBoxChange(dataField,selects){
        this.setState({ [dataField]:selects });
    },
    getInitialState() {
        return {
            visible: false,
            exportContent: [],
            version: ["newst"]
        }
    },
    //submit按钮提交操作
    handleSubmit(e) {
        this.setState({validateState:true});
        const obj = Form.handleData(this.state, isSuccess);
        if (obj.isPass) {    //验证通过
            this.refs.modal.close();
        } else {              //验证失败
            console.log('表单验证失败');
        }
        e.preventDefault();
    },
    //获取验证是否通过状态，并存放到isSuccess数组中。
    isSuccess(flag){
        isSuccess.push(flag);
    },
    handleCancel() {
        this.refs.modal.close();
    },

    componentDidMount(){
      
      var data = this.props.data;
      
    },
    onChange(checkedValues) {
      console.log('checked = ', checkedValues);
    },
    labelListChange(evt){

    },

    render() {
        isSuccess = [];
        const validates = [{
            validateVal: this.state.exportContent,
            required: '请选择导出内容',
            handle: function() {
                let s;
                if (!this.validateVal && this.required) {
                    s = this.required;
                }  else {
                    s = 'success'
                }
                return s;
            }
        }];
        return (
                <Modal ref="modal">
                    <ModalHeader>
                        <h4 className="modal-title">选择导出内容</h4>
                    </ModalHeader>
                    <ModalBody>
                        <Form horizontal  isSuccess={this.isSuccess} sibmitStatus={this.state.isSubmit}>
                            <FormItem  validate={validates[0]} required>
                                <CheckboxGroup  selects = {this.state.exportContent} onChange={this.handleCheckBoxChange.bind(this,"exportContent")}>
                                    <Checkbox value="createTable">建表语句</Checkbox>
                                    <Checkbox value="dataStream">数据流关系</Checkbox>
                                    <Checkbox value="script">工作流</Checkbox>
                                    <Checkbox value="workflow">脚本</Checkbox>
                                    <Checkbox value="projectConfig">项目配置</Checkbox>
                                    <Checkbox value="dataAudit">数据稽核任务</Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                            <FormItem style={{fontSize: 14}} label="版本标签:">
                                <Select  selected={this.state.version} onChange={this.handleSelectChange.bind(this,"version")}>
                                    <Option value="newst">最新</Option>
                                    <Option value="version1">version1</Option>
                                    <Option value="version2">version2</Option>
                                </Select>
                            </FormItem>
                            <FormFooter  className="row text-center" style={{ marginTop:20, marginBottom:20}} btnStyle={{width:"70px !important"}}
                                        submitClick={this.handleSubmit} cancelClick={this.handleCancel}/>
                        </Form>
                    </ModalBody>
                </Modal>
        );
    }
});

export default Export;

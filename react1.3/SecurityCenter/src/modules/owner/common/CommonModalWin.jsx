/***************************************************
 * 时间: 2016/7/21 15:51
 * 作者: bing.wang
 * 说明: 公用确认对话框
 *
 ***************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import FormFooter from '../../../common/js/component/FormFooter'
let that;
class Hive extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
    }

    /**
     * 取消处理
     */
    cancelClick() {

        this.refs._modal.close();
    }

    /**
     * 确认处理
     */
    handleSubmit() {
        let result=this.refs.child.doVaildate();
        if(result)
        {
            if(this.props.submit)
            {
                this.props.submit(this.refs.child.state);
            }
            else if(this.refs.child.submit)
            {
                this.refs.child.submit();
            }
        }

    }

    render() {
        that = this;
        let Child = this.props.Child;
        return (
            <div className={this.props.className}>
                <Modal ref="_modal"  lock={true}>
                    <ModalHeader>
                        <h4 className="modal-title">{this.props.title}</h4>
                    </ModalHeader>
                    <ModalBody>
                        <Child ref="child" {...this.state} cancelClick={this.cancelClick.bind(this)}/>
                        <FormFooter btnClassName={this.state?this.state.btnClassName:""} style={{marginLeft:"100px"}}
                                    className={this.props.className}
                                    submitClick={this.handleSubmit.bind(this)}  cancelClick={this.cancelClick.bind(this)}/>
                    </ModalBody>
                </Modal>
                </div>
        )
    }
}

export default Hive;
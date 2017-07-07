/***************************************************
 * 时间: 2016/7/21 15:51
 * 作者: bing.wang
 * 说明: 公用确认对话框
 *
 ***************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import {FormFooter} from 'CommonComponent'
import '../css/style.less'
let that;
class Hive extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
        this.state={};
    }

    open()
    {
        this.refs._modal.open();
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
        if((!this.refs.child.doVaildate || this.refs.child.doVaildate()) && this.refs.child.submit)
        {
            this.refs.child.submit(this.props.submit);
        }
    }

    render() {
        that = this;
        let Child = this.props.Child;
        let formFooter=(this.props.hasFormFooter=="false")?null:<FormFooter style={{marginLeft:"100px"}} submitClick={this.handleSubmit.bind(this)}  cancelClick={this.cancelClick.bind(this)}/>
        return (
            <div className={this.props.className||"width1000"}>
                <Modal ref="_modal"  lock={true}>
                    <ModalHeader>
                        <h4 className="modal-title">{this.state.title || this.props.title}</h4>
                    </ModalHeader>
                    <ModalBody>
                        <Child ref="child" {...this.state} owner={this} cancelClick={this.cancelClick.bind(this)}/>
                        {formFooter}
                    </ModalBody>
                </Modal>
                </div>
        )
    }
}

export default Hive;
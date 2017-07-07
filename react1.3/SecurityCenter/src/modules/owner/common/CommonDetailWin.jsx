/***************************************************
 * 时间: 2016/7/21 15:51
 * 作者: bing.wang
 * 说明: 公用查看界面
 *
 ***************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import {FormFooter} from 'CommonComponent'
let that;
class Hive extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
    }

    //取消处理
    cancelClick() {
        this.refs._modal.close();
    }


    render() {
        that = this;
        let Child = this.props.Child;
        return (
                <Modal ref="_modal">
                    <ModalHeader>
                        <h4 className="modal-title">{this.props.title}</h4>
                    </ModalHeader>
                    <ModalBody>
                        <Child ref="child" {...this.state}/>
                        <button type="button" className="btn btn-default common-btn"  style={{marginLeft: "213px"}} onClick={this.cancelClick.bind(this)}>取消</button>
                    </ModalBody>
                </Modal>
        )
    }
}

export default Hive;
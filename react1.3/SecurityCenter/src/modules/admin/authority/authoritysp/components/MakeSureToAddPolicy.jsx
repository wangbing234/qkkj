/***************************************************
 * 时间: 2016/7/20 14:13
 * 作者: lijun.feng
 * 说明: 
 ***************************************************/
import React from 'react';
import { Modal, ModalBody } from 'bfd-ui/lib/Modal'
import FormFooter from 'CommonComponent/component/formfooter'

class MakeSureToAddPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.cancelHandle = this.cancelHandle.bind(this);
        this.submitHandle = this.submitHandle.bind(this);
    }

    submitHandle(e){
        this.setState({isOpen:false});
    }

    cancelHandle(e){
        this.setState({isOpen:false});
    }

    render(){
        return (
        <Modal isOpen={this.state.isOpen} onClose={this.cancelHandle}>
            <ModalBody>
                <p>确定要新增策略并授权用户>确定要新增策略并授权用户{this.props.userName}吗？</p>
                <p style={{color:"#FF6600"}}>注：策略内容为用户申请的内容</p>
            </ModalBody>
            <FormFooter submitClick={this.submitHandle} cancelClick={this.cancelHandle}/>
            <span style={{height:10}}>&nbsp;</span>
        </Modal>);

    }
}

export default MakeSureToAddPolicy
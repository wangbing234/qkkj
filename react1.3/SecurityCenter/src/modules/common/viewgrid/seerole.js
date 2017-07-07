import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import DataTable from 'bfd-ui/lib/DataTable'
const ownerColumns = [{
    title: "",
    key: 'roleName'
}];

const data = {"totalList": [],
    "currentPage": 1,
    "totalPageNum": 100000
};
const SeeRole = React.createClass({
    open() {
        this.refs.modal.open();
    },
    getInitialState(){
        this.data = {totalList:[]};
        return {
            visible:false
        }
    },
    closeHandler(){
        this.setState({
            visible:false
        })
    },

    setData(data){
        this.data = {totalList:[]};
        let that=this;
        data.map((name,index) =>{
            that.data.totalList.push({key:index,roleName:name});
        });
        this.setState({});
    },
    setObjectArray(data){
        this.data = {totalList:data};
        this.setState({});
    },

    render() {
        data.totalList=this.state.roles||[];
        return (
            <Modal ref="modal" onClose={this.closeHandler}>
                <ModalHeader>
                    <h4 className="modal-title">已被授权的角色</h4>
                </ModalHeader>
                <ModalBody>
                    <DataTable data={this.data} column={ownerColumns} howRow={10} />
                </ModalBody>
            </Modal>
        );
    }
});

export default SeeRole
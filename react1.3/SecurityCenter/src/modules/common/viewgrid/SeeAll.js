import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import DataTable from 'bfd-ui/lib/DataTable'
const ownerColumns = [{
    title: "租户",
    key: 'tenant'
}];

const data = {totalList:[
    { key: 1,tenant:'租户张',tenant1:'租户二'},
    { key: 2, tenant:'租户李',tenant1:'租户三'}
],
    currentPage : 1,
    totalPageNum : 20
};

const SeeAll = React.createClass({
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
        data.map((name,index) =>{
            this.data.totalList.push({key:index,name:name});
        });
        this.setState({});
    },
    getColumn(){
       return [{
           title: this.props.title,
           key: 'name'
       }]
    },
    render() {
        let column = this.getColumn();
        return (
            <Modal ref="modal" onClose={this.closeHandler}>
                <ModalHeader>
                    <h4 className="modal-title">{this.props.title}</h4>
                </ModalHeader>
                <ModalBody>
                    <DataTable data={this.data}  column={column} howRow={10} />
                </ModalBody>
            </Modal>
        );
    }
});

export default SeeAll
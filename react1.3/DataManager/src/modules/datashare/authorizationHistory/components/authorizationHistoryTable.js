import React from 'react';

import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'


var style = {
    marginRight: 10
};

let tableRender;
const TABLEINFORFORM = 'tableInfoForm';

// 通过 rowSelection 对象表明需要行选择
const rowSelection = {
    getCheckboxProps(record) {
        return {};
    },
    onChange(selectedRowKeys) {
        console.log(`selectedRowKeys changed: ${selectedRowKeys}`);
    },
    onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows) {
        console.log(selected, selectedRows);
    }
};


class AuthorizationHistoryTable extends React.Component{

    constructor(prop) {
        super(prop);
        tableRender = this;
        this.state = {}
    }



    handleCancel(e) {
        console.log(e);
    }

    onPageChange(){}



    render() {

        return (<div>

            <Modal ref="modal">
                <ModalHeader>
                    <h4>申请权限</h4>
                </ModalHeader>
                <ModalBody>
                    <AuthorizationHistoryForm/>
                </ModalBody>
            </Modal>
        </div>)
    }
}

export default AuthorizationHistoryTable;

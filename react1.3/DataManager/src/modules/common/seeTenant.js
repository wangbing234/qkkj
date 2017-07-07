import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import DataTable from 'bfd-ui/lib/DataTable'

import AjaxReq from './ajax/AjaxReq'

class SeeTenant extends React.Component {
  constructor( props ) {
    super( props );
    this.pageSize = 20;
    this.state = {data:{
      totalList: [ ],
      currentPage: 1,
      totalPageNum: 20
    }};
  }

  componentDidMount(){
    this.getList();
  }

  /*获取列表数据*/
  getList(){
    let that = this;
    if(this.data){
      AjaxReq.getAuthorizedTenantList({
        tableName:this.data.tableName,
        database:this.data.database
      },(data) => {
        data = data.data;
        that.setState({data:data});
      });
    }
  }

  /*打开当前窗口*/
  open(data) {
    this.data = data;
    this.getList();
    this.refs.modal.open();
  }

  /*关闭当前窗口*/
  closeHandler(){
    this.refs.modal.close();
  }

  /*设置表格列*/
  getColumns(){
    return  [ {
      title: "序号",
      key: 'id'
    }, {
      title: "租户",
      key: 'applyTenantName'
    } ];
  }

  render() {
    let columns = this.getColumns();
    return (
      <Modal ref="modal">
        <ModalHeader>
          <h4 className="modal-title">查看授权租户</h4>
        </ModalHeader>
        <ModalBody>
          <DataTable data={this.state.data} column={columns} howRow={this.pageSize}/>
          <button
            className="btn btn-sm btn-default"
            onClick={this.closeHandler.bind(this)}
          >关闭</button>
        </ModalBody>
      </Modal>
    );
  }
}
export default SeeTenant
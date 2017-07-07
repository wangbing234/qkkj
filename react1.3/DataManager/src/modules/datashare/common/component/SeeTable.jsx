import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import TableTabs from '../../../searchdata/searchtable/component/TableTabs.jsx'

class SeeTable extends React.Component {

  constructor(prop) {
    super(prop);

    }


  render() {
    let listInfo = {table_name:this.state?this.state.tableName:'',database:(this.state && this.state.database)?this.state.database:''};
    return (<div className="data-share">
      <div className="modalWidth800">
      <Modal ref="modal">
        <ModalHeader>
          <h4>查看表详情</h4>
        </ModalHeader>
        <ModalBody>
          <TableTabs table={listInfo}/>
        </ModalBody>
      </Modal>
      </div>
    </div>)
  }
}

export default SeeTable;

import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import AjaxReq from '../../ajax/AjaxReq'
class LogPanel extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  open(data){
    this.data = data;
    this.getLog();
    this.refs.modal.open();
  }

  componentDidMount(){
    if(this.data) this.getLog();
  }

  getLog(){
    let that = this;
    AjaxReq.getProcessById({instanceId:Number(this.data.id),logPath:this.data.executeLog},(data)=>{
      that.setState({data:data.data});
    });
  }


  render(){
    return (
    <div>
      <Modal ref="modal">
        <ModalHeader>
          <h4 className="modal-title">日志信息</h4>
        </ModalHeader>
        <ModalBody>
          <div className="log-div">
            <textarea
              className="form-control"
              disabled={false} readOnly={true}
              value={this.state.data}
              style={{height:"260px"}}
            ></textarea>
          </div>

        </ModalBody>
      </Modal>
    </div>
    );
  }
}
export default LogPanel
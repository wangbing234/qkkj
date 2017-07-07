import React from 'react'
import './index.less'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'

class BDOSModal extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {}
  }

  close() {
    this.refs.modal.close()
  }

  open() {
    this.refs.modal.open()
  }

  render() {
    let className = "footer "

    if (this.props.hideFooter) {
      className += 'hide'
    }
    return (<Modal ref="modal" lock={true}>
      <ModalHeader>
        <h4 className="modal-title">{this.props.title}</h4>
      </ModalHeader>
      <ModalBody>
        {this.props.children}
        <div className={className} style={{textAlign:'center'}}>
          <div className="btn btn-sm btn-default"
               onClick={this.close.bind(this)}>取消
          </div>
          <button className="btn btn-sm btn-primary"
                  style={{marginRight:10}}>确定
          </button>
        </div>

      </ModalBody>
    </Modal>)
  }
}

export default BDOSModal
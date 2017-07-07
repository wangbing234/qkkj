import 'bfd-bootstrap'
import React, { PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import ModalHeader from './ModalHeader.jsx'
import ModalBody from './ModalBody.jsx'

import './modal.less'

const childContextTypes = {
  /**
   * 响应 ModelHeader 关闭点击事件
   */
  handleClose: PropTypes.func
}

const Modal = React.createClass({
  getDefaultProps(){
    return {
      okTitle: '确定',
      closeTitle: '取消',
      showFooter: true,
      showHeader: true,
      title: '提示'
    }
  },

  getInitialState() {
    return {
      isOpen: false
    }
  },

  getChildContext() {
    return {
      handleClose: this.close
    }
  },

  componentDidMount() {
    this.bodyClassName = document.body.className
    this.bodyPaddingRight = parseInt(document.body.style.paddingRight, 10) || 0
  },

  componentWillUpdate(nextProps, nextState) {
    const body = document.body
    if (nextState.isOpen) {
      body.className = this.bodyClassName + ' modal-open'
      body.style.paddingRight = this.bodyPaddingRight + this.scrollbarWidth + 'px'
    } else {
      setTimeout(() => {
        body.className = this.bodyClassName
        if (this.bodyPaddingRight) {
          body.style.paddingRight = this.bodyPaddingRight + 'px'
        } else {
          body.style.paddingRight = ''
        }
      }, 300)
    }
  },

  handleModalClick() {
    this.close()
  },

  handleDialogClick(e) {
    e.stopPropagation()
  },

  open() {
    this.setState({isOpen: true})
  },

  close() {
    this.setState({isOpen: false})
  },

  okHandler(){
    this.props.okHandler && this.props.okHandler(this.state)
    this.close()
  },

  renderHeader(){
    if (this.props.showHeader) {
      return (
        <ModalHeader>
          <h4 className="modal-title">{this.props.title}</h4>
        </ModalHeader>
      )
    }
  },

  renderFooter(){
    if (this.props.showFooter) {
      return (
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={this.close}>{this.props.closeTitle}</button>
          <button type="button" className="btn btn-primary" onClick={this.okHandler}>{this.props.okTitle}</button>
        </div>
      )
    }
  },

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="in" transitionEnterTimeout={200} transitionLeaveTimeout={150}>
        {this.state.isOpen ? (
          <div className="bfd-modal" {...this.props}>
            <div className="modal-backdrop"></div>
            <div className="modal" onClick={this.handleModalClick}>
              <div className="modal-dialog" onClick={this.handleDialogClick}>
                <div className="modal-content">
                  {this.renderHeader()}
                  <ModalBody>
                    {this.props.children}
                  </ModalBody>
                  {this.renderFooter()}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </ReactCSSTransitionGroup>
    )
  }
})

Modal.childContextTypes = childContextTypes

export default Modal
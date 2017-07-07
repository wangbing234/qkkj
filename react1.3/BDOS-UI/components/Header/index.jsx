/***************************************************
 * 时间: 7/25/16 16:43
 * 作者: zhongxia
 * 说明: 项目header组件,包括用户信息,修改密码,AccessKey功能
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'


import AccessKey from './Modal/AccessKey'
import UserInfo from './Modal/UserInfo'
import ChangePsw from './Modal/ChangePsw'

import Model from './model'

import './index.less'


const ENUM = {
  ACCESSKEY: 0,
  USERINFO: 1,
  CHNAGEPSW: 2
}

class GlobalNav extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      userinfo: {userName: ''}
    };
  }

  /**
   * 组件渲染到DOM节点之后
   */
  componentDidMount() {
    //获取当前登录的用户信息
    Model.getUserAllInfo(result=> {
      console.log("getUserInfo success:", result)
      this.setState({userinfo: result.data})
    })
  }

  /**
   * 打开Accesskey页面
   */
  handleOpenModal(type) {
    let refs = this.refs;
    switch (type) {
      //AccessKey页面
      case ENUM.ACCESSKEY:
        refs.mAccessKey.open();
        break;
      //用户信息页面
      case ENUM.USERINFO:
        refs.mUserInfo.open();
        break;
      //修改密码页面
      case ENUM.CHNAGEPSW:
        refs.mChangePsw.open();
        break;
    }
    refs.dropdown.close();
  }

  /**
   * 关闭Modal页面
   */
  handleCloseModal() {
    let refs = this.refs;
    refs.mAccessKey.close();
    refs.mUserInfo.close();
    refs.mChangePsw.close();
  }

  render() {
    return (
      <div className='bdos-header'>
        <div className="bdos-header-right">
          <span className="access-key" onClick={this.handleOpenModal.bind(this,ENUM.ACCESSKEY)}>Access Key</span>
          <Dropdown ref="dropdown">
            <DropdownToggle>
              <span>{this.state.userinfo && this.state.userinfo.userName}</span>
            </DropdownToggle>
            <DropdownMenu>
              <li onClick={this.handleOpenModal.bind(this,ENUM.USERINFO)}>帐号信息</li>
              <li onClick={this.handleOpenModal.bind(this,ENUM.CHNAGEPSW)}>修改密码</li>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/*AccessKey页面*/}
        <div className="bdos-header-accesskey">
          <Modal ref="mAccessKey" lock={true}>
            <ModalHeader>
              <h4 className="modal-title">Access Key管理</h4>
            </ModalHeader>
            <ModalBody>
              <AccessKey close={this.handleCloseModal.bind(this)}/>
            </ModalBody>
          </Modal>
        </div>

        {/*用户信息页面*/}
        <div className="bdos-header-userinfo">
          <Modal ref="mUserInfo" lock={true}>
            <ModalHeader>
              <h4 className="modal-title">用户信息</h4>
            </ModalHeader>
            <ModalBody>
              <UserInfo userName={this.state.userinfo&&this.state.userinfo.userName}
                        close={this.handleCloseModal.bind(this)}/>
            </ModalBody>
          </Modal>
        </div>

        {/*修改密码页面*/}
        <div className="bdos-header-changepsw">
          <Modal ref="mChangePsw" lock={true}>
            <ModalHeader>
              <h4 className="modal-title">修改密码</h4>
            </ModalHeader>
            <ModalBody>
              <ChangePsw close={this.handleCloseModal.bind(this)}
                         userName={this.state.userinfo&&this.state.userinfo.userName}/>
            </ModalBody>
          </Modal>
        </div>
      </div>
    )
  }
}

GlobalNav.propTypes = {
  name: PropTypes.string
}
GlobalNav.defaultProps = {
  name: '基本信息'
}

export default GlobalNav

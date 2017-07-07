/***************************************************
 * 时间: 7/25/16 16:43
 * 作者: zhongxia
 * 说明: 导航组件
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'

class GlobalNav extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      userName: 'Jupiter'
    };
  }

  render() {
    return (
      <div className='layout-header'>
        <div className="layout-header-right">
          <Dropdown>
            <DropdownToggle>
              <span>{this.state.userName}</span>
            </DropdownToggle>
            <DropdownMenu>
              <li style={{color:'#000'}}>帐号信息</li>
              <li style={{color:'#000'}}>修改密码</li>
            </DropdownMenu>
          </Dropdown>
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

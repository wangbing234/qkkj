import React from 'react'
import { Link } from 'react-router'

const GlobalNav = React.createClass({
  logout(){
    top.location.href = _CONFIG_.LOGOUT;
  },
  render() {
    return (
      <div className='layout-header' style={{paddingLeft:20}}>
        <h1 style={{height:50,lineHeight:'50px',margin:0,float:'left'}}>API管理系统</h1>
        <div style={{float:'right',display:'none'}}>
          <div className="logout" onClick={this.logout}>注销</div>
        </div>
      </div>
    )
  }
})

export default GlobalNav

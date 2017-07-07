import React, { PropTypes } from 'react'
import classNames from 'classnames'
//import rightMenu from 'Base/rightMenu'
import rightMenu from 'CommonComponent/component/rightmenu'  //使用到 Auth 这个通用方法,因此引用通用里面的

class RightMenuDemo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
    this.rightMenuHandle = this.rightMenuHandle.bind(this)
  }

  componentDidMount() {
    document.body.oncontextmenu = function (e) {
      e.preventDefault();
      return false;
    }
  }

  rightMenuHandle(e) {
    window.__AUTHCODES__ = {btns: [10]}
    rightMenu.show({
      x: e.pageX,
      y: e.pageY,
      data: [{
        text: '打开',
        dataCode: 10,
        disabled: true,
        func: function (node) {
          console.log("open")
        }
      }, {
        text: '删除',
        dataCode: 101,
        func: function (node) {
          console.log("close")
        }
      }]
    })
  }

  render() {


    return (<div style={{height:300,border:'1px solid #000'}} onContextMenu={this.rightMenuHandle}>
    </div>);
  }
}

export default RightMenuDemo
/**
 * Created by bing.wang on 2016-06-16.
 */

import 'bfd-bootstrap'
import './main.less'
import React from 'react'
import confirm from 'bfd-ui/lib/confirm'

export default React.createClass({
  handleClick(item) {
    confirm('确认删除吗', () => {
      if(typeof this.props.onRemove == 'function') {
        this.props.onRemove(item)
      }
    })
  },
  render() {
    return (
      <div className="filelist">
      {
        this.props.data.map((item, index) => {
          return (
            <div key={index} className="row">
              <span>{item.name}</span>
              <span>{item.percent}%</span>
              <span style={{display: item.state == 0 ? '' : 'none'}} className="glyphicon glyphicon-upload"></span>
              <span style={{color: 'green', display: item.state == 1 ? '' : 'none'}} className="glyphicon glyphicon-ok-sign"></span>
              <span title="上传失败" style={{color: 'red', display: item.state == 2 ? '' : 'none'}} className="glyphicon glyphicon-remove-sign"></span>
              <span style={{color: 'gray', cursor: 'pointer'}} className="glyphicon glyphicon-trash" onClick={this.handleClick.bind(this, item)}></span>
            </div>
          )          
        })
      }
      </div>
    )
  }
})
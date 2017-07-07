/**
 * Created by bing.wang on 2016-06-16..
 */

import 'bfd-bootstrap'
import './main.less'
import React from 'react'
import classnames from 'classnames'
import xhr from 'bfd-ui/lib/xhr'
import FileList from './FileList'

export default React.createClass({
  getInitialState() {
    return {
      list: []
    }
  },
  handleClick() {
    const fileEl = this.refs.file
    fileEl.click()
  },

function1(self, file, index){
  const fd = new FormData()
  fd.append('files', file)
  xhr({
    type: 'post',
    url: self.props.action,
    data: fd,
    beforeSend(xhr) {
      // 侦查当前附件上传情况
      xhr.upload.onprogress = function(evt) {
        const loaded = evt.loaded
        const tot = evt.total
        const per = Math.floor(100 * loaded / tot) // 已经上传的百分比
        const list = self.state.list.slice(0)
        const f = list[index]
        f.percent = per
        self.setState({list})
      }
    },
    success(data) {
      const list = self.state.list.slice(0)
      const f = list[index]
      f.state = 1
      self.setState({list})
      if(typeof self.props.onComplete == 'function') {
        self.props.onComplete(data)
      }
    },
    error(msg) {
      const list = self.state.list.slice(0)
      const f = list[index]
      f.state = 2
      self.setState({list})
      if(typeof self.props.onComplete == 'function') {
        self.props.onComplete(msg)
      }
    },
    complete() {
    }
  })
},

  handleChange(event) {
    const el = event.target
    const files = el.files
    const self = this
    const arr = []
    for(let i=0; i<files.length; i++) {
      const file = files[i]
      arr.push({
        name: file.name,
        size: file.size,
        type: file.type,
        state: 0
      });

      self.function1(self, file, i)
    }

    this.setState({
      list: arr
    })
  },
  handleRemove(currItem) {
    const self = this
    const arr = this.state.list.slice(0)
    arr.map((item, index) => {
      if(item == currItem) {
        arr.splice(index, 1)
        self.setState({
          list: arr
        })
        return
      }
    })
  },
  render() {
    return (
      <div className={classnames('bfd-upload', this.props.className)} style={this.props.style}>
        <input ref="file" onChange={this.handleChange} type="file" accept={this.props.accept} multiple={this.props.multiple ? true : false} style={{display: 'none'}} />
         <span onClick={this.handleClick}>
              {this.props.children}
          </span>
        <div className="listbox" style={{display:this.props.visable?"block":"none"}}>
          <FileList data={this.state.list} onRemove={this.handleRemove}></FileList>
        </div>
      </div>
    )
  }
})


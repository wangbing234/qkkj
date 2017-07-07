import React from 'react'
import './index.less'
/* let msgArr = [{
 text: '用户审计',
 url:''//如果不需要跳转url可以为空或不写url
 },{
 text: '数据审计',
 url:'/useraudit/data'
 }];*/

const BreadCrumb = React.createClass({
  clickHandler(url){
    if (url && url != '') {
      this.props.clickHandler && this.props.clickHandler(url)
    }
  },
  render() {
    var title
    var str
    var arr = this.props.msgArr ? this.props.msgArr : []
    str = arr.length !== 0 && arr[arr.length - 1].text

    if (this.props.title) {
      str = this.props.title
    }
    if (str) {
      title = <span><h2 style={{marginTop:0, marginBottom:0}}>{str}</h2></span>
    }
    return (<div style={{margin:0}}>
      <h3 style={{marginBottom: '5px'}}>{this.props.text}</h3>
      <ol className="breadcrumb filemanage-breadcrumb" style={{marginBottom:0}}>
        {this.props.msgArr.map((item, index)=> {
          if (!item.url) {
            return (<li key={index}>
              {item.text}
            </li>)
          } else {
            return (<li key={index}>
              <a href="javascript:void(0);"
                 onClick={this.clickHandler.bind(this, item.path)}>
                {item.text}
              </a>
            </li>)
          }

        })}
      </ol>
    </div>)
  }
})

module.exports = BreadCrumb
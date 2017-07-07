/***************************************************
 * 时间: 16/6/14 11:23
 * 作者: zhongxia
 * 说明: 查看脚本组件,内部使用 IDE, 从外部传入脚本id,获取脚本信息
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import IDE  from 'CommonComponent/component/ide'
import ReactDOM from 'react-dom'
//Ajax 操作
import Model from '../../model/versionHistory'

class SeeScript extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      isLoaded: false,
      ...prop.data
    };
  }

  componentDidMount() {
    const that = this;
    if (that.state.id) {
      Model.getScriptInfo({taskCode: that.state.taskCode, version: that.state.version}, function (result) {
        that.setState({scriptInfo: result.data, isLoaded: true}, ()=> {
          $('.version-script').find('textarea').attr('disabled', true)
        })
      })
    }
  }

  render() {
    //设置脚本的类型,根据查看传过来的参数
    let mode = this.props.mode || 'sql'
    let scriptInfo = this.state.scriptInfo;

    if (this.state.isLoaded) {
      return (
        <div className="version-script" style={{width:'100%',height:500}}>
          <IDE mode={mode}>
            { scriptInfo }
          </IDE>
        </div>
      );
    }
    else {
      return <span></span>
    }
  }
}

export default SeeScript
/***************************************************
 * 时间: 16/6/15 17:22
 * 作者: zhongxia
 * 说明: 脚本信息, 鼠标移入, 显示脚本信息
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Model from 'IDERoot/model/ide'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import ENUM from 'IDERoot/enum'

const STYLE = {
  width: 120
}

class ScriptInfo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      data: {
        name: '',
        typeCode: '',
        createUser: '',
        lockUser: '',
        createTimeDis: '',
        updateTimeDis: '',
        maxVersion: ''
      }
    };
  }

  componentDidMount() {
    this.ajaxGetScriptInfo = Model.getScriptInfo(this.props.id, (result)=> {
      this.setState({data: result.data || {}})
    })
  }

  componentWillUnmount() {
    this.ajaxGetScriptInfo.abort();
  }

  render() {
    return (
      <table className="script-info">
        <tbody>
        <tr>
          <td>脚本名称:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.name}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>脚本类型:</td>
          <td><TextOverflow>
            <div style={STYLE}>{ENUM.getScriptConfig(this.state.data.typeCode).key}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>创建人:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.createUser}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>当前锁定者:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.lockUser}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>创建时间:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.createTimeDis}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>更新时间:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.updateTimeDis}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>最大版本号:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.maxVersion}</div>
          </TextOverflow></td>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default ScriptInfo
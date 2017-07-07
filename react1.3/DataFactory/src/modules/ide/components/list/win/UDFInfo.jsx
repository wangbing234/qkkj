/***************************************************
 * 时间: 16/6/15 17:22
 * 作者: zhongxia
 * 说明: 脚本信息, 鼠标移入, 显示脚本信息
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Model from 'IDERoot/model/ide'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

const STYLE = {
  width: 180
}

class UDFInfo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      data: {
        name: '',
        hiveDatabase: '',
        className: '',
        args: '',
        comment: '',
        jarPath: ''
      }
    };
  }

  componentDidMount() {
    this.ajaxGetUDFInfo = Model.getUDFInfo(this.props.id, (result)=> {
      this.setState({data: result.data || {}})
    })
  }

  componentWillUnmount() {
    this.ajaxGetUDFInfo.abort();
  }

  render() {
    return (
      <table className="script-info">
        <tbody>
        <tr>
          <td>UDF名称:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.name}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>库名:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.hiveDatabase}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>类名:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.className}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>参数:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.args}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>使用说明:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.comment}</div>
          </TextOverflow></td>
        </tr>

        <tr>
          <td>jar路径:</td>
          <td><TextOverflow>
            <div style={STYLE}>{this.state.data.jarPath}</div>
          </TextOverflow></td>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default UDFInfo
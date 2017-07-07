/***************************************************
 * 时间: 16/6/30 20:15
 * 作者: zhongxia
 * 说明: API服务
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

//import Pre from  'common/components/Pre'  // 代码组件
import BDOSTable from  'common/components/BDOSTable'  // 表格

import Model from 'model/apiService'

let that;
class DetailDoc extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      apis: [],
      ...prop.data
    };

    this.columns = [
      {title: '字段', key: 'name'},
      {title: '类型', key: 'type'},
      {title: '说明', key: 'desc'}
    ]
  }

  componentWillUnmount() {
    that = null;
  }

  componentDidMount() {
    Model.getAPIDetailInfo(that.state.id, function (result) {
      that.setState({apis: [result.data]})
    })
  }

  closePage() {
    that.props.parent && that.props.parent.setState({pageType: 0})
  }


  /**
   * 渲染输出参数
   * @param param
   * @returns {XML}
   */
  renderParam(param) {
    let baseData = [{"name": "accessToken", "type": "string", "desc": "授权token"}]
    let data = JSON.parse(param || "[]");
    data = baseData.concat(data);
    return (<BDOSTable style={{width:500,marginBottom:20}} columns={that.columns} data={data ||[]}/>)
  }

  render() {
    that = this;
    that.style = {
      center: {
        marginLeft: 100
      }, info: {
        color: '#6E7E8E',
        marginBottom: 20
      }
    }
    return (
      <div>
        <ul className="api-service-list">
          {that.state.apis.map(function (item, index) {
            return (
              <li style={{width:'80%',marginBottom:40,borderBottom: '1px solid #E5E8EE'}} key={index}>
                <h3>URL: {item.apiUrl}</h3>
                <p style={that.style.info}>{item.digestContent}</p>

                <strong>支持格式</strong>
                <p style={that.style.info}>JSON</p>

                <strong>HTTP请求方式</strong>
                <p style={that.style.info}>GET</p>

                <strong>是否需要登录</strong>
                <p style={that.style.info}>是</p>

                <strong>输入参数</strong>
                {that.renderParam(item.conditions)}

                <strong>输出参数</strong>
                <div>********************************************************************************************</div>
                <pre style={{width:'80%',marginBottom:20}}>{item.outParams || '暂无信息!'}</pre>

                <strong>详细说明</strong>
                <div>********************************************************************************************</div>
                <pre>{item.detailContent || '暂无说明!'}</pre>
              </li>
            )
          })}
        </ul>

        <div style={that.style.center}>
          <button type="button"
                  style={{marginLeft:100}}
                  className="btn btn-sm btn-primary" onClick={this.closePage}>返回
          </button>
        </div>
      </div>
    );
  }
}

export default DetailDoc
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import VisualSearch from 'Base/VisualSearch'
import BfdRequest from 'CommonComponent/request/AjaxRequest'

let that;
class VisualSearchDemo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  componentDidMount() {
    let url = "./data/search.json"
    BfdRequest.ajaxGet(url, (result)=> {
      setTimeout(()=> {
        this.setState({config: result.data})
      }, 1000)
    })
  }

  componentWillUnmount() {
    that = null;
  }

  handleSearch(query, data) {
    console.log("query", query, data)
  }

  handleClick() {
    let config = [
      {
        name: 'name',
        data: [
          {name: '1', label: 'zhongxia'},
          {name: '11', label: 'zhongxia1'},
          {name: '12', label: 'zhongxia2'},
          {name: '13', label: 'zhongxia3'},
          {name: '14', label: 'zhongxia4'},
        ]
      },
      {
        name: 'age'
      }, {
        name: 'type',
        data: ['1', '2', '3', '4']
      }
    ]
    this.setState({config: config})
  }

  render() {
    that = this;
    return (
      <div>
        <VisualSearch onSearch={this.handleSearch} style={{width:400}} config={this.state.config || []}/>
        <button onClick={this.handleClick.bind(this)}>设置配置</button>
      </div>
    );
  }
}

export default VisualSearchDemo

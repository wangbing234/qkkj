import React from 'react'
import { Link } from 'react-router'
import data from './components.json'
import './components.less'

export default React.createClass({
  render() {
    return (
      <div >
        {this.props.children ? this.props.children : (
          <div className="components">
            <h2 className="title">组件</h2>
            <ul>
              {data.components && data.components.map((item, i) => {
                return (
                  <li key={i}>
                    <Link to={'/components/' + item.name}>
                      <div className="name">
                        <h3>{item.cn}</h3>
                        <h5>{item.name}</h5>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <h2 className="title">样式</h2>
            <ul>
              {data.style && data.style.map((item, i) => {
                return (
                  <li key={i}>
                    <Link to={'/components/' + item.name}>
                      <div className="name">
                        <h3>{item.cn}</h3>
                        <h5>{item.name}</h5>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    )
  }
})
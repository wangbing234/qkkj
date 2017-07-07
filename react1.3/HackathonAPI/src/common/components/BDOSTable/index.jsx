import React, { PropTypes } from 'react'
import classNames from 'classnames'

import './index.less'

let that;
class BDOSTable extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  componentWillUnmount() {
    that = null;
  }

  /**
   * 渲染表头
   * @returns {XML}
   */
  renderThead() {
    let columns = that.props.columns || [];
    return (
      <thead>
      <tr>
        {
          columns.map(function (item, index) {
            return <th key={index} style={{width:item.width}}>{item.title}</th>
          })
        }
      </tr>
      </thead>
    )
  }

  /**
   * 渲染表格内容
   * @returns {XML}
   */
  renderTbody() {
    let data = that.props.data || [];
    let columns = that.props.columns || []
    return (
      <tbody>
      {
        data.map(function (item, index) {
          return (
            <tr key={index}>
              {
                columns.map(function (col, colIndex) {
                  let key = col.key || "";
                  let hideBorder = item.hideBorder || false;
                  return <td style={{borderBottomWidth:hideBorder?0:1}}
                             key={colIndex}>{col.render ? col.render(item[key], item) : item[key]}</td>
                })
              }
            </tr>
          )
        })
      }
      </tbody>
    )
  }

  render() {
    that = this;
    const {className,...other} = that.props;
    return (
      <table className={classNames("bdos-component-table",className)} {...other}>
        {that.renderThead()}
        {that.renderTbody()}
      </table>
    );
  }
}

BDOSTable.propTypes = {
  data: PropTypes.array
}

export default BDOSTable
/***************************************************
 * 时间: 16/6/16 17:14
 * 作者: zhongxia
 * 说明: 列表组件,传入数据,快速生成列表, 支持点击事件(传回点击列表的数据)
 *
 *

 clickHandler(item) {
    //item 为 data 其中一个 对象
    console.log("item", item)
 }

 const data = [
 {key: 'zhongxia4', value: '5'},
 {key: 'zhongxia5', value: '6'}
 ]

 <List data={data} style={{width:150}} onClick={this.clickHandler}/>
 ***************************************************/
/***************************************************
 * 时间: 16/6/16 17:14
 * 作者: zhongxia
 * 说明: 列表组件,传入数据,快速生成列表, 支持点击事件(传回点击列表的数据)
 *
 *

 clickHandler(item) {
    //item 为 data 其中一个 对象
    console.log("item", item)
 }

 const data = [
 {key: 'zhongxia4', value: '5'},
 {key: 'zhongxia5', value: '6'}
 ]

 <List data={data} style={{width:150}} onClick={this.clickHandler}/>
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import './index.less'

class List extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  /**
   * 点击事件, 单击
   * @param item
   * @param evt
   */
  clickHandler(item, index, evt) {
    evt && evt.stopPropagation()
    this.props.onClick && this.props.onClick(item, index)
  }

  /**
   * 双击事件
   * @param item
   * @param evt
   */
  dbClickHandler(item, index, evt) {
    evt && evt.stopPropagation()
    this.props.onDoubleClick && this.props.onDoubleClick(item, index)
  }

  render() {
    let that = this;
    let data = this.props.data || []
    const {onClick,onDoubleClick,...other} = this.props;
    let className = classNames("bdos-list", that.props.className)
    return (
      <div  {...other} className={className}>
        <ul>
          {data.map(function (item, index) {
            let content = item[that.props.keyField]
            if (that.props.render) {
              content = that.props.render(item, index);
            }
            return (
              <li key={index}
                  className="bdos-list-item"
                  onClick={that.clickHandler.bind(that,item,index)}
                  onDoubleClick={that.dbClickHandler.bind(that,item,index)}
                  data-value={item[that.props.valueField]}>
                {content}
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

List.propTypes = {
  data: PropTypes.array.isRequired
}
List.defaultProps = {
  keyField: 'key',
  valueField: 'value'
}

export default List
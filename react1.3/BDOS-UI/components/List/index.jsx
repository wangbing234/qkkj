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
  clickHandler(item, evt) {
    evt && evt.stopPropagation()
    this.props.onClick && this.props.onClick(item)
  }

  /**
   * 双击事件
   * @param item
   * @param evt
   */
  dbClickHandler(item, evt) {
    evt && evt.stopPropagation()
    this.props.onDoubleClick && this.props.onDoubleClick(item)
  }

  render() {
    let that = this;
    let className = classNames("bdos-list", that.props.className)
    return (
      <div  {...this.props} className={className}>
        <ul>
          {this.props.data.map(function (item, index) {
            let content = item[that.props.keyFiled]
            if (item.render) {
              console.log("item render")
              content = item.render(item[that.props.keyFiled], item);
            }
            return (
              <li key={index}
                  className="bdos-list-item"
                  onClick={that.clickHandler.bind(that,item)}
                  onDoubleClick={that.dbClickHandler.bind(that,item)}
                  data-value={item[that.props.valueFiled]}>
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
  keyFiled: 'key',
  valueFiled: 'value'
}

export default List
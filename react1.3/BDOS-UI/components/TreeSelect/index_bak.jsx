/***************************************************
 * 时间: 16/6/17 19:06
 * 作者: zhongxia
 * 说明: 下拉树
 * 使用说明:

 //返回树节点的item数据
 clickHandler(item, xxx) {
    console.log("item", item, xxx)
  }

 //树结构数据
 const data = [{
      name: '数据工厂',
      open: true,
      children: [{
        name: 'adsdsd'
      }, {
        name: 'ioio'
      }, {
        name: 'tutrut',
        children: [{
          name: 'dasd'
        }]
      }]
    }, {
      name: '配置中心',
    }, {
      name: '配置中心2',
      children: [{
        name: 'dsads'
      }]
    }]

 return (
 <div>
 <TreeSelect data={data} onClick={this.clickHandler.bind(this)}/>
 </div>
 )
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import ClearableInput from 'bfd-ui/lib/ClearableInput'
import Icon from 'bfd-ui/lib/Icon'
import Tree from 'bfd-ui/lib/Tree/'
import './index.less'

class TreeSelect extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      index: -1,
      value: this.props.defaultValue || this.props.value || '',
      result: []
    };
  }

  componentWillReceiveProps(nextProps) {
    'value' in nextProps && this.setState({value: nextProps.value})
  }

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /**
   * 获取焦点, 展开下拉框
   */
  handleFocus() {
    this.open()
  }

  /**
   * 展开下拉框
   */
  open() {
    this.refs.refDropdown.open()
  }

  /**
   * 关闭下拉框页面
   */
  close() {
    this.refs.refDropdown.close()
  }

  /**
   * 节点点击事件
   * @param item
   */
  onActive(data) {
    this.close()
    let item = this.getActiveItem(data)
    console.log("item", item)
    if (item) {
      this.setState({value: item[this.props.valueFiled]})
      this.props.onClick && this.props.onClick(item)
    }
  }

  /**
   * 从返回的选中节点, 获取点击的节点
   * @param data
   * @returns {*}
   */
  getActiveItem(data) {
    return data && data.filter(function (item) {
        return item.active ? true : false;
      })[0]
  }

  render() {
    const { className,onClick, ...other } = this.props
    return (
      <Dropdown ref="refDropdown" className={classNames('bdos-tree-select', className)} {...other}>
        <input type="text" className="form-control"
               style={{display:'inline-block'}}
               value={this.state.value}
               onFocus={this.handleFocus.bind(this)}
               onChange={this.handleChange.bind(this,'value')}/>
        <Icon onClick={this.handleFocus.bind(this)} type="folder-open"
              style={{color:'#DEAC4F',position: 'absolute',lineHeight: '30px',right: 5,cursor:'pointer'}}/>
        <DropdownMenu>
          <Tree data={this.props.data} onActive={this.onActive.bind(this)}/>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

TreeSelect.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string
}
TreeSelect.defaultProps = {
  valueFiled: 'name',
}

export default TreeSelect
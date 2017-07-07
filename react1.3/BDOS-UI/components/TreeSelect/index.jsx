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
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import './index.less'

class TreeSelect extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      value: prop.defaultValue || prop.value || '',
      data: prop.data || []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value, data: nextProps.data})
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
    if (item) {
      this.props.onChange && this.props.onChange(item[this.props.valueField], item)
    }
  }

  /**
   * 根据唯一值,获取值
   * @param value
   */
  getKey(data, value) {
    data = data || [];
    let keys = [];
    const {labelField,valueField} = this.props;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      if (item[valueField] === value) {
        keys.push(item[labelField]);
      }
      else if (item.children) {
        keys.push(this.getKey(item.children, value));
      }
    }
    return keys;
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

  /**
   * 树文件太长的话, 则显示tooltip
   * @param item
   * @returns {XML}
   */
  renderTreeItem(item) {
    return (
      <TextOverflow>
        <div> {item[this.props.labelField]}</div>
      </TextOverflow>
    )
  }

  render() {
    const { className,style,data,onChage,...other} = this.props
    let title = this.getKey(this.state.data, this.state.value);
    if (Array.isArray(title)) {
      title = title.join('');
      if (title.indexOf(',') !== -1) title = title.substr(0, title.length - 1);
    }
    return (
      <Dropdown tabIndex={10} ref="refDropdown" className={classNames('bdos-tree-select', className)} style={style}>
        <DropdownToggle>
          <TextOverflow>
            <div className="title">{ title || this.props.defaultValue || this.props.placeholder}</div>
          </TextOverflow>
          <Icon type="folder-open" className="icon-caret"/>
        </DropdownToggle>
        <DropdownMenu>
          <Tree {...other}
            render={this.renderTreeItem.bind(this)}
            data={this.state.data}
            onChange={this.handleChange.bind(this,'data')}
            onActive={this.onActive.bind(this)}/>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

TreeSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueField: PropTypes.string,
  labelField: PropTypes.string
}
TreeSelect.defaultProps = {
  labelField: 'name',
  valueField: 'id'
}

export default TreeSelect
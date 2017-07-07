/***************************************************
 * 时间: 16/6/17 19:06
 * 作者: zhongxia
 * 说明: 下拉树
 * 使用说明:
 //注意,注意,注意
 动态下拉树, 需要设置 onTreeChange 方法,把最新数据在绑定到Tree组件上
 treeChange(data){
    this.setState({mrTreeSelectData: data})
 }

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
 <TreeSelect data={data} onChange={this.clickHandler.bind(this)}/>
 </div>
 )
 ***************************************************/
import './index.less'
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import warning from 'warning'

//bfd-ui
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import ClearableInput from 'bfd-ui/lib/ClearableInput'
import Icon from 'bfd-ui/lib/Icon'
import Tree from 'bfd-ui/lib/Tree/'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

class TreeSelect extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
    this.renderTreeItem = this.renderTreeItem.bind(this);
    this.onActive = this.onActive.bind(this);
  }

  /**
   * 根据唯一值,获取值
   * @param value
   */
  getKey(data, value) {
    data = data || [];
    const {labelField,valueField} = this.props;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      if (item[valueField] === value) {
        this.currentItem = item;
      }
      else if (item.children) {
        this.getKey(item.children, value);
      }
    }
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
    let item = data[data.length - 1];
    if (this.props.onlyParent) {
      if (item && !item.isParent) {
        this.setState({value: item[this.props.valueField], label: item[this.props.labelField]}, ()=> {
          this.props.onChange && this.props.onChange(item[this.props.valueField], item)
        })
        this.close()
      }
    } else {
      if (item) {
        this.setState({value: item[this.props.valueField], label: item[this.props.labelField]}, ()=> {
          this.props.onChange && this.props.onChange(item[this.props.valueField], item)
        })
        this.close()
      }
    }
  }

  /**
   * 树文件太长的话, 则显示tooltip
   * @param item
   * @returns {XML}
   */
  renderTreeItem(item) {
    const {onlyParent} = this.props;
    let flag = onlyParent && item.isParent || false;
    return (
      <TextOverflow>
        <div disabled={flag}> {item[this.props.labelField]}</div>
      </TextOverflow>
    )
  }

  render() {
    const { className,style,data,value,onTreeChange,...other} = this.props;

    if (other.getUrl) {
      warning(onTreeChange, 'If dynamic tree Data , TreeSelect must set onTreeChange! see TreeSelect Component doc..')
    }

    this.currentItem = null;
    //根据设置的value,获取显示的值[递归,因此不设置返回值]
    this.getKey(data, value);
    const title = this.currentItem && this.currentItem[this.props.labelField];

    return (
      <Dropdown disabled={this.props.disabled ||false} tabIndex={10} ref="refDropdown"
                className={classNames('bdos-tree-select', className)} style={style}>
        <DropdownToggle>
          <TextOverflow>
            <div className="title">{ title || this.props.defaultValue || this.props.placeholder}</div>
          </TextOverflow>
          <Icon type="angle-down" className="icon-caret"/>
        </DropdownToggle>
        <DropdownMenu>
          <Tree {...other}
            render={this.renderTreeItem}
            data={data}
            onChange={onTreeChange}
            onActive={this.onActive}/>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

TreeSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),  //动态树回显用
  valueField: PropTypes.string,
  labelField: PropTypes.string,
  onTreeChange: PropTypes.func,  //动态树,需要设置该方法
  onActive: PropTypes.func,
}
TreeSelect.defaultProps = {
  labelField: 'name',
  valueField: 'id',
  onlyParent: false
}

export default TreeSelect
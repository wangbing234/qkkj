/***************************************************
 * 时间: 7/27/16 15:19
 * 作者: zhongxia
 * 说明: 树节点拖拽
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Tree from 'bfd-ui/lib/Tree'

class TreeDemo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      data: [{
        name: '1',
        open: true,
        children: [{
          name: '1-1'
        }, {
          name: '1-2'
        }, {
          name: '1-3',
          children: [{
            name: '1-3-1'
          }]
        }]
      }, {
        name: '2',
      }, {
        name: '3',
        children: [{
          name: '3-1'
        }]
      }]
    };
    this.treeIdField = 'name';
  }

  handleChangeTreeData(data) {
    this.setState({data: data})
  }

  /**
   * 是否允许拖拽
   * @param ev
   */
  handleAllowDrop(ev) {
    ev.preventDefault();
  }

  /**
   * 拖拽放下的操作
   * @param item
   * @param ev
   */
  handleDrop(dropItem, ev) {
    console.info("treeNode drop", dropItem.name)
    const idFiled = this.treeIdField;
    const data = $.extend(true, [], this.state.data);

    const dragKey = ev.dataTransfer.getData('dragKey');
    const dropKey = dropItem[idFiled];

    //根据节点唯一标识,递归或者数据
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item[idFiled] === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };

    let dragObj;
    //获取拖拽的节点,并且在数组中删除
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    //添加到目标位置
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      item.children.push(dragObj);
    });

    this.setState({data: data})
  }

  /**
   * 开始拖拽
   * @param item
   * @param ev
   */
  handleDragStart(item, ev) {
    console.info("treeNode dragStart", item)
    ev.dataTransfer.setData('dragKey', item[this.treeIdField])
  }


  renderTreeItem(item) {
    if (item.children && item.children.length > 0) {
      return <span draggable
                   onDragStart={this.handleDragStart.bind(this,item)}
                   onDragOver={this.handleAllowDrop.bind(this,item)}
                   onDrop={this.handleDrop.bind(this,item)}>{item.name}</span>;
    } else {
      return <span draggable onDragStart={this.handleDragStart.bind(this,item)}>{item.name}</span>
    }
  }


  render() {
    return (
      <div>
        <Tree data={this.state.data}
              onChange={this.handleChangeTreeData.bind(this)}
              render={this.renderTreeItem.bind(this)}/>
      </div>
    )
      ;
  }
}

export default TreeDemo
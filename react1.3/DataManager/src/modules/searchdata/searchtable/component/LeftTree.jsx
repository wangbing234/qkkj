/****************************************
 * 时间: 16/7/28
 * 作者: liujingjing
 * 说明: 查找表的左侧项目列表
 *
 ****************************************/

import React from "react";
import Tree from 'bfd-ui/lib/Tree'
import AjaxReq from './../model/AjaxReq'
import EventName from 'EventName'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

let that;

class LeftTree extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      data: [{name: '正在加载数据'}]
    };
    // 监听切换租户事件
    EventEmitter.subscribe(EventName.CHANGE_TENANT, this.getLeftTreeList.bind(this));
  }

  componentDidMount() {
    this.getLeftTreeList();
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  //componentWillReceiveProps(){
  //    this.getLeftTreeList();
  //}

  //shouldComponentUpdate(nextProps, nextState) {
  //  return this.state.data != nextState.data;
  //}

  // 从接口获取树列表数据
  getLeftTreeList() {
    let that = this;
    let param = {tenant: window.currentTenant};
    AjaxReq.getLeftTreeList(param, function (result) {
      if (!that.isUnmount) {
        if (result.data) {
          let obj = {projectCode: that.props.projectCode};
          EventEmitter.dispatch(EventName.UPDATE_SEARCH_TABLE_INFO, obj);
          [result.data].map(function (item) {
            item.name = item.name + "(" + item.count + ")";
            if (item.children) {
              item.children.map(function (item) {
                if (item.project_code == obj.projectCode) {
                  item.active = true;
                }
                item.name = item.project_code + "(" + item.table_count + ")";
                if (item.children) {
                  item.children.map(function (item) {
                    if (item.project_code == obj.projectCode) {
                      item.active = true;
                    }
                    item.name = item.name + "(" + item.table_count + ")";
                  });
                }
              });
            }
          });
          // 更新state
          that.setState({
            data: [result.data]
          });
        } else if (!result.data) {
          // 更新state
          that.setState({
            data: [{name: '暂无数据'}]
          });
        }
      }

    })
  }

  handleActive(data) {
    data[1] = data[1] || {};
    if (!this.firstCliskFlag && this.props.projectCode !== data[1].project_code) {
      this.firstCliskFlag = true;
      $('#dm_tree .active').removeClass('active')
    }

    if (data[0].name != '暂无数据' && data[0].name != '正在加载数据') {
      let projectCode = '';
      let database = '';
      switch (data.length) {
        case 1:// All
          projectCode = '';
          break;
        case 2:// 项目级传项目代码
          projectCode = data[1].project_code;
          break;
        case 3:// 数据库级传项目代码和数据库名字
          projectCode = data[2].project_code;
          database = data[2].name;
          //处理database中的括号()
          let index = database.indexOf('(');
          database = database.substr(0, index);
          break;
      }
      let obj = {projectCode: projectCode, database: database};
      EventEmitter.dispatch(EventName.UPDATE_SEARCH_TABLE_INFO, obj);
    }
  }

  getIcon(data) {
    let icon = 'database';
    if (data.children) {
      if (data.open) {
        icon = 'folder-open'
      } else {
        icon = 'folder'
      }
    }
    return icon;
  }

  /**
   * 树节点渲染
   * @param item
   */
  treeRender(item) {
    return <TextOverflow>
      <div>{item.name}</div>
    </TextOverflow>;
  }

  render() {
    that = this;
    return (
      <div id="dm_tree" className="tree-border">
        <Tree data={this.state.data}
              render={this.treeRender.bind(this)}
              onActive={this.handleActive.bind(this)}
              getIcon={this.getIcon}/>
      </div>
    );
  }
}

export default LeftTree;

import React from "react";
import Tree from 'bfd-ui/lib/Tree'
import AjaxReq from './AjaxReq'
import EventName from 'EventName'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
let that;

class LeftTree extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      data: [{
        name: '数据工厂',
        open: true,
        children: [{
          name: 'adsdsd',
          active: true
        }, {
          name: 'ioio'
        }, {
          name: 'tutrut',
          children: [{
            name: 'dasd'
          }]
        }]
      }, {
        name: '配置中心'
      }, {
        name: '配置中心2',
        children: [{
          name: 'dsads'
        }]
      }]
    }
  }

  componentDidMount() {
    this.getLeftTreeList();
  }

  // 从接口获取树列表数据
  getLeftTreeList() {
    that = this;
    let param = {tenant:'test',parm:'test'}
    AjaxReq.getLeftTreeList(param, function(result) {
      that.setState({
        data: [result.data]
      });
    })
  }

  handleActive(data) {
    console.log(data)
    EventEmitter.dispatch(EventName.updateTopInfo, data);
  }

  /**
   * 树节点渲染
   * @param item
   */
  treeRender(item) {
    return <TextOverflow><div>{item.name}</div></TextOverflow>;
  }

  render() {
    that = this;
    return (
      <div className="tree-border">
        <Tree data={this.state.data} onActive={this.handleActive}  render={this.treeRender.bind(this)}/>
      </div>
    );
  }
}

export default LeftTree;
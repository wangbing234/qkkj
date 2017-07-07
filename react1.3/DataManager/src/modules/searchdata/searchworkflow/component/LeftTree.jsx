import React from "react";
import Tree from 'bfd-ui/lib/Tree'
import AjaxReq from '../model/AjaxReq'
import EventName from 'EventName'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
let that;

class LeftTree extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      data: []
    }
    EventEmitter.subscribe( EventName.CHANGE_TENANT, this.changeTenant.bind(this) );
  }

  componentDidMount() {
    this.isUnmount = false;
    this.getLeftTreeList();
  }

  componentWillUnmount(){
    this.isUnmount = true;
  }

  changeTenant(tenantId){
    this.getLeftTreeList(tenantId);
  }

  // 从接口获取树列表数据
  getLeftTreeList(tenantId) {
    let that = this;
    let param = {tenant:tenantId?tenantId:''};
    AjaxReq.getLeftTree(param,function(result) {
      if(result){
        EventEmitter.dispatch(EventName.UPDATE_PROJECT_DESC_INFO, that.props.projectCode);
        //result.active=true;
        result.name = `${result.name}(${result.count})`;
        if(result.children){
          result.children.map((item,index)=>{
            if(item.project_code == that.props.projectCode){
              item.active = true;
            }
            //项目名称后拼上工作流数
            item.name = `${item.project_code}(${item.workflow_count})`
          })

        }
      }

      if(!that.isUnmount){
        that.setState({
          data: [result]
        });
      }
    })
  }

  handleActive(data) {
    console.log(data);
    EventEmitter.dispatch(EventName.UPDATE_PROJECT_DESC_INFO, data);
  }

  getIcon(data) {
    return data.open ? 'folder-open' : 'folder'
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
        <Tree data={this.state.data} render={this.treeRender.bind(this)} onActive={this.handleActive.bind(this)} getIcon={this.getIcon}/>
      </div>
    );
  }
}

export default LeftTree;
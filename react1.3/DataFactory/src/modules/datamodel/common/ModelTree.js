import React from 'react';
import Tree from 'bfd-ui/lib/Tree'
import '../css/style.less'
import CanvasAjax from '../modelcanvas/ajax/AjaxReq'
import TypeConst from './TypeConst'
import  TablePopWin from '../modellist/tablewin/TablePopWin'
import NodeConfig from '../modelcanvas/component/editorconfig/config'
import message from 'bfd-ui/lib/message'
import confirm from 'bfd-ui/lib/confirm'
import rightMenu from 'CommonComponent/component/rightmenu'
import CreateDir from './win/CreateDir'
import CommonModalWin from './CommonModalWin'
import CommonTree from './CommonTree';
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import update from 'react-update'
import get from 'lodash/get'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

//1：层级，2：主题域，3：文件夹，4，表
class ModelTree extends React.Component {
  constructor(props){
    super(props);
    this.state= {data:[]};
    this.objectArray={};//唯一标识和路径的对应数组
    this.callBackHander=function(){};
    this.update = update.bind(this);
    EventEmitter.subscribe(TypeConst.DELETE_ONDID_ON_TREE,this.deleteNodeOnTreeByCode.bind(this));
    //增加刷新树事件
    EventEmitter.subscribe(TypeConst.REFRESH_COMMON_MODEL_TREE,this.refreshCommonModelTree.bind(this));
  }

  componentDidMount() {
    this.loadInterval = setInterval(this.queryModelTree(),100);
    //设置隐藏右键菜单
    document.body.oncontextmenu = function (e) {
      e.preventDefault();
      return false;
    }
  }

  /**
   * 组件卸载,清除事件监听
   */
  componentWillUnmount() {
    //EventEmitter.remove(TypeConst.DELETE_ONDID_ON_TREE)
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /**
   * 打开数据表对话框
   * @param data，数据
   */
  openDiffrentTable(data,infoCode,_callBackHander){
    this.callBackHander=_callBackHander;
    let config= this.getConfigByKeyAndValue(NodeConfig.node, 'id', data.tableType.toLowerCase());
    this.refs.tablePopWin.setState({tableConfig:config.window,data:data,infoCode:infoCode});
    this.refs.tablePopWin.refs.tablePopWin.open();
  }

  /**
   * 获取配置的数据
   * @param data，数据
   */
  getConfigByKeyAndValue(configs, key, value) {
    let _value=this.getType(value);
    configs = configs || [];
    for (let i = 0, length = configs.length; i < length; i++) {
      if (configs[i][key] === _value) {
        return configs[i];
      }
    }
  }

  /**
   * 通过类型区分
   * @param value
   * @returns {*}
     */
  getType(value){
    if(["mysql","oracle","db2"].indexOf(value)>-1)
        return "rdbms"
    return value;
  }


  /**
   * 查询第几页
   * @param page 第几页
   */
  queryModelTree() {
    let that=this;
    CanvasAjax.queryModeTree((data) => {
      CommonUtil.spreadTree(data);
      if(that.loadInterval){
        that.setState({data:[{name:"全部",open:true,type:-1,code:-1,children:data}]});
      }
    })
  }

  /**
   * 获取Tree图标
   * @param data
   * @returns {string}
   */
  filterHander(data) {
    return data.data;
  }

  /**
   * 调用后台删除节点
   * @param msg
   * @param code
     */
  deleteTableTree(msg,code)
  {
    CanvasAjax.deleteTableTree(code, function (result) {
      EventEmitter.dispatch(TypeConst.DELETE_ONDID_ON_TREE,code)
      message.success(msg,3)
    })
  }

  /**
   * 刷新公用模型树
   */
  refreshCommonModelTree(){
    this.queryModelTree();
  }

  /**
   * 异步在树上删除节点
   * @param code
     */
  deleteNodeOnTreeByCode(code)
  {
    let path=this.objectArray[code];
    if(path)
    {
      this.refrehParentNode({code},false);
    }
  }

  /**
   *
   * @param code
   * @param item
     */
  adddTableOnTree(pCode,item)
  {
    let path=this.objectArray[pCode];
    if (path.length <= 1) return
    let thisData=$.extend(true,[],this.state.data)
    let parent = get(thisData, path);
    let isHasArray=parent.children instanceof Array && parent.children.length>0;
    if(isHasArray)
    {
      parent.children.push(item);
    }
    else {
      parent.children=[item];
    }
    this.state.data=thisData;
    return thisData;
  }

  /**
   * 脚本树右键菜单
   */
  rightMenuHandler(evt) {
    evt.stopPropagation()

    let that = this;
    let code = evt.target.getAttribute('data-code')//文件编码
    let type = parseInt(evt.target.getAttribute('data-type'))//文件类型
    let name = evt.target.getAttribute('data-name')//文件名称
    let pCode = evt.target.getAttribute('data-pcode')//文件父编码
    let parmItem={code,type,name,pCode}
    let newItem={code,type,pCode}
    let menuArray=[];
    switch (type){
      case -1://层级
      {
        menuArray=[
          {
            text: '刷新',
            //dataCode:"1020613",
            func: function (node) {
              that.refreshCommonModelTree()
            }
          }]
        break;
      }

      case 2://主题域
      {
        menuArray=[
          {
          text: '新建文件夹',
            dataCode:"1020613",
            func: function (node) {
              that.refs.mCreateDir.setState({title:"新建文件夹",node:newItem,editor:false})
              that.refs.mCreateDir.open()
        }
        }]
        break;
      }
      case 3://目录
      {
        menuArray=[
          {
            text: '新建文件夹',
            dataCode:"1020613",
            func: function (node) {
              that.refs.mCreateDir.setState({title:"新建文件夹",node:newItem,editor:false})
              that.refs.mCreateDir.open()
            }},
          {text: '重命名',
            func: function (node)
            {
              that.refs.mCreateDir.setState({title:"重命名文件夹",node:parmItem,editor:true})
              that.refs.mCreateDir.open()
            }
          },
          {text: '删除',
            func: function (node)
            {
              CanvasAjax.treeHasChildren({code:code},(data)=>{
                if(data==true)//接口是怎么样的
                {
                  confirm('此目录有子目录，是否确定删除?', () => {
                    that.deleteTableTree("删除目录成功!",code);
                  })
                }
                else {
                  confirm('是否确定删除次目录?', () => {
                    that.deleteTableTree("删除目录成功!",code);
                  })
                }
              })
            }
          }
        ]
        break;
      }
      case 4://脚本
      {
        if(this.props.operatorType=="canvas")
        {
          menuArray.push( {text: '查看一级关系',
            func: function (node)
            {

              EventEmitter.dispatch(TypeConst.LOAD_BY_TABLE_CODE_LEVEL,{level:1,tableCode:code})
            }
          })

          menuArray.push({text: '查看二级关系',
            func: function (node)
            {
              EventEmitter.dispatch(TypeConst.LOAD_BY_TABLE_CODE_LEVEL,{level:2,tableCode:code})
            }
          })
          menuArray.push({text: '查看三级关系',
            func: function (node)
            {
              EventEmitter.dispatch(TypeConst.LOAD_BY_TABLE_CODE_LEVEL,{level:3,tableCode:code})
            }
          })
        }
        menuArray.push(
          {text: '彻底删除',
            dataCode:"1020614",
            func: function (node)
            {
              confirm('是否确定删除该表吗?', () => {
                that.deleteTableTree("删除表成功!",code);
              })
            }
          })

        break;
      }
      case -1://根目录
      {
        return "folder"
        break;
      }
    }

    if(menuArray.length>0)
       rightMenu.show({ x: evt.pageX, y: evt.pageY, data: menuArray});
  }

  /**
   * 树节点渲染
   * @param item
   */
  treeRender(item,path) {
    this.objectArray[item.code]=path;
    let propData = {
      "data-code": item.code,
      "data-name": item.name,
      "data-type": item.type,
      "data-pcode": item.pCode
    }


    //脚本文件才可以拖拽
    if (item.type==4) {
      return  <TextOverflow><div draggable className="dragNodeTree4" {...propData}
                   onDragStart={CommonTree.handleDragStart.bind(this,item,1)}>
                    {item.name}</div></TextOverflow>;
    }
    //叶子节点,脚本树
    else {
      return <TextOverflow><div draggable {...propData}
                   onDragOver={this.handleAllowDrop.bind(this)}
                   onDrop={this.handleDrop.bind(this,item)}>{item.name}</div></TextOverflow>;
    }
  }


  /**
   * 是否允许拖拽
   * @param ev
   */
  handleAllowDrop(eventData) {
    eventData.preventDefault();
    let drageItem=JSON.parse(eventData.dataTransfer.getData('data'));
    return drageItem.format=="model";
  }

  /**
   * 拖拽放下的操作
   * @param item
   * @param ev
   */
  handleDrop(dropItem, ev) {
    let drageItem=JSON.parse(ev.dataTransfer.getData('data'));
    console.info("treeNode drop", dropItem.name);
    if(drageItem.format=="model")
        this.moveTreeNodeHander(drageItem,dropItem);
  }

  /**
   * 移动处理
   * @param drageItem
   * @param dropItem
     */
  moveTreeNodeHander(drageItem,dropItem){
    if(this.isSameClass(drageItem,dropItem))
      return;
    CanvasAjax.moveTreeNode({source:JSON.stringify(drageItem),target:JSON.stringify(dropItem)},(data)=>{
      drageItem.pCode=dropItem.code;
      dropItem.open=true;
      EventEmitter.dispatch(TypeConst.DELETE_ONDID_ON_TREE,drageItem.code);
      this.refrehParentNode(dropItem,true);
    })
  }

  /**
   * 是否是统一拖拽目标对象
   * @param evt
   */
  isSameClass(drageItem,dropItem){
    let pPath=this.objectArray[dropItem.code];
    let cPath=this.objectArray[drageItem.code];
    let pItem = get(this.state.data, pPath);
    let cItem = get(this.state.data, cPath.slice(0, -2));
    let dragP=this.getHierarchyNameCode(drageItem);
    let dragD=this.getHierarchyNameCode(dropItem);
   if(dragP!=dragD)
   {
     message.danger("只能在同一个层级下拖动")
     return true;
   }

    return pItem===cItem
  }

  getHierarchyNameCode(item){
    let cPath=this.objectArray[item.code];
    let parentItem=get(this.state.data, cPath);
    if(parentItem && parentItem.type==1)
      return parentItem
    else if(!parentItem)
      return null
    return this.getHierarchyNameCode(get(this.state.data, cPath.slice(0, -2)))
  }

  /**
   * 双击脚本树打开脚本
   * @param evt
   */
  onDoubleClickHander(evt) {
    let dataType = evt.target.getAttribute('data-type');
    let code = evt.target.getAttribute('data-code');
    if(!code || !dataType)
        return;
    let operatorType=this.props.operatorType
    if(dataType==-1 && operatorType!="list")
    {
      EventEmitter.dispatch("refrsh_canvas_cell")
    }
    //如果是双击表
    else if (dataType=="4") {
      CanvasAjax.viewTableByCode({code},(data)=>{
        this.openDiffrentTable(data,true)
      })
    }
    //如果是文件夹
    else if(this.props.operatorType=="list")
    {
      let parms={pCode:code,pType:dataType};
      if(code==-1)
        parms=null;
      EventEmitter.dispatch(TypeConst.QUERY_MODEL_BY_TYPE,parms)
    }
    else if(["1","2","3"].indexOf(dataType)>-1){
      EventEmitter.dispatch(TypeConst.LOAD_MODEL_BY_CODE,{code:code,treeType:dataType})
    }
  }

  /**
   * 创建文件夹完成
   * @param e
     */
  submitCreateDir(state,e){
    this.refrehParentNode(state,!state.editor);
    this.refs.mCreateDir.cancelClick();
  }

  /**
   * 更新父节点
   * @param state,父节点
     */
    refrehParentNode(state,isParent=true){
      let path=this.objectArray[state.code];
      let thisData=$.extend(true,[],this.state.data)
      let cItem = get(thisData, isParent?path:path.slice(0, -2));
      CanvasAjax.queryModeTreeByUrlAsync(this.getUrl(cItem),(data) => {
        for (let dObj of data.data) {
          for (let iobj of cItem.children)
          {
             if(dObj.code==iobj.code && iobj.children && iobj.children.length>0)
             {
               dObj.children=iobj.children;
               break;
             }
          }
      }
        cItem.children=data.data;
      })

    this.setState({data:thisData});
    }

  /**
   * 增加修改方法，不然组件报错
   * @param data
   */
  onChangeHander(data)
  {
    this.state.data=data;
    console.log("tree chanage",data);
  }

  /**
   * 增加表回掉
   */
  tablePopWinSubmit(){
    this.callBackHander && this.callBackHander();
  }


  /**
   * 获取查询树的URL
   * @param item
   * @returns {*}
     */
  getUrl(item)
  {
    return `${Server.dataFactory}uml/tree/getChildren?pCode=${item.code?item.code:''}&projectCode=${item.code?'':window.projectCode}&type=${item.type?item.type:''}&hasTable=true`
  }

  render(){
    let treeData=this.state.data;
    return (
        <div className="dragModelTree">
          <Tree  data={treeData} ref="tree" dataFilter={this.filterHander.bind(this)}
                 getIcon={CommonTree.getIcon}  render={this.treeRender.bind(this)}
                 onDoubleClick={this.onDoubleClickHander.bind(this)}
                 onChange={this.onChangeHander.bind(this)}
                 onActive={(nodes)=>{}}
                 onContextMenu={this.rightMenuHandler.bind(this)}
                 getUrl={this.getUrl.bind(this)}/>
             <TablePopWin ref="tablePopWin" submit={this.tablePopWinSubmit.bind(this)}/>
             <CommonModalWin className="none" ref="mCreateDir" title="重命名" Child={CreateDir} submit={this.submitCreateDir.bind(this)}/>
          </div>)
    }
}
export default ModelTree;
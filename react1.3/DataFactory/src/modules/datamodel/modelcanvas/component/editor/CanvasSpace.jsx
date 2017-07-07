/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:编辑器主页面
 *
 ***************************************************/
import React from 'react';
import {ToolBar,MenuBar,Paper,Modal,RightMenu,Loading} from 'Editor'
import Serialization from './serialization'
import Parser from './parser'
import message from 'CommonComponent/component/bdosmessage'
import Ajax from '../../ajax/AjaxReq'
import  TypeConst from '../../../common/TypeConst'
import rightMenu from 'CommonComponent/component/rightmenu'
import Config from '../editorconfig/config'
import confirm from 'bfd-ui/lib/confirm'
import ReactDOM from 'react-dom'
import shouldComponentUpdate from 'bfd-ui/lib/shouldComponentUpdate'
//时间类型
const EVENTNAMES = {
  SAVECELLS: 'paper_saveCells',   //触发保存事件时抛出 工作区间的所有节点
  FORMSAVE: '_paper_formSave',    //节点弹窗保存派发出的事件
  PAPER_EXPORT_CELL:"paper_Export_cell",//parper保存
  REFRSH_CANVAS_CELL:"refrsh_canvas_cell",//parper保存
  PAPER_SAVE_CELL_COMPELENT:"paper_save_cell_compelent",//parper保存
  SCREEN_FULL:"screen_full"//全屏
}

//页面显示类型
const PAGE_TYPE = {
  MAIN_EDIT:"mainEdit",
  DATA_MANAGER: 'dataManager',   //数据管理表关系
  DATA_MANAGER_PROJECT: 'dataManagerProject',   //数据管理project表关系
  FONT_PAGE: 'fontPage',    //首页展示

}

class CanvasSpace extends React.Component {
  constructor(props) {
    super(props);
    this.state={};
    //this.removeListenter();
    this.paperSaveCells=this.paperSaveCells.bind(this);
    this.screenFullHander=this.screenFullHander.bind(this);
    this.loadByTableCode=this.loadByTableCode.bind(this);
    this.queryListByCode =this.queryListByCode.bind(this);
    this.paperSavCellCcompelent =this.paperSavCellCcompelent.bind(this);
    this.queryAllData=this.queryAllData.bind(this);
    this.loadByCode=this.loadByCode.bind(this);
    if(PAGE_TYPE.FONT_PAGE!=this.props.type) {
      EventEmitter.subscribe(EVENTNAMES.SAVECELLS, this.paperSaveCells);
      EventEmitter.subscribe(EVENTNAMES.PAPER_EXPORT_CELL, this.paperExport);
      EventEmitter.subscribe(EVENTNAMES.SCREEN_FULL, this.screenFullHander);
      EventEmitter.subscribe(TypeConst.LOAD_BY_TABLE_CODE_LEVEL,this.loadByTableCode);
      EventEmitter.subscribe(TypeConst.QUERY_MODEL_BY_TYPE,this.queryListByCode);
      EventEmitter.subscribe(EVENTNAMES.PAPER_SAVE_CELL_COMPELENT,this.paperSavCellCcompelent);
      EventEmitter.subscribe(EVENTNAMES.REFRSH_CANVAS_CELL,this.queryAllData);
    }

    EventEmitter.subscribe(TypeConst.LOAD_MODEL_BY_CODE,this.loadByCode);
    console.log("构造方法调用。。。")
  }

  /**
   * 保存完成之后加载数据
   * @param data
     */
  paperSavCellCcompelent(data){
    this.loadModelByJson({root:data},true);
  }


  componentDidMount() {
    this.queryAllData();
  }

  removeListenter(){
    if(PAGE_TYPE.FONT_PAGE!=this.props.type) {
      EventEmitter.remove(EVENTNAMES.SAVECELLS, this.paperSaveCells);
      EventEmitter.remove(EVENTNAMES.PAPER_EXPORT_CELL, this.paperExport);
      EventEmitter.remove(EVENTNAMES.SCREEN_FULL, this.screenFullHander);
      EventEmitter.remove(TypeConst.LOAD_BY_TABLE_CODE_LEVEL,this.loadByTableCode);
      EventEmitter.remove(TypeConst.QUERY_MODEL_BY_TYPE,this.queryListByCode);
      EventEmitter.remove(EVENTNAMES.PAPER_SAVE_CELL_COMPELENT,this.paperSavCellCcompelent);
      EventEmitter.remove(EVENTNAMES.REFRSH_CANVAS_CELL,this.queryAllData);
    }
    EventEmitter.remove(TypeConst.LOAD_MODEL_BY_CODE,this.loadByCode);
  }

  componentWillUnmount(){
    this.removeListenter();
    let _jaxArray=[this.loadByDataaseAndTablenameAjax,
      this.queryModelCanvasAjax,
      this.queryTableRelationAjax,
      this.saveUMLAjax,
      this.delByCode,
      this.doRemoveNodeDidAjax,
      this.delByCodeDidAjax,
      this.loadByTableCodeAjax,
      this.treeLoadByTableCodeAjax,
      this.loadByCodeAjax];
    for (let _jax of _jaxArray) {
      if(_jax)
      {
        _jax.abort();
        _jax = null;
      }
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    return shouldComponentUpdate.call(this, ['data'], nextProps, nextState)
  }

  workspaceScroll(pos,nodes){
    var paper_div= $(ReactDOM.findDOMNode(this.refs.paper_div))
    if(this.props.type==PAGE_TYPE.MAIN_EDIT)
    {
      if(pos.x!=0)
        paper_div.scrollLeft((pos.x-100));
      if(pos.y!=0)
        paper_div.scrollTop((pos.y-100));
    }
    else{
      this.refs.paper.changeElementPostion(pos,nodes);
    }
  }

  /**
   * 查询编辑器界面
   */
  queryAllData(){
    //数据管理
    if(PAGE_TYPE.DATA_MANAGER==this.props.type)
    {
      this.loadByDataaseAndTablenameAjax=Ajax.loadByDataaseAndTablename({data_base:this.props.table.database,table_name:this.props.table.table_name,level:1},(data)=>{
        let result=data.result;
        this.loadModelByJson(result);
        this.props.callback(result.ref);
      })
    }
    else {//查询模型数据
      let parms;
      if(PAGE_TYPE.DATA_MANAGER_PROJECT==this.props.type)
      {
        parms= {projectCode:this.props.projectCode};
      }
      else{
        parms= {projectCode:window.projectCode};
      }

      this.queryModelCanvasAjax=Ajax.queryModelCanvas(parms,(data)=>{
        this.loadModelByJson(data);
      })
    }
  }


  /**
   * 加载模型
   * @param jsonObj
     */
  loadModelByJson(jsonObj,isPostion){
    let that=this;
    let editorData = Parser(jsonObj, Config);
    setTimeout(() => {
      if(that.refs.paper)
        that.refs.paper.updateGriphic(editorData,isPostion);
    },200);
  }


  /**
   * 查询表关系
   * @param item
     */
  queryListByCode(item){
    let that=this;
    if(item && item.oType!=0)
    {
      var info14={code:item.code};
      that.queryTableRelationAjax=Ajax.queryTableRelation(info14,(data) => {
        that.setState({tableData: data});
      })
    }
  }

  /**
   * 全屏
   */
  screenFullHander(e) {
    var workSpaceId=$(ReactDOM.findDOMNode(this.refs.workSpace));
    if(workSpaceId.hasClass("normoalScreenStyle"))
    {
      workSpaceId.removeClass("normoalScreenStyle");
      workSpaceId.addClass("fullScreenStyle")
    }
    else if(workSpaceId.hasClass("fullScreenStyle"))
    {
      workSpaceId.removeClass("fullScreenStyle");
      workSpaceId.addClass("normoalScreenStyle")
    }
  }

  /**
   * 导出数据
   */
  paperExport(cells) {
    let jsonObject = Serialization(cells,Config);
    let jsonString=JSON.stringify(jsonObject);
    console.log("导出数据"+jsonString);
}


  /**
   * 导出数据
   */
  paperSaveCells(cells){
    let that=this;
    let jsonObject = Serialization(cells,Config);
    jsonObject.root.projectCode=window.projectCode;
    let jsonString=JSON.stringify(jsonObject.root);
    that.saveUMLAjax=Ajax.saveUML({"struct":jsonString},(data)=>{
      message.success("保存成功！");
      EventEmitter.dispatch(EVENTNAMES.PAPER_SAVE_CELL_COMPELENT,data)
    })
  }

  /**
   * 界面删除图元
   * @param node
     */
  removeNode(ev){
    this.delByCode= Ajax.delByCode({infoCode:ev.model.get("data").infoCode,projectCode:window.projectCode},(data)=>{
        ev.model.remove();
        message.success("删除成功！");
      })
  }


  /**
   * 界面删除线段
   * @param node
   */
  removeLink(ev){
      ev.model.remove();
  }


  /**
   * 彻底删除
   * @param node
   */
  removeNodeDid(ev) {
    let that=this;
    confirm('彻底删除会删除数据库中的表，确认删除吗？', () => {
      that.doRemoveNodeDidAjax=that.doRemoveNodeDid(ev);
    })
  }

  /**
   * 实际删除代码
   * @param ev
     */
  doRemoveNodeDid(ev){
    let _data = ev.model.get("data");
    this.delByCodeDidAjax=Ajax.delByCodeDid({code: (_data.infoCode || _data.infoCode)}, (data)=> {
      ev.model.remove();
      EventEmitter.dispatch(TypeConst.DELETE_ONDID_ON_TREE,_data.infoCode);
      EventEmitter.dispatch(TypeConst.DELETE_ONDID_ON_TREE,_data.id);
      message.success("彻底删除成功！");
    })
  }

  /**
   * 查询几级关系
   * @param node
   */
  loadByTableCode(data){
    this.loadByTableCodeAjax= Ajax.loadByTableCode(data,(data)=>{
      this.loadModelByJson(data);
    })
  }

  /**
   * 查询几级关系
   * @param node
   */
  treeLoadByTableCode(ev,level){
    let _data=ev.model.get("data");
    this.treeLoadByTableCodeAjax= this.loadByTableCode({tableCode:(_data.infoCode || _data.shape.uiModel.infoCode),level:level});
  }

  /**
   * 通过左侧树查询UML模型
   * @param node
   */
  loadByCode(data)
  {
    this.loadByCodeAjax= Ajax.loadByCode(data,(data)=>{
      this.loadModelByJson(data);
    })
  }



  render() {
    let that=this;
    let noTopStyle={};
    let menus={};
    let menuBar;
    let zoomObj=(PAGE_TYPE.FONT_PAGE==this.props.type)?{zoom: 0.5}:{};
    //如果是主编辑区域
    let canEdit=(PAGE_TYPE.MAIN_EDIT==this.props.type);
    if(canEdit)
    {
      //邮件菜单借点
      menus.node = [
        {
          text: '查看一级关系',
          func: function (node,ev) {
            that.treeLoadByTableCode(ev,1)
          }
        },
        {
          text: '查看二级关系',
          func: function (node,ev) {
            that.treeLoadByTableCode(ev,2);
          }
        },
        {
          text: '查看三级关系',
          func: function (node,ev) {
            that.treeLoadByTableCode(ev,3);
          }
        },
        {
          text: '删除',
          dataCode:"1020607",
          func: function (node,ev) {
            that.removeNode(ev);
          }
        },
        {
          text: '彻底删除',
          dataCode:"1020614",
          func: function (node,ev) {
            that.removeNodeDid(ev);
          }

        },
      ];

      menus.link=[{
        text: '删除',
        dataCode:"1020607",
        func: function (node,ev) {
          that.removeLink(ev);
        }
      }];

      menuBar = (
          <MenuBar>
            <ToolBar paper="paper" config={Config} dispatchEventName="paper_createNode"/>
          </MenuBar>);
    }
    else
    {
      noTopStyle={paddingTop:0,overflow:"hidden"};
    }

    let idProps={id:"noUse"};
    if(PAGE_TYPE.FONT_PAGE!=this.props.type)
    {
      idProps= {id:"paper"};
    }

    return (
      <div ref="workSpace"  className="normoalScreenStyle">
          {menuBar}
          <div ref="paper_div"  id="paper_div" className="paperStyle" style={noTopStyle}>
            <Paper {...idProps} ref="paper" rightMenu={{rightMenu,menus}} owner={this} Ajax={Ajax} style={zoomObj} onlyRead={!canEdit}
                                removeNode={this.removeNode.bind(this)}
                   config={Config} data={this.state.data} Modal={Modal}>
            </Paper>
        </div>
      </div>
    )
  }
}
export default CanvasSpace
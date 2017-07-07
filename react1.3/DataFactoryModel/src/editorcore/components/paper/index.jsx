/**
 * 时间: 16/4/27 14:01
 * 作者: zhongxia
 * 说明: Joint工作区间组件, 支持挂工具栏,弹框 组件.
 * 需要完善的地方:
 *  1. 如何把 事件注册的相关操作抽取出来,
 *  2. 保存的方法,反序列化,需要放到外面去做
 */

import React from 'react'
import message from 'CommonComponent/component/bdosmessage'
import BfdRequest from 'CommonComponent/request/AjaxRequest'
import nodeSerializer from './js/util/nodeSerializer.js'
import './css/joint.css'
import './css/paper.less'
import confirm from 'bfd-ui/lib/confirm'
import BaseNode from './js/basenode/nodeShape.js'
import shouldComponentUpdate from 'bfd-ui/lib/shouldComponentUpdate'
import ReactDOM from 'react-dom'
//let commandManager;  //历史管理器,支持前进,回退

//拖拽格式
const DRAG_FORAMT = {
  TOOLS:"tools",
  MODEL:"model"
}

/**
 * 注册,派发的事件名
 * @type {{}}
 */
const EVENTNAMES = {
  ADDLINE: '_paper_addLine',      //添加线段
  DELETE: 'paper_delete',         //删除
  //UNDO: 'paper_undo',             //后退
  //REDO: 'paper_redo',             //后退
  //PAPER_REUNDO: 'paper_reundo',  //前进
  //CLEAN: 'paper_clean',           //清除
  SAVE: 'paper_save',
  IMPORT:"paper_open",//导入
  EXPORT: "paper_export",//导出
  CREATENODE: 'paper_createNode', //tool创建节点
  CREATENODE_TOOL: 'createnode_tool', //创建节点
  SAVECELLS: 'paper_saveCells',   //触发保存事件时抛出 工作区间的所有节点
  FORMSAVE: '_paper_formSave',    //节点弹窗保存派发出的事件
}


class Paper extends React.Component {
  constructor(props) {
    super(props);
    window.__tempLine__=false;
    this.graph;  //工作区的图
    this.paper;  //工作区
    this.selectCells;
    this.tempLink;//当前线段
    this.beginElemet;//起始节点
    this.isMoveing;//是否正在移动
    this.startMovingModel;//点击的起点图元
    this.state = {
      data: this.props.data,
      nodeArray:[],
      loaded:false
    };

    console.log("parper.constructor  构造方法....")

    let dispalyLabel=this.props.style.zoom?true:false;
    this.changeListState=this.changeListState.bind(this)
    this.paperDelete=this.paperDelete.bind(this)
    this.paperSave=this.paperSave.bind(this)
    this.dropCreateNodeTree=this.dropCreateNodeTree.bind(this)
    this.dropCreateNode= this.dropCreateNode.bind(this);
    this.removeEvent= this.removeEvent.bind(this);
    EventEmitter.subscribe("removeCanvas_event", this.removeEvent);
    if(!dispalyLabel)
    {
      console.log("parper.subscribeEvent....")
      //注册外部传进来的事件
      this.props.regFn && this.props.regFn(this);
      // 顶部工具栏的事件注册
      EventEmitter.subscribe(EVENTNAMES.ADDLINE, this.changeListState);
      EventEmitter.subscribe(EVENTNAMES.DELETE, this.paperDelete);
      EventEmitter.subscribe(EVENTNAMES.SAVE, this.paperSave);
      //EventEmitter.subscribe(EVENTNAMES.EXPORT, this.paperExport.bind(this));
      // 图元工具栏的事件注册
      EventEmitter.subscribe(EVENTNAMES.CREATENODE_TOOL, this.dropCreateNodeTree);// 重工作区中拖拽过来的
      // 图元工具栏的事件注册
      // 图元工具栏的事件注册
      EventEmitter.subscribe(EVENTNAMES.CREATENODE, this.dropCreateNode); // 图元工具栏的事件注册
    }
  }


  componentDidMount() {
    let that=this;
    require.ensure([], function (require) {
      that.initPaper();
      that.initPaperEvent();
      //that.initCommandManager();
    })

    //接受的外部事件
    this.subscribeEvent();
    //接受键盘事件
    //this.onKeyDownHander();
  }

  /**
   * 键盘事件
   */
  //onKeyDownHander(e){
  //  $(document).keydown(function(e){
  //    if(e.ctrlKey){
  //      if(e.which == 67)//ctrl+C
  //      {
  //        let model = this.selectCells.attributes;
  //        let config = this.selectCells.attributes.data.config;
  //      }
  //      else if(e.which == 86)//ctrl+V
  //      {
  //        this.selectCells;
  //      }
  //    }
  //  });
  //}


  /**
   * 更新图形
   * @param data
   * @param isPostion
     */
  updateGriphic(data,isPostion){
    this.clearThis();
    this.initNodes(data,isPostion);
    this.initLines(data);
  }

  /**
   * 事件注册
   */
  subscribeEvent() {

  }

  /**
   * 组件卸载,清除事件监听
   */
  componentWillUnmount() {
    this.removeEvent();
    let _jaxArray=[this.tableAddAjax,this.viewTableByCodeDragAjax,this.viewTableByCodeDragAjax];
    for (let _jax of _jaxArray) {
      if(_jax)
      {
        _jax.abort();
        _jax = null;
      }
    }
  }

  removeEvent(){
    let dispalyLabel=this.props.style.zoom?true:false;
    if(!dispalyLabel) {
      console.log("parper.componentWillUnmount....")
      EventEmitter.remove(EVENTNAMES.CREATENODE, this.dropCreateNode);
      EventEmitter.remove(EVENTNAMES.CREATENODE_TOOL, this.dropCreateNodeTree);
      EventEmitter.remove(EVENTNAMES.ADDLINE, this.changeListState);
      EventEmitter.remove(EVENTNAMES.DELETE, this.paperDelete);
      //EventEmitter.remove(EVENTNAMES.UNDO);
      //EventEmitter.remove(EVENTNAMES.REDO);
      //EventEmitter.remove(EVENTNAMES.CLEAN);
      EventEmitter.remove(EVENTNAMES.SAVE, this.paperSave);
      //EventEmitter.remove(EVENTNAMES.EXPORT);
    }
  }

  /**
   * 初始化历史管理器,支持前进,回退
   */
  //initCommandManager(){
  //  commandManager = new joint.dia.CommandManager({
  //    graph: that.graph
  //  });
  //}


  /**
   * 初始化工作区
   */
  initPaper() {
    this.graph=null;
    this.paper=null;
    this.graph = new joint.dia.Graph;
    debugger
    this.paper = new joint.dia.Paper({
      el: $(ReactDOM.findDOMNode(this.refs[this.props.id])),//   $('#' + ),
      width: 5000,
      height: 5000,
      gridSize: 1,
      model: this.graph
    });
  }

  /**
   * 初始化工作区间的事件绑定
   */
  initPaperEvent() {
    let that=this;
    this.paper.on('cell:pointerdown', this.cellPointerDown.bind(this));
    this.paper.on('cell:mouseout', function (evt) {
      //EventEmitter.dispatch(EVENTNAMES.PAPER_REUNDO, commandManager);
    });

    //功能：点击节点，出现边框，选中状态，点击节点，或者空白位置，则清除选中状态  START
    this.paper.on('cell:pointerdown', function (evt) {
      $('.border').removeClass('border');
      if (evt.$box) evt.$box.addClass('border');
      $('.addLine').hide();
      if (evt.$box) evt.$box.find(".addLine").show();
    });

    /**
     * 鼠标再图元上
     */
    this.paper.on('cell:mouseover', function (evt) {
      if (that.isMoveing && !evt.model.isLink() && that.canAsTarget(evt)) {
        evt.highlight();
      }
    });

    /**
     * 鼠标移出线段
     */
    this.paper.on('cell:mouseout', function (evt) {
      if (that.isMoveing && !evt.model.isLink()) {
        evt.unhighlight();
      }
    });

    /**
     * 点击空白处
     */
    this.paper.on('blank:pointerdown', function (evt) {
      that.selectCells=null;
      $('.border').removeClass('border');
      $('.addLine').hide();
      if(that.isMoveing == true)
        that.selectCells = evt;
      that.removeLinkHander();
    });

    /**
     * 邮件菜单
     */
    this.paper.on('cell:contextmenu', function (ev, evt, x, y) {
      let model=ev.model?ev.model:ev;
      let rightMenu=that.props.rightMenu;
      //如果是图元
      if (model.attributes.type == "html.Element") {
          rightMenu.rightMenu.show({ x: evt.pageX, y: evt.pageY, data: rightMenu.menus.node},ev);
      }
      else{
        rightMenu.rightMenu.show({ x: evt.pageX, y: evt.pageY, data: rightMenu.menus.link},ev);
      }
    });

   //监听双击事件
    this.paper.on('cell:pointerdblclick',that.nodeDbClickHander.bind(this));
  }

  /**
   * 双击，弹出modal
   */
  nodeDbClickHander(evt){
    let that=this;
    let data = evt.model?evt.model.get('data'):evt.get('data');
    let model=evt.model?evt.model:evt;
    let allConfig = that.props.config || {};
    let config;
    if (model.attributes.type == "html.Element") {
      config = data.config;
    }
    else {
      config = allConfig.line;
    }
    if (config && config.window) {
      let _code=data.infoCode;

      if(_code && config.id!="join")
      {
        that.viewTableByCodeAjax=  that.props.Ajax.viewTableByCode({code:_code},(data)=>{
          that.setState({PopWin: config.window, node: evt, nodeData: data});
          that.refs._modal && that.refs._modal.open();
        });
      }
      else {
        //就
        console.log(that.props.owner)
        console.log(that.isMount)
        that.setState({PopWin: config.window, node: evt, nodeData: data});
        that.refs._modal && that.refs._modal.open();
      }
    }
  }

  /**
   * 移除线段
   */
    removeLinkHander(){
      if (this.isMoveing == true) {
        this.isMoveing = false;
        $(document).unbind("mousemove", this.mousemoveHander);
        if (this.tempLink != null)
        {
          this.tempLink.remove();
          this.tempLink=null;
        }
      }
    }

  /**
   * 根据要已有的节点数据，初始化节点
   * @param tState
     */
  initNodes(tState,isPostion) {
    let that=this;
    let dispalyLabel=this.props.style.zoom?true:false;
    if (tState && tState.nodes && tState.nodes.length!=0) {
      let postion={x:tState.nodes[0].position.x,y:tState.nodes[0].position.y};
      tState.nodes.map(function (node) {
        if(node.position.x<postion.x)
        {
          postion.x=node.position.x;
        }
        if(node.position.y<postion.y)
        {
          postion.y=node.position.y;
        }
      });
      if(isPostion!==true)
          this.initPostion(postion,tState.nodes);
    }

    tState.nodes.map(function (node) {
      that.createNode(node.position.x, node.position.y, node,dispalyLabel);
    })
  }


  /**
   * 调整位置
   * @param postion
   * @param nodes
     */
  initPostion(postion,nodes){
    this.props.owner.workspaceScroll(postion,nodes);
  }

  /**
   * 不是编辑器的方法
   * @param postion
   * @param nodes
   */
  changeElementPostion(postion,nodes){
    nodes.map(function (node) {
      node.position={x:node.position.x-postion.x+100,y:node.position.y-postion.y+100}
    });
  }

  /**
   * 初始化线段
   * @param tState
     */
  initLines(tState) {
    let that=this;
    if (tState && tState.links) {
      tState.links.map(function (_link) {
        that.createLink(that.getNodeByDataID(_link.start), that.getNodeByDataID(_link.end), _link);
      });
    }
  }


  /**
   * 创建线段
   * @param elm1 起始点
   * @param elm2 结束点
   * @param _link 线段携带的data数据
   * @returns {*}
   */
  createLink(elm1, elm2, _link) {
    if(!elm1 || !elm2)
      return;
    var _tempLine = new joint.shapes.erd.Line({
      source: {
        id: elm1.id
      },
      target: {
        id: elm2.id
      },
      attrs: {
        '.marker-source': {},
        '.marker-target': {fill: '#4b4a67', stroke: '#4b4a67', d: 'M 10 0 L 0 5 L 10 10 z'}
      },
      labels: [
        {position: 0.5, attrs: {text: {text: ''}}}
      ],
      data: _link
    });

    _tempLine.addTo(this.graph);
    return _tempLine;
  }


  /**
   * 创建节点
   * @param x
   * @param y
   * @param data
   */
  createNode(x, y, data,dispalyLabel) {
    var el1 = new BaseNode({
      configId: data.id,
      position: {x: x, y: y},
      size: {width: 60, height: 60},
      label: dispalyLabel?"":data.label,
      src: data.src,
      data: data
    });
    //this.state.nodeArray.push(el1);
    this.graph.addCell(el1);
    return el1;
  }


  /**
   * 根据key 和value 获取对象数组中的 某一项
   * @param config
   * @param key
   * @param value
   * @returns {*}
   */
  getConfigByKeyAndValue(configs, key, value) {
    if(["mysql","oracle","db2"].indexOf(value)>-1)
      value="rdbms"
    configs = configs || [];
    for (let i = 0, length = configs.length; i < length; i++) {
      if (configs[i][key] === value) {
        return configs[i];
      }
    }
  }

  /**
   * 根据ID,获取工作区间中的某个图元
   * @param dataId
   * @returns {*}
   */
  getNodeByDataID(dataId) {
    let models = this.graph.getCells();
    for (let i = 0, length1 = models.length; i < length1; i++) {
      if (models[i].attributes.configId == dataId) {
        return models[i];
      }
    }
    return null;
  }

  /**
   * 节点弹框的确定按钮操作
   * @param e
     */
  modalOkHandler(e) {
    let that=this;
    let node = this.refs._popwin.props.node;
    let _model=node.model?node.model:node;
    if(!this.refs._popwin.vaildate || this.refs._popwin.vaildate())
    {
      let data = this.refs._popwin.getData && this.refs._popwin.getData();
      var oldData=_model.get("data");
      if(oldData.config.id!="join")
      {
        oldData.shape.dataModel=data;
        oldData.label=data.tableInfo.tableName;
          let url;
          let ui=oldData.shape.uiModel;
        //data.edit=oldData.edit;
          let isAddInfo=false;
          if(oldData && oldData.infoCode)
          {
            url=`${Server.dataFactory}uml/table/update`;
          }
          else {
            isAddInfo=true;
            url=`${Server.dataFactory}uml/table/add`;
          }
        that.tableAddAjax=  BfdRequest.ajaxPostData(url,{table:JSON.stringify(data)},(data)=>{
            if(isAddInfo)
            {
              oldData.infoCode=data.code;
              oldData.keyId=0;
            }
            _model.set({data: oldData, label: oldData.label});
            that.refs._modal.close();
          });
      }
      else {
        data.infoCode="join";
        data.label=data.chinaName?data.chinaName:data.label;
        _model.set({data: data, label: data.chinaName?data.chinaName:data.label});
        that.refs._modal.close();
      }
    }
  }


  /**
   * 关闭处理，如果没有报错，删除
   * @param _model
     */
  closeHandler(_model) {
    if(this.state.node  && this.state.node.attributes && this.state.node.attributes.data && this.state.node.attributes.data.infoCode)
    {
      console.log("新增编辑有数据图元！");
    }
    else if(this.state.node &&  this.state.node.model && this.state.node.model.attributes && this.state.node.model.attributes.data.infoCode)
    {
      console.log("此图有是有数据的图元！");
    }
    else {
      console.log("工具栏中拖拽的图元！");
      this.state.node.remove();
    }
  }

  /*******************************************************************
   *   顶部MenuBar条 相关  START
   *******************************************************************/

  /**
   * 撤销
   * @param evt
     */
  //paperUndo(evt) {
  //  commandManager.undo();
  //  EventEmitter.dispatch(EVENTNAMES.PAPER_REUNDO, commandManager);
  //}

  /**
   * 重做
   * @param evt
     */
  //paperRedo(evt) {
  //  commandManager.redo();
  //  EventEmitter.dispatch(EVENTNAMES.PAPER_REUNDO, commandManager);
  //}

  /**
   * 清空
   * @param evt
     */
  //paperClean(evt) {
  //  let that=this;
  //  confirm('确认要清空面面板吗？', () => {
  //    that.clearThis();
  //  })
  //}

  clearThis(){
    this.graph.clear();
    //commandManager.reset();
    //EventEmitter.dispatch(EVENTNAMES.PAPER_REUNDO, commandManager);
  }

  /**
   * 删除
   * @param evt
     */
  paperDelete(evt) {
    if (this.selectCells) {
      this.props.removeNode(this.selectCells);
      this.selectCells=null;
    }
    else {
      message.danger("请选择删除的节点！");
    }
  }

  /**
   * 保存,是抛出事件,让外部处理
   * @param evt
   */
  paperSave(evt) {
    let cells = this.graph && this.graph.getCells();
    EventEmitter.dispatch(EVENTNAMES.SAVECELLS, cells);
  }

  /**
   * 保存,是抛出事件,让外部处理
   * @param evt
   */
  paperExport(evt) {
    let cells = this.graph && this.graph.getCells();
    EventEmitter.dispatch("paper_Export_cell", cells);
  }


  /*******************************************************************
   *   连线 相关 START
   *******************************************************************/
  /**
   * 点击图元的连线节点,创建线段
   * @param evt
   */
  changeListState(evt) {
    let that=this;
    window.__tempLine__=true;
    let _top = $('#' + this.props.id).offset().top;
    let _left = $('#' + this.props.id).offset().left;
    let x = window.event.pageX - _left - 10;
    let y = window.event.pageY - _top - 10;

    that.beginElemet = evt;
    that.tempLink = new joint.shapes.erd.Line({
      source: {
        id: evt.id
      },
      target: {
        x: x,
        y: y
      },
      attrs: {
        '.marker-source': {},
        '.marker-target': {fill: '#4b4a67', stroke: '#4b4a67', d: 'M 10 0 L 0 5 L 10 10 z'}
      },
      labels: [
        {position: 0.5, attrs: {text: {text: ''}}}
      ],
      data: {
        config: that.props.config.line
      }
    });
    that.tempLink.addTo(evt.graph);
    that.startMovingModel = evt;
    that.isMoveing = true;
    $(document).bind("mousemove", this.mousemoveHander.bind(this));
  }


  /**
   * 连线,鼠标移动,线段随着变动
   * @param e
   */
  mousemoveHander(e):void {
    if (this.isMoveing) {
      let _top = $('#' + this.props.id).offset().top;
      let _left = $('#' + this.props.id).offset().left;
      let targetPoint = this.getIntersectionPoint(this.startMovingModel.attributes.position, {
        x: e.pageX - _left - 10,
        y: e.pageY - _top - 10,
        width: 20,
        height: 20
      });
      this.tempLink.set('target', targetPoint);
    }
  }


  /**
   * 获取交汇的点
   * @param _point    起始点
   * @param target    要画线的目标图元
   */
  getIntersectionPoint(_point, target) {
    var p1 = {x: (target.x + target.width / 2), y: (target.y + target.height / 2)};
    var p2 = {x: (_point.x - p1.x), y: (_point.y - p1.y)};
    if (p2.x == 0 && p2.y == 0) {
      return p1;
    }
    var p3 = {};
    if (Math.abs(p2.y) >= Math.abs(p2.x) * target.height / target.width) {
      p3.y = (p2.y >= 0 ? 1 : -1) * target.height / 2;
      p3.x = 1 * p2.x / p2.y * p3.y;
    }
    else {
      p3.x = (p2.x >= 0 ? 1 : -1) * target.width / 2;
      p3.y = 1 * p2.y / p2.x * p3.x;
    }
    p3.x = p3.x + p1.x;
    p3.y = p3.y + p1.y;
    return p3;
  }

  /**
   * 点击连线的目标节点,连接线段
   * @param evt
   */
  cellPointerDown(evt) {
    this.selectCells = evt;
    if (this.isMoveing && evt.model.attributes.type == "html.Element") {
      if (this.canAsStart(this.beginElemet) && this.validateLine(this.beginElemet, evt.model) && this.canAsTarget(evt,true)) {
        this.isMoveing = false;
        this.tempLink.remove();
        window.__tempLine__ = false;
        this.createLink(this.beginElemet, evt.model, null);
      }
      else {
        this.tempLink.remove();
        this.tempLink = null;
        console.log("无法连接此步骤！");
        this.isMoveing = false;
        window.__tempLine__=false;
      }
    }
    else if(this.isMoveing && evt.model.attributes.type == "erd.Line") {
      this.removeLinkHander();
      window.__tempLine__=false;
    }
    else {
      this.isMoveing = false;
    }
    evt.unhighlight();
    $(document).off("mousemove", this.mousemoveHander.bind(this));
  }


  /**
   * 判断是否可以去连接
   * @param bElemet
   * @returns {boolean}
     */
  canAsStart(bElemet) {
    let config = bElemet.get('data').config;
    var configNum = 0;
    if (!config.outLimit)
      configNum = 1;
    else if (config.outLimit == -1)
      configNum = 100000;
    else
      configNum = config.outLimit;
    let outLines = this.graph.getConnectedLinks(bElemet, {outbound: true});
    var canLine = configNum > outLines.length - 1;
    if (!canLine) {
      canLine = false;
    }
    return canLine;
  }

  /**
   * 判断是否可以被连接
   * @param evt
   * @returns {boolean}
     */
  canAsTarget(evt,isDown) {
    let config = evt.model.get('data').config;
    let configNum = 0;
    if (!config.inLimit)
      configNum = 1;
    else if (config.inLimit == -1)
      configNum = 100000;
    else
      configNum = config.inLimit;
    let inLine = this.graph.getConnectedLinks(evt.model, {inbound: true});
    var canLine = configNum > inLine.length;
    if (!canLine) {
      if(isDown)
          message.danger("无法连接此步骤！")
      return false;
    }
    let outLine = this.graph.getConnectedLinks(evt.model, {outbound: true});
    for (let item of outLine) {
      if(item.attributes.target.id==this.beginElemet.id){
        return false;
      }
    }

    if(evt.model==this.beginElemet)
    {
      if(isDown)
        message.danger("无法连接自身！");
      return false;
    }
    return canLine;
  }


  /**
   * 验证是否可以连成线段(起始点不能和结束点属于同一个图元)
   * @param $from 起始点
   * @param $to   结束点
   * @returns {boolean}
   */
  validateLine($from, $to) {
    let that=this;
    let isVaild = true;
    if ($from == $to) {
      isVaild = false;
      return false;
    }
    let outLines = this.graph.getConnectedLinks($from, {outbound: true});
    let inLines = this.graph.getConnectedLinks($to, {inbound: true});
    outLines.map(function (_line, index) {
      if (_line != that.tempLink && inLines.indexOf(_line) > -1) {
        isVaild = false;
      }
    });
    return isVaild;
  }

  /*******************************************************************
   *   render 相关 START
   *******************************************************************/

  /**
   * 拖拽放下的处理事件
   * @param eventData 事件派发传递过来的数据
   */
  dropCreateNode(eventData) {
    let data = eventData.data;
    //从工具栏中拖拽
    if(data.format==DRAG_FORAMT.TOOLS)
    {
      let ev = eventData.ev;
      data.config = this.getConfigByKeyAndValue(this.props.config.node, 'id', data.id);
      data.shape={};
      data.shape.dataModel=null;
      data.shape.uiModel=null;
      data.src=data.config.image;
      let cNode=this.createNode(ev.layerX, ev.layerY, data);
      this.nodeDbClickHander(cNode);
    }
    //从模型中拖拽
    else  if(data.format==DRAG_FORAMT.MODEL)
    {
      this.createNodeFormDrag(eventData);
    }
  }

  /**
   * 判断是否已经在画布中
   * @param model
   * @returns {boolean}
     */
  isInCanvas(model){
      let models = this.graph.getCells();
    if(model.code)
    {
      for (let obj of models) {
        let eleData=obj.attributes.data;
        if( model.code==eleData.infoCode)
        {
          message.danger("画布上已经存在此节点！");
          return true;
        }
      }
    }
     else {
      for (let obj of models) {
        let eleData=obj.attributes.data;
        if(obj.attributes.label==model.tableName && eleData.iconType==model.iconType && eleData.shape.uiModel.type==model.tableType)
        {
          message.danger("画布上已经存在此节点！");
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 通过拖拽创建图标
   * @param eventData
     */
  createNodeFormDrag(eventData){
    let that=this;
    let data = eventData.data;
    if(this.isInCanvas(data))
    {
      return true;
    }
    let parmas={code:data.code,isCheck:true,database:data.database,tableName:data.tableName,projectCode:(data.projectCode||window.projectCode),tableType:(data.tType||1)};
    if(!data.code) {
      that.viewTableByCodeDragAjax=this.props.Ajax.viewTableByCode(parmas, (_data)=> {
          let ev = eventData.ev;
          let newData = {};
          newData.config = that.getConfigByKeyAndValue(that.props.config.node, 'id', _data.tableType);
          newData.shape = {};
          newData.infoCode = _data.tableInfo.code;
          newData.keyId = 0;
          newData.iconType = _data.tableType == "join" ? 4 : data.iconType;
          newData.edit = _data.edit;
          newData.shape.dataModel = _data;
          newData.shape.uiModel = null;
          newData.src = newData.config.image;
          newData.label = _data.tableInfo.tableName;
          that.createNode(ev.layerX, ev.layerY, newData);
        });
    }
    else {
      let ev = eventData.ev;
      let newData={};
      newData.config = that.getConfigByKeyAndValue(that.props.config.node, 'id', data.tableType);
      newData.shape={uiModel:{type:data.tableType}};
      newData.infoCode=  data.code;
      newData.keyId= 0;
      newData.iconType=data.tableType=="join"?4:data.iconType;
      newData.tableType=  data.tableType;
      // 双击要加上newData.edit=_data.edit;
      // 双击要加上  newData.shape.dataModel=_data;
      newData.src=newData.config.image;
      newData.label=data.tableName;
      that.createNode(ev.layerX, ev.layerY, newData);
    }
  }


  /**
   * 拖拽Tree处理事件
   * @param eventData 事件派发传递过来的数据
   */
  dropCreateNodeTree(eventData) {
    let data = eventData.data;
    let ev = eventData.ev;
    data.config = this.getConfigByKeyAndValue(this.props.config.node, 'id', data.id);
    data.shape={};
    data.src=data.config.image;
    data.shape.dataModel=null;
    data.shape.uiModel=null;
    data.label="自定义";
    data.src=data.config.image;
    this.createNode(ev.layerX, ev.layerY, data);
  }


  /**
   * 渲染模态框
   * @returns {XML}
   */
  renderModal() {
    const {Modal} = this.props;
    let PopWin = this.state.PopWin;
    let okButton="0";
    if(this.state.node && this.state.node.model)
    {
      let _data=this.state.node.model.get("data");
      okButton=["2","3"].indexOf(_data.iconType+"")>-1?"1":"0";
    }

    //每一个节点的弹窗配置
    let Pop = PopWin ? <PopWin ref='_popwin' node={this.state.node} data={this.state.nodeData} okButton={okButton}/> : <div></div>;
    return Modal ?
      (<Modal ref="_modal"   title="提示" okButton={okButton} okHandler={this.modalOkHandler.bind(this)} closeHander={this.closeHandler.bind(this,true)}> {Pop}  </Modal>) : <div></div>;
  }

  render() {
    let className = this.props.onlyRead ? "paper onlyRead" : "paper";
    return (
      <div className="bdos-paper" style={this.props.style}>
        <div id={this.props.id} name={this.props.id} ref={this.props.id} className={className}></div>
        {this.renderModal()}
      </div>
    );
  }
}

Paper.defaultProps = {
  id: 'paper',
  onlyRead: false
};

export default Paper;
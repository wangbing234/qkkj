/**
 * 时间: 16/4/27 14:01
 * 作者: zhongxia
 * 说明: Joint工作区间组件, 支持挂工具栏,弹框 组件.
 * 需要完善的地方:
 *  1. 如何把 事件注册的相关操作抽取出来,
 *  2. 保存的方法,反序列化,需要放到外面去做
 */
import React from 'react'

import nodeSerializer from './js/util/nodeSerializer.js'
import './css/joint.css'
import './css/paper.less'


let myLink;//当前线段
let beginElemet;//起始节点
let that;
let isMoveing;//是否正在移动
let startMovingModel;//点击的起点图元
let selectCells;//点击的起点图元
let commandManager;  //历史管理器,支持前进,回退

/**
 * 注册,派发的事件名
 * @type {{}}
 */
const EVENTNAMES = {
  ADDLINE: '_paper_addLine',      //添加线段
  DELETE: 'paper_delete',         //删除
  UNDO: 'paper_undo',             //后退
  REDO: 'paper_redo',             //前进
  CLEAN: 'paper_clean',           //清除
  SAVE: 'paper_save',             //保存
  CREATENODE: 'paper_createNode', //创建节点
  SAVECELLS: 'paper_saveCells',   //触发保存事件时抛出 工作区间的所有节点
  FORMSAVE: '_paper_formSave',    //节点弹窗保存派发出的事件
}


class Paper extends React.Component {

  constructor(props) {
    super(props);

    this.graph;  //工作区的图
    this.paper;  //工作区
    this.BaseNode;  //节点模板类，用来实例节点

    that = this;
    this.state = {
      data: this.props.data
    };

    this.subscribeEvent();

  }

  /**
   * 事件注册
   */
  subscribeEvent() {
    //注册外部传进来的事件
    this.props.regFn && this.props.regFn(this);

    // 顶部工具栏的事件注册
    EventEmitter.subscribe(EVENTNAMES.ADDLINE, this.changeListState);
    EventEmitter.subscribe(EVENTNAMES.DELETE, this.paperDelete);
    EventEmitter.subscribe(EVENTNAMES.UNDO, this.paperUndo);
    EventEmitter.subscribe(EVENTNAMES.REDO, this.paperRedo);
    EventEmitter.subscribe(EVENTNAMES.CLEAN, this.paperClean);
    EventEmitter.subscribe(EVENTNAMES.SAVE, this.paperSave);

    // 图元工具栏的事件注册
    EventEmitter.subscribe(EVENTNAMES.CREATENODE, this.dropCreateNode);
  }


  componentDidMount() {
    require.ensure([], function (require) {
      //基本图元
      that.BaseNode = require('./js/basenode/nodeShape.js');

      that.initPaper();
      that.initPaperEvent();

      that.initNodes();
      that.initLines();

      //初始化历史管理器
      commandManager = new joint.dia.CommandManager({
        graph: that.graph
      });
    })
  }

  /*******************************************************************
   *   初始化 相关 START
   *******************************************************************/
  /**
   * 初始化工作区
   */
  initPaper() {
    this.graph = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({
      el: $('#' + this.props.id),
      width: window.screen.availWidth,
      height: window.screen.availHeight,
      gridSize: 1,
      model: this.graph
    });
  }

  /**
   * 初始化工作区间的事件绑定
   */
  initPaperEvent() {
    this.paper.on('cell:pointerdown', this.cellPointerDown);
    /**
     * 功能：点击节点，出现边框，选中状态，点击节点，或者空白位置，则清除选中状态  START
     */
    this.paper.on('cell:pointerdown', function (evt) {
      $('.border').removeClass('border');
      if (evt.$box) evt.$box.addClass('border');
      $('.addLine').hide();
      if (evt.$box) evt.$box.find(".addLine").show();
    });

    this.paper.on('cell:mouseover', function (evt) {
      if (isMoveing && !evt.model.isLink() && that.canAsTarget(evt)) {
        evt.highlight();
      }
    });
    this.paper.on('cell:mouseout', function (evt) {
      if (isMoveing && !evt.model.isLink()) {
        evt.unhighlight();
      }
    });

    this.paper.on('blank:pointerdown', function (evt) {
      $('.border').removeClass('border');
      $('.addLine').hide();
      if (isMoveing == true) {
        selectCells = evt;
        isMoveing = false;
        $(document).unbind("mousemove", that.mousemoveHander);
        if (myLink != null)
          myLink.remove();
      }
    });
    this.paper.on('cell:pointerdown', function (evt) {
      EventEmitter.dispatch("paper_reundo", commandManager);
    });
    this.paper.on('cell:contextmenu', function (ev, evt, x, y) {
      EventEmitter.dispatch("paper_showRightMenu", {ev, evt, x, y});
      window._ev = ev;
    });

    // 双击，弹出modal
    this.paper.on('cell:pointerdblclick', function (evt) {
      let data = evt.model.get('data');
      let allConfig = that.props.config || {};
      let config;
      if (evt.model.attributes.type == "html.Element") {
        config = data.config;
      }
      else {
        config = allConfig.line;
      }
      if (config) {
        that.setState({PopWin: config.window, node: evt, nodeData: data});
        that.refs._modal && that.refs._modal.open();
      }
    });
  }

  /**
   * 根据要已有的节点数据，初始化节点
   */
  initNodes() {
    if (this.state.data && this.state.data.nodes) {
      this.state.data.nodes.map(function (node) {
        that.createNode(node.x, node.y, node);
      });
    }
  }

  /**
   * 初始化线段
   */
  initLines() {
    if (this.state.data && this.state.data.links) {
      this.state.data.links.map(function (_link) {
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
    var myLink = new joint.shapes.erd.Line({
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

    myLink.addTo(this.graph);
    return myLink;
  }


  /**
   * 创建节点
   * @param x
   * @param y
   * @param data
   */
  createNode(x, y, data) {
    var el1 = new that.BaseNode({
      configId: data.id,
      position: {x: x, y: y},
      size: {width: 60, height: 60},
      label: data.label,
      src: data.src,
      data: data
    });
    return that.graph.addCell(el1);
  }


  /*******************************************************************
   *   工具类方法 相关 START
   *******************************************************************/

  /**
   * 根据key 和value 获取对象数组中的 某一项
   * @param config
   * @param key
   * @param value
   * @returns {*}
   */
  getConfigByKeyAndValue(configs, key, value) {
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
      if (models[i].get('data').id == dataId) {
        return models[i];
      }
    }
    return null;
  }


  /**
   * 节点弹框的确定按钮操作
   */
  modalOkHandler(e) {
    let node = this.refs._popwin.props.node;
    let data = this.refs._popwin.getData && this.refs._popwin.getData();
    node.model.set({data: data, label: data.label});

    //派发出事件,让外部可以处理
    EventEmitter.dispatch(EVENTNAMES.FORMSAVE, {node: node, data: data})
  }

  /*******************************************************************
   *   顶部MenuBar条 相关  START
   *******************************************************************/

  paperUndo(evt) {
    commandManager.undo();
    EventEmitter.dispatch("paper_reundo", commandManager);
  }

  paperRedo(evt) {
    commandManager.redo();
    EventEmitter.dispatch("paper_reundo", commandManager);
  }

  paperClean(evt) {
    that.graph.clear();
  }

  paperDelete(evt) {
    if (selectCells != null) {
      selectCells.model.remove();
      console.log("that.graph.getCells()  :", that.graph.getCells());
    }
  }

  /**
   * 保存,是抛出事件,让外部处理
   * @param evt
   */
  paperSave(evt) {
    let cells = that.graph && that.graph.getCells();
    EventEmitter.dispatch(EVENTNAMES.SAVECELLS, cells);
  }


  /*******************************************************************
   *   连线 相关 START
   *******************************************************************/
  /**
   * 点击图元的连线节点,创建线段
   * @param evt
   */
  changeListState(evt) {
    let _top = $('#' + that.props.id).offset().top;
    let _left = $('#' + that.props.id).offset().left;
    let x = window.event.pageX - _left - 10;
    let y = window.event.pageY - _top - 10;

    beginElemet = evt;
    myLink = new joint.shapes.erd.Line({
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

    myLink.addTo(evt.graph);

    startMovingModel = evt;
    isMoveing = true;
    $(document).bind("mousemove", that.mousemoveHander);
  }


  /**
   * 连线,鼠标移动,线段随着变动
   * @param e
   */
  mousemoveHander(e):void {
    if (isMoveing) {
      let _top = $('#' + that.props.id).offset().top;
      let _left = $('#' + that.props.id).offset().left;
      let targetPoint = that.getIntersectionPoint(startMovingModel.attributes.position, {
        x: e.pageX - _left - 10,
        y: e.pageY - _top - 10,
        width: 20,
        height: 20
      });
      myLink.set('target', targetPoint);
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
    selectCells = evt;
    if (isMoveing && evt.model.attributes.type == "html.Element") {
      if (that.canAsStart(beginElemet) && that.validateLine(beginElemet, evt.model) && that.canAsTarget(evt)) {
        isMoveing = false;
        myLink.set('target', {id: evt.model.id});
      }
      else {
        myLink.remove();
        myLink = null;
        console.log("无法连接此步骤！cellPointerDown");
        isMoveing = false;
      }
    }
    else {
      isMoveing = false;
    }
    evt.unhighlight();
    $(document).off("mousemove", that.mousemoveHander);
  }


  /**
   *  判断是否可以去连接
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
    let outLines = that.graph.getConnectedLinks(bElemet, {outbound: true});
    var canLine = configNum > outLines.length - 1;
    if (!canLine) {
      canLine = false;
    }
    return canLine;
  }

  /**
   *  判断是否可以被连接
   */
  canAsTarget(evt) {
    let config = evt.model.get('data').config;
    let configNum = 0;
    if (!config.inLimit)
      configNum = 1;
    else if (config.inLimit == -1)
      configNum = 100000;
    else
      configNum = config.inLimit;
    let inLine = that.graph.getConnectedLinks(evt.model, {inbound: true});
    var canLine = configNum > inLine.length;
    if (!canLine) {
      console.log("无法连接此步骤！canAsTarget", evt);
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
    let isVaild = true;
    if ($from == $to) {
      isVaild = false;
      return false;
    }
    let outLines = that.graph.getConnectedLinks($from, {outbound: true});
    let inLines = that.graph.getConnectedLinks($to, {inbound: true});
    outLines.map(function (_line, index) {
      if (_line != myLink && inLines.indexOf(_line) > -1) {
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
    let ev = eventData.ev;
    data.config = that.getConfigByKeyAndValue(that.props.config.node, 'id', data.id);
    that.createNode(ev.layerX, ev.layerY, data);
  }

  /**
   * 渲染模态框
   * @returns {XML}
   */
  renderModal() {
    const {Modal} = this.props;
    let PopWin = this.state.PopWin;

    //每一个节点的弹窗配置
    let Pop = PopWin ? <PopWin ref='_popwin' node={this.state.node} data={this.state.nodeData}/> : <div></div>;

    return Modal ?
      (
        <Modal ref="_modal"
               title="提示"
               okHandler={this.modalOkHandler.bind(this)}>
          {Pop}
        </Modal>
      ) : <div></div>;
  }

  render() {
    let className = this.props.onlyRead ? "paper onlyRead" : "paper";
    return (
      <div className="bdos-paper">
        <div id={this.props.id} className={className}></div>
        {this.props.children}
        {this.renderModal()}
      </div>
    );
  }
}


Paper.propTypes = {
  //title: React.PropTypes.bool,
}

Paper.defaultProps = {
  id: 'paper',
  onlyRead: false
};

export default Paper;
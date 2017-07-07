/***************************************************
 * 时间: 16/6/16 17:00
 * 作者: zhongxia
 * 说明: 左侧树, 包含 脚本树, 库表树, UDF
 * 脚本树, 包含右键菜单, 悬浮显示信息 , 点击事件
 * 库表树, 包含右键菜单, 悬浮显示信息
 ***************************************************/
import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import Tree from 'bfd-ui/lib/Tree'
import Icon from 'bfd-ui/lib/Icon'
import confirm from 'bfd-ui/lib/confirm'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

import rightMenu from 'CommonComponent/component/rightmenu'
import List from 'CommonComponent/component/list'
import SearchInput from 'CommonComponent/component/SelectInputIde'
import message from 'CommonComponent/component/bdosmessage'

//逻辑页面
import ScriptInfo from './win/ScriptInfo'
import CreateDir from './win/CreateDir'
import UDFInfo from './win/UDFInfo'

//枚举
import ENUM from 'IDERoot/enum'
//Ajax相关操作
import Model from 'IDERoot/model/ide'


let that;
class LeftTree extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      offsetLeft: 10,   //脚本详情页面 偏移量
      offsetTop: 10,    //脚本详情页面 偏移量
      showDetailDuration: 1000,   //鼠标在脚本树,停留多长时间展示脚本信息
      top: 0,
      left: 0,
      showScriptInfo: false,
      scriptTreeData: [],
      tableTreeData: [],
      udfListData: [],
      ScriptItem: ''  //脚本树 点击项的数据
    };

    this.treeIdField = 'id';  //树节点标识

    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTTREE, this.getScriptTree);
  }

  componentDidMount() {
    this.getData();   //获取数据

    //设置隐藏右键菜单
    document.body.oncontextmenu = function (e) {
      e.preventDefault();
      return false;
    }
  }

  componentWillUnmount() {
    EventEmitter.remove(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTTREE, this.getScriptTree);
    document.body.oncontextmenu = null;
    this.ajaxGetScriptsTree.abort();
    this.ajaxGetTablesTree.abort();
    this.ajaxGetUDFList.abort();
  }

  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = {};
    //针对 多选框, 文本框
    if (event && event.target) {
      newState[name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /*----------------------获取数据相关 START--------------------------*/
  /**
   * 获取左侧树数据
   * @param scripName  脚本名称
   * @param tableName  表格名称
   * @param udfName    udf名称
   */
  getData(scripName = '', tableName = '', udfName = '') {
    this.getScriptTree(scripName)
    this.getTablesTree(tableName)
    this.getUDFList(udfName)
  }

  /**
   * 获取脚本树
   * @param scripName
   */
  getScriptTree(scripName) {
    console.info('获取脚本树数据')
    this.ajaxGetScriptsTree = Model.getScriptsTree(scripName, function (result) {
      if (result.data && result.data[0]) {
        result.data[0].open = true;
        result.data[0].type = 1;  //type=1 表示为 文件夹
      }
      //保存两份, 一份用于展示, 一份用于过滤的时候用
      that && that.setState({scriptTreeData: result.data, scriptTreeDataAll: result.data})

      //变量里面保存所有的脚本信息[新增生成脚本名用,以防重复]
      window._IDE_ = window._IDE_ || {};
      window._IDE_['scripts'] = result.data;
    })
  }

  /**
   * 获取表格树
   * @param tableName
   */
  getTablesTree(tableName) {
    this.ajaxGetTablesTree = Model.getTablesTree(tableName, function (result) {

      //遍历数据,把树节点的open属性该为false
      if (result.data && Array.isArray(result.data)) {
        result.data.map((item)=> {
          item.open = false;
          item.type = 1;
          if (Array.isArray(item.children)) {
            item.children.map((subItem)=> {
              subItem.open = false;
              subItem.type = 2;
              subItem.dbName = item.name;  //把数据库名称保存起来
            })
          }
        })
      }

      window._IDE_ = window._IDE_ || {};
      window._IDE_.tableTreeData = result.data;

      //保存两份, 一份用于展示, 一份用于过滤的时候用
      that && that.setState({tableTreeData: result.data, tableTreeDataAll: result.data})
    })
  }

  /**
   * 获取UDF列表
   * @param udfName
   */
  getUDFList(udfName) {
    this.ajaxGetUDFList = Model.getUDFList(udfName, function (result) {
      //保存两份, 一份用于展示, 一份用于过滤的时候用
      that && that.setState({udfListData: result.data, udfListDataAll: result.data})
    })
  }

  /*----------------------左侧树相关操作 START--------------------------*/

  /**
   * UDF选项卡点击, 重新刷新 列表数据
   */
  tabChange(tabindex) {
    if (tabindex === 2) {
      this.getUDFList()
    }
  }

  /**
   * 脚本树双击
   * @param evt
   */
  handleDbClickTree(evt) {
    let isParent = evt.target.getAttribute('data-parent');
    let infoCode = evt.target.getAttribute('data-info')     //树id对应的脚本id
    this.mouseOutScriptHandler();

    //双击脚本文件夹, 跳转到脚本列表页面,展示该文件夹的所有脚本
    if (isParent === "true") {
      let id = evt.target.getAttribute('data-id')
      let treeName = evt.target.getAttribute('data-content')  //节点名称
      this.getAllScript(id, treeName)
    }
    //双击脚本
    else if (isParent === "false") {
      this.openScript(infoCode)
    }
  }

  /**
   * 获取所有数据
   * @param treeCode 文件夹标识
   */
  getAllScript(treeCode, treeName) {
    treeCode = treeCode == 0 ? '' : treeCode;
    this.props.parent.setState({page: ENUM.PAGE.SCRIPTLIST, treeCode: treeCode, treeName: treeName});
  }


  /**
   * 脚本树右键菜单
   */
  rightMenuHandler(evt) {
    evt.stopPropagation()
    let that = this;

    //双击之后,脚本信息以及定时器清除
    that.mouseOutScriptHandler();

    var data = $(evt.target).data();

    let pid = evt.target.getAttribute('data-pid')           //父节点id
    let id = evt.target.getAttribute('data-id')             //脚本id
    let treeName = evt.target.getAttribute('data-content')  //脚本名称
    let infoCode = evt.target.getAttribute('data-info')     //树id对应的脚本id
    let isParent = evt.target.getAttribute('data-parent')   //是否为父节点
    let editable = evt.target.getAttribute('data-editable')   //是否为父节点

    //文件夹右键
    if (isParent === 'true') {
      rightMenu.show({
        x: evt.pageX,
        y: evt.pageY,
        data: [
          {
            text: '更新',
            func: function () {
              that.getScriptTree();
            }
          },
          {
            text: '新建脚本',
            dataCode: '1021002',
            func: function (node) {
              node = node || {};
              node.pid = id;
              EventEmitter.dispatch(ENUM.EVENTNAME.IDE_ADD_IDEDROPDOWN, node);
              that.props.parent.setState({page: ENUM.PAGE.IDE});
            }
          },
          {
            text: '新建文件夹',
            dataCode: '1021017',
            func: function (node) {
              node = node || {}
              node.pid = pid;
              node.id = id;
              //如果点击的是父节点
              if (isParent === "true") {
                node.pid = id
                node.id = ""
              }
              that.setState({ScriptItem: node, isEditDirName: false})
              that.refs.mCreateDir.open()
            }
          },
          {
            text: '重命名',
            dataCode: '1021018',
            disabled: id === "",
            func: function (node) {
              console.log("node", node)
              node = node || {}
              node.id = id;
              node.treeName = treeName;
              node.pid = pid;
              that.setState({ScriptItem: node, isEditDirName: true})
              that.refs.mCreateDir.open()
            }
          },
          {
            text: '删除',
            dataCode: '1021006',
            disabled: id === "",
            func: function () {
              confirm('是否确定删除该文件夹?', () => {
                Model.deleteScriptTree(id, function (result) {
                  message.success("删除文件夹成功!")
                  that.getScriptTree()
                  EventEmitter.dispatch(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTLIST, {})
                })
              })
            }
          },
          {
            text: '导入',
            dataCode: '1021003',
            func: function () {
              that.props.parent.openImportModal(id, treeName, true);
            }
          },
          {
            text: '导出',
            dataCode: '1021004',
            func: function () {
              that.props.parent.openExportModal(id, treeName, true);
            }
          }
        ]
      })
    }
    //脚本文件右键
    else if (isParent === "false") {
      rightMenu.show({
        x: evt.pageX,
        y: evt.pageY,
        data: [
          {
            text: '打开',
            func: function () {
              that.openScript(infoCode)
            }
          },
          {
            text: '删除',
            dataCode: '1021006',
            disabled: editable === "false",
            func: function (node) {
              confirm('是否确定删除该脚本?', () => {
                Model.deleteScript([infoCode], function (result) {
                  message.success("删除脚本成功!")
                  that.getScriptTree()
                  EventEmitter.dispatch(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTLIST, {})
                })
              })
            }
          },
          {
            text: '导出',
            dataCode: '1021004',
            func: function (node) {
              EventEmitter.dispatch(ENUM.EVENTNAME.IDE_EXPORT, {id: id, name: treeName, isRightMenu: true})
            }
          }
        ]
      })
    }
  }

  /**
   * 打开脚本
   */
  openScript(code) {
    Model.getScriptInfo(code, (result)=> {
      console.info('左侧树双击打开脚本:', code)
      this.props.parent.setState({page: ENUM.PAGE.IDE});
      EventEmitter.dispatch(ENUM.EVENTNAME.IDE_ADD_EDITOR, result.data);
    })
  }

  /**
   * 创建脚本成功的回调
   */
  callbackCreateDir() {
    this.getScriptTree()
  }

  /**
   * 关闭 新建/重命名 文件夹弹框
   */
  closeCreateDir() {
    this.refs.mCreateDir.close();
  }

  /**
   * 双击库表树, 在IDE插入该表或者该库
   */
  useTable2Ide(evt) {
    //如果点击的不是treeNode 则直接返回, 不处理
    let tagName = evt.target.tagName;
    if (tagName === "I" || tagName === "LI" || tagName === "UL") return;
    let name = evt.target.getAttribute('data-name') || '';
    let dbName = evt.target.getAttribute('data-db') || '';
    let code = `${dbName}.${name}`;
    if (!dbName) {
      code = name;
    }
    EventEmitter.dispatch(ENUM.EVENTNAME.IDE_INSERT_CODE, {code: code})
  }

  /**
   * 双击UDF, 在IDE里面插入该方法
   */
  udfClickHandler(item) {
    Model.udfIsExist(item.id, function (result) {
      if (result.data) {
        //函数存在, 获取函数信息
        Model.getUDFInfo(item.id, function (udfResult) {
          udfResult.data = udfResult.data || {}
          let code = that && that.generatorUDFCode(udfResult.data);
          if (code) {
            //派发事件, 在当前IDE中, 插入脚本
            EventEmitter.dispatch(ENUM.EVENTNAME.IDE_INSERT_CODE, {code: code})
          }
        })
      }
      else {
        message.danger('UDF脚本不存在!')
      }
    })
  }

  /**
   * 根据数据,生成UDF函数的使用方式
   * @param udfResult
   */
  generatorUDFCode(udfResult) {
    return `${udfResult.hiveDatabase}.${udfResult.functionName}`;
  }


  /*----------------------显示脚本详情,UDF详细信息相关 START--------------------------*/
  /**
   * 鼠标移入,开始计时,达到2秒 显示 浮动窗, 显示脚本详细信息
   * @param evt
   */
  mouseOverScriptHandler(evt) {
    let isParent = evt.target.getAttribute('data-parent')
    let scriptCode = evt.target.getAttribute('data-info') //脚本code

    //鼠标移动到脚本上,展示脚本信息
    if (isParent === "false" && scriptCode) {
      let x = evt.pageX + this.state.offsetLeft;
      let y = evt.pageY + this.state.offsetTop;
      this.timer = setTimeout(this.showScriptInfoHandler.bind(this, x, y, scriptCode), this.state.showDetailDuration)
    }
  }

  /**
   * 展示脚本信息
   * @param x
   * @param y
   * @param scriptCode 脚本标识
   */
  showScriptInfoHandler(x, y, scriptId) {
    this.setState({
      top: y,
      left: x,
      scriptId: scriptId,
      showScriptInfo: true
    })
  }

  /**
   * 移除之后, 清除定时器
   */
  mouseOutScriptHandler() {
    this.timer && clearTimeout(this.timer)
    this.setState({
      showScriptInfo: false
    })
  }


  /**
   * 鼠标移入,开始计时,达到2秒 显示 浮动窗, 显示脚本详细信息
   * @param evt
   */
  mouseOverUDFHandler(evt) {
    let id = evt.target.getAttribute('data-value')
    let x = evt.pageX + this.state.offsetLeft;
    let y = evt.pageY + this.state.offsetTop;
    if (id) {
      this.timer = setTimeout(this.showUDFInfoHandler.bind(this, x, y, id), this.state.showDetailDuration)
    }
  }

  /**
   * 展示脚本信息
   * @param x
   * @param y
   * @param udfId 脚本标识
   */
  showUDFInfoHandler(x, y, udfId) {
    this.setState({
      top: y,
      left: x,
      udfId: udfId,
      showUDFInfo: true
    })
  }

  /**
   * 移除之后, 清除定时器
   */
  mouseOutUDFHandler() {
    this.timer && clearTimeout(this.timer)
    this.setState({
      showUDFInfo: false
    })
  }


  /*----------------------搜索相关 START--------------------------*/

  /**
   * 脚本树搜索
   * @param key
   * @param e
   */
  scriptTreeSearch(key, e) {
    let newState = {};
    let scriptTreeData = $.extend(true, [], this.state[`${key}All`]);
    let value = e.target.value;

    let filterData = value ? this.filterScriptDataByVal(scriptTreeData, value) : scriptTreeData;

    newState[key] = filterData;
    this.setState(newState)
  }

  /**
   * 递归,根据名称过滤节点数据
   * @param data
   * @param val 名称
   * @returns {Array}
   */
  filterScriptDataByVal(data, val) {
    data = data || [];
    let leafData = [];
    for (var i = 0; i < data.length; i++) {
      let obj = data[i];

      //查找文件夹和叶子节点
      if (obj.name.indexOf(val) !== -1) {
        obj.active = true;
        leafData.push(obj);
      } else {

        if (obj.children && obj.children.length > 0) {
          obj.children = this.filterScriptDataByVal(obj.children, val);
          //找到匹配的脚本,添加到结果中
          if (obj.children.length > 0) {
            obj.open = true;
            leafData.push(obj);
          }
        }
      }
    }
    return leafData;
  }

  /**
   * UDF搜索
   * @param udfListKey UDF列表数组(根据查询过滤后保存)
   * @param udfListSourceKey UDF列表完整数组
   * @param e
   */
  udfSearch(udfListKey, e) {
    let newState = {};
    let udfList = this.state[`${udfListKey}All`];
    let value = e.target.value;
    newState[udfListKey] = udfList.filter(function (item) {
      return item.name.indexOf(value) !== -1
    });
    this.setState(newState)
  }

  /*----------------------脚本树拖拽相关 START--------------------------*/

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
    const data = $.extend(true, [], this.state.scriptTreeData);

    const dragKey = ev.dataTransfer.getData('dragKey');
    const dropKey = dropItem[idFiled];

    //根据节点唯一标识,递归或者数据
    const loop = (data, key, callback) => {
      data = data || [];
      data.forEach((item, index, arr) => {
        if (item[idFiled] === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children || [], key, callback);
        }
      });
    };

    let dragObj;
    let isChildren = false; //是否拖拽到自己的子节点里面

    loop(data, dragKey, (item) => {
      dragObj = item;
      loop(item.children, dropKey, (item)=> {
        isChildren = true;
      })
    })

    //拖拽有效(不是拖放到自己上面, 不是拖放到自己的子文件夹下)
    if (dragObj && dragKey !== dropKey && !isChildren) {

      //数组中删除拖拽的节点
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
      });

      //添加到目标位置
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });


      let id = dragObj.id;  //拖拽文件的id
      let name = dragObj.name; //拖拽文件的名称
      let pid = dropItem.id === "0" ? '' : dropItem.id; //拖拽到目标文件夹的id

      Model.updateNodeLocation(id, pid, name, (result)=> {
        this.setState({scriptTreeData: data})
      })
    } else {
      console.info('treeNode can not drap to childNode');
    }
  }

  /**
   * 开始拖拽
   * @param item
   * @param ev
   */
  handleDragStart(item, ev) {
    console.info("treeNode dragStart", item)
    ev.dataTransfer.setData('dragKey', item[this.treeIdField])

    this.mouseOutScriptHandler()
  }

  /**
   * 获取树图标
   * @param item
   * @returns {string}
   */
  getTableTreeIcon(item) {
    //item => item.children&&item.children.length>0 ? 'database' : 'table'
    let icon = '';
    switch (item.type) {
      case 1:
        icon = 'database';
        break;
      case 2:
        icon = 'table';
    }
    return icon;
  }


  /*----------------------render相关 START--------------------------*/

  /**
   * 脚本树节点渲染
   * @param item
   */
  scriptTreeRender(item) {
    let flag = item.type === 1 ? true : false;
    let propData = {
      "data-id": item.id,
      "data-info": item.infoCode,
      "data-pid": item.pidCode,
      "data-parent": flag,
      "data-content": item.name,
      "data-editable": item.editable
    }

    let jsx = (<span draggable {...propData}
                     onDragStart={this.handleDragStart.bind(this,item)}>{item.name}</span>);


    //如果锁定之后, 不能删除
    //文件夹
    if (flag) {
      jsx = (<span draggable {...propData}
                   onDragStart={this.handleDragStart.bind(this,item)}
                   onDragOver={this.handleAllowDrop.bind(this)}
                   onDrop={this.handleDrop.bind(this,item)}>{item.name}</span>);
    }
    return jsx;
  }

  /**
   * 表格树渲染
   */
  tableTreeRender(item) {
    return (
      <TextOverflow>
        <span title={item.name}
              data-db={item.dbName}
              data-name={item.name}>
          {item.name}
        </span>
      </TextOverflow>
    )
  }

  /**
   * 显示脚本信息
   * @returns {XML}
   */
  renderScriptInfo() {
    if (this.state.showScriptInfo) {
      let top = this.state.top;
      let gap = 10;  //距离顶部,底部的大小
      let winH = 220; //悬浮框高度
      if (top + winH + gap > document.documentElement.clientHeight) {
        top = top - winH < gap ? ( document.documentElement.clientHeight - winH - gap) : (top - winH);
      }
      return (
        <div
          style={{
          zIndex:99999,
          position:'fixed',
          width:250,
          border:'1px solid #D6DFE4',
          background:'#F4F4F4',
          borderRadius:5,
          top:top,
          left:this.state.left
          }}>
          <ScriptInfo id={this.state.scriptId}/>
        </div>
      )
    }
  }

  /**
   * 显示脚本信息
   * @returns {XML}
   */
  renderUDFInfo() {
    if (this.state.showUDFInfo) {
      let top = this.state.top;
      let gap = 10;  //距离顶部,底部的大小
      let winH = 220; //悬浮框高度
      if (top + winH + gap > document.documentElement.clientHeight) {
        top = top - winH < gap ? ( document.documentElement.clientHeight - winH - gap) : (top - winH);
      }
      return (
        <div
          style={{
          zIndex:99999,
          position:'fixed',
          width:250,
          border:'1px solid #D6DFE4',
          background:'#F4F4F4',
          borderRadius:5,
          top:top,
          left:this.state.left
          }}>
          <UDFInfo id={this.state.udfId}/>
        </div>
      )
    }
  }

  /**
   *
   */
  renderUdf(item) {
    return (
      <div data-value={item.id}>
        <Icon data-value={item.id} type="superscript" style={{marginRight:'5px',color:'#2873C5'}}/>
        <span data-value={item.id}>{item.name}</span>
      </div>
    )
  }

  render() {
    that = this;
    return (
      <div className="ide-list-tree" id="bfd-tab-style3">
        <Tabs onChange={this.tabChange.bind(this)}>
          <TabList>
            <Tab>脚本</Tab>
            <Tab>表</Tab>
            <Tab>函数</Tab>
          </TabList>

          {/*********** 脚本树 START ***************/}
          <TabPanel>
            <div className="tree-container">
              <SearchInput onChange={this.scriptTreeSearch.bind(this,'scriptTreeData')}/>
              <Tree data={this.state.scriptTreeData}
                    render={this.scriptTreeRender.bind(this)}
                    onActive={(nodes)=>{}}
                    getIcon={item => item.type===1 ? 'folder' : 'file-text-o'}
                    onContextMenu={this.rightMenuHandler.bind(this)}
                    onDoubleClick={this.handleDbClickTree.bind(this)}
                    onChange={this.handleChange.bind(this,'scriptTreeData')}
                    onMouseOver={this.mouseOverScriptHandler.bind(this)}
                    onMouseOut={this.mouseOutScriptHandler.bind(this)}/>
            </div>
            {this.renderScriptInfo()}

            <Modal ref="mCreateDir" lock={true}>
              <ModalHeader>
                <h4 className="modal-title">文件夹{this.state.isEditDirName ? '编辑' : '保存'}</h4>
              </ModalHeader>
              <ModalBody>
                <CreateDir
                  data={this.state.ScriptItem}
                  callback={this.callbackCreateDir.bind(this)}
                  closeWin={this.closeCreateDir.bind(this)}
                  isEdit={this.state.isEditDirName}/>
              </ModalBody>
            </Modal>

          </TabPanel>

          {/*********** 库表树 START ***************/}
          <TabPanel>
            <div className="tree-container">
              <SearchInput onChange={this.scriptTreeSearch.bind(this,'tableTreeData')}/>
              <Tree data={this.state.tableTreeData}
                    render={this.tableTreeRender.bind(this)}
                    getIcon={this.getTableTreeIcon}
                    onActive={(nodes)=>{}}
                    onDoubleClick={this.useTable2Ide.bind(this)}/>
            </div>
          </TabPanel>

          {/*********** UDF START ***************/}
          <TabPanel>
            <div className="tree-container">
              <SearchInput onChange={this.udfSearch.bind(this,'udfListData')}/>
              <List data={this.state.udfListData}
                    render={this.renderUdf.bind(this)}
                    keyField="name"
                    valueField="id"
                    onDoubleClick={this.udfClickHandler.bind(this)}
                    onMouseOver={this.mouseOverUDFHandler.bind(this)}
                    onMouseOut={this.mouseOutUDFHandler.bind(this)}/>
              {this.renderUDFInfo()}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default LeftTree

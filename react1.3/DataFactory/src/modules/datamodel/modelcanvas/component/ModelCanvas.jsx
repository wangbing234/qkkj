/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明: 模型列表模型主页面
 *
 ***************************************************/
import React from 'react';
import CanvasLeft from './lefttree/CanvasLeft'
import CanvasSpace from './editor/CanvasSpace'
import ProjectModelList from './lefttree/ProjectModelList'
import CommonModalWin from '../../common/CommonModalWin';
import DataModelList from './lefttree/DataModelList'
import TypeConst from '../../common/TypeConst'
import HSplitPane from 'CommonComponent/component/hsplitpane'
import  TablePopWin from '../../modellist/tablewin/TablePopWin'
import NodeConfig from '../../modelcanvas/component/editorconfig/config'
import Ajax from '../ajax/AjaxReq'
let isAddKeyDownEvent = false;//防止重复添加事件

class ModelCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 点击标题,供外部调用
   */
  submitModel() {
    EventEmitter.dispatch(TypeConst.REFRESH_COMMON_MODEL_TREE);
  }

  componentDidMount() {
    this.onKeyDownHander();
  }

  componentWillUnmount() {
    if (this.listAjax) {
      this.listAjax.abort();
      this.listAjax = null;
    }
  }

  /**
   * 键盘事件
   */
  onKeyDownHander() {
    if (isAddKeyDownEvent)
      return;
    isAddKeyDownEvent = true;
    $(document).keydown(function (e) {
      if ($("#canvas_main_id").parent().hasClass("active")) {
        if (e.ctrlKey && e.which == 83)//ctrl+C
        {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    });

    $(document).keyup(function (e) {
      if (e.ctrlKey && $("#canvas_main_id").parent().hasClass("active")) {
        if (e.which == 83)//ctrl+C
        {
          e.stopPropagation();
          e.preventDefault();
          EventEmitter.dispatch("paper_save");
        }
      }
    });
  }


  /**
   * 点击查询tab
   * @param data，数据
   */
  viewTableByCode(parms) {
    this.listAjax = Ajax.viewTableByCode(parms, (data)=> {
      this.openDiffrentTable(data, true)
    })
  }

  /**
   * 打开数据表对话框
   * @param data，数据
   */
  openDiffrentTable(data, infoCode, _callBackHander) {
    let config = this.getConfigByKeyAndValue(NodeConfig.node, 'id', data.tableType);
    this.refs.tablePopWin.setState({tableConfig: config.window, data: data, infoCode: infoCode,okButton:"1"});
    this.refs.tablePopWin.refs.tablePopWin.open();
  }

  /**
   * 通过类型区分
   * @param value
   * @returns {*}
   */
  getType(value) {
    if (["mysql", "oracle", "db2"].indexOf((value||"").toLowerCase()) > -1)
      return "rdbms"
    return value;
  }

  /**
   * 获取配置的数据
   * @param data，数据
   */
  getConfigByKeyAndValue(configs, key, value) {
    let _value = this.getType(value);
    configs = configs || [];
    for (let i = 0, length = configs.length; i < length; i++) {
      if (configs[i][key] === _value) {
        return configs[i];
      }
    }
  }

  render() {
    return (
      <div className="canvas_main" id="canvas_main_id">
        <HSplitPane size={200} minSize={200} maxSize={600}>
          <CanvasLeft owner={this}/>
          <CanvasSpace type="mainEdit"/>
        </HSplitPane>>
        <CommonModalWin title="加载模型" ref="_modal" Child={DataModelList} submit={this.submitModel.bind(this)}
                        hasFormFooter="false"/>
        <CommonModalWin ref="projectModelWin" title="引入" Child={ProjectModelList} hasFormFooter="false"/>
        <TablePopWin ref="tablePopWin" okStyle={{display:"none"}}/>
      </div>);
  }
}
export default ModelCanvas
import React, { PropTypes } from 'react'
import classNames from 'classnames'

//import DataTable from 'bfd-ui/lib/DataTable'
import DataTable from 'CommonComponent/component/datatable2'  //TODO:等公司组件库新增自动翻页功能, 则替换成公司组件库
import { Tabs, TabList, Tab, TabPanel } from 'CommonComponent/component/bdostabs'
import message from 'CommonComponent/component/bdosmessage'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import ENUM from 'IDERoot/enum'
import Model from 'IDERoot/model/ide'

const MAXINT = 999999;
//执行的日志面板
class ResultLog extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      tabs: [],
      activeIndex: 0,
      resultLog: "",
      isStopRun: false //是否停止运行
    };

    this.limitLine = 1000  //每次获取过程日志的行数
    this.durationTime = 2000  //每次轮询的间隔时间(ms)

    this.addIDETabHandler = this.addIDETabHandler.bind(this)
    this.stopRunHandle = this.stopRunHandle.bind(this)
    this.handleSetLog = this.handleSetLog.bind(this)
    this.handleCloseTab = this.handleCloseTab.bind(this);
    this.closeAllTab = this.closeAllTab.bind(this);

    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_ADD_LOG, this.addIDETabHandler);
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_STOP_RUN, this.stopRunHandle);
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_LOG_CHANGE_TAB, this.handleSetLog)
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_LOG_CLOSE_TAB, this.handleCloseTab)
    EventEmitter.subscribe(ENUM.EVENTNAME.IDE_CLOSEALL_LOG, this.closeAllTab)
  }

  componentWillUnmount() {
    EventEmitter.remove(ENUM.EVENTNAME.IDE_ADD_LOG, this.addIDETabHandler);
    EventEmitter.remove(ENUM.EVENTNAME.IDE_STOP_RUN, this.stopRunHandle);
    EventEmitter.remove(ENUM.EVENTNAME.IDE_LOG_CHANGE_TAB, this.handleSetLog)
    EventEmitter.remove(ENUM.EVENTNAME.IDE_LOG_CLOSE_TAB, this.handleCloseTab)
    EventEmitter.remove(ENUM.EVENTNAME.IDE_CLOSEALL_LOG, this.closeAllTab)
  }

  /**
   * 获取当前日志脚本
   * @returns {*}
   */
  getCurrentTabConfig() {
    let allPanel = this.state.tabs || [];
    return allPanel[this.state.activeIndex - 1];
  }

  /**
   * 运行返回的结果为当前选中的脚本
   */
  runResultIsCurScript(config) {
    return (!this.state.ideEditorActiveKey || config.uuid === this.state.ideEditorActiveKey);
  }

  /**
   * 关闭所有日志面板
   */
  closeAllTab() {
    this.setState({tabs: [], resultLog: '', activeIndex: 0})
  }

  /**
   * 停止运行
   * @param param flag:关闭页面,触发的停止操作 config:选项卡配置
   */
  stopRunHandle(param) {
    param.config = param.config || {};

    if (this.runResultIsCurScript(param.config)) {
      let log = param.flag ? '' : '任务停止成功!';
      this.setState({isStopRun: true, resultLog: log})
    } else {
      this.setState({isStopRun: true})
    }
  }

  /**
   * 设置当前脚本的日志内容,并且传当前脚本的标识过来
   * @param config
   */
  handleSetLog(param) {
    let activeIndex = 0;
    let delIndexs = this.getIndexsByUUID(param.config.uuid);
    if (delIndexs.length > 0) {
      activeIndex = delIndexs[0] + 1;
    }
    this.setState({resultLog: param.config.log, ideEditorActiveKey: param.config.uuid, activeIndex: activeIndex})
    this.changeTabHandler(activeIndex)
  }

  /**
   * 关闭日志选项卡
   */
  handleCloseTab(param) {
    let allPanel = this.state.tabs;

    let newState = {activeIndex: 0, resultLog: ''};

    //删除Tab
    let delIndexs = this.getIndexsByUUID(param.activeKey);
    if (delIndexs.length > 0) {
      delIndexs.reverse();
      for (var i = 0, length = delIndexs.length; i < length; i++) {
        allPanel.splice(delIndexs[i], 1);
      }
      newState.tabs = allPanel;
    }

    //根据当前脚本Tab 获取日志Tab
    if (param.currentTab) {
      newState.resultLog = param.currentTab.log;
      let _activeIndexs = this.getIndexsByUUID(param.currentTab.uuid);
      if (_activeIndexs.length > 0) {
        newState.activeIndex = _activeIndexs[0] + 1;
      }
    }
    this.setState(newState)
  }

  /**
   * [可能存在多个 hive 和 sparkSQl]
   * 根据uuid获取选项卡数组中的下标
   * @param uuid
   */
  getIndexsByUUID(uuid) {
    let allPanel = this.state.tabs;
    let indexs = [];
    for (var i = 0; i < allPanel.length; i++) {
      var panel = allPanel[i];
      if (panel.uuid === uuid) {
        indexs.push(i);
      }
    }
    return indexs;
  }

  /**
   * 运行脚本,并记录返回结果
   * @param param 当前运行脚本的选项卡配置信息
   */
  addIDETabHandler(param) {
    let that = this;
    let allPanel = this.state.tabs;
    //记录运行的开始时间
    this._startTime = new Date().getTime();

    let config = param.config;
    config.log = "";
    config.hasLog = false; //是否已经返回过程日志

    let uuid = config.execName;

    //清空 运行日志,并且跳转到运行日志选项卡
    this.setState({activeIndex: 0, isStopRun: false})

    //删除当前的运行结果面板, 重新添加
    let delIndexs = this.getIndexsByUUID(config.uuid);
    if (delIndexs.length > 0) {
      delIndexs.reverse();
      for (var i = 0, length = delIndexs.length; i < length; i++) {
        allPanel.splice(delIndexs[i], 1);
      }
    }

    this.pollGetLog(uuid, 0,
      //获取过程日志
      (data)=> {
        if (data.complete) {
          config.hasLog = false;
          config.log += data.result;
        } else {
          //计算运行时长
          let runTime = ((new Date().getTime() - this._startTime ) / 1000).toFixed(0);
          if (!data.result && !config.hasLog) {
            config.log = `正在执行，请稍等(${runTime}s)...\n`
          } else {
            //刚获取日志, 就清空"正在执行,请稍等"的提示
            if (!config.hasLog) {
              config.log = "";
            }
            config.hasLog = true;  //开始有日志了
            if (data.result) {
              config.log += `${data.result}\n`;
            }
          }
        }
        //把当前选中脚本的过程日志,显示到页面上
        if (that.runResultIsCurScript(config)) {
          that.setState({resultLog: config.log})
        }
      },
      //获取结果日志  完成
      ()=> {
        Model.getResultLog(uuid, 0, MAXINT, (result)=> {
          let status = result.data.status;
          let activeIndex = 0;
          let cPanel;

          console.info(`获取任务执行结果结束!`, result, config.log)

          //status 不等于 0 ,100 ,101 表示执行异常
          if (status !== 0 && status !== 100 && status !== 101) {
            config._runSucess = false;
            config.log = config.log.replace(/^正在执行，请稍等\(\d+s\).../, ``)
            config.log = `执行失败!\n` + config.log;
          }

          //执行成功
          else {
            config._runSucess = true;
            config.log = config.log.replace(/^正在执行，请稍等\(\d+s\).../, ``)
            config.log = `执行完成,Ok!\n` + config.log;
          }

          result.data.result = result.data.result || "";
          //结果日志为空,则不新增选项卡
          if (result.data.result.length > 0) {
            //返回表格数据
            if (Array.isArray(result.data.result)) {
              for (let i = 0; i < result.data.result.length; i++) {
                let item = result.data.result[i];
                cPanel = that.renderTableLog(item);

                allPanel.push({
                  panel: cPanel,
                  name: `${config.name}${i === 0 ? '' : '_' + i}`,
                  uuid: config.uuid,
                  typeCode: config.typeCode,
                  execName: config.execName
                });
              }
            }
            //返回文本日志
            else {
              cPanel = that.renderTextLog(result.data.result)
              allPanel.push({
                panel: cPanel,
                name: config.name,
                uuid: config.uuid,
                typeCode: config.typeCode,
                execName: config.execName
              });
            }
            //因为有一个 默认的 tab, 没有存放在 allPanel中,因此,当前ActiveIndex = 数组长度
            activeIndex = allPanel.length;
          }

          let newState = {
            tabs: allPanel
          }

          //执行结果为当前脚本的结果
          if (that.runResultIsCurScript(config)) {
            newState.resultLog = config.log
            newState.activeIndex = activeIndex
          }

          that.setState({...newState}, ()=> {

            //回调, 让正在运行状态的ICON变回执行结束状态ICON, 参数2:是否显示导出按钮
            that.props.cbRunEnd && that.props.cbRunEnd(config, result.data.result && result.data.result.length > 0);
          })
        })
      })
  }

  /**
   * 获取数据
   * @param uuid 唯一标识
   * @param startLine 开始行
   * @param endLine 结束行
   * @param callback 获取过程日志
   * @param completeCallback 获取结果日志回调
   */
  pollGetLog(uuid, startLine, callback, completeCallback) {
    Model.getProcessLog(uuid, startLine, this.limitLine, (result)=> {
      result.data = result.data || {};
      //未停止运行,则继续请求
      if (!this.state.isStopRun) {
        callback(result.data);
        console.info("正在获取执行过程日志...", result.data)

        //未完成, 继续获取过程日志
        if (!result.data.complete) {
          setTimeout(()=> {
            startLine = result.data.pos;
            this.pollGetLog(uuid, startLine, callback, completeCallback)
          }, this.durationTime)

        }
        //获取过程日志完成,执行获取结果的日志
        else {
          console.info("任务执行结束,开始获取运行结果...")
          completeCallback();
        }
      }
    })
  }

  /**
   * 关闭选项卡
   * @param index
   */
  closeTabHandler(index) {
    const tabs = this.state.tabs
    tabs.splice(index - 1, 1)
    this.setState({tabs, activeIndex: index - 1 < 0 ? 0 : index - 1})
  }

  /**
   * 切换选项卡[在SCRIPTEditerPanel 显示是否有导出的按钮]
   * @param activeIndex
   */
  changeTabHandler(activeIndex) {
    let allPanel = this.state.tabs;
    this.setState({activeIndex})
    this.props.cbTabChange && this.props.cbTabChange(allPanel[activeIndex - 1], activeIndex);
  }

  /**
   * 渲染表格数据的结果日志
   */
  renderTableLog(data) {
    data = data || [];

    //返回数据数组的 第一个值是 表头, 剩余的是数据

    let columnsArr = data[0] || [];
    let dataList = data.slice(1);

    let columns = [{key: "sequence", title: '序号', width: '40px'}];
    //计算表格字段
    columnsArr.map((col)=> {
      columns.push({key: col, title: col});
    })

    //表格数据
    let tableData = {
      totalList: dataList,
      totalPageNum: dataList.length
    }

    //TODO:组件库新增自动翻页功能后,去掉 autoPage属性
    return (
      <div style={{padding:'0px 20px 35px 20px'}}>
        <DataTable data={tableData} showPage="true" howRow={10}
                   autoPage={true}
                   column={columns}>
        </DataTable>
      </div>
    )
  }

  /**
   * 渲染文字类型的返回结果
   */
  renderTextLog(log) {
    return (
      <pre style={{background:'#FFF',border:0}}>
        {log}
      </pre>
    )
  }

  render() {
    return (
      <Tabs dynamic autoWidth
            activeIndex={this.state.activeIndex}
            onChange={this.changeTabHandler.bind(this)}
            handleClose={this.closeTabHandler.bind(this)}>
        <TabList>
          <Tab abolishClose={true}><TextOverflow>
            <div style={{padding: "0 8px 0 3px",minWidth:'60px'}}>执行日志</div>
          </TextOverflow>
          </Tab>
          {this.state.tabs && this.state.tabs.map((tab, i) => {
            return (
              <Tab key={i}><TextOverflow>
                <div style={{padding: "0 8px 0 3px"}} title={tab.name}>{tab.name}</div>
              </TextOverflow>
              </Tab>
            )
          })
          }
        </TabList>

        {/*默认的日志面板*/}
        <TabPanel>
          <pre style={{background:'#FFF',border:0}}>{this.state.resultLog}</pre>
        </TabPanel>
        {/*动态生成展示的日志面板*/}
        {this.state.tabs && this.state.tabs.map((tab, i) => <TabPanel key={i}>{tab.panel}</TabPanel>)}
      </Tabs>
    );
  }
}

export default ResultLog

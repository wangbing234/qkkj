import React from 'react';
import Icon from 'bfd-ui/lib/Icon'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'

import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import FormGenerator from 'CommonComponent/component/formgenerator'
import Util from 'CommonComponent/utils/CommonUtil'
import message from 'CommonComponent/component/bdosmessage'

import AjaxReq from '../ajax/AjaxReq'

const EXCUTE_STATUS_WAITING = 101;//等待执行（在执行的时候!101表示执行错误）
const EXCUTE_STATUS_RUNNING = 100;//正在执行
const STOP_STATUS_SUCCESS = 200;//停止成功
const EXCUTE_STATUS_COMPLETE = 0;//执行完成

class ExcutePanel extends React.Component {
  constructor(props) {
    super(props);
    this.processLog = "";
    this.resultLog = "";
    this.lineFrom = 1;
    this.resultLineFrom = 1;
    this.lineStep = 10;
    this.timeInterval = 1000;//间隔多久获取一次数据
    this.state = {};
    this.getScript.bind(this);
  }

  componentDidMount() {
    this.hasRender = true;
    //后面去掉，只为测试使用
    //this.uuid = "EF235A3A-3D71-0D12-3BC6-3062AE890FDB";//Util.generatorUUID();
    //this.hasRender = setInterval(this.g);
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.hasRender = false;
    this.loadInterval && clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  componentWillReceiveProps(nextProps) {
    this.hasRender = true;
  }

  getScript(saveData) {
    let that = this;
    AjaxReq.getSqoopScript(saveData, (data) => {
      that.setState({scriptStr: data.data});
    });
  }

  backToEditPanel() {
    this.hasRender = false;
    this.refs.excuteModal.close();
  }

  getParams() {
    // return
  }

  /*执行点击处理，查找当前的命令中是否有参数*/
  runClick() {
    if (!this.command || this.isRunning) return;
    let formConfig = Util.generatorFormConfigByStr(this.command);
    if (formConfig && formConfig.length > 0) {
      this.setState({paramsFormConfig: formConfig});
      this.refs.refParams.open();
    } else {
      this.runScript();
    }

  }

  /*参数设置窗口的保存*/
  setRunParams(params) {
    this.runScript(params);
    this.closeModal();
  }

  /*执行脚本*/
  runScript(params) {
    this.isRunning = true;
    this.stopFlag = false;
    let that = this;
    this.lineFrom = 1;
    this.uuid = Util.generatorUUID();
    this._startTime = new Date().getTime();
    let commandObj = JSON.parse(this.command);
    commandObj.sqoopInput = this.state.sqoopInput;
    AjaxReq.excuteScript({
      projectCode: window.projectCode,
      execType: "ide",
      params: params ? JSON.stringify(params) : "",
      execName: this.uuid,
      command: JSON.stringify(commandObj),
      typeCode: this.scriptData.typeCode,
      queue: this.scriptData.queue,
      queuePriority: this.scriptData.priority
    }, (data) => {
      data = data.data;
      if (data == EXCUTE_STATUS_WAITING) {
        this.hasLog = false;
        that.getLog();
      } else {
        this.isRunning = false;
        this.processLog = "执行失败！";
        message.danger("执行失败！");
      }
      that.setState({...that.state});
    });
  }

  /*停止*/
  stopClick() {
    if (!this.isRunning) return;
    let that = this;
    AjaxReq.stopScript({
      execName: this.uuid
    }, (data) => {
      that.isRunning = false;
      data = data.data;
      that.stopFlag = true;
      if (data != STOP_STATUS_SUCCESS) {
        that.processLog = this.processLog.replace( /^正在执行，请稍等\(\d+s\).../, `` );
        that.processLog = `停止失败！\n` + this.processLog;
      } else {
        that.processLog = this.processLog.replace( /^正在执行，请稍等\(\d+s\).../, `` );
        that.processLog = `已经停止执行！\n` + this.processLog;
      }
      that.setState({...that.state});
    });
  }

  /*获取日志*/
  getLog() {
    if (!this.hasRender) {
      return;
    }
    //如果已经点击了停止则不再进行获取日志
    if (this.stopFlag) return;
    let that = this;
    //execName=EF235A3A-3D71-0D12-3BC6-3062AE890FDB&lineFrom=101&lineTo=10&echoType=PROCESS
    AjaxReq.getResult({
      execName: this.uuid,
      lineFrom: this.lineFrom,
      lineTo: this.lineStep,
      echoType: "PROCESS"
    }, (data) => {
      data = data.data;

      if (!data.result && !this.hasLog) {
        //计算运行时长
        let runTime = ((new Date().getTime() - this._startTime ) / 1000).toFixed(0);
        this.processLog = `正在执行，请稍等(${runTime}s)...\n`;
      } else if (data.result && that.lineFrom != data.pos) {
        //刚获取日志, 就清空"正在执行,请稍等"的提示
        if (!this.hasLog) {
          this.processLog = "";
        }
        this.hasLog = true;
        this.processLog += `${data.result}\n`;
      }
      that.setState({...that.state, activeIndex: 0});
      if (Boolean(data.complete) &&
        data.status != EXCUTE_STATUS_RUNNING &&
        data.status != EXCUTE_STATUS_WAITING) {
        that.setState({...that.state, activeIndex: 1});
        that.resultLineFrom = 1;
        if (this.hasRender) {
          that.getResult(that.resultLineFrom);
        }
      } else if (!that.stopFlag) {
        that.lineFrom = data.pos;
        setTimeout(that.getLog.bind(that), that.timeInterval);
      }
    })
  }

  /*获取结果*/
  getResult(resultLineFrom) {
    let that = this;
    //execName=EF235A3A-3D71-0D12-3BC6-3062AE890FDB&lineFrom=101&lineTo=10&echoType=PROCESS
    AjaxReq.getResult({
      execName: this.uuid,
      lineFrom: resultLineFrom,
      lineTo: -1,
      echoType: "RESULT"
    }, (data) => {
      data = data.data;
      this.isRunning = false;
      let status = data.status;
      //status 不等于 0 ,100 ,101 表示执行异常
      if (status !== EXCUTE_STATUS_COMPLETE && status !== EXCUTE_STATUS_RUNNING && status !== EXCUTE_STATUS_WAITING) {
        this.processLog = this.processLog.replace(/^正在执行，请稍等\(\d+s\).../, ``);
        this.processLog = `执行失败!\n` + this.processLog;
        message.danger("执行失败！");
      } else {
        this.processLog = this.processLog.replace(/^正在执行，请稍等\(\d+s\).../, ``);
        this.processLog = `执行,Ok!\n!\n` + this.processLog;
      }
      this.resultLog = data.result;
      that.setState({...that.state});
    })
  }

  open(scriptData, saveData, command) {
    this.command = command;
    this.scriptData = scriptData;
    this.refs.excuteModal.open();
    this.isRunning = false;
    this.getScript(saveData);
    this.initPanel();
  }

  initPanel() {
    this.processLog = "";
    this.resultLog = "";
    this.lineFrom = 1;
    this.resultLineFrom = 1;
    this.lineStep = 10;
    this.setState({activeIndex: 0, sqoopInput: this.scriptData ? this.scriptData.sqoopInput : ""});
  }

  onParamChange(evt) {
    let value = evt.target.value;
    this.setState({...this.state, sqoopInput: value});
  }

  closeModal() {
    this.refs.refParams.close();
  }

  render() {
    return (
      <div className="data-access-excute-panel">
        <Modal ref="excuteModal" lock={true} onClose={()=>{this.hasRender = false;}}>
          <ModalHeader>
            <h4 className="modal-title">执行</h4>
          </ModalHeader>
          <ModalBody>
            <div className="excute-panel">
            <textarea
              className="form-control"
              readOnly={true}
              disabled={false}
              style={{height:"120px",cursor:"auto",backgroundColor:"#fff"}}
              value={this.state.scriptStr}/>
              <RestrictTextarea
                className="form-control"
                style={{height:"50px"}}
                value={this.state.sqoopInput}
                onChange={this.onParamChange.bind(this)}
              ></RestrictTextarea>
              <div className="tool-bar-container">
                <Icon
                  type="play" style={{cursor:"pointer",pointerEvents:"auto"}}
                  title="执行" disabled={this.isRunning} onClick={this.runClick.bind(this)}></Icon>
                <Icon
                  type="pause" style={{cursor:"pointer",pointerEvents:"auto"}}
                  title="停止" disabled={!this.isRunning} onClick={this.stopClick.bind(this)}></Icon>
              </div>
              <Tabs activeIndex={this.state.activeIndex}>
                <TabList>
                  <Tab>过程日志</Tab>
                  <Tab>结果日志</Tab>
                </TabList>
                <TabPanel>
                  <textarea className="script-result-div" disabled value={this.processLog}/>
                </TabPanel>
                <TabPanel>
                  <textarea className="script-result-div" disabled  value={this.resultLog}/>
                </TabPanel>
              </Tabs>
            </div>
            <button
              className="btn btn-sm btn-default"
              style={{marginLeft:"15px"}}
              onClick={this.backToEditPanel.bind(this)}>关闭
            </button>

            {/*脚本运行参数 START*/}
            <Modal ref="refParams" lock={true}>
              <ModalHeader>
                <h4 className="modal-title">变量赋值</h4>
              </ModalHeader>
              <ModalBody>
                <FormGenerator
                  config={this.state.paramsFormConfig}
                  submit={this.setRunParams.bind(this)}
                  close={this.closeModal.bind(this)}/>
              </ModalBody>
            </Modal>
            {/*脚本运行参数 END*/}
          </ModalBody>
        </Modal>
      </div>

    );
  }
}
export default ExcutePanel
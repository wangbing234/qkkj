/***************************************************
 * 时间: 16/6/21 15:41
 * 作者: zhongxia
 * 说明: 保存脚本
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select, Option } from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { MultipleSelect } from 'bfd-ui/lib/MultipleSelect'
import Input from 'CommonComponent/component/input'

import message from 'CommonComponent/component/bdosmessage'
import TreeSelect from 'CommonComponent/component/treeselect'

//自定义组件
import RestrictInput from 'CommonComponent/component/restrictinput'
//验证类
import RestrictConst from 'CommonComponent/utils/RestrictConst'
// Ajax 相关操作
import Model from 'IDERoot/model/ide'
//枚举
import ENUM from 'IDERoot/enum'

const style = {
  inputWidth: {width: 200, display: 'inline-block'},
  mulSelectWidth: {width: '100%'}
}

class SaveScriptWin extends React.Component {
  constructor(prop) {
    super(prop);

    //表单数据
    let formData = {
      name: '',
      priority: '',
      executorNum: "2",
      executorMemory: "1",
      executorCores: "1",
      otherParams: [],
      pid: "",
      remark: '',
      ...prop.data
    }

    //编辑,把脚本名称的后缀去掉
    if (formData.code) {
      formData.name = formData.name.split('.')[0];
      //保存时是数字类型,取回是字符串类型
      formData.priority = formData.priority === "" ? '' : parseInt(formData.priority);
    }

    this.state = {
      flag: true,
      formData: formData,
      pathTreeSelectData: [],
      queueList: [],
    };

    //Form验证规则
    this.rules = {
      name: (val)=> {
        if (!val) return '脚本名称不能为空!'
        if (this.state.flag) {
          let name = `${val}${this.state.formData.suffix}`;
          let code = this.state.formData.code;
          if (Model.validateScriptName(code, name)) {
            return '脚本名称已存在!'
          }
        }
      },
      priority(val) {
        //因为队列id , 有一个为0
        if (val === '') return '队列不能为空!'
      },
      remark(val) {
        if (!val) return ''
      }
    }
  }

  componentDidMount() {
    if (this.refs.refFirstInput) {
      ReactDOM.findDOMNode(this.refs.refFirstInput).focus();
    }

    //获取队列
    this.ajaxGetQueueList = Model.getQueueList((result)=> {
      this.setState({queueList: result.data})
    })
    //获取保存路径
    this.ajaxGetSavePath = Model.getSavePath((result)=> {
      result.data[0].id = '';
      this.setState({pathTreeSelectData: result.data})
    })
  }

  componentWillUnmount() {
    this.ajaxGetQueueList.abort();
    this.ajaxGetSavePath.abort();
  }

  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = this.state.formData;
    //针对 多选框, 文本框
    if (event && event.target) {
      newState[name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    this.setState({formData: newState});
  }

  /**
   * 队列change事件[专门用在队列]
   * @param value
   */
  handleQueueChange(value) {
    let newState = this.state.formData;
    const queueList = this.state.queueList;
    let queueName;
    queueList.map((item)=> {
      if (value === item["id"]) {
        queueName = item["queue"];
      }
    })
    newState["priority"] = value;
    newState["queue"] = queueName;
    console.log("newState", newState)
    this.setState({formData: newState});
  }


  /**
   * 验证脚本名称
   */
  handleValidateName() {
    this.setState({flag: true})
  }

  /**
   * 取消验证
   */
  handleCancleValidate() {
    this.setState({flag: false})
  }

  /**
   * 取消保存
   */
  handleCancel() {
    this.props.close && this.props.close()
  }

  /**
   * 保存脚本
   */
  saveScript() {
    let data = this.state.formData;

    if (this.refs.form.validate(data)) {

      const typeCode = data.typeCode;
      data.name = `${data.name}${data.suffix}`;
      // 自定义mr sparkmr 数据要格式化成JSON字符串
      if (typeCode === ENUM.SCRIPTTYPE.CUSTOMMR || typeCode === ENUM.SCRIPTTYPE.CUSTOMSPART) {
        data.command = JSON.stringify(data.command)
      }

      //shell python 如果是mr 才有队列值
      else if ((typeCode === ENUM.SCRIPTTYPE.PYTHON || typeCode === ENUM.SCRIPTTYPE.SHELL) && !data.mr) {
        data.queue = "";
      }

      else if (typeCode === ENUM.SCRIPTTYPE.SPARKSQL) {
        data.command = JSON.stringify({
          executorNum: data.executorNum,
          executorMemory: data.executorMemory,
          executorCores: data.executorCores,
          otherParams: data.otherParams,
          sql: data.command
        })
      }

      //验证是否重名
      Model.saveScript(data, (result)=> {
        console.log("saveScript result", result)
        //更新左侧脚本树, 更新脚本选项卡信息
        EventEmitter.dispatch(ENUM.EVENTNAME.IDE_UPDATE_SCRIPTTREE, {data: data, code: result.data});
        EventEmitter.dispatch(ENUM.EVENTNAME.IDE_UPDATE_TAB, {data: data, code: result.data})
        message.success("保存脚本成功!");
      })
      this.handleCancel();
    }
  }

  /**
   * 是否为Mr, hive不需要
   * @returns {XML}
   */
  renderIsMr() {
    const typeCode = this.state.formData.typeCode;
    if (typeCode !== ENUM.SCRIPTTYPE.HIVE && typeCode !== ENUM.SCRIPTTYPE.SPARKSQL) {
      return (
        <FormItem label="是否是MR" required name="mr">
          <RadioGroup value={this.state.formData.mr} onChange={this.handleChange.bind(this,'mr')}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
        </FormItem>
      )
    }
  }

  /**
   * 渲染队列(只有shell 在 mr 下显示, 其他默认显示)
   * */
  renderQueue() {
    const typeCode = this.state.formData.typeCode;
    const mr = this.state.formData.mr;
    const queueJsx = (
      <FormItem required label="队列" name="priority">
        <Select style={{width: '200px'}}
                value={this.state.formData.priority}
                onChange={this.handleQueueChange.bind(this)}>
          <Option value="">请选择</Option>
          {this.state.queueList.map((item, index)=> {
            return <Option key={index} value={item.id}>{item.queueName}</Option>
          })}
        </Select>
      </FormItem>
    );
    if (typeCode !== ENUM.SCRIPTTYPE.SHELL && typeCode !== ENUM.SCRIPTTYPE.PYTHON) {
      return queueJsx;
    } else {
      if (mr) {
        return queueJsx;
      }
    }
  }

  /**
   * 渲染SparkSQL需要的表单
   */
  renderSparkSql() {
    const typeCode = this.state.formData.typeCode;
    if (typeCode === ENUM.SCRIPTTYPE.SPARKSQL) {
      return (
        <div>
          <FormItem label="Executor数量" required name="executorNum">
            <input type="number" className="form-control"
                   style={style.inputWidth}
                   min="0"
                   value={this.state.formData.executorNum}
                   onChange={this.handleChange.bind(this,'executorNum')}/>
            个
          </FormItem>

          <FormItem label="Executor内核数" required name="executorCores">
            <input type="number" className="form-control"
                   style={style.inputWidth}
                   min="0"
                   value={this.state.formData.executorCores}
                   onChange={this.handleChange.bind(this,'executorCores')}/>
            个
          </FormItem>

          <FormItem label="Executor内存" required name="executorMemory">
            <input type="number" className="form-control"
                   style={style.inputWidth}
                   min="0"
                   value={this.state.formData.executorMemory}
                   onChange={this.handleChange.bind(this,'executorMemory')}/>
            G
          </FormItem>

          <FormItem label="其他参数" name="otherParams">
            <Input type="text"
                   minLength={1024}
                   className="form-control"
                   value={this.state.formData.otherParams}
                   onChange={this.handleChange.bind(this,'otherParams')}/>
          </FormItem>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="save-script-form">
        <Form ref="form" rules={this.rules} data={this.state.formData}>
          <FormItem ref="refName" label="名称" required name="name">
            <RestrictInput type="text"
                           ref="refFirstInput"
                           style={style.inputWidth}
                           className="form-control"
                           value={this.state.formData.name}
                           restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                           tipString="长度不大于64个字符"
                           onFocus={this.handleCancleValidate.bind(this)}
                           onBlur={this.handleValidateName.bind(this)}
                           onChange={this.handleChange.bind(this,'name')}/>
          </FormItem>

          {this.renderIsMr()}

          {this.renderQueue()}

          <FormItem label="保存至" name="pid">
            <TreeSelect value={this.state.formData.pid}
                        data={this.state.pathTreeSelectData}
                        onChange={this.handleChange.bind(this,'pid')}/>
          </FormItem>

          {this.renderSparkSql()}

          <FormItem label="脚本描述" name="remark">
              <textarea className="form-control" style={{height:100}}
                        value={this.state.formData.remark}
                        onChange={this.handleChange.bind(this, 'remark')}>
              </textarea>
          </FormItem>
        </Form>

        {/*弹窗按钮  START*/}
        <div style={{textAlign:'center'}}>
          <button type="button"
                  style={{marginRight: '15'}}
                  className="btn btn-sm btn-primary"
                  onClick={this.saveScript.bind(this)}>保存
          </button>
          <button type="button"
                  className="btn btn-sm btn-default"
                  onClick={this.handleCancel.bind(this)}>取消
          </button>
        </div>
      </div>
    );
  }
}

export default SaveScriptWin

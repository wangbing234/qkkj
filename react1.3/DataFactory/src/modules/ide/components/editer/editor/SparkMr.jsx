/***************************************************
 * 时间: 7/28/16 14:37
 * 作者: zhongxia
 * 说明: SparkMr 类型的
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
//bfd-ui components
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { FormSelect, Option } from 'bfd-ui/lib/FormSelect'

//custom components
import message from 'CommonComponent/component/bdosmessage'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import TreeSelect from 'CommonComponent/component/treeselect'
import Input from 'CommonComponent/component/input'

import Model from 'IDERoot/model/ide'

const style = {
  numWidth: {
    width: 175,
    display: 'inline-block'
  },
  width: {
    width: 150,
    display: 'inline-block'
  },
  midWidth: {
    width: 325,
    display: 'inline-block'
  },
  longWidth: {
    width: 570
  },
  center: {
    marginLeft: 100
  },
  unit: {
    marginLeft: 5
  }
}

//程序类型
const PROTYPE = {
  SCALA: "1",
  JAVA: "2",
  PYTHON: "3",
  R: "4"
}

class SparkMr extends React.Component {
  constructor(prop) {
    super(prop);

    let data = prop.data && prop.data.command || '{}'
    data = JSON.parse(data);
    this.state = {
      formData: {
        proType: "1",
        className: '',
        driveCores: "1",
        executorCores: "1",
        executorNum: "1",
        executorMemory: "2",
        ...data
      },
    };

    this.mr = 1;  //是否为MR类型

    this.rules = {
      proPath: (value)=> {
        return BaseValidate.validateInput({label: "程序路径", value: value, isRequired: true});
      },
      className: (value)=> {
        if (this.state.formData.proType !== PROTYPE.PYTHON && this.state.formData.proType !== PROTYPE.R) {
          return BaseValidate.validateInput({label: "mian函数", value: value, isRequired: true});
        }
      }
    }
  }


  /**
   * 虚拟DOM渲染到真实DOM之后, 回显数据
   */
  componentDidMount() {
    //获取Mr数据
    this.ajaxGetMr = Model.getMr((result)=> {
      let data = result.data || {};
      let treeData = this.modifyMrTreeData(data.mrFileList)
      this.setState({mrTreeSelectData: treeData, path: data.path})
    })
  }

  componentWillUnmount() {
    this.ajaxGetMr.abort();
  }

  /**
   * 返回表单的值,给执行保存用. [外部调用]
   * @returns {CustomMr.state.formData|{type, mainFun, reduceMemory, mapMemory, reduceCount}}
   */
  getValue() {
    if (this.refs.form.validate(this.state.formData)) {
      return this.state.formData || {};
    }
  }


  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = this.state.formData || {};
    //针对 多选框, 文本框
    if (event && event.target) {
      switch (event.target.type) {
        case "number":
          newState[name] = event.target.value + '';
          break;
        case "checkbox":
          newState[name] = event.target.checked + '';
          break;
        default:
          newState[name] = event.target.value + '';
      }
    }
    //针对 Select 组件
    else {
      newState[name] = event + '';
    }
    //实时验证
    if (name === "className" || name === "proPath") {
      this.refs[name] && this.refs[name].validate(newState[name])
    }

    this.setState({formData: newState});
  }

  /**
   * 动态加载树节点,处理数据格式
   * @param result 返回的结果
   */
  filterTreeData(result) {
    if (result.data.mrFileList && result.data.mrFileList.length > 0) {
      this.setState({path: result.data.path})
      result.data.mrFileList.map((item)=> {
        if (item.type === 1) {
          item.isParent = true;
        }
      })
      return result.data.mrFileList;
    }
  }

  /**
   * 修改下Mr程序的下拉树数据
   */
  modifyMrTreeData(data) {
    return data && data.map(item=> {
        if (item.type === 1) {
          item.isParent = true;
        }
        return item;
      })
  }

  /**
   * 动态树展开节点,把最新获取的数据,保存起来
   * @param data
   */
  onTreeChange(data) {
    this.setState({mrTreeSelectData: data})
  }

  /**
   * 切换Mr程序类型
   */
  onProTypeChange(name, val) {
    let newState = this.state.formData || {};
    newState[name] = val;
    newState["proPath"] = '';
    newState["className"] = '';
    newState["otherParams"] = '';
    newState["proParams"] = '';
    this.setState({formData: newState}, ()=> {
      this.refs["className"] && this.refs["className"].validate(newState["className"])
    });
  }


  render() {
    let defaultTreeValue = "";
    if (this.state.formData.proPath) {
      defaultTreeValue = this.state.formData.proPath.split('/');
      defaultTreeValue = defaultTreeValue[defaultTreeValue.length - 1]
    }

    //是否显示Main函数
    const showClassName = this.state.formData.proType === PROTYPE.PYTHON || this.state.formData.proType === PROTYPE.R;

    return (
      <Form
        ref="form"
        className="bdos-form spark-mr-form"
        data={this.state.formData}
        rules={this.rules}>

        <div className="row">
          <div className="col-sm-4">
            <FormItem required label="程序类型" name="proType">
              <FormSelect style={style.width} value={this.state.formData.proType}
                          onChange={this.onProTypeChange.bind(this,'proType')}>
                <Option value="1">Scala</Option>
                <Option value="2">Java</Option>
                <Option value="3">Python</Option>
                <Option value="4">R</Option>
              </FormSelect>
            </FormItem>
          </div>
          <div className="col-sm-12">
            <FormItem ref="proPath" required label="Spark程序" name="proPath">
              <TreeSelect
                style={style.longWidth}
                onlyParent={true}
                value={this.state.formData.proPath}
                defaultValue={defaultTreeValue}
                valueField="fullName"
                data={this.state.mrTreeSelectData||[]}
                onTreeChange={this.onTreeChange.bind(this)}
                dataFilter={this.filterTreeData.bind(this)}
                getUrl={item=>`${window.Server.dataFactory}ide/task/mrFiles?path=` + item.fullName}
                onChange={this.handleChange.bind(this,'proPath')}/>
            </FormItem>
          </div>

          <div className="col-sm-12" style={{display:showClassName?'none':'block'}}>
            <FormItem ref="className" required label="Main函数" name="className"
                      help="只能输入字母、数字、点、下划线，且必须以字母开头">
              <Input type="text"
                     style={style.longWidth}
                     className="form-control"
                     maxLength={512}
                     restrict={RestrictConst.NUM_START_STRING_UNDERLINE_POINT_512}
                     value={this.state.formData.className}
                     onChange={this.handleChange.bind(this,'className')}/>
            </FormItem>
          </div>
          <div className="col-sm-6">
            <FormItem label="Driver内核数" name="driveCores">
              <input type="number"
                     min={0}
                     style={style.numWidth}
                     className="form-control"
                     value={this.state.formData.driveCores}
                     onChange={this.handleChange.bind(this,'driveCores')}/>
              <span style={style.unit}>个</span>
            </FormItem>
          </div>
          <div className="col-sm-6">
            <FormItem label="Executor内核数" name="executorCores">
              <input type="number"
                     min={0}
                     style={style.numWidth}
                     className="form-control"
                     value={this.state.formData.executorCores}
                     onChange={this.handleChange.bind(this,'executorCores')}/>
              <span style={style.unit}>个</span>
            </FormItem>
          </div>
          <div className="col-sm-6">
            <FormItem label="Executor数量" name="executorNum">
              <input type="number"
                     min={0}
                     style={style.numWidth}
                     className="form-control"
                     value={this.state.formData.executorNum}
                     onChange={this.handleChange.bind(this,'executorNum')}/>
              <span style={style.unit}>个</span>
            </FormItem>
          </div>

          <div className="col-sm-6">
            <FormItem label="Executor内存大小" name="executorMemory">
              <input type="number"
                     min={0}
                     style={style.numWidth}
                     className="form-control"
                     value={this.state.formData.executorMemory}
                     onChange={this.handleChange.bind(this,'executorMemory')}/>
              <span style={style.unit}>GB</span>
            </FormItem>
          </div>
        </div>

        <FormItem label="程序参数" name="proParams">
          <Input type="text"
                 style={style.longWidth}
                 className="form-control"
                 renderType="textarea"
                 resizeType="v"
                 maxLength={1024}
                 value={this.state.formData.proParams}
                 onChange={this.handleChange.bind(this,'proParams')}/>
        </FormItem>

        <FormItem label="其他参数" name="otherParams">
          <Input type="text"
                 style={style.longWidth}
                 className="form-control"
                 renderType="textarea"
                 resizeType="v"
                 maxLength={1024}
                 value={this.state.formData.otherParams}
                 onChange={this.handleChange.bind(this,'otherParams')}/>
        </FormItem>

      </Form>
    );
  }
}

export default SparkMr
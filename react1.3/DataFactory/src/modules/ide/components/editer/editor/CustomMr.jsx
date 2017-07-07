/***************************************************
 * 时间: 7/28/16 14:37
 * 作者: zhongxia
 * 说明: 自定义Mr
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
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import TreeSelect from 'CommonComponent/component/treeselect'
import Input from 'CommonComponent/component/input'

import Model from 'IDERoot/model/ide'

const style = {
  width: {
    width: 150,
    display: 'inline-block'
  },
  numWidth: {
    width: 70,
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
  PYTHON: 1,
  JAVA: 2
}

class CustomMr extends React.Component {
  constructor(prop) {
    super(prop);

    let data = prop.data && prop.data.command || '{}'
    data = JSON.parse(data);

    this.state = {
      formData: {
        proType: PROTYPE.JAVA,
        mainClass: '',
        mapMem: "2",
        reduceMem: "3",
        reduceNum: "1",
        ...data
      },
    };

    this.mr = 1;  //是否为MR类型

    this.rules = {
      proPath: (value)=> {
        if (this.state.formData.proType === PROTYPE.JAVA) {
          return BaseValidate.validateInput({label: "程序路径", value: value, isRequired: true});
        }
      },
      mainClass: (value)=> {
        if (this.state.formData.proType === PROTYPE.JAVA) {
          return BaseValidate.validateInput({label: "mian函数", value: value, isRequired: true});
        }
      },
      mapPath: (value)=> {
        if (this.state.formData.proType === PROTYPE.PYTHON) {
          return BaseValidate.validateInput({label: "Mapper路径", value: value, isRequired: true});
        }
      },
      redPath: (value)=> {
        if (this.state.formData.proType === PROTYPE.PYTHON) {
          return BaseValidate.validateInput({label: "Reducer路径", value: value, isRequired: true});
        }
      }
    }
  }


  /**
   * 虚拟DOM渲染到真实DOM之后, 回显数据
   */
  componentDidMount() {
    this.ajaxGetMr = Model.getMr((result)=> {
      let data = result.data || {};
      let treeData = this.modifyMrTreeData(data.mrFileList)
      this.setState({proPathTreeData: treeData, redPathTreeData: treeData, mapPathTreeData: treeData})
    })
  }

  componentWillUnmount() {
    this.ajaxGetMr.abort();
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
          newState[name] = parseInt(event.target.value) || 0;
          break;
        case "checkbox":
          newState[name] = event.target.checked;
          break;
        default:
          newState[name] = event.target.value;
      }
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    //选中值后验证
    if (name === "mainClass" || name === "proPath" || name === "mapPath" || name === "redPath") {
      this.refs[name] && this.refs[name].validate(newState[name])
    }
    if (name === "proType") {
      this.refs.form.validate(newState);
      newState['mainClass'] = "";
      newState['proPath'] = "";
      newState['mapPath'] = "";
      newState['redPath'] = "";
    }
    //if (name === "proParam") {
    //  newState[name] = $.trim(newState[name])
    //}
    this.setState({formData: newState});
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
   * 动态加载树节点,处理数据格式
   * @param result 返回的结果
   */
  filterTreeData(result) {
    if (result.data.mrFileList && result.data.mrFileList.length > 0) {
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
   */
  onTreeChange(name, data) {
    let newState = this.state;
    newState[name] = data;
    this.setState(newState)
  }

  /**
   * 程序类型Pyahton 和 Java 有各自的参数
   * @returns {XML}
   */
  renderParam() {
    let proPath = "";
    let mapPath = "";
    let redPath = "";

    if (this.state.formData.proPath) {
      proPath = this.state.formData.proPath.split('/');
      proPath = proPath[proPath.length - 1];
    }
    if (this.state.formData.mapPath) {
      mapPath = this.state.formData.mapPath.split('/');
      mapPath = mapPath[mapPath.length - 1];
    }
    if (this.state.formData.redPath) {
      redPath = this.state.formData.redPath.split('/');
      redPath = redPath[redPath.length - 1];
    }

    if (this.state.formData.proType === PROTYPE.PYTHON) {
      return (
        <div>
          <div className="col-sm-12">
            <FormItem ref="mapPath" required label="Mapper路径" name="mapPath">
              <TreeSelect
                style={style.longWidth}
                onlyParent={true}
                value={this.state.formData.mapPath}
                defaultValue={mapPath}
                valueField="fullName"
                data={this.state.mapPathTreeData||[]}
                onTreeChange={this.onTreeChange.bind(this,'mapPathTreeData')}
                dataFilter={this.filterTreeData.bind(this)}
                getUrl={item=>`${window.Server.dataFactory}ide/task/mrFiles?path=` + item.fullName}
                onChange={this.handleChange.bind(this,'mapPath')}/>
            </FormItem>
          </div>

          <div className="col-sm-12">
            <FormItem ref="redPath" required label="Reducer路径" name="redPath">
              <TreeSelect
                style={style.longWidth}
                onlyParent={true}
                value={this.state.formData.redPath}
                defaultValue={redPath}
                valueField="fullName"
                data={this.state.redPathTreeData||[]}
                onTreeChange={this.onTreeChange.bind(this,'redPathTreeData')}
                dataFilter={this.filterTreeData.bind(this)}
                getUrl={item=>`${window.Server.dataFactory}ide/task/mrFiles?path=` + item.fullName}
                onChange={this.handleChange.bind(this,'redPath')}/>
            </FormItem>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="col-sm-12">
            <FormItem ref="proPath" required label="MR程序" name="proPath">
              <TreeSelect
                style={style.longWidth}
                onlyParent={true}
                value={this.state.formData.proPath}
                defaultValue={proPath}
                valueField="fullName"
                data={this.state.proPathTreeData||[]}
                onTreeChange={this.onTreeChange.bind(this,'proPathTreeData')}
                dataFilter={this.filterTreeData.bind(this)}
                getUrl={item=>`${window.Server.dataFactory}ide/task/mrFiles?path=` + item.fullName}
                onChange={this.handleChange.bind(this,'proPath')}/>
            </FormItem>
          </div>

          <div className="col-sm-12">
            <FormItem ref="mainClass" required label="Main函数" name="mainClass"
                      help="只能输入字母、数字、点、下划线，且必须以字母开头">
              <Input type="text"
                     style={style.longWidth}
                     className="form-control"
                     maxLength={512}
                     restrict={RestrictConst.NUM_START_STRING_UNDERLINE_POINT_512}
                     value={this.state.formData.mainClass}
                     onChange={this.handleChange.bind(this,'mainClass')}/>
            </FormItem>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <Form
        ref="form"
        className="bdos-form custom-mr-form"
        data={this.state.formData}
        rules={this.rules}>

        <div className="row">
          <div className="col-sm-4">
            <FormItem required label="程序类型" name="proType">
              <FormSelect style={style.width} value={this.state.formData.proType}
                          onChange={this.handleChange.bind(this,'proType')}>
                <Option value={PROTYPE.PYTHON}>python</Option>
                <Option value={PROTYPE.JAVA}>java</Option>
              </FormSelect>
            </FormItem>
          </div>

          {this.renderParam()}

          <div className="col-sm-4">
            <FormItem label="Map内存" name="mapMem">
              <input type="number"
                     min={0}
                     style={style.numWidth}
                     className="form-control"
                     value={this.state.formData.mapMem}
                     onChange={this.handleChange.bind(this,'mapMem')}/>
              <span style={style.unit}>GB</span>
            </FormItem>
          </div>
          <div className="col-sm-4">
            <FormItem label="Reduce内存" name="reduceMem">
              <input type="number"
                     min={0}
                     style={style.numWidth}
                     className="form-control"
                     value={this.state.formData.reduceMem}
                     onChange={this.handleChange.bind(this,'reduceMem')}/>
              <span style={style.unit}>GB</span>
            </FormItem>
          </div>
          <div className="col-sm-4">
            <FormItem label="Reduce个数" name="reduceNum">
              <input type="number"
                     min={0}
                     style={style.numWidth}
                     className="form-control"
                     value={this.state.formData.reduceNum}
                     onChange={this.handleChange.bind(this,'reduceNum')}/>
              <span style={style.unit}>个</span>
            </FormItem>
          </div>
        </div>

        <FormItem label="程序参数" name="proParam">
          <Input type="text"
                 renderType="textarea"
                 resizeType="v"
                 style={style.longWidth}
                 className="form-control"
                 maxLength={1024}
                 restrict={RestrictConst.NUM_START_STRING_UNDERLINE_POIN_SPACE_T_SPECIALCHAR_1024}
                 value={this.state.formData.proParam}
                 onChange={this.handleChange.bind(this,'proParam')}/>
        </FormItem>


        <FormItem label="创建路径" name="mkPath" help="执行前创建路径, 多个路径以逗号分隔">
          <Input type="text"
                 style={style.longWidth}
                 className="form-control"
                 maxLength={1024}
                 value={this.state.formData.mkPath}
                 onChange={this.handleChange.bind(this,'mkPath')}/>
        </FormItem>

        <FormItem label="删除路径" name="delPath" help="执行前删除路径, 多个路径以逗号分隔">
          <Input type="text"
                 style={style.longWidth}
                 className="form-control"
                 maxLength={1024}
                 value={this.state.formData.delPath}
                 onChange={this.handleChange.bind(this,'delPath')}/>
        </FormItem>
      </Form>
    );
  }
}

export default CustomMr
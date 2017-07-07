/***************************************************
 * 时间: 16/6/24 10:51
 * 作者: zhongxia
 * 说明: 角色列表 添加用户
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'bfd-ui/lib/message'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { FormSelect, Option } from 'bfd-ui/lib/FormSelect'
import { Checkbox } from 'bfd-ui/lib/Checkbox'

import BDOSTable from  'common/components/BDOSTable'  // 表格

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'

import Model from 'model/apiManager'

let that;
class AddMySqlAPI extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      getDbSource: [],
      isEdit: prop.data ? true : false,
      checkedArr: [],
      configId: '',
      tableName: '',
      type: 0,
      tableColumns: [
        'name', 'age'
      ],
      interfaces: [
        {id: 1, field: 'getByRowKey', value: '', hideBorder: true},
        {id: 2, field: 'getByColumnfamily', value: '', hideBorder: true},
        {id: 3, field: 'getByColumn', value: ''},

        {id: 4, field: 'delRowKey', value: '', hideBorder: true},
        {id: 5, field: 'delColumn', value: ''},

        {id: 6, field: 'update', value: ''},
        {id: 7, field: 'list', value: ''},
        {id: 8, field: 'rangeList', value: '',},
      ],
      ...prop.data
    };

    /**
     * 表格列
     * @type {*[]}
     */
    this.columns = [
      {
        title: '字段',
        key: 'field',
        width: 100,
        render: function (text, item) {
          return (
            <div>
              <Checkbox checked={that.state.id?true:item.checked}
                        disabled={that.state.id?true:false}
                        onChange={that.handleTableChange.bind(that,item,'checked')}>{text}</Checkbox>
            </div>
          )
        }
      },
      {
        title: 'URL',
        key: 'url',
        render: function (text, item) {
          return (
            <div>
              <input type="text" className="form-control" value={item.value}
                     disabled={true}
                     onChange={that.handleTableChange.bind(that,item,'value')}/>
            </div>
          )
        }
      }
    ]

    this.rules = {
      tableName(val){
        if (!val) return '表不能为空!'
      },
      configId(val){
        if (!val) return '数据源不能为空!'
      }
    }
  }

  componentDidMount() {
    //编辑的时候, 回显
    if (that.state.isEdit) {
      Model.view(that.state.id, function (result) {
        console.log("result", result.data)
        that.setState({...result.data})
      })
    }

    //获取数据源下拉列表
    Model.getDbSource(1, function (result) {
      console.log("result", result)
      that.setState({dbSourceList: result.data})
    })
  }


  componentWillUnmount() {
    that = null;
  }


  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /**
   * 数据源下拉框, change事件
   * @param name
   * @param id
   */
  dbChange(name, id) {

    let newState = {};
    newState[name] = id;
    newState['tableList'] = [];
    newState['tableName'] = "";
    if (id) {
      let aliasName = that.getAliasName(id)['aliasName'];
      newState['aliasName'] = aliasName;
      //获取表格下拉框
      Model.getHbaseTable(aliasName, function (result) {
        newState['tableList'] = result.data || []
        that.setState(newState);
      })
    } else {
      newState['aliasName'] = "";
    }
    that.setState(newState);
  }

  /**
   * 根据id, 获取数据源 的信息
   */
  getAliasName(id) {
    let data = that.state.dbSourceList;
    if (data) {
      for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        if (obj.id === id)
          return obj;
      }
    }
  }

  /**
   * 表格下拉框, change事件
   * @param name
   * @param tableName
   */
  tableChange(name, tableName) {
    let newState = {};
    newState[name] = tableName;

    let interfaces = that.state.interfaces;
    for (var i = 0; i < interfaces.length; i++) {
      var obj = interfaces[i];
      obj['value'] = that.generatorApiUrl(obj.field);
    }
    newState["interfaces"] = interfaces;
    console.log("newState", newState)
    that.setState(newState);
  }

  /**
   * 生成API地址
   */
  generatorApiUrl(apiType) {
    return `/api/hbase/${that.state.aliasName}/a/${that.state.tableName}/${apiType}`
  }

  /**
   * 表格修改
   * @param item
   * @param event
   */
  handleTableChange(item, key, event) {
    let data = that.state.interfaces;
    let dataItem = data[item.id - 1];
    let value = event.target.value;
    if (event.target.type === "checkbox") {
      value = event.target.checked;
    }
    dataItem[key] = value;
    that.setState({interfaces: data})
  }


  closePage() {
    that.props.parent && that.props.parent.setState({isAddPage: false})
  }


  /**
   * 添加或者编辑
   */
  addOrEdit() {
    console.log("that.state", that.state)

    if (that.refs.form.validate(that.state)) {
      //编辑
      if (that.state.id) {
        //过滤跳一些数据
        let {dbSourceList,interfaces,createTime,updateTime,...data} = that.state;
        Model.update(data, function (result) {
          console.log("result", result)
          message.success("更新资源配置成功!")
          that.props.parent.getTableData();
          that.closePage()
        })
      } else {
        //添加 TODO:等待联调接口
        let addData = {
          configId: that.state.configId,
          tableName: that.state.tableName,
          ops: JSON.stringify(that.getSelectedAPI()),
        }

        Model.add(addData, function (result) {
          console.log("result", result)
          message.success("新增资源配置成功!")
          that.props.parent.getTableData();
          that.closePage()
        })
      }
    }
  }

  /**
   * 获取选中的API URL
   * @returns {Array}
   */
  getSelectedAPI() {
    let interfaces = that.state.interfaces;
    let selectedArr = [];
    for (var i = 0; i < interfaces.length; i++) {
      let obj = interfaces[i];
      if (obj['checked']) {
        selectedArr.push({op: obj.field, apiUrl: obj.value});
      }
    }
    return selectedArr;
  }

  /**
   * 渲染 文本框, 编辑的时候才有
   * @returns {XML}
   */
  renderTextArea() {
    if (that.state.isEdit) {
      return (
        <div>
          <FormItem label="输出参数" name="outParams">
          <textarea className="form-control" style={that.style.textarea}
                    value={that.state.outParams}
                    onChange={that.handleChange.bind(that,'outParams')}></textarea>
          </FormItem>

          <FormItem label="API摘要说明" name="digestContent">
          <textarea className="form-control" style={that.style.textarea}
                    value={that.state.digestContent}
                    onChange={that.handleChange.bind(that,'digestContent')}></textarea>
          </FormItem>

          <FormItem label="API详细说明" name="detailContent">
          <textarea className="form-control" style={that.style.textarea}
                    value={that.state.detailContent}
                    onChange={that.handleChange.bind(that,'detailContent')}></textarea>
          </FormItem>
        </div>
      )
    }
  }

  renderAPITable() {
    if (that.state.id) {
      return (
        <FormItem label="URL" name="table">
          <BDOSTable style={{width:700,marginBottom:20}}
                     columns={that.columns}
                     data={[{field:that.state.op,value:that.state.apiUrl}]}/>
        </FormItem>)
    } else {
      return (
        <FormItem label="URL" name="table">
          <BDOSTable style={{width:700,marginBottom:20}}
                     columns={that.columns}
                     data={that.state.interfaces}/>
        </FormItem>
      )
    }
  }

  render() {
    that = this;
    that.style = {
      width: {
        width: 250,
        display: 'inline-block'
      },
      center: {
        marginLeft: 100
      },
      textarea: {
        width: 700,
        height: 100
      },
      table: {
        width: 700,
        display: 'inline-block'
      }
    }

    return (
      <div className="bdos-edit-form">
        <Form
          ref="form"
          data={this.state}
          rules={this.rules}>

          <FormItem label="数据源" required name="configId">
            <FormSelect style={that.style.width}
                        value={that.state.configId}
                        disabled={that.state.id?true:false}
                        onChange={that.dbChange.bind(that,'configId')}>
              <Option value="">请选择</Option>
              {
                that.state.dbSourceList && that.state.dbSourceList.map(function (item, index) {
                  return (
                    <Option key={index} value={item.id}>{item.sourceName}</Option>
                  )
                })
              }
            </FormSelect>
          </FormItem>

          <FormItem label="表" required name="tableName">
            <FormSelect style={that.style.width}
                        value={that.state.tableName}
                        disabled={that.state.id?true:false}
                        onChange={that.tableChange.bind(that,'tableName')}>
              <Option value="">请选择</Option>
              {
                that.state.tableList && that.state.tableList.map(function (item, index) {
                  return (
                    <Option key={index} value={item}>{item}</Option>
                  )
                })
              }
            </FormSelect>
          </FormItem>

          {that.renderAPITable()}

          {that.renderTextArea()}

          <div style={that.style.center}>
            <button type="button"
                    className="btn btn-sm btn-primary" onClick={this.addOrEdit}>保存
            </button>
            <button type="button"
                    style={{marginLeft:30}}
                    className="btn btn-sm btn-default" onClick={this.closePage}>取消
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

export default AddMySqlAPI
/***************************************************
 * 时间: 16/6/24 10:51
 * 作者: zhongxia
 * 说明: 添加用户
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'bfd-ui/lib/message'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { Select, Option } from 'bfd-ui/lib/Select'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import Icon from 'bfd-ui/lib/Icon'

import BDOSTable from  'common/components/BDOSTable'  // 表格

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'

import Model from 'model/apiManager'

let that;
class AddMySqlAPI extends React.Component {
  constructor(prop) {
    super(prop);
    console.log("prop.data ? true : false", prop.data ? true : false)
    this.state = {
      isEdit: prop.data ? true : false,
      dbSourceList: [],//数据源列表
      configId: '',  //数据源id
      staType: 0,   //API 类型, 0 标准  1 自定义
      tableColumns: [],  //表格列数组 , 目前没有用

      customParamTable: [
        {_sKey: 'customParamTable', _index: 0, field: '', type: 'int', comment: ''},
      ],
      apiGetTableData: [
        {_sKey: 'apiGetTableData', _index: 0, field: '', type: 'int', comment: ''},
      ],
      apiDelTableData: [
        {_sKey: 'apiDelTableData', _index: 0, field: '', type: 'int', comment: ''},
      ],
      apiListTableData: [
        {_sKey: 'apiListTableData', _index: 0, field: '', type: 'int', comment: ''},
      ],

      ...prop.data
    };

    // 参数表格的字段
    this.columns = [
      {
        title: '字段',
        key: 'field',
        render: function (text, item) {
          return (
            <div>
              <input type="text" className="form-control"
                     value={item.field}
                     disabled={that.state.id?true:false}
                     onChange={that.handleTableChange.bind(that,item,'field')}/>
            </div>
          )
        }
      },
      {
        title: '类型',
        key: 'type',
        render: function (text, item) {
          return (
            <div>
              <Select value={item.type}
                      disabled={that.state.id?true:false}
                      onChange={that.handleTableChange.bind(that,item,'type')}>
                <Option value="varchar">varchar</Option>
                <Option value="int">int</Option>
              </Select>
            </div>
          )
        }
      }, {
        title: '说明',
        key: 'comment',
        render: function (text, item) {
          return (
            <div>
              <input type="text"
                     className="form-control"
                     value={item.comment}
                     disabled={that.state.id?true:false}
                     onChange={that.handleTableChange.bind(that,item,'comment')}/>
            </div>
          )
        }
      }
    ]

    /**
     * 表格列
     * @type {*[]}
     */
    this.updateColumns = [
      {
        title: '操作',
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
                     disabled={that.state.id?true:false}
                     onChange={that.handleTableChange.bind(that,item,'value')}/>
            </div>
          )
        }
      }
    ]

    //API类型, get del list 三种类型
    this.data = [
      {id: 1, field: 'get', value: '', checked: false,},
      {id: 2, field: 'del', value: '', checked: false},
      {id: 4, field: 'list', value: '', checked: false},
    ]

    this.rules = {
      tableName(val){
        if (!val) return '表不能为空!'
      },
      configId(val){
        if (!val) return '数据源不能为空!'
      },
      apiUrl(val){
        if (that.state.staType === 1) {
          if (!val) return 'URL不能为空!'
        }
      },
      sqlInfo(val){
        if (that.state.staType === 1) {
          if (!val) return 'SQL不能为空!'
        }
      }
    }
  }

  componentDidMount() {
    //编辑的时候, 回显
    if (that.state.isEdit) {
      Model.view(that.state.id, function (result) {
        console.log("result", result.data)

        //自定义模式回显
        if (result.data && result.data.staType === 1) {
          let customParamTable = JSON.parse(result.data.conditions || "[]")
          for (var i = 0; i < customParamTable.length; i++) {
            var obj = customParamTable[i];
            obj._sKey = 'customParamTable';
            obj._index = i;
            obj.field = obj.name;
            obj.type = obj.type;
            obj.comment = obj.desc;
          }
          result.data['customParamTable'] = customParamTable;
        }

        that.setState({...result.data})
      })
    }

    Model.getDbSource(0, function (result) {
      console.log("result", result)
      that.setState({dbSourceList: result.data})
    })
  }

  componentWillUnmount() {
    that = null;
  }


  handleChange(name, event) {
    let newState = {};
    //针对 多选框, 文本框
    if (event && event.target) {
      let type = event.target.type;
      if (type === 'checkbox') {
        newState[name] = event.target.checked;
      }
      else {
        newState[name] = event.target.value;
      }
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    that.setState(newState);
  }

  /**
   * 数据源下拉框, change事件
   * @param name
   * @param id
   */
  dbChange(name, id) {
    let newState = {};
    newState[name] = id;
    newState['tableName'] = ""
    newState['tableList'] = []
    newState['tableColumns'] = []
    if (id) {
      let aliasName = that.getAliasName(id)['aliasName'];
      newState['aliasName'] = aliasName;
      newState["apiUrl"] = that.getCustomAPIUrl(aliasName);

      //获取表格下拉框
      Model.getTableSource(id, function (result) {
        newState['tableList'] = result.data || []
        that.setState(newState);
      })
    } else {
      newState['aliasName'] = "";
      newState["apiUrl"] = ""
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
   * 获取自定义URL
   * @returns {*}
   */
  getCustomAPIUrl(aliasName) {
    return `/api/mysql/${aliasName}/c/${that.state['customAPIUrl'] || ''}`
  }

  /**
   * 表格下拉框, change事件
   * @param name
   * @param tableName
   */
  tableChange(name, tableName) {
    let newState = {};
    newState[name] = tableName;

    newState["getUrl"] = that.generatorStandardApiUrl('get', tableName);
    newState["delUrl"] = that.generatorStandardApiUrl('del', tableName);
    newState["listUrl"] = that.generatorStandardApiUrl('list', tableName);
    that.setState(newState)
    //获取表格下拉框
    Model.getColSource({configId: that.state.configId, tableName: tableName}, function (result) {
      newState['tableColumns'] = result.data || []
      that.setState(newState);
    })
  }

  /**
   * 生成标准API地址
   */
  generatorStandardApiUrl(apiType, tableName) {
    return `/api/mysql/${that.state.aliasName}/a/${tableName}/${apiType}`
  }

  /**
   * 参数表格内容修改
   * @param item
   * @param event
   */
  handleTableChange(item, key, event) {
    let data = that.state[item._sKey];
    if (data) {
      let dataItem = data[item._index];
      let value = '';
      if (event.target && event.target.type === "text") {
        value = event.target.value;
      } else {
        value = event;
      }

      dataItem[key] = value;
      let newState = {};
      console.log("data", data)
      newState[item._sKey] = data;

      that.setState(newState)
    }
  }

  /**
   * 关闭页面
   */
  closePage() {
    that.props.parent && that.props.parent.setState({isAddPage: false})
  }


  /**
   * 添加或者编辑
   */
  addOrEdit() {
    let {apiDelTableData,apiGetTableData,apiListTableData,customParamTable,createTime,updateTime,createTimeStr,updateTimeStr,dbSourceList,tableColumns,tableList,...data} = that.state;

    data['conditions'] = that.getJSONFromTableData(customParamTable);
    data['ops'] = that.getOps(apiGetTableData, apiDelTableData, apiListTableData)

    if (that.refs.form.validate(that.state)) {
      if (that.state.id) {
        Model.update(data, function (result) {
          console.log("result", result)
          message.success("更新资源配置成功!")
          that.props.parent.getTableData();
          that.closePage()
        })
      } else {
        Model.add(data, function (result) {
          console.log("result", result)
          message.success("新增资源配置成功!")
          that.props.parent.getTableData();
          that.closePage()
        })
      }
    }
  }

  /**
   * 获取标准API 的参数
   */
  getOps(apiGetTableData, apiDelTableData, apiListTableData) {
    let ops = [];
    if (that.state.urlGet) {
      ops.push({
        op: 'get',
        apiUrl: that.state.getUrl,
        sqlInfo: that.state.getSql,
        conditions: that.getJSONFromTableData(apiGetTableData),
      })
    }
    if (that.state.urlDel) {
      ops.push({
        op: 'del',
        apiUrl: that.state.delUrl,
        sqlInfo: that.state.delSql,
        conditions: that.getJSONFromTableData(apiDelTableData),
      })
    }
    if (that.state.urlList) {
      ops.push({
        op: 'list',
        apiUrl: that.state.listUrl,
        sqlInfo: that.state.listSql,
        conditions: that.getJSONFromTableData(apiListTableData),
      })
    }
    return JSON.stringify(ops);
  }

  /**
   * 把表格数据转换成JSON数据
   */
  getJSONFromTableData(tableData) {
    let json = [];
    tableData && tableData.map(function (item, index) {
      json.push({
        name: item.field,
        type: item.type,
        desc: item.comment
      })
    })
    return JSON.stringify(json);
  }

  /**
   * 参数 添加行
   */
  addTableRow(tableDataKey) {
    let tableData = that.state[tableDataKey] || [];
    tableData.push({_sKey: tableDataKey, _index: tableData.length, field: '', type: 'int', comment: ''})
    let newState = {}
    newState[tableDataKey] = tableData;
    that.setState(newState)
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

  /**
   * 渲染标准类型下的 URL参数
   */
  renderStandardURLAPI() {
    if (that.state.id) {
      return (
        <BDOSTable style={{width:550,marginBottom:20}}
                   columns={that.updateColumns}
                   data={[{field:that.state.op,value:that.state.apiUrl}]}/>)
    } else {
      return (
        <div>
          <div>
            <Checkbox checked={that.state.urlGet} onChange={that.handleChange.bind(that,'urlGet')}>get</Checkbox>
            <div className="standard-api" style={{display:that.state.urlGet?'block':'none'}}>
              {that.renderMySqlAPI('getUrl', 'getSql', 'getParam', 'apiGetTableData')}
            </div>
          </div>
          <div>
            <Checkbox checked={that.state.urlDel} onChange={that.handleChange.bind(that,'urlDel')}>del</Checkbox>
            <div className="standard-api" style={{display:that.state.urlDel?'block':'none'}}>
              {that.renderMySqlAPI('delUrl', 'delSql', 'delParam', 'apiDelTableData')}
            </div>
          </div>
          <div>
            <Checkbox checked={that.state.urlList} onChange={that.handleChange.bind(that,'urlList')}>list</Checkbox>
            <div className="standard-api" style={{display:that.state.urlList?'block':'none'}}>
              {that.renderMySqlAPI('listUrl', 'listSql', 'listParam', 'apiListTableData', false)}
            </div>
          </div>
        </div>
      )
    }
  }

  /**
   * 渲染标准API的参数
   */
  renderStandardAPI() {
    return (
      <div>
        <FormItem label="表" required name="tableName">
          {that.renderTableName()}
        </FormItem>

        <FormItem label="列" name="table" style={{minHeight:30}}>
          {
            that.state.tableColumns && that.state.tableColumns.map(function (item, index) {
              let divisionStr = index === 0 ? '' : ' , '
              return (<span key={index} style={{height:30,lineHeight: '30px'}}>{divisionStr}{item.name}</span>)
            })
          }
        </FormItem>

        <FormItem label="URL" name="table">
          {that.renderStandardURLAPI()}
        </FormItem>
      </div>
    );
  }

  /**
   * 渲染表展示
   * @returns {XML}
   */
  renderTableName() {
    if (that.state.id) {
      return (
        <input type="text" className="form-control" style={that.style.table} value={that.state.tableName}
               disabled={that.state.id?true:false}/>
      )
    } else {
      return (
        <Select style={that.style.table}
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
        </Select>
      )
    }
  }

  /**
   * 渲染文本框和文本域
   * @param urlKey url的key参数
   * @param sqlKey sql语句
   * @returns {XML}
   */
  renderUrlAndSql(urlKey, sqlKey, paramKey, urlLabel, sqlLabel, paramLabel, tableData, sqlKeyIsRequired, disabled = true) {
    return (
      <div>
        <FormItem label={urlLabel} required name={urlKey}>
          <RestrictInput type="text"
                         style={that.style.url}
                         className="form-control"
                         disabled={disabled}
                         value={this.state[urlKey]}
                         onChange={that.handleChange.bind(that,urlKey)}/>
        </FormItem>
        <FormItem label={sqlLabel} required={sqlKeyIsRequired} name={sqlKey}>
          <textarea className="form-control" style={that.style.textarea}
                    value={that.state[sqlKey]}
                    onChange={that.handleChange.bind(that,sqlKey)}></textarea>
        </FormItem>
        <FormItem label={paramLabel} name={paramKey}>
          <BDOSTable style={{width:700,marginBottom:20}}
                     columns={that.columns}
                     data={that.state[tableData]}/>
        </FormItem>

        <FormItem label="" name="">
          <a href="javascript:void(0)" disabled={that.state.id?true:false}
             onClick={that.addTableRow.bind(that,tableData)}> <Icon type="plus"/>{' '}添加</a>
        </FormItem>
      </div>
    )
  }

  /**
   * 渲染自定义API的参数
   */
  renderCustomAPI() {
    return that.renderUrlAndSql("apiUrl", "sqlInfo", 'customParam', 'URL', 'SQL', '输入参数', 'customParamTable', true, false)
  }

  /**
   * 添加MySQL API 列表
   * @param urlKey URL字段名
   * @param sqlKey SQL字段名
   * @param paramKey 参数字段名
   * @param tableData 表格数据
   * @param sqlKeyIsRequired 条件是否是必填项
   * @returns {XML}
   */
  renderMySqlAPI(urlKey, sqlKey, paramKey, tableData, sqlKeyIsRequired = true) {
    return that.renderUrlAndSql(urlKey, sqlKey, paramKey, 'URL', '条件', '输入参数', tableData || '', sqlKeyIsRequired)
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
        width: 250,
        display: 'inline-block'
      },
      url: {
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
            <Select style={that.style.width}
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
            </Select>
          </FormItem>

          <FormItem label="别名" name="aliasName">
            <RestrictInput type="text"
                           style={that.style.width}
                           className="form-control"
                           value={this.state.aliasName}
                           disabled={true}
                           onChange={that.handleChange.bind(that,'aliasName')}/>
          </FormItem>

          <FormItem label="类型" name="staType">
            <Select style={that.style.width}
                    value={that.state.staType}
                    disabled={that.state.id?true:false}
                    onChange={that.handleChange.bind(that,'staType')}>
              <Option value={0}>标准</Option>
              <Option value={1}>自定义</Option>
            </Select>
          </FormItem>

          {that.state.staType === 1 ? that.renderCustomAPI() : that.renderStandardAPI()}

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
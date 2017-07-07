import React from 'react';
import Icon from 'bfd-ui/lib/Icon'
import {Form, FormItem} from 'bfd-ui/lib/Form2'
import { Select, Option } from 'bfd-ui/lib/Select2'
import AutoComplete from 'bfd-ui/lib/AutoComplete'
import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import message from 'CommonComponent/component/bdosmessage'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import ValidateTable from 'CommonComponent/component/validatetable'

import TypeConst from '../../utils/TypeConst'
import AjaxReq from '../../ajax/AjaxReq'


class DbInfoPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.resourceTypeList = [];
    this.hiveTargetList = [];
    this.hiveTargetDatabaseList = [];
    this.hiveTargetTableList = [];
    this.hiveTargetPartiList = [];
    this.dataSourceList = [];//数据源列表
    this.databaseList = [];//数据库列表
    this.queueList = [];
    this.queuePriority = "";
    this.sourceTableList = [];
    this.state = this.setDataToState();
    this.setRules.bind( this );
    this.rules = this.setRules();
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getDatabaseTypeList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*每次组件更新时，更新验证*/
  componentDidUpdate() {
    if ( this.needValidate && this.hasValidate ) {
      this.needValidate = false;
      this.refs.dbInfoForm.validate( this.state.data );
    }
  }

  setRules() {
    let that = this;
    let _data = this.state.data;
    return {
      name( value ){
        let isError = BaseValidate.validateInput( { label: "资源名称", value, isRequired: true } );
        if ( isError ) {
          return isError;
        } else if ( that.nameIsRepeat ) {
          return "资源名称不能重复！";
        }
        return "";
      },
      storageType( value ){
        return BaseValidate.validateInput( { label: "导出方式", value, isRequired: true } );
      },
      datasourceType( value ){
        return BaseValidate.validateInput( { label: "导出目标", value, isRequired: true } );
      },
      hiveDataSource( value ){
        if ( _data.storageType == TypeConst.importType ) {
          return BaseValidate.validateInput( { label: "Hive源", value, isRequired: true } );
        }
      },
      nameSpace( value ){
        if ( _data.storageType == TypeConst.importType ) {
          return BaseValidate.validateInput( { label: "Hive库", value, isRequired: true } );
        }
      },
      hiveTableName( value ){
        if ( _data.storageType == TypeConst.importType ) {
          return BaseValidate.validateInput( { label: "源表名", value, isRequired: true } );
        }
      },
      partition( value ){
        return that.refs.partiTab.validate() ? "" : "分区列值有误！";
      },

      hdfsUrl( value ){
        if ( _data.storageType != TypeConst.importType ) {
          return BaseValidate.validateInput( { label: "源导出地址", value, isRequired: true } );
        }
      },
      dataSource( value ){
        return BaseValidate.validateInput( { label: "目标源", value, isRequired: true } );
      },
      tableName( value ){
        return BaseValidate.validateInput( { label: "目标表", value: _data.tableName, isRequired: true } );
      },
      /*updateModel( value ){
        return BaseValidate.validateInput( { label: "更新模式", value, isRequired: true } );
      },
      updateMethod( value ){
        return BaseValidate.validateInput( { label: "更新属性", value, isRequired: true } );
      },*/
      queue( value ){
        return BaseValidate.validateInput( { label: "队列", value, isRequired: true } );
      }
    };
  }

  /*设置数据到state中*/
  setDataToState() {
    let _data;
    this.nameIsRepeat = false;
    if ( this.props.isNew ) {
      _data = {
        data: {
          storageType: TypeConst.importType,
          typeCode: TypeConst.DB,
          syncType: TypeConst.EXPORT_TYPE,
          updateModel:"",
          rowSplit: "\\n",
          columnSplit: "\\001"
        }
      };
    } else {
      _data = { data: this.props.data };
      this.hiveTargetPartiList = JSON.parse( _data.data.partition ) ? JSON.parse( _data.data.partition ) : [];
    }
    return _data;
  }

  /*从state中获取数据并返回*/
  getDataFromState() {
    let _stateData = this.state.data;
    let infoJson = {};
    let _data = {};
    _data.projectCode = window.projectCode;
    _data.name = _stateData.name;
    _data.code = _stateData.code;
    _data.typeCode = TypeConst.DB;
    _data.accessType = 1;//0 导入， 1导出
    _data.syncType = TypeConst.EXPORT_TYPE;
    _data.datasourceType = _stateData.datasourceType;
    _data.storageType = _stateData.storageType;
    _data.queue = _stateData.queue;
    _data.priority = this.queuePriority;
    _data.sqoopInput = _stateData.sqoopInput;
    _data.datasourceInfo = this.getCommond();
    return _data;
  }

  /*获取可执行/需要拼接的json*/
  getCommond() {
    let _stateData = this.state.data;
    let infoJson = {};
    //执行需要
    infoJson.typeCode = TypeConst.DB;
    infoJson.accessType = 0; //0 导入， 1导出
    infoJson.syncType = _stateData.syncType;//1单表 2多表 3条件 4ftp 5导出
    infoJson.datasourceType = _stateData.datasourceType;
    infoJson.storageType = _stateData.storageType;
    infoJson.queue = _stateData.queue;
    infoJson.priority = this.queuePriority;
    infoJson.sqoopInput = _stateData.sqoopInput;
    infoJson.importType = _stateData.storageType;
    infoJson.dataSource = _stateData.dataSource;
    /*if(this.dataSourceList && this.dataSourceList.length && this.dataSourceList[ 0 ].hasSchema){
      infoJson.schema = _stateData.schema;
    }*/
    infoJson.tableName = _stateData.tableName;
    infoJson.excludeColumns = "";
    if ( _stateData.storageType == TypeConst.importType ) {
      infoJson.hiveDataSource = _stateData.hiveDataSource;
      infoJson.nameSpace = _stateData.nameSpace;
      infoJson.hiveTableName = _stateData.hiveTableName;
      infoJson.dynamicRule = _stateData.dynamicRule;
      infoJson.filterRule = _stateData.filterRule;
      if ( this.hiveTargetPartiList.length ) {
        infoJson.partition = JSON.stringify( this.hiveTargetPartiList );
      }
    } else {
      infoJson.hdfsUrl = _stateData.hdfsUrl;
    }
    if(_stateData.updateModel){
      infoJson.updateModel = _stateData.updateModel;
    }
    infoJson.updateMethod = _stateData.updateMethod;
    infoJson.rowSplit = _stateData.rowSplit;
    infoJson.columnSplit = _stateData.columnSplit;
    return JSON.stringify( infoJson );
  }

  /*获取数据库类型列表*/
  getDatabaseTypeList() {
    let that = this;
    that.resourceTypeList = [];
    AjaxReq.getDatabaseTypeList( {}, ( data ) => {
      data = data.data;
      that.resourceTypeList = data;
      data.map( ( item ) => {
        TypeConst.dataSourceTypeIdDic[ item.typeId ] = item.name;
        TypeConst.dataSourceTypeDic[ item.name ] = item.typeId;
      } );
      if ( that.loadInterval ) {
        that.getTargetDataSource();
        if ( !that.props.isNew ) {
          that.getRelativeDataSourceList( TypeConst.dataSourceTypeIdDic[ that.state.data.datasourceType ] );
        }
        that.setState( { ...this.state } );
      }
    } );
  }

  /*获取数据源列表*/
  getRelativeDataSourceList( typeName ) {
    let that = this;
    that.dataSourceList = [];
    AjaxReq.getRelativeDataSourceList( {
      typeName: typeName
    }, ( data ) => {
      that.dataSourceList = data.data;
      if ( that.loadInterval ) {
        if ( !that.props.isNew ) {
          /*if ( that.dataSourceList && that.dataSourceList.length && that.dataSourceList[ 0 ].hasSchema ) {
            that.getDatabaseList( that.state.data.dataSource );
          } else {*/
            that.getSourceTableList( this.state.data.dataSource );
          //}
        }
        that.setState( { ...that.state } );
      }
    } );
  }

  /*获取数据库列表*/
  getDatabaseList( sourceId ) {
    let that = this;
    that.databaseList = [];
    AjaxReq.getDatabaseList( {
      id: sourceId
    }, ( data ) => {
      that.databaseList = data.data;
      if ( that.loadInterval ) {
        that.setState( { ...that.state } );
        if ( !that.props.isNew ) {
          that.getSourceTableList( sourceId, that.state.data.schema );
        }
      }
    } );
  }

  /*获取表列表*/
  getSourceTableList( paramId, db ) {
    let that = this;
    that.sourceTableList = [];
    AjaxReq.getTableList( {
      id: paramId,
      schema: db
    }, ( data ) => {
      that.sourceTableList = data.data;
      if ( that.loadInterval ) {
        that.setState( { ...that.state } );
        if ( !that.props.isNew ) {
          that.getTargetDataSource();
        }
      }
    } );
  }

  /*获取hive目标源*/
  getTargetDataSource() {
    let that = this;
    that.hiveTargetList = [];
    AjaxReq.getDataSourceList( {
      typeName: "hive"
    }, ( data ) => {
      that.hiveTargetList = data.data;
      if ( that.loadInterval ) {
        that.getQueueList();
        if ( !that.props.isNew ) {
          that.getHiveDatabase( that.state.data.hiveDataSource );
        }
        that.setState( {} );
      }
    } );
  }

  /*获取hive数据库列表*/
  getHiveDatabase( hiveId ) {
    this.hiveTargetDatabaseList = [];
    if ( hiveId ) {
      let that = this;
      AjaxReq.getHiveDatabase( {
        hiveId: hiveId
      }, ( data ) => {
        that.hiveTargetDatabaseList = data.data;
        if ( that.loadInterval ) {
          if ( !that.props.isNew ) {
            that.getHiveTables( hiveId, that.state.data.nameSpace );
          }
          that.setState( { ...that.state } );
        }
      } );
    }
  }

  /*获取hive 表列表*/
  getHiveTables( hiveId, nameSpace ) {
    let that = this;
    that.hiveTargetTableList = [];
    AjaxReq.getHiveTableList( {
      hiveId: hiveId,
      nameSpace: nameSpace
    }, ( data ) => {
      that.hiveTargetTableList = data.data;
      if ( that.loadInterval ) {
        that.setState( {} );
      }
    } );
  }

  /*获取分区字段列表*/
  getTablePartiList( hiveId, nameSpace, tableName, isChange ) {
    let that = this;
    if ( isChange ) {
      that.hiveTargetPartiList = [];
    }
    AjaxReq.getHiveTablePartiList( {
      hiveId: hiveId,
      nameSpace: nameSpace,
      table: tableName
    }, ( data ) => {
      data = data.data;
      if ( isChange ) {
        data.map( ( item ) => {
          that.hiveTargetPartiList.push( { name: item, value: "" } );
        } );
      }
      if ( that.loadInterval ) {
        that.setState( { ...that.state } );
      }
    } );
  }

  /*获取队列列表*/
  getQueueList() {
    let that = this;
    this.queueList = [];
    AjaxReq.getQueueList( {}, ( data )=> {
      this.queueList = data.data;
      that.setState( { ...that.state } );
    } );
  }

  /*组件change 事件处理*/
  changeHandle( dataField, value ) {
    if ( dataField == "name" ) {
      this.nameIsRepeat = false;
    }
    if ( value && value.target ) {
      this.state.data[ dataField ] = value.target.value;
    } else {
      this.state.data[ dataField ] = value;
    }
    this.setState( { data: this.state.data } );
    this.needValidate = true;
  }

  /*提交处理*/
  handleSubmit() {
    this.hasValidate = true;
    let that = this;
    let isSuccess = this.refs.dbInfoForm.validate( this.state.data );
    if ( isSuccess ) {
      AjaxReq.saveInfo( this.getDataFromState(), ( data ) => {
        message.success( "保存成功" );
        that.props.cancelHandler();
      } );
    }
  }

  /*更新执行参数*/
  refreshParam( value ) {
    let data = this.state.data;
    data.sqoopInput = value;
    this.setState( { ...this.state } );
  }

  /*select 需要进行实时校验的change处理*/
  selectChangeHandle( dataField, formItemRef, value ) {
    let data = this.state.data;
    data[ dataField ] = value;
    this.refs[ formItemRef ] && this.refs[ formItemRef ].validate( value );
    this.setState( { ...this.state } );
  }

  /*数据源类型change 处理*/
  dataSourceTypeChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.dataSourceList = [];
    this.databaseList = [];
    this.sourceTableList = [];
    let _data = this.state.data;
    _data.tableName = "";
    this.setState({...this.state});
    this.getRelativeDataSourceList( TypeConst.dataSourceTypeIdDic[ value ] );
  }

  /*数据源change 处理*/
  dataSourceChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.databaseList = [];
    this.sourceTableList = [];
    let _data = this.state.data;
    _data.tableName = "";
    this.setState({...this.state});
    /*if ( this.dataSourceList && this.dataSourceList.length && this.dataSourceList[ 0 ].hasSchema ) {
      this.getDatabaseList( value );
    } else {*/
      this.getSourceTableList( value );
    //}
  }

  /*数据库change 处理*/
  dataBaseChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.sourceTableList = [];
    let _data = this.state.data;
    _data.tableName = "";
    this.setState({...this.state});
    this.getSourceTableList( this.state.data.dataSource, value );
  }

  /*hive数据源change 处理*/
  hiveTargetDataSourceChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.hiveTargetDatabaseList = [];
    this.hiveTargetTableList = [];
    this.hiveTargetPartiList = [];
    this.getHiveDatabase( value );
  }

  /*hive数据库change 处理*/
  hiveTargetDatabaseChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.hiveTargetTableList = [];
    this.hiveTargetPartiList = [];
    this.getHiveTables( this.state.data.hiveDataSource, value );
  }

  /*hive表下拉change 处理*/
  hiveTableChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.hiveTargetPartiList = [];
    this.getTablePartiList( this.state.data.hiveDataSource, this.state.data.nameSpace, value, true );
  }

  /*队列切换处理*/
  queueChangeHandle( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    let _item = this.queueList.filter( ( item ) => {
      return item.queue === value
    } );
    this.queuePriority = _item[ 0 ].id;
  }

  /*分区表格-分区值change 处理*/
  partiTbChange( item, evt ) {
    item.value = evt.target.value;
    this.setState( { ...this.state } );
  }

  testConnect() {
    this.hasValidate = true;
    let isSuccess = this.refs.dbInfoForm.validate( this.state.data );
    if ( isSuccess ) {
      this.props.openExcuteScript( this.state.data, this.getCommond(), this.getDataFromState() );
    }
  }

  /*校验名称重复*/
  checkRepeat() {
    let _data = this.state.data;
    let that = this;
    AjaxReq.validateNameRepeat( {
      name: _data.name,
      code: _data.code ? _data.code : "",
      projectCode: window.projectCode,
      accessType: 1
    }, ( data ) => {
      that.nameIsRepeat = Boolean( data.data );
      that.refs.nameFormItem.validate( _data.name );
    } );
  }

  /*面包屑切换*/
  breadCrumbChange( index ) {
    this.props.cancelHandler();
  }

  /*设置分区表格列*/
  getPartiColumn() {
    let that = this;
    return [
      {
        title: "分区名",
        key: "name"
      },
      {
        title: "分区值",
        key: "value",
        isRequired: true,
        render( text, item ){
          return <RestrictInput
            className="form-control"
            style={{width:"200px"}}
            value={text} onChange={that.partiTbChange.bind(that,item)}/>
        }
      }
    ];
  }

  /*设置源选项*/
  getSourceItemView() {
    let _data = this.state.data;
    if ( _data.storageType == TypeConst.importType ) {
      let _partiColumn = this.getPartiColumn();
      return (
        <div className="single-column-form">
          <FormItem
            label="Hive源"
            ref="targetDataSourceFormItem"
            required name="hiveDataSource">
            <Select
              placeholder="请选择"
              value={_data.hiveDataSource}
              onChange={this.hiveTargetDataSourceChange.bind(this,"hiveDataSource",'targetDataSourceFormItem')}>
              {this.hiveTargetList.map((item,index) => {
                return <Option key={index} value={item.id}>{item.name}</Option>
                })}
            </Select>
          </FormItem>
          <FormItem label="Hive库" ref="nameSpaceFormItem" required name="nameSpace">
            <Select
              placeholder="请选择"
              value={_data.nameSpace}
              onChange={this.hiveTargetDatabaseChange.bind(this,"nameSpace","nameSpaceFormItem")}>
              {this.hiveTargetDatabaseList.map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
                })}
            </Select>
          </FormItem>
          <FormItem label="表名" ref="hiveTableNameFormItem" required name="hiveTableName">
            <Select
              placeholder="请选择"
              value={_data.hiveTableName}
              searchable
              onChange={this.hiveTableChange.bind(this,"hiveTableName","hiveTableNameFormItem")}>
              {this.hiveTargetTableList.map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
                })}
            </Select>
          </FormItem>
          {this.hiveTargetPartiList.length ?
          <FormItem label="分区" ref="hiveTargetPartiFormItem" required name="partition">
            <ValidateTable
              ref="partiTab"
              data={{totalList:this.hiveTargetPartiList}}
              column={_partiColumn}
              howRow={100}
              tableWidth="500px"
            ></ValidateTable>
          </FormItem>:null}
          <FormItem label="过滤规则" name="filterRule">
            <RestrictInput
              className="form-control"
              placeholder="如：year=${yyyy} and month=${mm}"
              value={_data.filterRule}
              onChange={this.changeHandle.bind(this,"filterRule")}/>
          </FormItem>
        </div>
      )
    } else {

      return (
        <FormItem label="源导出地址" required name="hdfsUrl">
          <RestrictInput
            className="form-control"
            value={_data.hdfsUrl}
            onChange={this.changeHandle.bind(this,"hdfsUrl")}
          />
        </FormItem>
      );
    }
  }

  render() {
    let _data = this.state.data;
    /*let databaseItem = this.dataSourceList && this.dataSourceList.length && this.dataSourceList[ 0 ].hasSchema ?
      <FormItem label="表空间" ref="dataBaseFormItem" name="schema">
        <Select
          placeholder="请选择"
          value={_data.schema}
          onChange={this.dataBaseChange.bind(this,"schema","dataBaseFormItem")}>
          {this.databaseList.map((item,index) => {
            return <Option key={index} value={item}>{item}</Option>
            })}
        </Select>
      </FormItem> : null;*/
    let sourceItem = this.getSourceItemView();
    return (
      <EditPanel
        breadCrumbList={[{text:"数据导出"},{text:this.props.isNew?"新增":"编辑"}]}
        history={this.props.history} onChange={this.breadCrumbChange.bind(this)}>
        <div className="single-column-form edit-form">
          <Form
            ref="dbInfoForm" horizontal
            rules={this.rules} labelWidth={150}
            disabled={this.props.isLook}>
            <FormCategory>
              <FormCategoryItem name="基本信息">
                <FormItem label="资源名称" ref="nameFormItem" required name="name">
                  <RestrictInput
                    type="text"
                    className="form-control"
                    restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                    onChange={this.changeHandle.bind(this,"name")}
                    value={_data.name} onBlur={this.checkRepeat.bind(this)}/>
                </FormItem>
                <FormItem label="导出方式" ref="storageTypeFormItem" required name="storageType">
                  <Select
                    value={_data.storageType}
                    onChange={this.selectChangeHandle.bind(this,"storageType","storageTypeFormItem")}>
                    <Option value={1}>Hive</Option>
                    <Option value={2}>HDFS</Option>
                  </Select>
                </FormItem>
                <FormItem label="导出目标" ref="datasourceTypeFormItem" required name="datasourceType">
                  <Select
                    value={_data.datasourceType}
                    placeholder="请选择"
                    onChange={this.dataSourceTypeChange.bind(this,"datasourceType","datasourceTypeFormItem")}>
                    {this.resourceTypeList.map((item,index) => {
                      return <Option key={index} value={item.typeId}>{item.name}</Option>
                      })}
                  </Select>
                </FormItem>
              </FormCategoryItem>
              <FormCategoryItem name="源">
                {sourceItem}
              </FormCategoryItem>
              <FormCategoryItem name="目标">
                <FormItem label="目标源" ref="dataSourceFormItem" required name="dataSource">
                  <Select
                    placeholder="请选择"
                    value={_data.dataSource}
                    onChange={this.dataSourceChange.bind(this,"dataSource","dataSourceFormItem")}>
                    {this.dataSourceList.map((item,index) => {
                      return <Option key={index} value={item.id}>{item.name}</Option>
                      })}
                  </Select>
                </FormItem>
                {/*databaseItem*/}
                <div className="special-fromItem-error">
                  <FormItem label="目标表" ref="sourceTableFormItem" required name="tableName">
                    <div style={{height:"30px",lineHeight:"30px",display:"inline-block"}}>
                      <AutoComplete
                        value={_data.tableName}
                        placeholder="表名前缀"
                        source={this.sourceTableList}
                        style={{width:"200px"}}
                        onChange={this.selectChangeHandle.bind(this,'tableName','sourceTableFormItem')}></AutoComplete>
                      <div
                        style={{float:"left",display:"inline-block", width:10,height:30,lineHeight:4,marginLeft:5,marginRight:5}}>
                        _
                      </div>
                      <div className="clear-error-div">
                        <RestrictInput
                          className="form-control data-access-steps2-input"
                          style={{float:"left"}}
                          placeholder="动态后缀"
                          value={_data.dynamicRule}
                          onChange={this.changeHandle.bind(this,"dynamicRule")}
                        />
                        <Icon
                          style={{marginLeft:"10px",cursor:"pointer"}}
                          type="question-circle"
                          title="日期格式，如${yyyy-MM-dd}。导入以分表方式存储的源数据"/>
                      </div>
                    </div>
                  </FormItem>
                </div>
              </FormCategoryItem>
              <FormCategoryItem name="高级设置">
                <FormItem label="更新模式" name="updateModel">
                  <Select
                    placeholder="请选择"
                    value={_data.updateModel}
                    onChange={this.changeHandle.bind(this,"updateModel")}>
                    <Option value="">默认</Option>
                    <Option value="updateonly">仅更新</Option>
                    <Option value="allowinsert">允许插入</Option>
                  </Select>
                </FormItem>
                {_data.updateModel?<FormItem label="更新属性" name="updateMethod">
                  <RestrictInput
                    className="form-control"
                    value={_data.updateMethod}
                    onChange={this.changeHandle.bind(this,'updateMethod')}/>
                </FormItem>:null}
                <FormItem label="行分隔符" name="rowSplit">
                  <RestrictInput
                    className="form-control"
                    onChange={this.changeHandle.bind(this,"rowSplit")} value={this.state.data.rowSplit}/>
                </FormItem>
                <FormItem label="列分隔符" name="columnSplit">
                  <RestrictInput
                    className="form-control"
                    onChange={this.changeHandle.bind(this,"columnSplit")} value={this.state.data.columnSplit}/>
                </FormItem>
                <FormItem label="扩展参数" name="sqoopInput" help="例如：-m 1">
                  <RestrictTextarea
                    type="text"
                    className="form-control"
                    style={{height:"50px",resize:"both"}}
                    value={_data.sqoopInput}
                    onChange={this.changeHandle.bind(this,"sqoopInput")}
                  />
                </FormItem>
                <FormItem label="队列" ref="queueFormItem" required name="queue">
                  <Select
                    placeholder="请选择"
                    value={_data.queue}
                    onChange={this.queueChangeHandle.bind(this,"queue","queueFormItem")}>
                    {
                      this.queueList.map((item,index) => {
                        return <Option key={index} value={item.queue}>{item.queueName}</Option>
                        })
                      }
                  </Select>
                </FormItem>
              </FormCategoryItem>
            </FormCategory>
          </Form>
          <div className="footer btns-div">
            {this.props.isLook?null:<div style={{display:"inline-block"}}>
              <button className="btn btn-sm btn-primary" style={{marginRight:"10px"}}
                      onClick={this.testConnect.bind(this)}>执行
              </button>
              <button className="btn btn-sm btn-primary" style={{marginRight:"10px"}}
                      onClick={this.handleSubmit.bind(this)}>保存
              </button>
            </div>}
            <button className="btn btn-sm btn-default" onClick={this.props.cancelHandler}>取消</button>
          </div>
        </div>
      </EditPanel>
    );
  }
}
export default DbInfoPanel
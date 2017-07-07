import React from 'react';
import Icon from 'bfd-ui/lib/Icon'
import {Form, FormItem} from 'bfd-ui/lib/Form2'
import { Select, Option } from 'bfd-ui/lib/Select2'
import Transfer from 'bfd-ui/lib/Transfer'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import AutoComplete from 'bfd-ui/lib/AutoComplete'

import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import message from 'CommonComponent/component/bdosmessage'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import ValidateTable from 'CommonComponent/component/validatetable'
import Util from 'CommonComponent/utils/CommonUtil'

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
    this.columnList = [];
    this.queueList = [];
    this.queuePriority = "";
    this.sourceTableList = [];
    this.state = this.setDataToState();
    this.hasValidate = false;
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

  /*设置验证规则*/
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
      datasourceType( value ){
        return BaseValidate.validateInput( { label: "资源类型", value, isRequired: true } );
      },
      storageType( value ){
        return BaseValidate.validateInput( { label: "导入方式", value, isRequired: true } );
      },
      syncType( value ){
        return BaseValidate.validateInput( { label: "源类型", value, isRequired: true } );
      },
      dataSource( value ){
        return BaseValidate.validateInput( { label: "数据源", value, isRequired: true } );
      },
      tableName( value ){
        if ( _data.syncType == TypeConst.SINGLETABLE_TYPE ) {
          return BaseValidate.validateInput( { label: "源表", value: _data.tableName, isRequired: true } );
        }
      },
      isInclude( value ){
        if ( _data.syncType == TypeConst.MULTITABLE_TYPE && typeof( value) != "number" ) {
          return "请选择包含/ 排除！"
        }

      },
      importSql( value ){
        if ( _data.syncType == TypeConst.CONDITION_TYPE ) {
          return BaseValidate.validateInput( { label: "SQL语句", value, isRequired: true } );
        }
      },
      targetDataSource( value ){
        if ( _data.storageType == TypeConst.importType ) {
          return BaseValidate.validateInput( { label: "Hive目标源", value, isRequired: true } );
        }
      },
      nameSpace( value ){
        if ( _data.storageType == TypeConst.importType ) {
          return BaseValidate.validateInput( { label: "Hive目标库", value, isRequired: true } );
        }
      },
      hiveTableName( value ){
        if ( _data.storageType == TypeConst.importType ) {
          return BaseValidate.validateInput( { label: "目标表名", value, isRequired: true } );
        }
      },
      partition( value ){
        return that.refs.partiTab.validate() ? "" : "分区列值有误！";
      },
      hdfsUrl( value ){
        if ( _data.storageType != TypeConst.importType ) {
          return BaseValidate.validateInput( { label: "HDFS路径", value, isRequired: true } );
        }
      },
      isOverWrite( value ){
        if ( typeof( value) != "number" ) {
          return "是否覆盖不能为空！"
        }
      },
      isIncreaseImport( value ){
        if ( _data.isOverWrite == 0 ) {
          if ( typeof( value) != "number" ) {
            return "是否增量导入不能为空！"
          }
        }
      },
      increaseColumn( value ){
        if ( _data.isIncreaseImport ) {
          return BaseValidate.validateInput( { label: "导入参考列", value, isRequired: true } );
        }
      },
      increaseModel( value ){
        if ( _data.isIncreaseImport ) {
          return BaseValidate.validateInput( { label: "增量导入模式", value, isRequired: true } );
        }
      },
      maxIncrease( value ){
        if ( _data.isIncreaseImport ) {
          return BaseValidate.validateInput( { label: "参考列最大值", value, isRequired: true } );
        }
      },
      maxReader( value ){
        if ( _data.isIncreaseImport ) {
          return BaseValidate.validateInput( { label: "每次读取最大值", value, isRequired: true } );
        }
      },
      queue( value ){
        return BaseValidate.validateInput( { label: "队列", value, isRequired: true } );
      }
    };
  }

  /*设置数据到state中*/
  setDataToState() {
    this.nameIsRepeat = false;
    let _data;
    if ( this.props.isNew ) {
      _data = {
        data: {
          storageType: TypeConst.importType,
          syncType: TypeConst.SINGLETABLE_TYPE,
          typeCode: TypeConst.DB,
          isOverWrite: 0,
          isIncreaseImport: 1,
          maxReader: 1000
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
    _data.accessType = 0;//0 导入， 1导出
    _data.syncType = _stateData.syncType;//1单表 2多表 3条件 4ftp 5导出
    _data.datasourceType = _stateData.datasourceType;
    _data.storageType = _stateData.storageType;
    _data.queue = _stateData.queue;
    _data.priority = this.queuePriority;
    _data.sqoopInput = _stateData.sqoopInput;
    _data.datasourceInfo = this.getCommond( _data );
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
    //写入数据库
    infoJson.importType = _stateData.storageType;
    infoJson.dataSource = _stateData.dataSource;
    /*if ( this.dataSourceList && this.dataSourceList.length && this.dataSourceList[ 0 ].hasSchema ) {
     infoJson.schema = _stateData.schema;
     }*/
    infoJson.excludeColumns = "";
    if ( _stateData.syncType != TypeConst.MULTITABLE_TYPE ) {
      infoJson.isOverWrite = _stateData.isOverWrite;
    }
    if ( _stateData.isOverWrite == 0 && _stateData.syncType != TypeConst.MULTITABLE_TYPE ) {
      infoJson.isIncreaseImport = _stateData.isIncreaseImport;
      if ( _stateData.isIncreaseImport ) {
        infoJson.increaseModel = _stateData.increaseModel;
        infoJson.maxIncrease = _stateData.maxIncrease;
        infoJson.maxReader = Number( _stateData.maxReader );
        infoJson.increaseColumn = _stateData.increaseColumn;
      }
    }
    switch ( _stateData.syncType ) {
      case TypeConst.SINGLETABLE_TYPE:
        infoJson.tableName = _stateData.tableName;
        infoJson.dynamicRule = _stateData.dynamicRule;
        break;
      case TypeConst.MULTITABLE_TYPE:
        let tbs = [];
        infoJson.isInclude = _stateData.isInclude;
        this.transferTargetList.map( ( item ) => {
          tbs.push( item.label );
        } );
        if ( _stateData.isInclude ) {
          infoJson.tables = tbs.join( "," );
        } else {
          infoJson.excludeTables = tbs.join( "," );
        }
        break;
      case TypeConst.CONDITION_TYPE:
        infoJson.importSql = _stateData.importSql;
        break;
    }
    if ( _stateData.storageType == TypeConst.importType ) {
      infoJson.targetDataSource = _stateData.targetDataSource;
      infoJson.nameSpace = _stateData.nameSpace;
      infoJson.hiveTableName = _stateData.hiveTableName;
      infoJson.dynamicRule = _stateData.dynamicRule;
      if ( this.hiveTargetPartiList.length ) {
        infoJson.partition = JSON.stringify( this.hiveTargetPartiList );
      }
    } else {
      infoJson.hdfsUrl = _stateData.hdfsUrl;
    }
    return JSON.stringify( infoJson );
  }

  /*获取数据库类型列表*/
  getDatabaseTypeList() {
    let that = this;
    that.resourceTypeList = [];
    that.hiveTargetList = [];
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
          /* if ( that.dataSourceList && that.dataSourceList.length && that.dataSourceList[ 0 ].hasSchema ) {
           that.getDatabaseList( that.state.data.dataSource );
           } else {*/
          that.getSourceTableList( this.state.data.dataSource );
          //}
          that.getSourceColumnList( this.state.data.tableName );
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
          that.getHiveDatabase( that.state.data.targetDataSource );
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
        if ( !that.props.isNew && that.state.data.partition ) {
          let _data = that.state.data;
          that.getTablePartiList( _data.targetDataSource, _data.nameSpace, _data.hiveTableName );
        }
        that.setState( {} );
      }
    } );
  }

  getSourceColumnList( tableName ) {
    let that = this;
    let _data = this.state.data;
    let param = {
      id: _data.dataSource,
      table: tableName
    };
    //if(this.dataSourceList && this.dataSourceList.length && this.dataSourceList[ 0 ].hasSchema){
    //  param.schema = _data.schema;
    //}
    AjaxReq.getSourceColumnList( param, ( data ) => {
      data = data.data;
      that.columnList = data ? data : [];
      that.setState( { ...that.state } );
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
        that.props.cancelAddUser();
      } );
    }
  }

  /*校验名称重复*/
  checkRepeat( evt ) {
    let _data = this.state.data;
    let that = this;
    AjaxReq.validateNameRepeat( {
      name: _data.name,
      code: _data.code ? _data.code : "",
      projectCode: window.projectCode,
      accessType: 0
    }, ( data ) => {
      that.nameIsRepeat = Boolean( data.data );
      that.refs.nameFormItem.validate( _data.name );
    } );
  }

  /*select 需要进行实时校验的change处理*/
  selectChangeHandle( dataField, formItemRef, value ) {
    let data = this.state.data;
    data[ dataField ] = value;
    this.refs[ formItemRef ] && this.refs[ formItemRef ].validate( value );
    this.setState( { ...this.state } );
  }

  /*数据源类型change 处理*/
  syncTypeChange( dataField, formItemRef, value ) {
    let _data = this.state.data;
    this.selectChangeHandle( dataField, formItemRef, value );
    this.refs.sourceTableFormItem && this.refs.sourceTableFormItem.validate( _data.tableName );
    this.refs.isIncludeFormItem && this.refs.isIncludeFormItem.validate( _data.isInclude );
    this.refs.importSqlFormItem && this.refs.importSqlFormItem.validate( _data.importSql );
  }

  /*数据源类型change 处理*/
  dataSourceTypeChange( dataField, formItemRef, value ) {
    this.dataSourceList = [];
    this.databaseList = [];
    this.sourceTableList = [];
    let _data = this.state.data;
    _data.tableName = "";
    this.setState( { ...this.state } );
    this.selectChangeHandle( dataField, formItemRef, value );
    this.getRelativeDataSourceList( TypeConst.dataSourceTypeIdDic[ value ] );
  }

  /*数据源change 处理*/
  dataSourceChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.databaseList = [];
    this.sourceTableList = [];
    let _data = this.state.data;
    _data.tableName = "";
    this.setState( { ...this.state } );
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
    this.setState( { ...this.state } );
    this.getSourceTableList( this.state.data.dataSource, value );
  }

  /*hive数据源change 处理*/
  hiveTargetDataSourceChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.hiveTargetDatabaseList = [];
    this.hiveTargetTableList = [];
    this.hiveTargetPartiList = [];
    let _data = this.state.data;
    _data.hiveTableName = "";
    this.setState( { ...this.state } );
    this.getHiveDatabase( value );
  }

  /*hive数据库change 处理*/
  hiveTargetDatabaseChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.hiveTargetTableList = [];
    this.hiveTargetPartiList = [];
    let _data = this.state.data;
    _data.hiveTableName = "";
    this.setState( { ...this.state } );
    this.getHiveTables( this.state.data.targetDataSource, value );
  }

  /*队列切换处理*/
  queueChangeHandle( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    let _item = this.queueList.filter( ( item ) => {
      return item.queue === value
    } );
    this.queuePriority = _item[ 0 ].id;
  }

  /*点击测试链接处理*/
  testConnect() {
    this.hasValidate = true;
    let isSuccess = this.refs.dbInfoForm.validate( this.state.data );
    if ( isSuccess ) {
      this.props.openExcuteScript( this.state.data, this.getCommond(), this.getDataFromState() );
    }
  }

  /*表查询处理*/
  handleTablesSearch( label, keyValue ) {
    return label.indexOf( keyValue ) != -1;
  }

  /*穿梭框变化时，处理函数*/
  tablesChangeHandle( sdata, tdata ) {
    /*包含还是排除，包含的时候取tdata中的值，排除的时候 ，取sdata中的值*/
    let _data = this.state.data;
    if ( _data.isInclude ) {
      _data.tables = tdata;
    } else {
      _data.excludeTables = tdata;
    }
    this.setState( { data: { ..._data } } );
  }

  /*auto组件change事件处理*/
  autoInputChangeHandle( dataField, refsFormItem, value ) {
    let _data = this.state.data;
    this.state.data[ dataField ] = value;
    this.refs[ refsFormItem ].validate( value );
    this.setState( { data: this.state.data } );
    if ( dataField != "tableName" && dataField != "increaseColumn" ) {
      this.hiveTargetPartiList = [];
      this.getTablePartiList( _data.targetDataSource, _data.nameSpace, value, true );
    } else if( dataField != "increaseColumn"){
      this.getSourceColumnList( value );
    }
  }

  /*分区表格-分区值change 处理*/
  partiTbChange( item, evt ) {
    item.value = evt.target.value;
    this.setState( { ...this.state } );
  }

  /*面包屑点击处理*/
  breadCrumbChange( index ) {
    this.props.cancelAddUser();
  }

  /*更新执行参数*/
  refreshParam( value ) {
    let data = this.state.data;
    data.sqoopInput = value;
    this.setState( { ...this.state } );
  }

  setTransferList() {
    //设置源list
    let _sList = [];
    this.sourceTableList.map( ( item, index ) => {
      _sList.push( { id: item, label: item } );
    } );
    let _data = this.state.data;
    this.transferTargetList = [];
    let targetList = [];
    let tbList;
    if ( _data.isInclude && _data.tables ) {
      tbList = _data.tables;
    } else if ( _data.excludeTables ) {
      tbList = _data.excludeTables;
    }
    //当第一次从包含切换到排除的时候
    if ( !tbList && _data.tables ) {
      tbList = _data.tables;
    }
    if ( tbList ) {
      if ( typeof(tbList) == "string" ) {
        tbList = tbList.split( "," );
      }
      tbList.map( ( titem, tindex ) => {
        if ( typeof(titem) == "string" ) {
          targetList.push( {
            id: titem,
            label: titem
          } );
        } else {
          targetList.push( titem );
        }
      } );
    }
    _sList = Util.removeFormOtherArray( _sList, targetList, 'label' );
    this.transferTargetList = targetList;
    return _sList;
  }

  /*设置源动态生成的item*/
  getSourceItemView() {
    let that = this;
    let _data = this.state.data;
    if ( _data.syncType == TypeConst.SINGLETABLE_TYPE ) {
      return <div className="special-fromItem-error">
        <FormItem label="源表" ref="sourceTableFormItem"
                  required name="tableName">
          <div style={{height:"30px",lineHeight:"30px",display:"inline-block"}}>
            <AutoComplete
              value={_data.tableName}
              source={this.sourceTableList}
              placeholder="表名前缀"
              style={{width:"200px"}}
              onChange={this.autoInputChangeHandle.bind(this,'tableName','sourceTableFormItem')}></AutoComplete>
            <div
              style={{float:"left",display:"inline-block", width:10,height:30,lineHeight:4,marginLeft:5,marginRight:5}}>
              _
            </div>
            <div className="clear-error-div">
              <RestrictInput
                className="form-control data-access-steps2-input"
                style={{float:"left"}}
                placeholder="动态规则"
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
    } else if ( _data.syncType == TypeConst.MULTITABLE_TYPE ) {
      let sList = this.setTransferList();
      return (
        <FormItem label="源表名" required name="isInclude" ref="isIncludeFormItem">
          <div>
            <RadioGroup value={_data.isInclude} onChange={this.changeHandle.bind(this,"isInclude")}>
              <Radio value={1}>包含</Radio>
              <Radio value={0}>排除</Radio>
            </RadioGroup>
            <Transfer
              height={200} title={"已选的表"} sdata={sList}
              tdata={this.transferTargetList}
              onSearch={this.handleTablesSearch.bind(this)}
              render={item => `${item.label}`}
              onChange={this.tablesChangeHandle.bind(this)}
            />
          </div>

        </FormItem>
      )
    } else {
      return <FormItem label="SQL语句" ref="importSqlFormItem" name="importSql">
        <RestrictTextarea
          className="form-control" style={{height:"100px",width:"500px"}} value={_data.importSql}
          onChange={this.changeHandle.bind(this,"importSql")}/>
      </FormItem>
    }

  }

  /*设置目标动态生成的item*/
  getTargetItemView() {
    let _data = this.state.data;
    let _partiColumn = this.getPartiColumn();
    let hiveTarget = <div>
      <FormItem
        label="Hive目标源"
        ref="targetDataSourceFormItem"
        required name="targetDataSource">
        <Select
          value={_data.targetDataSource}
          placeholder="请选择"
          onChange={this.hiveTargetDataSourceChange.bind(this,"targetDataSource",'targetDataSourceFormItem')}>
          {this.hiveTargetList.map((item,index) => {
            return <Option key={index} value={item.id}>{item.name}</Option>
            })}
        </Select>
      </FormItem>
      <FormItem label="Hive目标库" ref="nameSpaceFormItem" required name="nameSpace">
        <Select
          value={_data.nameSpace}
          placeholder="请选择"
          onChange={this.hiveTargetDatabaseChange.bind(this,"nameSpace","nameSpaceFormItem")}>
          {this.hiveTargetDatabaseList.map((item,index) => {
            return <Option key={index} value={item}>{item}</Option>
            })}
        </Select>
      </FormItem>
      {this.state.data.syncType == TypeConst.MULTITABLE_TYPE ? null :
      <div>
        <div style={{height:"50px"}}>
          <FormItem label="目标表名" ref="hiveTableNameFormItem" required name="hiveTableName">
            <AutoComplete
              value={_data.hiveTableName}
              source={this.hiveTargetTableList}
              onChange={this.autoInputChangeHandle.bind(this,'hiveTableName','hiveTableNameFormItem')}></AutoComplete>
          </FormItem>
        </div>
        {this.hiveTargetPartiList.length ?
        <FormItem label="分区" ref="hiveTargetPartiFormItem" required name="partition">
          <ValidateTable
            ref="partiTab"
            data={{totalList:this.hiveTargetPartiList}}
            column={_partiColumn}
            howRow={100}
            tableWidth="300px"
          ></ValidateTable>
        </FormItem>:null}
      </div>
        }
    </div>
    return _data.storageType == TypeConst.importType ?
      hiveTarget :
      <FormItem label="HDFS路径" required name="hdfsUrl">
        <RestrictInput
          className="form-control"
          value={_data.hdfsUrl}
          onChange={this.changeHandle.bind(this,"hdfsUrl")}
        />
      </FormItem>
  }

  /*设置分区表格列*/
  getPartiColumn() {
    let that = this;
    return [
      {
        title: "分区名",
        key: "name",
        width: "150px"
      },
      {
        title: "分区值",
        key: "value",
        isRequired: true,
        render( text, item ){
          return <RestrictInput
            className="form-control"
            style={{width:"200px"}}
            value={text}
            onChange={that.partiTbChange.bind(that,item)}/>
        }
      }
    ];
  }

  /*设置增量设置*/
  getImportView() {
    let _data = this.state.data;
    if ( _data.syncType != TypeConst.MULTITABLE_TYPE && _data.isOverWrite == 0 && _data.syncType != TypeConst.MULTITABLE_TYPE ) {
      return <FormItem label="是否增量导入" ref="isIncreaseImportFormItem" required name="isIncreaseImport">
        <Select
          value={_data.isIncreaseImport}
          placeholder="请选择"
          onChange={this.selectChangeHandle.bind(this,"isIncreaseImport","isIncreaseImportFormItem")}>
          <Option value={1}>是</Option>
          <Option value={0}>否</Option>
        </Select>
      </FormItem>
    }
  }

  /*设置增量为是的情况下高级设置*/
  getImportYesView() {
    let _data = this.state.data;
    let maxIncreaseItem;
    if ( _data.increaseModel == "append" ) {
      maxIncreaseItem = <FormItem label="参考列最大值" required name="maxIncrease">
        <RestrictInput
          type="text"
          className="form-control" restrict={RestrictConst.NUM}
          onChange={this.changeHandle.bind(this,"maxIncrease")} value={_data.maxIncrease}/>
      </FormItem>
    } else if ( _data.increaseModel == "lastmodified" ) {
      maxIncreaseItem = <FormItem label="参考列最大值" required name="maxIncrease">
        <RestrictInput
          type="text"
          className="form-control"
          onChange={this.changeHandle.bind(this,"maxIncrease")} value={_data.maxIncrease}/>
      </FormItem>
    }
    if ( _data.syncType != TypeConst.MULTITABLE_TYPE && _data.isOverWrite == 0 && _data.isIncreaseImport ) {
      let helpStr = TypeConst.dataSourceTypeIdDic[ _data.datasourceType ] == "Oracle" ? "注意：列名区分大小写" : "";
      return <div>
        <div style={{height:"50px"}}>
          <FormItem
            label="导入参考列" required ref="increaseColumnFormItem"
            name="increaseColumn" help={helpStr}>
            <AutoComplete
              value={_data.increaseColumn}
              source={this.columnList}
              onChange={this.autoInputChangeHandle.bind(this,'increaseColumn','increaseColumnFormItem')}></AutoComplete>
          </FormItem>
        </div>
        <FormItem label="增量导入模式" ref="increaseModelFormItem" required name="increaseModel">
          <Select
            value={_data.increaseModel}
            placeholder="请选择"
            onChange={this.selectChangeHandle.bind(this,"increaseModel","increaseModelFormItem")}>
            <Option value="lastmodified">最后修改时间</Option>
            <Option value="append">追加</Option>
          </Select>
        </FormItem>
        {maxIncreaseItem}
        <FormItem label="每次读取最大量" required name="maxReader">
          <RestrictInput
            type="text"
            className="form-control" restrict={RestrictConst.NUM_Z}
            onChange={this.changeHandle.bind(this,"maxReader")} value={_data.maxReader}/>
        </FormItem>
      </div>
    }
  }

  render() {
    let _data = this.state.data;
    /*let databaseItem = this.dataSourceList && this.dataSourceList.length && this.dataSourceList[ 0 ].hasSchema ?
     <FormItem label="表空间" ref="dataBaseFormItem" name="schema">
     <Select
     value={_data.schema}
     placeholder="请选择"
     onChange={this.dataBaseChange.bind(this,"schema","dataBaseFormItem")}>
     {this.databaseList.map((item,index) => {
     return <Option key={index} value={item}>{item}</Option>
     })}
     </Select>
     </FormItem> : null;*/
    let targetItem = this.getTargetItemView();
    let sourceItem = this.getSourceItemView();
    let importItem = this.getImportView();
    let importYesItem = this.getImportYesView();
    return (
      <EditPanel
        breadCrumbList={[{text:"数据接入"},{text:this.props.isNew?"新增":"编辑"}]}
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
                    value={_data.name}
                    restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                    onChange={this.changeHandle.bind(this,"name")}
                    onBlur={this.checkRepeat.bind(this)}
                  />
                </FormItem>

                <FormItem label="资源类型" ref="datasourceTypeFormItem" required name="datasourceType">
                  <Select
                    value={_data.datasourceType}
                    placeholder="请选择"
                    onChange={this.dataSourceTypeChange.bind(this,"datasourceType","datasourceTypeFormItem")}>
                    {this.resourceTypeList.map((item,index) => {
                      return <Option key={index} value={item.typeId}>{item.name}</Option>
                      })}
                  </Select>
                </FormItem>
                <FormItem label="导入方式" ref="storageTypeFormItem" required name="storageType">
                  <Select
                    value={_data.storageType}
                    onChange={this.selectChangeHandle.bind(this,"storageType","storageTypeFormItem")}>
                    <Option value={1}>Hive</Option>
                    <Option value={2}>HDFS</Option>
                  </Select>
                </FormItem>
              </FormCategoryItem>
              <FormCategoryItem name="源">
                <FormItem label="源类型" ref="syncTypeFormItem" required name="syncType">
                  <Select
                    value={_data.syncType}
                    onChange={this.syncTypeChange.bind(this,"syncType","syncTypeFormItem")}>
                    <Option value={TypeConst.SINGLETABLE_TYPE}>单表</Option>
                    <Option value={TypeConst.MULTITABLE_TYPE}>多表</Option>
                    <Option value={TypeConst.CONDITION_TYPE}>条件</Option>
                  </Select>

                </FormItem>
                <FormItem label="数据源" ref="dataSourceFormItem" required name="dataSource">
                  <Select
                    value={_data.dataSource}
                    placeholder="请选择"
                    onChange={this.dataSourceChange.bind(this,"dataSource","dataSourceFormItem")}>
                    {this.dataSourceList.map((item,index) => {
                      return <Option key={index} value={item.id}>{item.name}</Option>
                      })}
                  </Select>
                </FormItem>
                {/*databaseItem*/}
                {sourceItem}
              </FormCategoryItem>
              <FormCategoryItem name="目标">
                {targetItem}
              </FormCategoryItem>
              <FormCategoryItem name="高级设置">
                {_data.syncType != TypeConst.MULTITABLE_TYPE?<FormItem label="是否覆盖" ref="isOverWriteFormItem" required
                                                                       name="isOverWrite">
                  <Select
                    value={_data.isOverWrite}
                    onChange={this.selectChangeHandle.bind(this,"isOverWrite","isOverWriteFormItem")}>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                </FormItem>:null}
                {importItem}
                {importYesItem}
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
                    value={_data.queue}
                    placeholder="请选择"
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
            <button className="btn btn-sm btn-default" onClick={this.props.cancelAddUser}>取消</button>
          </div>
        </div>
      </EditPanel>
    );
  }
}
export default DbInfoPanel
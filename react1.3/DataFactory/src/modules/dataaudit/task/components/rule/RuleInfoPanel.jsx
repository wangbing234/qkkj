import React from 'react';
import {Form , FormItem} from 'bfd-ui/lib/Form2'
import {Select, Option} from 'bfd-ui/lib/Select2'
import { MultipleSelect } from 'bfd-ui/lib/MultipleSelect'

import EditPanel from 'CommonComponent/component/bdoseditpanel'
import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import FormFooter from 'CommonComponent/component/formfooter'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import BaseValidate from 'CommonComponent/utils/BaseValidate';

import RuleConst from '../../../utils/RuleConst'

import AjaxReq from '../../ajax/AjaxReq'

const df_date = 1; //日期类型
const df_num = 2; //数值类型
const df_phone = 3; //手机类型
const df_sfz = 4; //身份证类型
const df_mail = 5; //邮箱类型
const df_define = 6; //自定义类型

const liminalType_value = "value"; //阈值-值
const liminalType_range = "range"; //阈值-范围

const rollingType_recordNum = "record";//波动类型- 记录数
const rollingType_column = "column";//波动类型- 字段数据值

const judgeFunc_dimension = "dimension";//准确性- 判断类型 - 维度
const judgeFunc_liminal = "liminal";//准确性- 判断类型 - 阈值

const rollingTrend_abs = "r_abs";//绝对值
const rollingTrend_asc = "r_asc";//上升
const rollingTrend_desc = "r_desc"; //下降

const databaseType_hive = "hive";
const databaseType_oracle = "oracle";
const databaseType_mysql = "mysql";

class RuleInfoPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.concatData = {};
    this.typeDic = RuleConst.typeDic;
    this.taskData = this.props.taskData;
    if ( this.props.isNew ) {
      this.state = this.setDefaultState();
    } else {
      this.state = this.setDataToComponent();
    }
    this.rules = this.setRules();
    this.databaseList = [];//稽核数据库列表
    this.tableList = [];//稽核表列表
    this.tableFieldList = [];//稽核表字段列表
    this.dateFieldList = [];//日期字段列表（含分区字段列表）
    this.tableField_funcList = [];//稽核表字段-函数列表
    this.dataSourceList = [];//稽核数据源列表
    this.targetDatabaseList = [];////稽核目标数据库列表
    this.targetTableList = [];//稽核目标表列表
    this.targetFieldList = [];//稽核目标表字段列表
    this.formatTypeList = [
      /*{ id: df_date, name: "日期" },
       { id: df_num, name: "数值" },*/
      { id: df_phone, name: "手机号" },
      { id: df_sfz, name: "身份证" },
      { id: df_mail, name: "邮箱" },
      { id: df_define, name: "自定义" }
    ];
    this.relationOperList = [
      { id: "eq", name: "=" },
      { id: "gt", name: ">" },
      { id: "lt", name: "<" },
      { id: "ge", name: "≥" },
      { id: "le", name: "≤" },
      { id: "ne", name: "≠" },
      { id: "in", name: "IN" }
    ];
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    //获取源数据源
    this.loadInterval = setInterval( this.getBaseDatasource( "hive", false ), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*设置默认的state状态*/
  setDefaultState() {
    if ( this.props.isEdit ) {
      return { data: this.props.data }
    } else {
      let type = this.props.data.type;
      let data = { type: type };
      switch ( type ) {
        case RuleConst.RULE_TYPE_RECORD:
          data.liminalType = liminalType_value;
          break;
        case RuleConst.RULE_TYPE_DATAFORMATE:
          data.formatType = df_date;
          break;
        case RuleConst.RULE_TYPE_ACCURATE:
          data.judgeFunc = judgeFunc_dimension;
          break;
        case RuleConst.RULE_TYPE_ROLLING:
          data.rollingType = rollingType_recordNum;
          break;
      }
      return { data: data };
    }
  }

  /*设置校验规则*/
  setRules() {
    let that = this;
    return {
      ruleName( value ){
        let isError = BaseValidate.validateInput( { label: "规则名称", value, isRequired: true } );
        if ( isError ) {
          return isError;
        } else if ( that.nameIsRepeat ) {
          return "规则名称不能重复！";
        }
        return "";
      },
      ruleDesc( value ){
        return BaseValidate.validateInput( { label: "规则描述", value, maxLength: 255 } );
      },
      sourceDatabase( value ){
        return BaseValidate.validateInput( { label: "稽核表数据库", value, isRequired: true } );
      },
      sourceTable( value ){
        return BaseValidate.validateInput( { label: "稽核表", value, isRequired: true } );
      },
      liminalType( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_RECORD ||
          (that.state.data.type == RuleConst.RULE_TYPE_ACCURATE && that.state.data.judgeFunc == judgeFunc_liminal) ) {
          return BaseValidate.validateInput( { label: "阈值类型", value, isRequired: true } );
        }
      },
      liminalNum( value ){
        if ( that.state.data.liminalType == liminalType_value &&
          ( that.state.data.type == RuleConst.RULE_TYPE_RECORD ||
          ( that.state.data.type == RuleConst.RULE_TYPE_ACCURATE
          && that.state.data.judgeFunc == judgeFunc_liminal)) ) {
          return BaseValidate.validateInput( { label: "阈值", value, isRequired: true } );
        }
      },
      liminalInter( value ){
        value = that.concatData.liminalInter;
        if ( that.state.data.liminalType == liminalType_range &&
          ( that.state.data.type == RuleConst.RULE_TYPE_RECORD
          || (that.state.data.type == RuleConst.RULE_TYPE_ACCURATE
          && that.state.data.judgeFunc == judgeFunc_liminal)) ) {
          let baseSuc = BaseValidate.validateInput( { label: "阈值区间", value, isRequired: true } );
          if ( baseSuc ) {
            return baseSuc;
          } else if ( value.indexOf( "-" ) != -1 ) {
            let arr = value.split( "-" );
            let lenSucc = BaseValidate.validateInput( {
                label: "阈值区间",
                value: arr[ 0 ],
                maxLength: 32
              } ) && BaseValidate.validateInput( { label: "阈值区间", value: arr[ 1 ], maxLength: 32 } );
            if ( lenSucc ) {
              return lenSucc;
            }
            return Number( arr[ 1 ] ) < Number( arr[ 0 ] ) ? "阈值左侧值不能大于右侧值！" : "";
          }
        }
      },
      sourceLimit( value ){
        return BaseValidate.validateInput( { label: "限制条件", value, maxLength: 512 } );
      },
      /*alarmLevel( value ){
        return BaseValidate.validateInput( { label: "报警级别", value, isRequired: true } );
      },*/
      sourceColumn( value ){
        if ( [ RuleConst.RULE_TYPE_NULL, RuleConst.RULE_TYPE_SOLE, RuleConst.RULE_TYPE_DATAFORMATE ].indexOf( that.state.data.type ) != -1 ) {
          return BaseValidate.validateInput( { label: "稽核字段", value, isRequired: true } );
        }
      },
      formatType( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_DATAFORMATE ) {
          return BaseValidate.validateInput( { label: "格式类型", value, isRequired: true } );
        }
      },
      formatContent( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_DATAFORMATE ) {
          if ( that.state.data.formatType == df_define ) {
            return BaseValidate.validateInput( { label: "格式内容", value, isRequired: true, maxLength: 512 } );
          } else if ( [ df_date, df_num ].indexOf( that.state.data.formatType ) != -1 ) {
            return BaseValidate.validateInput( { label: "格式内容", value, isRequired: true, maxLength: 64 } );
          }
        }
      },
      judgeFunc( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_ACCURATE ) {
          return BaseValidate.validateInput( { label: "判断方法", value, isRequired: true } );
        }
      },
      operate( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_ACCURATE && that.state.data.judgeFunc == judgeFunc_dimension ) {
          return BaseValidate.validateInput( { label: "运算符", value, isRequired: true } );
        }
      },
      operateContent( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_ACCURATE && that.state.data.judgeFunc == judgeFunc_dimension ) {
          return BaseValidate.validateInput( { label: "内容", value, isRequired: true, maxLength: 512 } );
        }
      },

      expression( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_LOGIC ) {
          return BaseValidate.validateInput( { label: "稽核表达式", value, isRequired: true, maxLength: 2048 } );
        }
      },
      rollingType( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_ROLLING ) {
          return BaseValidate.validateInput( { label: "波动类型", value, isRequired: true } );
        }
      },
      tableField_roll( value ){
        value = that.concatData.tableField_roll;
        if ( that.state.data.type == RuleConst.RULE_TYPE_ROLLING && value.indexOf( "-" ) == -1 ) {
          return "稽核字段不能为空！";
        }
      },
      dateField( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_ROLLING ) {
          return BaseValidate.validateInput( { label: "日期字段", value, isRequired: true } );
        }
      },
      businessDate( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_ROLLING ) {
          return BaseValidate.validateInput( { label: "业务日期", value, isRequired: true, maxLength: 512 } );
        }
      },
      rollingTrend( value ){
        let _sdata = that.state.data;
        value = that.concatData.rollingTrend;
        if ( _sdata.type == RuleConst.RULE_TYPE_ROLLING ) {
          if ( !value || (value && value.indexOf( "-" ) == -1) ) {
            return "波动趋势不能为空！";
          } else {
            let sec = value.split( "-" )[ 1 ];
            return Number( sec ) > 100 ? "只能输入不大于100的正整数，长度不超过3个字符" : "";
          }
        }
      },
      compareWeek( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_ROLLING ) {
          return BaseValidate.validateInput( { label: "对比周期", value, isRequired: true } );
        }
      },
      resourceType( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_CONFORMITY || that.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
          return BaseValidate.validateInput( { label: "数据库类型", value, isRequired: true } );
        }
      },
      dataSource( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_CONFORMITY ) {
          return BaseValidate.validateInput( { label: "数据源", value, isRequired: true } );
        }
      },
      targetDatabase( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_CONFORMITY || that.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
          return BaseValidate.validateInput( { label: "参照表数据库", value, isRequired: true } );
        }
      },
      targetTable( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_CONFORMITY || that.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
          return BaseValidate.validateInput( { label: "参照表", value, isRequired: true } );
        }
      },
      targetExpression( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
          return BaseValidate.validateInput( { label: "参照表表达式", value, isRequired: true } );
        }
      },
      targetLimit( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
          return BaseValidate.validateInput( { label: "限制条件", value, maxLength: 512 } );
        }
      },
      relationOper( value ){
        if ( that.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
          return BaseValidate.validateInput( { label: "关系运算符", value, isRequired: true } );
        }
      }
    };
  }

  /*规则名称输入框失去焦点事件处理*/
  onRuleNameBlur( isSave, evt ) {
    //校验重名
    let _data = this.state.data;
    let that = this;
    let param = {
      ruleName: _data.ruleName,
      taskId: this.taskData.id,
      ruleId: _data.id
    };
    if ( this.props.isSaveAs ) delete param.ruleId;
    AjaxReq.validateRuleNameRepeat( { data: JSON.stringify( param ) }, ( data ) => {
      that.nameIsRepeat = Boolean( data.data );
      that.refs.ruleNameFormItem.validate( _data.ruleName );
      if ( isSave ) {
        let isSuccess = this.refs.ruleInfoForm.validate( this.state.data );
        if ( isSuccess ) that.saveRule();
      }
    } );
    if ( evt ) evt.preventDefault();
  }

  /*组件的onChange 处理*/
  changeHandle( dataField, value ) {
    let data = this.state.data;
    let concatData = this.concatData;
    if ( dataField == "ruleName" ) {
      this.nameIsRepeat = false;
      //this.refs.nameFormItem.validate(_data.ruleName);
    }
    if ( value && value.target ) {
      data[ dataField ] = value.target.value;
      if ( dataField == "liminalMin" ) {
        this.concatChange( concatData, value.target.value, "liminalInter", true );
      }
      if ( dataField == "liminalMax" ) {
        this.concatChange( concatData, value.target.value, "liminalInter", false );
      }
      if ( dataField == "rollingTrend_percent" && this.state.data.type == RuleConst.RULE_TYPE_ROLLING ) {
        this.concatChange( concatData, value.target.value, "rollingTrend", false );
      }
    } else {
      data[ dataField ] = value;
      if ( dataField == "tableField_func" ) {
        this.concatChange( concatData, value, "tableField_roll", true );
      }
      if ( dataField == "sourceColumn" && this.state.data.type == RuleConst.RULE_TYPE_ROLLING ) {
        this.concatChange( concatData, value, "tableField_roll", false );
      }
      if ( dataField == "rollingTrend_prefix" && this.state.data.type == RuleConst.RULE_TYPE_ROLLING ) {
        this.concatChange( concatData, value, "rollingTrend", true );
      }
    }
    this.setState( { ...this.state } );
  }

  dateFieldChangeHandle(dataField, formItemRef, value){
    let data = this.state.data;
    data[ dataField ] = [value];
    this.refs[ formItemRef ].validate( value );
    this.setState( { ...this.state } );
  }

  /*select 需要进行实时校验的change处理*/
  selectChangeHandle( dataField, formItemRef, value ) {
    if ( dataField == "sourceColumn" ) {
      let concatData = this.concatData;
      this.concatChange( concatData, value, "tableField_roll", false );
    }
    let data = this.state.data;
    data[ dataField ] = value;
    this.refs[ formItemRef ].validate( value );
    this.setState( { ...this.state } );

  }

  /*链接2个属性到一个属性中*/
  concatChange( data, value, totalField, isFirst ) {
    if ( isFirst ) {
      if ( data[ totalField ] && data[ totalField ].indexOf( "-" ) != -1 ) {
        data[ totalField ] = value + "-" + data[ totalField ].split( "-" )[ 1 ];
      } else {
        data[ totalField ] = value;
      }
    } else {
      if ( data[ totalField ] && data[ totalField ].indexOf( "-" ) != -1 ) {
        data[ totalField ] = `${data[ totalField ].split( "-" )[ 0 ]}-${value}`;
      } else {
        data[ totalField ] = `${data[ totalField ]}-${value}`;
      }
    }
  }

  /*源数据库切换处理*/
  databaseChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.tableList = [];
    this.tableFieldList = [];
    this.getTableList( value );
  }

  /*源表切换处理*/
  sourceTableChangeHandle( dataField, value ) {
    this.selectChangeHandle( dataField, "tableFormItem", value );
    this.tableFieldList = [];
    this.dateFieldList = [];
    //if ( this.state.data.type == RuleConst.RULE_TYPE_ROLLING ) {
      this.getDateFieldList( value );
    //} else {
      this.getSourceTableFieldList( value );
    //}
  }

  /*目标数据库类型切换处理*/
  dataBaseTypeChangeHandle( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.dataSourceList = [];
    this.targetDatabaseList = [];
    this.targetTableList = [];
    this.targetFieldList = [];
    this.getDataSourceList( value );
  }

  /*目标数据源切换处理*/
  targetDataSourceChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.targetDatabaseList = [];
    this.targetTableList = [];
    this.targetFieldList = [];

    if ( this.state.data.resourceType == "hive" ) {
      this.getDatabaseList( true );
    } else {
      if(this.state.data.type == RuleConst.RULE_TYPE_CONFORMITY){
        this.getRelationDatabaseList(this.state.data.resourceType);
      }
      this.getRelationTableList( value );
    }

  }

  /*目标数据库切换处理*/
  targetDatabaseChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.targetTableList = [];
    this.targetFieldList = [];
    if ( this.state.data.resourceType == "hive" || this.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
      this.getTableList( value, true );
    } else {
      this.getRelationTableList( value );
    }
  }

  /*目标表切换处理*/
  targetTableChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.targetFieldList = [];
    if ( this.state.data.resourceType == "hive" || this.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
      this.getSourceTableFieldList( value, true );
    } else {
      this.getRelationTableFieldList( value );
    }
  }

  /*目标数据源列表*/
  getDataSourceList( type ) {
    let that = this;
    AjaxReq.getDataSourceList( { typeName: type }, ( data ) => {
      that.dataSourceList = data.data;
      that.setState( { ...that.state } );
      if ( !that.props.isNew ) {
        if ( that.state.data.resourceType == "hive" || that.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
          that.getDatabaseList( true );
        } else {
          /*根据数据源获取关系型数据表列表*/
          that.getRelationTableList( that.state.data.resourceId )
        }
      }
    } );
  }

  /*获取关系型数据库列表*/
  getRelationDatabaseList( database ) {
    let that = this;
    AjaxReq.getRelationDatabaseList( { typeName: database }, ( data ) => {
      //that.targetDatabaseList = data.data;
      let _arr = data.data;
      if(_arr){
        let _data = this.state.data;
        let _dbArr = _arr.filter((item) => {
          return item.id == _data.resourceId;
        });
        _data.targetDatabase = _dbArr[0].database;
        that.setState( { ...that.state } );
      }

    } );
  }

  /*获取关系型数据库table列表*/
  getRelationTableList( databaseId ) {
    let that = this;
    AjaxReq.getRelationTableList( { id: databaseId }, ( data ) => {
      that.targetTableList = data.data;
      that.setState( { ...that.state } );
      if ( !that.props.isNew ) {
        that.getRelationTableFieldList( that.state.data.targetTable );
      }
    } )
  }

  /*获取关系型数据库table 表字段列表*/
  getRelationTableFieldList( tableName ) {
    let that = this;
    let _data = this.state.data;
    let dataBase = "";
    AjaxReq.getRelationTableFieldList( {
      id: _data.resourceId,
      table: tableName
    }, ( data ) => {
      that.targetFieldList = data.data;
      that.setState( { ...that.state } );
    } );
  }

  /*根据类型渲染不同的项*/
  getTableRuleConfig() {
    let comps;
    switch ( this.state.data.type ) {
      case RuleConst.RULE_TYPE_RECORD:
        comps = this.getRecordComponent();
        break;
      case RuleConst.RULE_TYPE_SOLE:
      case RuleConst.RULE_TYPE_CONFORMITY:
      case RuleConst.RULE_TYPE_NULL:
        comps = this.getNullComponent();
        break;
      case RuleConst.RULE_TYPE_DATAFORMATE:
        comps = this.getDataFmtComponent();
        break;
      case RuleConst.RULE_TYPE_ACCURATE:
        comps = this.getAccurateComponent();
        break;
      case RuleConst.RULE_TYPE_LOGIC:
        comps = this.getLogicComponent();
        break;
      case RuleConst.RULE_TYPE_ROLLING:
        comps = this.getRollingComponent();
        break;
      case RuleConst.RULE_TYPE_LOGICMULTI:
        comps = this.getLogicMultiComponent();
        break;
      default:
        break;
    }
    return comps;
  }

  /*获取数据源列表（界面中该选项，为了获取数据库列表做准备，在获取数据库列表的时候依赖该返回值的第一个选项）*/
  getBaseDatasource( type, isTarget ) {
    let that = this;
    this.loadInterval = AjaxReq.getDataSourceList( { typeName: type }, ( data ) => {
      data = data.data;
      if ( that.loadInterval && data ) {
        if ( !isTarget ) {
          that.hiveId = data[ 0 ].id;
          that.getDatabaseList( isTarget );
        } else {
          that.dataSourceList = data;
          that.setState( { ...that.state } );
        }
      }
    } )
  }

  /*获取源数据库列表*/
  getDatabaseList( isTarget ) {
    let that = this;
    AjaxReq.getSourceDatabase( { hiveId: this.hiveId }, ( data ) => {
      let databaseName;
      if ( isTarget ) {
        that.targetDatabaseList = data.data;
        databaseName = that.state.data.targetDatabase;
      } else {
        that.databaseList = data.data;
        databaseName = that.state.data.sourceDatabase;
      }
      that.setState( { ...that.state } );
      if ( !that.props.isNew ) {
        that.getTableList( databaseName, isTarget );
      }
    } );
  }

  /*获取表名列表*/
  getTableList( database, isTarget ) {
    let that = this;
    AjaxReq.getSourceTableList( { hiveId: this.hiveId, nameSpace: database }, ( data ) => {
      let tableName;
      if ( isTarget ) {
        that.targetTableList = data.data;
        tableName = that.state.data.targetTable;
      } else {
        that.tableList = data.data;
        tableName = that.state.data.sourceTable;
      }
      that.setState( { ...that.state } );
      if ( !that.props.isNew ) {
        that.getDateFieldList(tableName);
        that.getSourceTableFieldList( tableName, isTarget );
      }
    } );
  }

  /*获取源表的字段列表*/
  getSourceTableFieldList( tableName, isTarget ) {
    let that = this;
    AjaxReq.getSourceTableFieldList( {
      hiveId: this.hiveId,
      nameSpace: isTarget ? this.state.data.targetDatabase : this.state.data.sourceDatabase,
      table: tableName
    }, ( data ) => {
      if ( isTarget ) {
        that.targetFieldList = data.data;
      } else {
        that.tableFieldList = data.data;
        that.getFieldFuncList();
      }
      that.setState( { ...that.state } );
    } );
  }

  /*获取日期字段列表*/
  getDateFieldList( tableName ) {
    let that = this;
    AjaxReq.getDateFieldList( {
      database: this.state.data.sourceDatabase,
      tableName: tableName
    }, ( data ) => {
      that.dateFieldList = data.data;
      //that.getFieldFuncList();
      that.setState( { ...that.state } );
    } );
  }

  /*获取表的函数列表*/
  getFieldFuncList() {
    let that = this;
    AjaxReq.getFieldFuncList( { type: "function" }, ( data ) => {
      this.tableField_funcList = data.data;
      that.setState( { ...that.state } );
      let _data = that.state.data;
      if ( _data.type == RuleConst.RULE_TYPE_CONFORMITY && !that.props.isNew ) {
        /*获取目标数据源列表*/
        /*if(_data.resourceType == "hive"){
         that.getDatabaseList( true );
         }else {
         that.getRelationDatabaseList(_data.resourceType);
         }*/
        that.getDataSourceList( _data.resourceType );
      } else if ( _data.type == RuleConst.RULE_TYPE_LOGICMULTI && !that.props.isNew ) {
        that.getTableList( that.state.data.targetDatabase, true )
        //that.getRelationTableFieldList(that.state.data.targetTable);
      }
    } );
  }

  /*保存规则*/
  saveRule() {
    let that = this;
    let param = this.setComponentToData();
    AjaxReq.saveRule( param, ( data ) => {
      that.props.backToList();
    } );
  }

  /*反写数据到state中*/
  setDataToComponent() {
    this.nameIsRepeat = false;
    let _data = this.props.data;
    let stateOthers = JSON.parse( _data.context );
    let concatObj = { ..._data, ...stateOthers };
    this.concatData = {
      liminalInter: `${concatObj.liminalMin}-${concatObj.liminalMax}`,
      rollingTrend: `${concatObj.rollingTrend_prefix}-${concatObj.rollingTrend_percent}`,
      tableField_roll: `${concatObj.tableField_func}-${concatObj.sourceColumn}`
    };
    return { data: { ...concatObj } };
  }

  /*设置需要保存的数据*/
  setComponentToData() {
    let _data = this.state.data;
    if ( this.props.isSaveAs ) {
      delete _data.id;
      delete _data.ruleId;
    }
    let param = { ..._data, taskId: this.taskData.id }
    let others = {};
    switch ( this.state.data.type ) {
      case RuleConst.RULE_TYPE_RECORD://记录数
        others.liminalType = _data.liminalType;
        if ( this.state.data.liminalType == liminalType_value ) {
          others.liminalNum = _data.liminalNum;
        } else {
          others.liminalMin = _data.liminalMin;
          others.liminalMax = _data.liminalMax;
        }
        break;
      case RuleConst.RULE_TYPE_SOLE://唯一性
      case RuleConst.RULE_TYPE_CONFORMITY://一致性（多表）
      case RuleConst.RULE_TYPE_NULL://空值
        param.sourceColumn = _data.sourceColumn;
        break;
      case RuleConst.RULE_TYPE_DATAFORMATE://数据格式检核
        others.formatType = _data.formatType;
        if ( [ df_date, df_num, df_define ].indexOf( _data.formatType ) != -1 ) {
          others.formatContent = _data.formatContent;
        }
        param.sourceColumn = _data.sourceColumn;
        break;
      case RuleConst.RULE_TYPE_ACCURATE: //准确性
        param.sourceColumn = _data.sourceColumn;
        others.judgeFunc = _data.judgeFunc;
        if ( _data.judgeFunc == judgeFunc_dimension ) {
          others.operate = _data.operate;
          others.operateContent = _data.operateContent;
        } else {
          others.liminalType = _data.liminalType;
          if ( this.state.data.liminalType == liminalType_value ) {
            others.liminalNum = _data.liminalNum;
          } else {
            others.liminalMin = _data.liminalMin;
            others.liminalMax = _data.liminalMax;
          }
        }
        break;
      case RuleConst.RULE_TYPE_LOGIC: //逻辑性
        others.expression = _data.expression;
        break;
      case RuleConst.RULE_TYPE_ROLLING: //波动性
        others.rollingType = _data.rollingType;
        if ( _data.rollingType == rollingType_column ) {
          others.tableField_func = _data.tableField_func;
          param.sourceColumn = _data.sourceColumn;
        }
        others.dateField = _data.dateField;
        others.businessDate = _data.businessDate;
        others.rollingTrend_prefix = _data.rollingTrend_prefix;
        others.rollingTrend_percent = _data.rollingTrend_percent;
        others.compareWeek = _data.compareWeek;
        break;
      case RuleConst.RULE_TYPE_LOGICMULTI: //逻辑性（多表）
        others.expression = _data.expression;
        others.sourceExpreCondition = _data.sourceExpreCondition;
        others.relationOper = _data.relationOper;
        others.targetExpression = _data.targetExpression;
        others.targetExpreCondition = _data.targetExpreCondition;
        others.sourceTableAlias = _data.sourceTableAlias;
        others.targetTableAlias = _data.targetTableAlias;
        break;
    }
    param.context = JSON.stringify( others );
    return param;
  }

  /*记录数检核渲染*/
  getRecordComponent() {
    let formItem;
    if ( !this.state.data.liminalType ) {
      formItem = null;
    } else {
      formItem = this.state.data.liminalType == liminalType_value ?
        <FormItem label="阈值" required name="liminalNum">
          <RestrictInput
            className="form-control"
            disabled={this.props.isLook?true:false}
            value={this.state.data.liminalNum}
            onChange={this.changeHandle.bind(this,"liminalNum")}
            restrict={RestrictConst.NUM_Z_32}
            tipString="只能输入正整数，长度不超过32个字符"
          />
        </FormItem> :
        <FormItem label="区间" required name="liminalInter">
          <div>
            <RestrictInput
              className="form-control"
              style={{width:"180px"}}
              disabled={this.props.isLook?true:false}
              value={this.state.data.liminalMin}
              onChange={this.changeHandle.bind(this,"liminalMin")}
              restrict={RestrictConst.NUM_Z_32}
              tipString="只能输入正整数，长度不超过32个字符"
            />
            -
            <RestrictInput
              className="form-control"
              style={{width:"180px"}}
              disabled={this.props.isLook?true:false}
              value={this.state.data.liminalMax}
              onChange={this.changeHandle.bind(this,"liminalMax")}
              restrict={RestrictConst.NUM_Z_32}
              tipString="只能输入正整数，长度不超过32个字符"
            />
          </div>
        </FormItem>
    }
    return <div>
      <FormItem label="阈值类型" ref="liminalTypeFormItem" required name="liminalType">
        <Select
          value={this.state.data.liminalType}
          disabled={this.props.isLook?true:false}
          onChange={this.selectChangeHandle.bind(this,"liminalType","liminalTypeFormItem")}
          placeholder="请选择">
          <Option value={liminalType_value}>值</Option>
          <Option value={liminalType_range}>范围</Option>
        </Select>
      </FormItem>
      {formItem}
    </div>
  }

  /*空值检核渲染*/
  getNullComponent() {
    let isRequired = false;
    if ( this.state.data.type != RuleConst.RULE_TYPE_CONFORMITY ) {
      isRequired = true;
    }
    return <FormItem label="稽核字段" required={isRequired} name="sourceColumn">
      <Select
        searchable
        value={this.state.data.sourceColumn}
        disabled={this.props.isLook?true:false}
        onChange={this.changeHandle.bind(this,"sourceColumn")}
        placeholder="请选择">
        {this.tableFieldList.map((item,index) => {
          return <Option key={index} value={item}>{item}</Option>
          })}
      </Select>
    </FormItem>;
  }

  /*数据格式检核渲染*/
  getDataFmtComponent() {
    let formatContentItem;
    switch ( this.state.data.formatType ) {
      case df_date:
        formatContentItem = <FormItem label="格式内容" required name="formatContent">
          <RestrictInput
            className="form-control"
            disabled={this.props.isLook?true:false}
            value={this.state.data.formatContent}
            onChange={this.changeHandle.bind(this,"formatContent")}
            restrict={RestrictConst.NOT_CHARS_64}
            tipString="不能输入中文，且必须以字母开头，长度不超过64个字符，如YYYYMM、YYYYMMDD、YYYYMMDDHH24MISS等"
          />
        </FormItem>
        break;
      case df_num:
        formatContentItem = <FormItem label="格式内容" required name="formatContent">
          <RestrictInput
            className="form-control"
            disabled={this.props.isLook?true:false}
            value={this.state.data.formatContent}
            onChange={this.changeHandle.bind(this,"formatContent")}
            tipString="长度不超过64个字符"
          />
        </FormItem>
        break;
      case df_define:
        formatContentItem = <FormItem label="格式内容" required name="formatContent">
          <RestrictTextarea
            className="form-control"
            value={this.state.data.formatContent}
            style={{height:"60px"}}
            readOnly={this.props.isLook?true:false}
            restrict={RestrictConst.NOT_CHARS}
            onChange={this.changeHandle.bind(this,"formatContent")}
            tipString="不能输入中文，长度不超过512个字符"
          />
        </FormItem>
        break;
    }
    return <div>
      <FormItem label="格式类型" ref="formatTypeFormItme" required name="formatType">
        <Select
          disabled={this.props.isLook?true:false}
          value={this.state.data.formatType}
          onChange={this.selectChangeHandle.bind(this,"formatType","formatTypeFormItme")}
          placeholder="请选择">
          {this.formatTypeList.map((item,index) => {
            return <Option key={index} value={item.id}>{item.name}</Option>
            })}
        </Select>
      </FormItem>
      {formatContentItem}
      {this.getNullComponent()}
    </div>
  }

  /*准确性检核渲染*/
  getAccurateComponent() {
    let formItem = this.state.data.judgeFunc == judgeFunc_dimension ?
      <div>
        <FormItem label="运算符" ref="operateFormItem" required name="operate">
          <Select
            value={this.state.data.operate}
            disabled={this.props.isLook?true:false}
            onChange={this.selectChangeHandle.bind(this,"operate","operateFormItem")}
            placeholder="请选择">
            <Option value="IN">IN</Option>
            <Option value="=">=</Option>
          </Select>
        </FormItem>
        <FormItem label="内容" required name="operateContent">
          <RestrictTextarea
            className="form-control"
            style={{height:"60px"}}
            readOnly={this.props.isLook?true:false}
            value={this.state.data.operateContent}
            onChange={this.changeHandle.bind(this,"operateContent")}/>
        </FormItem>
      </div>
      :
      this.getRecordComponent();
    return <div>
      {this.getNullComponent()}
      <FormItem label="判断方法" ref="judgeFuncFormItem" required name="judgeFunc">
        <Select
          disabled={this.props.isLook?true:false}
          value={this.state.data.judgeFunc}
          onChange={this.selectChangeHandle.bind(this,"judgeFunc","judgeFuncFormItem")}
          placeholder="请选择">
          <Option value={judgeFunc_dimension}>维度</Option>
          <Option value={judgeFunc_liminal}>阈值</Option>
        </Select>
      </FormItem>
      {formItem}
    </div>
  }

  /*逻辑性检核渲染*/
  getLogicComponent() {
    let helpStr = this.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI?"例如：t1.column1+t1.column2":"例如：column1+column2>column3"
    return <FormItem label="稽核表达式" required name="expression" help={helpStr}>
      <div>
        <RestrictTextarea
          className="form-control"
          style={{height:"60px"}}
          readOnly={this.props.isLook?true:false}
          value={this.state.data.expression}
          onChange={this.changeHandle.bind(this,"expression")}
          tipString="长度不超过2048个字符"
        />
      </div>
    </FormItem>
  }

  /*逻辑性检核（多表）渲染*/
  getLogicMultiComponent() {
    return (
      <div>
        <FormItem label="稽核表别名" name="sourceTableAlias">
          <RestrictInput
            className="form-control"
            disabled={this.props.isLook?true:false}
            value={this.state.data.sourceTableAlias}
            onChange={this.changeHandle.bind(this,"sourceTableAlias")}
            restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_32}
          />
        </FormItem>
        {this.getLogicComponent()}
        <FormItem label="关联条件" name="sourceExpreCondition">
          <MultipleSelect
            disabled={this.props.isLook?true:false}
            values={this.state.data.sourceExpreCondition}
            onChange={this.changeHandle.bind(this,'sourceExpreCondition')}
          >
            {this.tableFieldList.map((item,index) => {
              return <Option key={index} value={item}>{item}</Option>
              })}
          </MultipleSelect>
        </FormItem>
      </div>
    );
  }

  /*波动性动态渲染*/
  getRollingComponent() {
    let formItem = this.state.data.rollingType == rollingType_recordNum ? null :
      <FormItem label="稽核字段" required ref="sourceColumnFormItem" name="tableField_roll">
        <div>
          <Select
            style={{width:"120px"}}
            disabled={this.props.isLook?true:false}
            value={this.state.data.tableField_func}
            onChange={this.changeHandle.bind(this,"tableField_func")}
            placeholder="请选择">
            {this.tableField_funcList.map((item,index) => {
              return <Option key={index} value={item.code}>{item.name}</Option>
              })}
          </Select>
          <Select
            disabled={this.props.isLook?true:false}
            value={this.state.data.sourceColumn}
            onChange={this.selectChangeHandle.bind(this,"sourceColumn","sourceColumnFormItem")}
            placeholder="请选择">
            {this.tableFieldList.map((item,index) => {
              return <Option key={index} value={item}>{item}</Option>
              })}
          </Select>
        </div>
      </FormItem>;


    return (
      <div>
        <FormItem label="波动类型" ref="rollingTypeFormItem" required name="rollingType">
          <Select
            disabled={this.props.isLook?true:false}
            value={this.state.data.rollingType}
            onChange={this.selectChangeHandle.bind(this,"rollingType","rollingTypeFormItem")}
            placeholder="请选择">
            <Option value={rollingType_recordNum}>记录数</Option>
            <Option value={rollingType_column}>字段数据值</Option>
          </Select>
        </FormItem>
        {formItem}
        <FormItem label="日期字段" ref="dateFieldFormItem" required name="dateField">
          <Select
            searchable
            disabled={this.props.isLook?true:false}
            value={this.state.data.dateField&&this.state.data.dateField[0]}
            onChange={this.dateFieldChangeHandle.bind(this,"dateField","dateFieldFormItem")}
          >
            {this.dateFieldList.map((item,index) => {
              return <Option key={index} value={item.column_name}>{item.column_name}</Option>
              })}
          </Select>
        </FormItem>
        <FormItem label="业务日期" required name="businessDate" help="与日期字段相对应，如${yyyymmdd}或者${yyyy},${mm},${dd}">
          <RestrictInput
            className="form-control"
            disabled={this.props.isLook?true:false}
            value={this.state.data.businessDate}
            onChange={this.changeHandle.bind(this,"businessDate")}
            tipString="长度不超过512个字符"
          />
        </FormItem>
        <FormItem label="波动趋势" required name="rollingTrend">
          <div>
            <Select
              style={{width:"120px"}}
              disabled={this.props.isLook?true:false}
              value={this.state.data.rollingTrend_prefix}
              onChange={this.changeHandle.bind(this,"rollingTrend_prefix")}
              placeholder="请选择">
              <Option value={rollingTrend_abs}>绝对值</Option>
              <Option value={rollingTrend_asc}>上升</Option>
              <Option value={rollingTrend_desc}>下降</Option>
            </Select>
            <div style={{display:"inline-block",verticalAlign:"middle"}}>
              <RestrictInput
                className="form-control"
                restrict={RestrictConst.NUM_Z}
                style={{width:"180px",marginBottom:"0px"}}
                disabled={this.props.isLook?true:false}
                value={this.state.data.rollingTrend_percent}
                onChange={this.changeHandle.bind(this,"rollingTrend_percent")}
                tipString="只能输入不大于100的正整数，长度不超过3个字符"
              />
              %
            </div>

          </div>
        </FormItem>
        <FormItem label="对比周期" required name="compareWeek"
                  ref="compareWeekFormItem">
          <Select
            disabled={this.props.isLook?true:false}
            value={this.state.data.compareWeek}
            onChange={this.selectChangeHandle.bind(this,"compareWeek","compareWeekFormItem")}
            placeholder="请选择">
            <Option value={1}>对比上一天</Option>
            <Option value={2}>对比上周同一天</Option>
            <Option value={3}>对比最近七天平均</Option>
            <Option value={4}>对比上月同一天</Option>
            <Option value={5}>对比最近三十天平均</Option>
          </Select>
          {/*<input className="form-control" disabled value={this.state.data.dateRange}
                 style={{marginLeft:"10px",width:"200px"}}/>*/}
        </FormItem>
      </div>
    );
  }

  /*多表的参照表设置渲染*/
  getMultiConfig() {
    if ( this.state.data.type == RuleConst.RULE_TYPE_CONFORMITY ) {
      let relationItem = this.state.data.resourceType == "hive" ?
        <FormItem label="参照表数据库" required name="targetDatabase" ref="targetDatabaseFormItem">
          <Select
            searchable
            disabled={this.props.isLook?true:false}
            value={this.state.data.targetDatabase}
            onChange={this.targetDatabaseChange.bind(this,"targetDatabase","targetDatabaseFormItem")}
            placeholder="请选择">
            {this.targetDatabaseList.map((item,index) => {
              return <Option key={index} value={item}>{item}</Option>
              })}
          </Select>
        </FormItem> : null;
      return (
        <FormCategoryItem name="参照表规则设置">
          <FormItem label="数据库类型" ref="databaseTypeFormItem" required name="resourceType">
            <Select
              disabled={this.props.isLook?true:false}
              value={this.state.data.resourceType}
              onChange={this.dataBaseTypeChangeHandle.bind(this,"resourceType","databaseTypeFormItem")}
              placeholder="请选择">
              <Option value={databaseType_hive}>Hive</Option>
              <Option value={databaseType_oracle}>Oracle</Option>
              <Option value={databaseType_mysql}>Mysql</Option>
            </Select>
          </FormItem>
          <FormItem label="数据源" required name="resourceId" ref="targetDataSourceFormItem">
            <Select
              searchable
              disabled={this.props.isLook?true:false}
              value={this.state.data.resourceId}
              onChange={this.targetDataSourceChange.bind(this,"resourceId","targetDataSourceFormItem")}
              placeholder="请选择">
              {this.dataSourceList.map((item,index) => {
                return <Option key={index} value={item.id?item.id:item}>{item.name?item.name:item}</Option>
                })}
            </Select>
          </FormItem>
          {relationItem}
          <FormItem label="参照表" required name="targetTable" ref="targetTableFormItem">
            <Select
              searchable
              disabled={this.props.isLook?true:false}
              value={this.state.data.targetTable}
              onChange={this.targetTableChange.bind(this,"targetTable","targetTableFormItem")}
              placeholder="请选择">
              {this.targetTableList.map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
                })}
            </Select>
          </FormItem>
          <FormItem label="参照字段" name="targetColumn" ref="targetFieldFormItem">
            <Select
              searchable
              disabled={this.props.isLook?true:false}
              value={this.state.data.targetColumn}
              onChange={this.selectChangeHandle.bind(this,"targetColumn","targetFieldFormItem")}
              placeholder="请选择">
              {this.targetFieldList.map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
                })}
            </Select>
          </FormItem>
          <FormItem label="限制条件" name="targetLimit" help="对稽核表稽核数据的限制，如对日期、地域、省份等设置">
            <div>
              <RestrictTextarea
                className="form-control"
                placeholder="条件表达式，填写语法与sql语法一样，相当于是sql中WHERE后的语句。"
                style={{height:"100px",width:"500px"}}
                readOnly={this.props.isLook?true:false}
                value={this.state.data.targetLimit}
                onChange={this.changeHandle.bind(this,"targetLimit")}/>
            </div>
          </FormItem>
        </FormCategoryItem>
      );
    } else if ( this.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI ) {
      return (
        <FormCategoryItem name="参照表规则设置">
          <FormItem label="参照表数据库" required name="targetDatabase" ref="targetDatabaseFormItem">
            <Select
              searchable
              disabled={this.props.isLook?true:false}
              value={this.state.data.targetDatabase}
              onChange={this.targetDatabaseChange.bind(this,"targetDatabase","targetDatabaseFormItem")}
              placeholder="请选择">
              {this.databaseList.map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
                })}
            </Select>
          </FormItem>
          <FormItem label="参照表" required name="targetTable" ref="targetTableFormItem">
            <Select
              searchable
              disabled={this.props.isLook?true:false}
              value={this.state.data.targetTable}
              onChange={this.targetTableChange.bind(this,"targetTable","targetTableFormItem")}
              placeholder="请选择">
              {this.targetTableList.map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
                })}
            </Select>
          </FormItem>
          <FormItem label="稽核表别名" name="targetTableAlias">
            <RestrictInput
              className="form-control"
              disabled={this.props.isLook?true:false}
              value={this.state.data.targetTableAlias}
              onChange={this.changeHandle.bind(this,"targetTableAlias")}
              restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_32}
            />
          </FormItem>
          <FormItem label="参照表表达式" required name="targetExpression" help="例如：t2.column1+t2.column2">
            <RestrictTextarea
              className="form-control"
              style={{height:"60px"}}
              readOnly={this.props.isLook?true:false}
              value={this.state.data.targetExpression}
              onChange={this.changeHandle.bind(this,"targetExpression")}/>
          </FormItem>
          <FormItem label="关联条件" name="targetExpreCondition">
            <MultipleSelect
              disabled={this.props.isLook?true:false}
              values={this.state.data.targetExpreCondition}
              onChange={this.changeHandle.bind(this,'targetExpreCondition')}
            >
              {this.targetFieldList.map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
                })}
            </MultipleSelect>
          </FormItem>
          <FormItem label="限制条件" name="targetLimit" help="对稽核表稽核数据的限制，如对日期、地域、省份等设置">
            <div>
              <RestrictTextarea
                className="form-control"
                style={{height:"100px",width:"500px"}}
                placeholder="条件表达式，填写语法与sql语法一样，相当于是sql中WHERE后的语句。"
                readOnly={this.props.isLook?true:false}
                value={this.state.data.targetLimit}
                onChange={this.changeHandle.bind(this,"targetLimit")}/>
            </div>
          </FormItem>
        </FormCategoryItem>
      );
    }
  }

  /*保存点击处理，先验证，通过后向后端进行保存*/
  saveForm() {
    if ( this.props.isSaveAs ) {
      let isSuccess = this.refs.ruleInfoForm.validate( this.state.data );
      if ( isSuccess )this.onRuleNameBlur( true );
    } else {
      let isSuccess = this.refs.ruleInfoForm.validate( this.state.data );
      if ( isSuccess ) {
        this.saveRule();
      }
    }
  }

  /*面包屑切换*/
  breadCrumbChange( index ) {
    if ( index == 1 ) {
      this.props.backToTaskList();
    } else if ( index == 2 ) {
      this.props.backToList();
    }
  }

  render() {
    let footerItem = this.props.isLook ?
      <button
        className="btn btn-sm btn-default"
        style={{marginLeft:"292px"}}
        onClick={this.props.backToList}>返回</button>
      :
      <FormFooter
        style={{marginLeft:"294px"}}
        submitClick={this.saveForm.bind(this)}
        cancelClick={this.props.backToList}/>
    return (
      <EditPanel
        breadCrumbList={[{text:"稽核任务"},{text:"规则配置"},{text:this.props.isNew?"新增规则":"编辑规则"}]}
        history={this.props.history} onChange={this.breadCrumbChange.bind(this)}>
        <div className="edit-form">
          <label
            style={{marginLeft:"30px",marginTop:"10px", fontSize:"16px"}}>规则类型：{this.typeDic[this.state.data.type]}</label>
          <Form ref="ruleInfoForm" rules={this.rules} labelWidth={120}>
            <FormCategory>
              <FormCategoryItem name="基本信息">
                <FormItem
                  ref="ruleNameFormItem"
                  label="规则名称" required name="ruleName">
                  <RestrictInput
                    className="form-control"
                    restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                    value={this.state.data.ruleName}
                    disabled={this.props.isLook?true:false}
                    onChange={this.changeHandle.bind(this,"ruleName")}
                    onBlur={this.onRuleNameBlur.bind(this,false)}
                    tipString="只能输入中文、字母、数字、下划线，长度不超过64个字符"
                  />
                </FormItem>
                <FormItem label="规则描述" name="ruleDesc">
                  <RestrictTextarea
                    className="form-control"
                    style={{height:"60px"}}
                    readOnly={this.props.isLook?true:false}
                    value={this.state.data.ruleDesc}
                    onChange={this.changeHandle.bind(this,"ruleDesc")}/>
                </FormItem>
              </FormCategoryItem>
              <FormCategoryItem name="稽核表规则设置">
                <FormItem ref="databaseFormItem" label="稽核表数据库" required name="sourceDatabase">
                  <Select
                    searchable
                    disabled={this.props.isLook?true:false}
                    value={this.state.data.sourceDatabase}
                    onChange={this.databaseChange.bind(this,"sourceDatabase","databaseFormItem")}
                    placeholder="请选择"
                  >
                    {this.databaseList.map((item,index) => {
                      return <Option key={index} value={item}>{item}</Option>
                      })}
                  </Select>
                </FormItem>
                <FormItem ref="tableFormItem" label="稽核表" required name="sourceTable">
                  <Select
                    searchable
                    disabled={this.props.isLook?true:false}
                    value={this.state.data.sourceTable}
                    onChange={this.sourceTableChangeHandle.bind(this,"sourceTable")}
                    placeholder="请选择"
                  >
                    {this.tableList.map((item,index) => {
                      return <Option key={index} value={item}>{item}</Option>
                      })}
                  </Select>
                </FormItem>
                {this.getTableRuleConfig()}
                <FormItem label="限制条件" name="sourceLimit" help="对稽核表稽核数据的限制，如对日期、地域、省份等设置">
                  <div>
                    <RestrictTextarea
                      className="form-control"
                      style={{height:"100px",width:"500px"}}
                      placeholder="条件表达式，填写语法与sql语法一样，相当于是sql中WHERE后的语句。"
                      readOnly={this.props.isLook?true:false}
                      value={this.state.data.sourceLimit}
                      onChange={this.changeHandle.bind(this,"sourceLimit")}/>
                  </div>
                </FormItem>
                {this.state.data.type == RuleConst.RULE_TYPE_LOGICMULTI? <FormItem label="关系运算符" required
                                                                                   disabled={this.props.isLook?true:false}
                                                                                   name="relationOper"
                                                                                   ref="relationOperFormItem">
                  <Select value={this.state.data.relationOper}
                          disabled={this.props.isLook?true:false}
                          onChange={this.selectChangeHandle.bind(this,"relationOper","relationOperFormItem")}
                          placeholder="请选择">
                    {this.relationOperList.map((item,index) => {
                      return <Option key={index} value={item.id}>{item.name}</Option>
                      })}
                  </Select>
                </FormItem>:null}
              </FormCategoryItem>
              {this.getMultiConfig()}
              {/*<FormCategoryItem name="报警设置">
                <FormItem ref="alertLevelFormItem" label="报警级别" required name="alarmLevel">
                  <Select value={this.state.data.alarmLevel}
                          disabled={this.props.isLook?true:false}
                          onChange={this.selectChangeHandle.bind(this,"alarmLevel","alertLevelFormItem")}
                          placeholder="请选择">
                    <Option value="error">错误</Option>
                    <Option value="warning">预警</Option>
                  </Select>
                </FormItem>
              </FormCategoryItem>*/}
            </FormCategory>
          </Form>
          {footerItem}
        </div>
      </EditPanel>
    );
  }
}
export default RuleInfoPanel
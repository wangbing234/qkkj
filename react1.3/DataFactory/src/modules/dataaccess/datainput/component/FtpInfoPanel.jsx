import React from 'react';
import {Form, FormItem} from 'bfd-ui/lib/Form2'
import { Select, Option } from 'bfd-ui/lib/Select2'
import AutoComplete from 'bfd-ui/lib/AutoComplete'

import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import ValidateTable from 'CommonComponent/component/validatetable'
import message from 'CommonComponent/component/bdosmessage'
import EditPanel from 'CommonComponent/component/bdoseditpanel'

import TypeConst from '../../utils/TypeConst'
import AjaxReq from '../../ajax/AjaxReq'
class FtpInfoPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.hiveTargetList = [];
    this.hiveTargetDatabaseList = [];
    this.hiveTargetTableList = [];
    this.hiveTargetPartiList = [];
    this.ftpList = [];
    this.queueList = [];
    this.state = this.setDataToState();
    this.setRules.bind( this );
    this.hasValidate = false;
    this.rules = this.setRules();
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getFtpList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
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
        return BaseValidate.validateInput( { label: "导入方式", value, isRequired: true } );
      },
      ftpDatasource( value ){
        return BaseValidate.validateInput( { label: "ftp源", value, isRequired: true } );
      },
      ftpDir( value ){
        return BaseValidate.validateInput( { label: "资源文件目录", value:_data.ftpDir, isRequired: true } );
      },
      /*ftpSeparator( value ){
        return BaseValidate.validateInput( { label: "分隔符", value, isRequired: true } );
      },*/
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
          typeCode: TypeConst.FTP,
          syncType: TypeConst.FTP_TYPE,
          isOverWrite: 0
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
    _data.typeCode = TypeConst.FTP;
    _data.accessType = 0;//0 导入， 1导出
    _data.syncType = TypeConst.FTP_TYPE;
    _data.storageType = _stateData.storageType;//hive or hdfs
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
    infoJson.typeCode = TypeConst.FTP;
    infoJson.accessType = 0; //0 导入， 1导出
    infoJson.syncType = _stateData.syncType;//1单表 2多表 3条件 4ftp 5导出
    infoJson.datasourceType = _stateData.datasourceType;
    infoJson.storageType = _stateData.storageType;
    infoJson.queue = _stateData.queue;
    infoJson.priority = this.queuePriority;

    infoJson.importType = _stateData.storageType;
    infoJson.isOverWrite = _stateData.isOverWrite;
    infoJson.ftpDatasource = _stateData.ftpDatasource;
    infoJson.ftpDir = _stateData.ftpDir;
    infoJson.ftpTimeRule = _stateData.ftpTimeRule;
    infoJson.ftpSeparator = _stateData.ftpSeparator;
    infoJson.sqoopInput = _stateData.sqoopInput;
    if ( _stateData.storageType == TypeConst.importType ) {
      infoJson.targetDataSource = _stateData.targetDataSource;
      infoJson.nameSpace = _stateData.nameSpace;
      infoJson.hiveTableName = _stateData.hiveTableName;
      if ( this.hiveTargetPartiList.length ) {
        infoJson.partition = JSON.stringify( this.hiveTargetPartiList );
      }
    } else {
      infoJson.hdfsUrl = _stateData.hdfsUrl;
    }
    return JSON.stringify( infoJson );
  }

  /*获取ftp列表数据*/
  getFtpList() {
    let that = this;
    that.ftpList = [];
    AjaxReq.getDataSourceList( {
      typeName: "ftp"
    }, ( data )=> {
      that.ftpList = data.data;
      if ( that.loadInterval ) {
        that.getTargetDataSource();
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
    let _stateData = this.state.data;
    AjaxReq.getHiveTableList( {
      hiveId: hiveId,
      nameSpace: nameSpace
    }, ( data ) => {
      that.hiveTargetTableList = data.data;
      if ( that.loadInterval ) {
        that.setState( {} );
        if ( !that.props.isNew ) {
          that.getTablePartiList( _stateData.targetDataSource, _stateData.nameSpace, _stateData.hiveTableName );
        }
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

  /*hive数据源change 处理*/
  hiveTargetDataSourceChange( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    this.hiveTargetDatabaseList = [];
    this.hiveTargetTableList = [];
    this.hiveTargetPartiList = [];
    let _data = this.state.data;
    _data.hiveTableName = "";
    this.setState({...this.state});
    this.getHiveDatabase( value );
  }

  /*hive数据库change 处理*/
  hiveTargetDatabaseChange( dataField, formItemRef, value ) {
    let _stateData = this.state.data;
    this.selectChangeHandle( dataField, formItemRef, value );
    this.hiveTargetTableList = [];
    this.hiveTargetPartiList = [];
    _stateData.hiveTableName = "";
    this.setState({...this.state});
    this.getHiveTables( _stateData.targetDataSource, _stateData.nameSpace, value );
  }

  /*auto组件change事件处理*/
  autoInputChangeHandle( dataField, value ) {
    let _data = this.state.data;
    this.state.data[ dataField ] = value;
    this.setState( { data: this.state.data } );
    this.hiveTargetPartiList = [];
    if ( dataField != "tableName" ) {
      this.getTablePartiList( _data.targetDataSource, _data.nameSpace, value, true );
    }
  }

  /*队列切换处理*/
  queueChangeHandle( dataField, formItemRef, value ) {
    this.selectChangeHandle( dataField, formItemRef, value );
    let _item = this.queueList.filter( ( item ) => {
      return item.queue === value
    } );
    this.queuePriority = _item[ 0 ].id;
  }

  /*select 需要进行实时校验的change处理*/
  selectChangeHandle( dataField, formItemRef, value ) {
    let data = this.state.data;
    data[ dataField ] = value;
    this.refs[ formItemRef ] && this.refs[ formItemRef ].validate( value );
    this.setState( { ...this.state } );
  }

  /*分区表格-分区值change 处理*/
  partiTbChange( item, evt ) {
    item.value = evt.target.value;
    this.setState( { ...this.state } );
  }

  /*提交处理*/
  handleSubmit() {
    this.hasValidate = true;
    let that = this;
    let isSuccess = this.refs.ftpInfoForm.validate( this.state.data );
    if ( isSuccess ) {
      AjaxReq.saveInfo( this.getDataFromState(), ( data ) => {
        message.success( "保存成功" );
        that.props.cancelAddUser();
      } );
    }
  }

  /*更新执行参数*/
  refreshParam( value ) {
    let data = this.state.data;
    data.sqoopInput = value;
    this.setState( { ...this.state } );
  }

  /*校验名称重复*/
  checkRepeat() {
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

  testConnect() {
    this.hasValidate = true;
    let isSuccess = this.refs.ftpInfoForm.validate( this.state.data );
    if ( isSuccess ) {
      this.props.openExcuteScript( this.state.data, this.getCommond(), this.getDataFromState() );
    }
  }

  breadCrumbChange( index ) {
    this.props.cancelAddUser();
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
      <div style={{height:"50px"}}>
        <FormItem label="目标表名" ref="hiveTableNameFormItem" required name="hiveTableName">
          <AutoComplete
            value={_data.hiveTableName}
            source={this.hiveTargetTableList}
            onChange={this.autoInputChangeHandle.bind(this,'hiveTableName')}></AutoComplete>
        </FormItem>
      </div>
      {this.hiveTargetPartiList.length ?
      <FormItem label="分区" ref="hiveTableNameFormItem" required name="partition">
        <ValidateTable
          ref="partiTab"
          data={{totalList:this.hiveTargetPartiList}}
          column={_partiColumn}
          howRow={100}
          tableWidth="300px"
        ></ValidateTable>
      </FormItem>:null}
    </div>
    return this.state.data.storageType == TypeConst.importType ?
      hiveTarget :
      <FormItem label="HDFS路径" required name="hdfsUrl">
        <RestrictInput
          className="form-control"
          value={_data.hdfsUrl}
          onChange={this.changeHandle.bind(this,"hdfsUrl")}
        />
      </FormItem>
  }

  render() {
    let _data = this.state.data;
    let targetItem = this.getTargetItemView();
    return (
      <EditPanel
        breadCrumbList={[{text:"数据接入"},{text:this.props.isNew?"新增":"编辑"}]}
        history={this.props.history} onChange={this.breadCrumbChange.bind(this)}>
        <div className="single-column-form edit-form">
          <Form
            ref="ftpInfoForm" horizontal
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
                <FormItem label="ftp源" ref="ftpDatasourceFormItem" required name="ftpDatasource">
                  <Select
                    placeholder="请选择"
                    value={this.state.data.ftpDatasource}
                    onChange={this.selectChangeHandle.bind(this,"ftpDatasource","ftpDatasourceFormItem")}>
                    {this.ftpList.map((item,index) => {
                      return <Option key={index} value={item.id}>{item.name}</Option>
                      })}
                  </Select>

                </FormItem>
                <div className="special-fromItem-error">
                  <FormItem label="资源文件目录" required name="ftpDir">
                    <div style={{height:"22px",display:"inline-block"}}>
                      <RestrictInput
                        className="form-control"
                        style={{float:"left",width:"200px"}}
                        value={this.state.data.ftpDir}
                        placeholder="目录名"
                        onChange={this.changeHandle.bind(this,"ftpDir")}
                      />
                      <div
                        style={{float:"left",display:"inline-block", width:"10px",height:"30px",
                    fontSize:"21px",marginLeft:"8px",marginRight:"5px"}}>
                        /
                      </div>
                      <div className="clear-error-div">
                        <RestrictInput
                          className="form-control data-access-steps2-input"
                          style={{float:"left"}}
                          placeholder="时间规则"
                          value={this.state.data.ftpTimeRule}
                          onChange={this.changeHandle.bind(this,"ftpTimeRule")}
                        />
                      </div>
                    </div>
                  </FormItem>
                </div>
                {/*<FormItem label="分隔符" required name="ftpSeparator">
                  <RestrictInput
                    className="form-control"
                    onChange={this.changeHandle.bind(this,"ftpSeparator")} value={this.state.data.ftpSeparator}/>
                </FormItem>*/}
              </FormCategoryItem>
              <FormCategoryItem name="目标">
                {targetItem}
              </FormCategoryItem>
              <FormCategoryItem name="高级设置">
                <FormItem label="是否覆盖" ref="isOverWriteFormItem" required name="isOverWrite">
                  <Select
                    value={_data.isOverWrite}
                    onChange={this.selectChangeHandle.bind(this,"isOverWrite","isOverWriteFormItem")}>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
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
export default FtpInfoPanel
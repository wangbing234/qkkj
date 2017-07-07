import React from 'react';
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import message from 'CommonComponent/component/bdosmessage'
import AddRowTable from 'CommonComponent/component/addrowtable'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import {stringToxml,xmlToString,xmlToObject,getValueFromArr} from "Util"
import EditPanel from 'CommonComponent/component/bdoseditpanel'

import MysqlForm from './addPages/MysqlForm'
import OracleForm from './addPages/OracleForm'
import HiveForm from './addPages/HiveForm'
import FtpForm from './addPages/FtpForm'
import FlumeForm from './addPages/FlumeForm'
import RedisForm from './addPages/RedisForm'
import ProxyForm from './addPages/ProxyForm'
import SqlServerForm from './addPages/SqlServerForm'
import Db2Form from './addPages/Db2Form'
import HbaseForm from './addPages/HbaseForm'


import KafkaForm from './addPages/KafkaForm'
import StormForm from './addPages/StormForm'
import ZookeeperForm from './addPages/ZookeeperForm'
import AjaxReq from '../ajax/AjaxReq'
import ResourceTypeConst from '../util/ResourceTypeConst'
import {setItemXML,setModelXML} from '../util/ResourceXmlUtil'

let typeList = [];
class ResourceInfo extends React.Component {
  constructor( props ) {
    super( props );
    /*xml数据解析成object,并设置到state中*/
    let _dataXml = stringToxml( this.props.data );
    let _dataJson = xmlToObject( _dataXml );
    let _data = _dataJson && _dataJson.root ? _dataJson.root.table : {
      resourceType: ResourceTypeConst.MYSQL,
      model: { metaDatabaseType: ResourceTypeConst.MYSQL }
    };
    let _itemData = {};
    if ( _data && _data.model && !Array.isArray( _data.model ) && _data.model.item ) {
      _itemData = this.deserialization( _data.model.item );
    } else {
      _itemData = _data.model;
    }
    this.state = {
      type: _data.resourceType,
      isEdit: this.props.isEdit,
      itemData: _itemData,
      ..._data
    }
    this.rules = {};
    this.filterTypeList();
  }

  /*根据是否是管理员过滤数据类型*/
  filterTypeList() {
    typeList = this.props.typeList;
  }

  /*将每条配置信息写入data中*/
  deserialization( dataArr ) {
    if ( !dataArr ) {
      return {};
    }
    if ( !Array.isArray( dataArr ) ) {
      dataArr = [ dataArr ];
    }
    let dataObj = {};
    for ( var i = 0; i < dataArr.length; i++ ) {
      dataObj[ dataArr[ i ].cpname ] = dataArr[ i ].value;
    }
    return dataObj;
  }

  /*基本配置change时，将值设置到state中存储*/
  handleChange( name, event ) {
    let newState = {};
    if ( event && event.target ) {
      newState[ name ] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      if ( this.refs.metaDatabaseTypeFormItem ) {
        this.refs.metaDatabaseTypeFormItem.validate( event );
      }
      if ( this.refs.privilegeFormItem ) {
        this.refs.privilegeFormItem.validate( event );
      }
      newState[ name ] = event;
    }
    this.setState( { itemData: { ...this.state.itemData, ...newState } } );
  }

  /*资源类型更改，将更改的值存储到state中*/
  handleResourceChange( value ) {
    this.setState( { resourceType: value, validateState: false } );
  }

  /*设置每条配置的正则及验证方法*/
  setItemValidate( arr ) {
    let that = this;
    let itemName;
    let lastChar;
    for ( var i = 0; i < arr.length; i++ ) {
      itemName = arr[ i ].cpname;
      lastChar = arr[ i ].name.charAt( arr[ i ].name.length - 1 );
      if ( [ "：", ":" ].indexOf( lastChar ) != -1 ) {
        arr[ i ].name = arr[ i ].name.substr( 0, arr[ i ].name.length - 1 );
      }
      //arr[ i ].name = arr[ i ].name.lastIndexOf("：");
      arr[ i ].isRequired = true;

      arr[ i ].validate = BaseValidate.validateInput;
      switch ( itemName ) {
        case "resourceName":
          arr[ i ].maxLen = 64;
          arr[ i ].restrict = RestrictConst.NUM_STRING_CHARS_UNDERLINE;
          arr[ i ].tipString = "只能输入中文、字母、数字、下划线，长度小于64个字符";
          break;
        case "host":
        case "metaHost":
          arr[ i ].maxLen = 128;
          arr[ i ].restrict = RestrictConst.NUM_STRING_POINT_UNDERLINE;
          arr[ i ].tipString = "只能输入字母、数字、点、下划线、中划线，长度小于128个字符";
          break;
        case "port":
        case "metaPort":
          arr[ i ].maxLen = 5;
          arr[ i ].restrict = RestrictConst.NUM_PORT;
          break;
        case "userName":
        case "metaUserName":
          arr[ i ].maxLen = 32;
          arr[ i ].restrict = RestrictConst.NOT_CHARS;
          arr[ i ].tipString = "长度小于32个字符";
          break;
        case "pwd":
          if ( [ ResourceTypeConst.HIVE, ResourceTypeConst.HBASE ].indexOf( this.state.resourceType ) != -1 ) {
            arr[ i ].isRequired = false;
            delete arr[ i ].validate;
          }
          break;
        case "metaPwd":
          arr[ i ].restrict = RestrictConst.NOT_CHARS;
          break;
        case "redisPwd":
          delete arr[ i ].validate;
          arr[ i ].isRequired = false;
          arr[ i ].restrict = RestrictConst.NOT_CHARS;
          break;
        case "schema":
          arr[ i ].isRequired = false;
          delete arr[ i ].validate;
        case "database":
        case "metaDatabase":
          arr[ i ].maxLen = 64;
          arr[ i ].restrict = RestrictConst.NOT_CHARS;
          arr[ i ].tipString = "长度小于64个字符";
          break;
        case "jdbcParam":
        case "metaJdbcParam":
          arr[ i ].isRequired = false;
          arr[ i ].restrict = RestrictConst.NOT_CHARS;
          arr[ i ].maxLen = 128;
          arr[ i ].tipString = "长度小于128个字符";
          break;
        case "maxNum":
          arr[ i ].restrict = RestrictConst.NUM;
          break;
        case "serviceName":
          arr[ i ].maxLen = 128;
          break;
        case "zkAddress":
          arr[ i ].maxLen = 512;
          break;
        case "installPath":
          arr[ i ].maxLen = 128;
          break;
        case "privilege":
          delete arr[ i ].validate;
          //arr[ i ].validate = that.radioValidate.bind( that );
          break;
      }
    }
  }

  /**
   * 根据配置信息生成表单组件
   * @param config
   * @returns {*}
   */
  generatorFormItens( config ) {
    let that = this;
    this.rules = null;
    this.rules = {};
    return config && config.map( function ( item, index ) {
        let requiredConfig = { name: item.cpname };
        if ( item.isRequired ) {
          requiredConfig.required = true;
        }
        if ( item.validate ) {
          that.rules[ item.cpname ] = v => {
            return item.validate( {
              isRequired: item.isRequired,
              label: item.name,
              value: v,
              maxLength: item.maxLen
            } );
          }
        }

        let isLook = that.props.isLook;
        let itemView;
        let inputType = "text";
        if ( window.userName != "jupiter" && that.props.createUser == "jupiter" ) {
          inputType = ([ "pwd", "metaPwd", "redisPwd", "userName", "metaUserName" ].indexOf( item.cpname ) != -1) ? "password" : "text";
        } else {
          inputType = ([ "pwd", "metaPwd", "redisPwd" ].indexOf( item.cpname ) != -1) ? "password" : "text";
        }
        let itemProperties = {
          className: "form-control common-form-input",
          value: that.state.itemData[ item.cpname ],
          restrict: item.restrict,
          type: inputType,
          readOnly: isLook,
          disabled: false,
          onChange: that.handleChange.bind( that, item.cpname )
        };

        if ( item.cpname == "metaDatabaseType" ) {
          requiredConfig.ref = "metaDatabaseTypeFormItem";
          itemView = (<Select disabled={isLook} value={that.state.itemData[item.cpname]} style={{width:"405px"}}
                              onChange={that.handleChange.bind(that,item.cpname)}>
            <Option key={ResourceTypeConst.SQLSERVER}
                    value={ResourceTypeConst.SQLSERVER}>{ResourceTypeConst.SQLSERVER}</Option>
            <Option key={ResourceTypeConst.MYSQL} value={ResourceTypeConst.MYSQL}>{ResourceTypeConst.MYSQL}</Option>
            <Option key={ResourceTypeConst.ORACLE} value={ResourceTypeConst.ORACLE}>{ResourceTypeConst.ORACLE}</Option>
          </Select>);
        } else if ( item.cpname == "zkAddress" ) {
          itemView = <RestrictTextarea {...itemProperties} style={{height:"60px"}} tipString={item.tipString}/>
        } else if ( item.cpname == "privilege" ) {
          requiredConfig.ref = "privilegeFormItem"
          itemView = <RadioGroup
            defaultValue={Number(that.state.itemData[item.cpname])}
            value={Number(that.state.itemData[item.cpname])}
            onChange={that.handleChange.bind(that,item.cpname)}>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>不启用</Radio>
          </RadioGroup>
        } else {
          itemView = (<RestrictInput {...itemProperties} tipString={item.tipString}/>);
        }
        return (
          <FormItem key={index} {...requiredConfig} label={item.name}>
            {itemView}
          </FormItem>
        )
      } );
  }

  /*单选按钮的验证*/
  radioValidate( valueObj ) {
    if ( Number(valueObj.value) === 0 || Number(valueObj.value) === 1 ) {
      return "";
    } else {
      return `${valueObj.label}不能为空！`;
    }
  }

  /**
   * 根据 type 获取相对应的配置，动态生成表单
   * TODO：kafka，strom，zookeeper 展示不一样,需要重新写
   * @returns {*}
   */
  getFormItemConfig() {
    let arr = this.state.model.item;
    switch ( this.state.resourceType ) {
      case ResourceTypeConst.MYSQL:
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'IP/主机名', cpname: 'host', validate: BaseValidate.validateInput },
          { name: '端口', cpname: 'port', validate: BaseValidate.validateInput },
          { name: '用户名', cpname: 'userName', validate: BaseValidate.validateInput },
          { name: '密码', cpname: 'pwd', validate: BaseValidate.validateInput },
          { name: '数据库名', cpname: 'database', validate: BaseValidate.validateInput },
          { name: 'JDBC连接参数', cpname: 'jdbcParam', validate: BaseValidate.validateInput }
        ]
        this.config = arr || this.config;
        break;
      case ResourceTypeConst.ORACLE:
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'IP/主机名', cpname: 'host', validate: BaseValidate.validateInput },
          { name: '端口', cpname: 'port', validate: BaseValidate.validateInput },
          { name: '用户名', cpname: 'userName', validate: BaseValidate.validateInput },
          { name: '密码', cpname: 'pwd', validate: BaseValidate.validateInput },
          { name: '实例名', cpname: 'database', validate: BaseValidate.validateInput },
          { name: '表空间', cpname: 'schema'},
          { name: 'JDBC连接参数', cpname: 'jdbcParam', validate: BaseValidate.validateInput }
        ]
        this.config = arr || this.config;
        break;
      case ResourceTypeConst.HIVE:
        let baseName = this.state.itemData && this.state.itemData.metaDatabaseType == ResourceTypeConst.ORACLE ? "实例名" : "元数据库名";
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'ZK连接地址', cpname: 'zkAddress', validate: BaseValidate.validateInput },
          { name: '用户名', cpname: 'userName', validate: BaseValidate.validateInput },
          { name: '密码', cpname: 'pwd' },
          { name: 'JDBC连接参数', cpname: 'jdbcParam', validate: BaseValidate.validateInput },
          { name: '元数据库类型', cpname: 'metaDatabaseType', validate: BaseValidate.validateInput },
          { name: '元数据库IP/主机名', cpname: 'metaHost', validate: BaseValidate.validateInput },
          { name: '元数据库端口号', cpname: 'metaPort', validate: BaseValidate.validateInput },
          { name: baseName, cpname: 'metaDatabase', validate: BaseValidate.validateInput },
          { name: '元数据库用户名', cpname: 'metaUserName', validate: BaseValidate.validateInput },
          { name: '元数据库密码', cpname: 'metaPwd', validate: BaseValidate.validateInput },
          { name: '元数据库连接参数', cpname: 'metaJdbcParam' }
        ]
        this.config = arr || this.config;
        break;
      case ResourceTypeConst.FTP:
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'IP/主机名', cpname: 'host', validate: BaseValidate.validateInput },
          { name: '端口', cpname: 'port', validate: BaseValidate.validateInput },
          { name: '用户名', cpname: 'userName', validate: BaseValidate.validateInput },
          { name: '密码', cpname: 'pwd', validate: BaseValidate.validateInput }
        ]
        this.config = arr || this.config;
        break;
      case ResourceTypeConst.FLUME:
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'IP/主机名', cpname: 'host', validate: BaseValidate.validateInput },
          { name: '安装目录', cpname: 'installPath', validate: BaseValidate.validateInput },
        ]
        this.config = arr || this.config;
        break;
      case ResourceTypeConst.REDIS:
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'IP/主机名', cpname: 'host', validate: BaseValidate.validateInput },
          { name: '端口', cpname: 'port', validate: BaseValidate.validateInput },
          { name: 'redis密码', cpname: 'redisPwd' }
        ]
        this.config = arr || this.config;
        break;
      case ResourceTypeConst.PROXY:
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'IP/主机名', cpname: 'host', validate: BaseValidate.validateInput },
          { name: '端口', cpname: 'port', validate: BaseValidate.validateInput },
          { name: '服务名称', cpname: 'serviceName', validate: BaseValidate.validateInput }
        ]
        this.config = arr || this.config;
        break;
      case ResourceTypeConst.SQLSERVER:
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'IP/主机名', cpname: 'host', validate: BaseValidate.validateInput },
          { name: '端口', cpname: 'port', validate: BaseValidate.validateInput },
          { name: '用户名', cpname: 'userName', validate: BaseValidate.validateInput },
          { name: '密码', cpname: 'pwd', validate: BaseValidate.validateInput },
          { name: '数据库名', cpname: 'database', validate: BaseValidate.validateInput },
          { name: 'JDBC连接参数', cpname: 'jdbcParam', validate: BaseValidate.validateInput }
        ]
        this.config = arr || this.config;
        break;
      case ResourceTypeConst.DB2:
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'IP/主机名', cpname: 'host', validate: BaseValidate.validateInput },
          { name: '端口', cpname: 'port', validate: BaseValidate.validateInput },
          { name: '用户名', cpname: 'userName', validate: BaseValidate.validateInput },
          { name: '密码', cpname: 'pwd', validate: BaseValidate.validateInput },
          { name: '数据库名', cpname: 'database', validate: BaseValidate.validateInput },
          { name: '表空间', cpname: 'schema'},
          { name: 'JDBC连接参数', cpname: 'jdbcParam', validate: BaseValidate.validateInput }
        ]
        this.config = arr || this.config;
        break;
      case ResourceTypeConst.HBASE:
        this.config = [
          { name: '资源名称', cpname: 'resourceName', validate: BaseValidate.validateInput },
          { name: 'ZK连接地址', cpname: 'zkAddress', validate: BaseValidate.validateInput },
          { name: '用户名', cpname: 'userName', validate: BaseValidate.validateInput },
          { name: '密码', cpname: 'pwd' }/*,
          { name: '端口', cpname: 'port', validate: BaseValidate.validateInput }*/
        ]
        this.config = arr || this.config;
        break;
    }
    let _itemForm;
    if ( this.config ) {
      this.setItemValidate( this.config );
      _itemForm = (this.generatorFormItens( this.config ));
    }
    return _itemForm;
  }

  /*设置其他复杂配置组件*/
  getOtherForm() {
    let formJsx;
    switch ( this.state.resourceType ) {
      case ResourceTypeConst.KAFKA:
        formJsx = this.renderKafka( this.state.itemData );
        break;
      case ResourceTypeConst.ZOOKEEPER:
        formJsx = this.renderZookeeper( this.state.itemData );
        break;
      case ResourceTypeConst.STORM:
        formJsx = this.renderStrom( this.state.itemData );
        break;
    }
    return formJsx;
  }

  /*kafka组件*/
  renderKafka( kafkaData ) {
    return <KafkaForm
      ref="KafkaForm" isEdit={this.props.isEdit}
      isLook={this.props.isLook} data={kafkaData}
      deserialization={this.deserialization.bind(this)}/>
  }


  /*storm组件*/
  renderStrom( stormData ) {
    return <StormForm
      ref="StormForm" isEdit={this.props.isEdit}
      isLook={this.props.isLook} data={stormData}
      deserialization={this.deserialization.bind(this)}/>
  }

  /*zookeeper组件*/
  renderZookeeper( zookeeperData ) {
    return <ZookeeperForm
      ref="ZookeeperForm" isEdit={this.props.isEdit}
      isLook={this.props.isLook} data={zookeeperData}
      deserialization={this.deserialization}/>;
  }

  //submit按钮提交操作
  handleSubmit( e ) {
    if ( this.validateForm( true ) ) {
      this.saveForm();
    }
    e.preventDefault();
  }

  validateForm( isSave ) {
    let isSuccessFlag = false;
    let rType = this.state.resourceType;
    if ( [ ResourceTypeConst.KAFKA, ResourceTypeConst.STORM, ResourceTypeConst.ZOOKEEPER ].indexOf( rType ) != -1 ) {
      if ( this.refs[ rType + "Form" ].validate() ) {
        isSuccessFlag = true;
      }
    } else {
      if ( this.refs[ rType + "Form" ].validate( this.state.itemData ) ) {
        isSuccessFlag = true;
        if (  [ResourceTypeConst.HIVE,ResourceTypeConst.HBASE].indexOf(rType) != -1 && !this.state.isEdit ) {
          isSuccessFlag = true;
          if ( isSave ) {
            isSuccessFlag = false;
            this.checkHasHiveOrHbase();
          }
        }
      } else {              //验证失败
        isSuccessFlag = false;
        console.log( '表单验证失败' );
      }
    }
    return isSuccessFlag;
  }

  /*检查hive是否有已经配置*/
  checkHasHiveOrHbase() {
    let hasHive = false;
    let that = this;
    let select_resourceTypeId = getValueFromArr( this.props.typeList, "name", this.state.resourceType, "id" );
    AjaxReq.checkHive( select_resourceTypeId, ( data ) => {
      if ( data.data.totalList && data.data.totalList.length > 0 ) {
        hasHive = true;
        message.danger( `已经配置了一条${this.state.resourceType}数据!` );
      } else {
        hasHive = false;
        that.saveForm();
      }

    }, ( data ) => {
      hasHive = true;
      message.danger( data.msg );
    } );
  }

  /*保存当前资源配置*/
  saveForm() {
    let xml = this.setStateToData();
    let param;
    let that = this;
    let select_resourceTypeId = getValueFromArr( this.props.typeList, "name", this.state.resourceType, "id" );
    if ( this.state.isEdit ) {
      param = { type: parseInt( select_resourceTypeId ), xml: xml, id: this.props.resourceId };
    } else {
      param = { type: parseInt( select_resourceTypeId ), xml: xml, id: 0 };
    }
    AjaxReq.saveResourceConfig( param, ( data ) => {
      message.success( data.msg );
      that.props.closeHandler();
    } );
  }

  /*将配置信息拼成xml格式*/
  objectToXmlString( obj, valueObj ) {
    let xmlDoc = stringToxml( "<root></root>" );
    let root = xmlDoc.createElement( "root" );
    let tbXml = xmlDoc.createElement( "table" );
    tbXml.setAttribute( "resourceType", obj.resourceType );
    tbXml.setAttribute( "resourceTypeId", obj.resourceTypeId );
    tbXml.appendChild( setItemXML( xmlDoc, "资源类型", "resourceType", obj.resourceTypeId ) );
    console.log( "xml--------------------------", xmlDoc );
    if ( this.state.resourceType != "kafka" && this.state.resourceType != "storm" && this.state.resourceType != "zookeeper" ) {
      let baseModel = setModelXML( xmlDoc, "base", "base", "基本配置" );
      tbXml.appendChild( baseModel );
      this.setItemToData( obj.base, valueObj, xmlDoc, baseModel );
    } else if ( this.state.resourceType == "kafka" ) {
      this.refs.kafkaForm.setStateToData( xmlDoc, tbXml );
    } else if ( this.state.resourceType == "storm" ) {
      this.refs.stormForm.setStateToData( xmlDoc, tbXml );
    } else if ( this.state.resourceType == "zookeeper" ) {
      this.refs.zookeeperForm.setStateToData( xmlDoc, tbXml );
    }
    root.appendChild( tbXml );
    let xmlStr = xmlToString( root );
    return xmlStr;
  }

  /*将state中存储的值写到Object中*/
  setStateToData() {
    let select_resourceTypeId = getValueFromArr( this.props.typeList, "name", this.state.resourceType, "id" );
    let base;
    let _data;
    let xmlStr;
    base = { model: this.state.model };
    _data = {
      resourceType: this.state.resourceType,
      resourceTypeId: select_resourceTypeId,
      item: { resourceType: select_resourceTypeId },
      base: base
    };
    xmlStr = this.objectToXmlString( _data, this.state.itemData );
    return xmlStr;
  }

  /*设置每条item配置的数据拼成xml，并放到数组中*/
  setItemToData( baseData, valueObj, xmlDoc, parentNode ) {
    let sourceArr = baseData.model.item ? baseData.model.item : this.config;
    sourceArr.map( ( data, index ) => {
      let itemXml;
      if ( data.cpname == "resourceName" ) {
        itemXml = setItemXML( xmlDoc, "资源名称", "resourceName", valueObj.resourceName );
      } else if ( data.cpname == "host" ) {
        itemXml = setItemXML( xmlDoc, "IP/主机名", "host", valueObj.host );
      } else if ( data.cpname == "port" ) {
        itemXml = setItemXML( xmlDoc, "端口", "port", valueObj.port );
      } else if ( data.cpname == "zkAddress" ) {
        itemXml = setItemXML( xmlDoc, "zk连接地址", "zkAddress", valueObj.zkAddress );
      } else if ( data.cpname == "userName" ) {
        itemXml = setItemXML( xmlDoc, "用户名", "userName", valueObj.userName );
      } else if ( data.cpname == "pwd" ) {
        itemXml = setItemXML( xmlDoc, "密码", "pwd", valueObj.pwd );
      } else if ( data.cpname == "database" ) {
        name = this.state.resourceType.toUpperCase() == 'Oracle'.toUpperCase() ? "实例名" : "数据库名";
        itemXml = setItemXML( xmlDoc, name, "database", valueObj.database );
      } else if( data.cpname == "schema" ){
        itemXml = setItemXML( xmlDoc, "表空间", "schema", valueObj.schema );
      } else if ( data.cpname == "loginName" ) {
        itemXml = setItemXML( xmlDoc, "机器登录名", "loginName", valueObj.loginName );
      } else if ( data.cpname == "maxNum" ) {
        itemXml = setItemXML( xmlDoc, "最大连接数", "maxNum", valueObj.maxNum );
      } else if ( data.cpname == "jdbcParam" ) {
        itemXml = setItemXML( xmlDoc, "JDBC连接参数", "jdbcParam", valueObj.jdbcParam );
      } else if ( data.cpname == "installPath" ) {
        itemXml = setItemXML( xmlDoc, "安装目录", "installPath", valueObj.installPath );
      } else if ( data.cpname == "metaDatabaseType" ) {
        itemXml = setItemXML( xmlDoc, "元数据库类型", "metaDatabaseType", valueObj.metaDatabaseType );
      } else if ( data.cpname == "metaHost" ) {
        itemXml = setItemXML( xmlDoc, "元数据库IP/主机名", "metaHost", valueObj.metaHost );
      } else if ( data.cpname == "metaPort" ) {
        itemXml = setItemXML( xmlDoc, "元数据库端口号", "metaPort", valueObj.metaPort );
      } else if ( data.cpname == "metaDatabase" ) {
        itemXml = setItemXML( xmlDoc, "元数据库名", "metaDatabase", valueObj.metaDatabase );
      } else if ( data.cpname == "metaUserName" ) {
        itemXml = setItemXML( xmlDoc, "元数据库用户名", "metaUserName", valueObj.metaUserName );
      } else if ( data.cpname == "metaPwd" ) {
        itemXml = setItemXML( xmlDoc, "元数据库密码", "metaPwd", valueObj.metaPwd );
      } else if ( data.cpname == "metaJdbcParam" ) {
        itemXml = setItemXML( xmlDoc, "元数据库连接参数", "metaJdbcParam", valueObj.metaJdbcParam );
      } else if ( data.cpname == "redisPwd" ) {
        itemXml = setItemXML( xmlDoc, "redis密码", "redisPwd", valueObj.redisPwd );
      } else if ( data.cpname == "dataFilePath" ) {
        itemXml = setItemXML( xmlDoc, "数据文件路径", "dataFilePath", valueObj.dataFilePath );
      } else if ( data.cpname == "serviceName" ) {
        itemXml = setItemXML( xmlDoc, "服务名称", "serviceName", valueObj.serviceName );
      }/* else if ( data.cpname == "privilege" ) {
        itemXml = setItemXML( xmlDoc, "开启权限", "privilege", valueObj.privilege.toString() );
      }*/
      itemXml && parentNode.appendChild( itemXml );
    } );
  }

  /*测试链接*/
  testConnectHandler() {
    if ( this.validateForm( false ) ) {
      let xml = this.setStateToData();
      let param = { xml: xml, resourceType: this.state.resourceType };
      AjaxReq.testConfigConnect( param, ( data ) => {
        message.success( data.msg );
      } );
    }
  }

  getRules() {
    return this.rules;
  }

  /*面包屑切换*/
  breadCrumbChange( index ) {
    this.props.closeHandler();
  }

  getFormConfig() {
    let formConfig = {
      getRules: this.getRules.bind( this ),
      getFormItemConfig: this.getFormItemConfig.bind( this )
    };
    switch ( this.state.resourceType ) {
      case ResourceTypeConst.MYSQL:
        return <MysqlForm ref="MySQLForm" {...formConfig}/>
        break;
      case ResourceTypeConst.ORACLE:
        return <OracleForm ref="OracleForm" {...formConfig}/>
        break;
      case ResourceTypeConst.HIVE:
        return <HiveForm ref="HiveForm" {...formConfig}/>
        break;
      case ResourceTypeConst.FTP:
        return <FtpForm ref="FTPForm" {...formConfig}/>
        break;
      case ResourceTypeConst.FLUME:
        return <FlumeForm ref="FlumeForm" {...formConfig}/>
        break;
      case ResourceTypeConst.REDIS:
        return <RedisForm ref="RedisForm" {...formConfig}/>
        break;
      case ResourceTypeConst.PROXY:
        return <ProxyForm ref="ProxyForm" {...formConfig}/>
        break;
      case ResourceTypeConst.SQLSERVER:
        return <SqlServerForm ref="SQLServerForm" {...formConfig}/>
        break;
      case ResourceTypeConst.DB2:
        return <Db2Form ref="DB2Form" {...formConfig}/>
        break;
      case ResourceTypeConst.HBASE:
        return <HbaseForm ref="HBaseForm" {...formConfig}/>
        break;
    }
  }

  render() {
    let formItems = this.getFormConfig();
    let otherItems = this.getOtherForm();
    let disabled = this.state.isEdit;
    const validates = [ {
      validateVal: this.state.resourceType,
      handle: function () {
        let s;
        if ( !this.validateVal ) {
          s = '请选择资源类型';
        } else {
          s = 'success'
        }
        return s;
      }
    } ];
    let testBtn = this.state.resourceType == ResourceTypeConst.FLUME || this.props.isLook ?
      null : <button type="button" className="btn btn-sm btn-primary" onClick={this.testConnectHandler.bind(this)}>
      测试连接
    </button>
    let submitBtn = this.props.isLook ?
      null : <button type="button" className="btn btn-sm btn-primary"
                     onClick={this.handleSubmit.bind(this)}>提交
    </button>

    return (
      <EditPanel
        breadCrumbList={[{text:"资源管理"},{text:this.props.isEdit?"编辑":"新增"}]}
        history={this.props.history} onChange={this.breadCrumbChange.bind(this)}>
        <div className="resourcemanage-edit">
          <Form horizontal rules={this.rules} ref="baseForm" labelWidth={150}
                className="resourcemanage-edit-form" style={{paddingTop:"15px"}}>
            <FormItem label="资源类型" required name="resourceType">
              <Select disabled={disabled} style={{width:"405px"}}
                      value={this.state.resourceType}
                      onChange={this.handleResourceChange.bind(this)}>
                {typeList.map( ( item, index )=> {
                  return (<Option key={item.name+index} value={item.name}>{item.name}</Option>);
                  } )}
              </Select>
            </FormItem>
          </Form>
          {formItems}
          {otherItems}
          <div className="form-group center" style={{marginLeft:"150px"}}>
            {testBtn}
            {submitBtn}
            <button type="button" className="btn btn-sm btn-default"
                    onClick={this.props.closeHandler}>取消
            </button>
          </div>
        </div>
      </EditPanel>
    );
  }
}
export default ResourceInfo
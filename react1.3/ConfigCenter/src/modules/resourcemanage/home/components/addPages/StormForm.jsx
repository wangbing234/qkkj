import React from "react"
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import {AddRowTable,BfdRequest,RestrictInput,RestrictConst,BaseValidate} from 'CommonComponent'
import AuthButton from 'CommonComponent/component/authbutton'
import AjaxReq from '../../ajax/AjaxReq'
import {setItemXML,setModelXML} from '../../util/ResourceXmlUtil'

class StormForm extends React.Component {
  constructor( props ) {
    super( props );
    let that = this;
    this.baseRules = {
      resourceName: value => {
        return BaseValidate.validateInput( { isRequired: true, label: "资源名称", value: value, maxLength: 64 } );
      }
    };
    this.zkRules = {
      zkRoot: value => {
        return BaseValidate.validateInput( { isRequired: true, label: "zkRoot", value: value, maxLength: 64 } );
      },
      zkConfigId: value => {
        return BaseValidate.validateInput( { isRequired: true, label: "集群", value: value } );
      }
    };
    this.nimbusRules = {
      nimbusLocal: value => {
        return BaseValidate.validateInput( { isRequired: true, label: "IP/主机名", value: value, maxLength: 128 } );
      },
      thriPort: value => {
        return BaseValidate.validateInput( { isRequired: true, label: "thriftPort", value: value, maxLength: 64 } );
      },
      installPath: value => {
        return BaseValidate.validateInput( { isRequired: true, label: "安装目录", value: value, maxLength: 128 } );
      }
    };
    /*xml数据解析成object,并设置到state中*/
    let baseModel = this.props.data ? this.getDataFromArr( "base" )[ 0 ] : { item: {} };
    let zkModel = this.props.data ? this.getDataFromArr( "zkConf" )[ 0 ] : { item: {} };
    let nimbusModel = this.props.data ? this.getDataFromArr( "nimbusConf" )[ 0 ] : { item: {} };
    let superVisorModel = this.props.data ? this.getDataFromArr( "superVisorConf" ) : [];
    superVisorModel = superVisorModel.map( ( _item, index )=> {
      return that.props.deserialization( _item.item );
    } );
    if ( !Array.isArray( superVisorModel ) ) {
      superVisorModel = [ superVisorModel ];
    }
    this.state = {
      isEdit: this.props.isEdit,
      jiqunList: [ { zkConfigId: "0", resourceName: "请选择" } ],
      baseModel: this.props.deserialization( baseModel.item ),
      zkModel: this.props.deserialization( zkModel.item ),
      nimbusModel: this.props.deserialization( nimbusModel.item ),
      superVisorModel: superVisorModel
    };
  }

  /*设置配置item 的type*/
  getDataFromArr( dataType ) {
    if ( Array.isArray( this.props.data ) ) {
      return this.props.data.filter( ( item ) => {
        return item.type == dataType;
      } );
    }
    return [ {} ];
  }

  /*拼接全部的xml*/
  setStateToData( xmlDoc, parentNode ) {
    let baseModelXML = setModelXML( xmlDoc, "base", "base", "基本配置" );
    parentNode.appendChild( baseModelXML );
    baseModelXML.appendChild( setItemXML( xmlDoc, "资源名称", "resourceName", this.state.baseModel.resourceName ) );
    let zkModelXML = setModelXML( xmlDoc, "zkConf", "zkConf", "zk配置" );
    zkModelXML.appendChild( setItemXML( xmlDoc, "zkRoot", "zkRoot", this.state.zkModel.zkRoot ) );
    zkModelXML.appendChild( setItemXML( xmlDoc, "选择集群", "zkConfigId", this.state.zkModel.zkConfigId ) );
    parentNode.appendChild( zkModelXML );
    let nimbusModelXML = setModelXML( xmlDoc, "nimbusConf", "nimbusConf", "nimbus配置" );
    this.getTableDataToXmlStr( xmlDoc, nimbusModelXML, this.state.nimbusModel );
    parentNode.appendChild( nimbusModelXML );
    this.setItemToData( xmlDoc, parentNode );
  }

  /*拼接item的xml*/
  setItemToData( xmlDoc, parentNode ) {
    let that = this;
    let sourceArr = this.state.superVisorModel;
    sourceArr.map( ( data, index ) => {
      let tbModelXML = setModelXML( xmlDoc, `superVisorConf${index}`, "superVisorConf" );
      parentNode.appendChild( tbModelXML );
      that.getTableDataToXmlStr( xmlDoc, tbModelXML, data );
    } );
  }

  /*拼接table的item 成xml*/
  getTableDataToXmlStr( xmlDoc, parentNode, tableItem ) {
    for ( var key in tableItem ) {
      parentNode.appendChild( setItemXML( xmlDoc, "", key, tableItem[ key ] ) );
    }
  }

  /*基本信息修改后，设置到state中存储*/
  base_handleChange( dataField, e ) {
    this.setState( { baseModel: { ...this.state.baseModel, [dataField]: e.target.value } } );
  }

  /*zk信息修改后，设置到state中存储*/
  zkModel_handleChange( dataField, e ) {
    this.setState( { zkModel: { ...this.state.zkModel, [ dataField ]: e.target.value } } );
  }

  /*zk信息 集群修改后，设置到state中存储*/
  jiqun_handleChange( dataField, value, evt ) {
    this.refs.jiqunSelect.validate( value );
    this.setState( { zkModel: { ...this.state.zkModel, [dataField]: value } } );
  }

  /*nimbus信息修改后，设置到state中存储*/
  nimbusModel_handleChange( dataField, e ) {
    this.setState( { nimbusModel: { ...this.state.nimbusModel, [ dataField ]: e.target.value } } );
  }

  /*storm信息修改后，设置到state中存储*/
  stormModel_handleChange( listOwnField, dataField, item, e ) {
    item[ dataField ] = e.target.value;
    this.setState( { [listOwnField]: this.state[ listOwnField ] } );
  }

  /*保存验证调用*/
  validate() {

    let successFlag;
    let baseSuccess = this.refs.stormForm_base.validate( this.state.baseModel );
    let zkSuccess = this.refs.stormForm_zk.validate( this.state.zkModel );
    let nimbusSuccess = this.refs.stormForm_nimbus.validate( this.state.nimbusModel );
    let tableSuccess = this.refs.stormTable.validate();
    if ( baseSuccess && zkSuccess && nimbusSuccess && tableSuccess ) {    //验证通过
      successFlag = true;
    } else {              //验证失败
      successFlag = false;
    }
    return successFlag;
  }

  /*设置table 单元格的render*/
  getInput( dataField, item, label ) {
    let that = this;
    let itemValue = item ? item[ dataField ] : "";
    let itemView;
    let isLook = this.props.isLook;
    let strict = RestrictConst.NUM_STRING_POINT_UNDERLINE;
    if ( dataField == "superLocal" ) {
      itemView = <RestrictInput
        className="form-control common-form-input"
        type="text" disabled={isLook} restrict={strict}
        value={itemValue}
        onChange={that.stormModel_handleChange.bind(that,"superVisorModel",dataField,item)}/>;
    } else {
      itemView = <input
        className="form-control common-form-input"
        type="text" value={itemValue} disabled={isLook}
        onChange={that.stormModel_handleChange.bind(that,"superVisorModel",dataField,item)}/>;
    }
    return (itemView);
  }

  /*获取zookeeper集群list*/
  componentDidMount() {
    AjaxReq.getJiqun( ( data ) => {
      if ( !Array.isArray( data.data ) ) {
        data.data = [ data.data ];
      }
      let jqList = [ { id: 0, resourceName: "请选择" } ];
      jqList = jqList.concat( data.data );
      if ( !this.state.zkModel.zkConfigId ) {
        this.state.zkModel.zkConfigId = 0;
      }
      this.setState( { jiqunList: jqList, zkModel: { ...this.state.zkModel } } );
    } );
  }

  /*删除*/
  delClick( item ) {
    let rowIndex = this.state.superVisorModel.indexOf( item );
    var arr = this.state.superVisorModel;
    if ( arr && arr.length > 1 ) {
      arr.splice( rowIndex, 1 );
    }
    this.setState( { superVisorModel: arr } );
  }

  /*渲染组件*/
  render() {
    let that = this;
    let isLook = this.props.isLook;
    let stromList = { totalList: this.state.superVisorModel };
    let stromListColumn = [ {
      title: "IP/主机名", key: "superLocal",
      toolTip: "只能输入字母、数字、点、下划线、中划线，长度小于128个字符", maxLen: 128, isRequired: true, render( text, item ){
        return (that.getInput( "superLocal", item, item.title ));
      }
    }, {
      title: "安装目录", key: "installPath", toolTip: "长度小于128个字符", maxLen: 128,
      isRequired: true, render( text, item ){
        return (that.getInput( "installPath", item, item.title ));
      }
    }, {
      title: "操作", key: "operation", render( item, record ){
        return (
          <AuthButton
            renderType="a"
            disabled={isLook}
            onClick={that.delClick.bind(that,item)}
            title="删除">删除</AuthButton>);
      }
    } ];
    return (<div style={{marginLeft:"15px",marginRight:"15px"}}>
        <Form className="resourcemanage-edit-form" ref="stormForm_base" rules={this.baseRules} labelWidth={150}>
          <div className="row">
            <FormItem required label="资源名称" name="resourceName">
              <RestrictInput className="form-control common-form-input" type="text"
                             restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE}
                             value={that.state.baseModel.resourceName} disabled={isLook}
                             tipString="只能输入中文、字母、数字、下划线，长度小于64个字符"
                             onChange={that.base_handleChange.bind(that,'resourceName')}/>
            </FormItem>
          </div>
        </Form>
        <Form className="resourcemanage-edit-form" ref="stormForm_zk" rules={this.zkRules} labelWidth={150}>
          <div className="hr">zk配置</div>
          <div className="row">
            <FormItem required label="zkRoot" name="zkRoot">
              <RestrictInput className="form-control common-form-input" type="text" disabled={isLook}
                             value={that.state.zkModel.zkRoot} restrict={/^[^\u4E00-\u9FA5]+$/g}
                             tipString="长度小于64个字符" onChange={that.zkModel_handleChange.bind(that,'zkRoot')}/>
            </FormItem>
          </div>
          <div className="row" style={{marginTop:'20px'}}>
            <FormItem ref="jiqunSelect" required label="选择集群" name="zkConfigId">
              <Select value={parseInt(that.state.zkModel.zkConfigId)} style={{width:"405px"}} disabled={isLook}
                      onChange={that.jiqun_handleChange.bind(that, 'zkConfigId')}>
                {this.state.jiqunList.map((item,index)=>{
                  return (<Option key={item.id+index} value={item.id}>{item.resourceName}</Option>);
                  })}
              </Select>
            </FormItem>
          </div>
        </Form>
        <Form className="resourcemanage-edit-form" ref="stormForm_nimbus" rules={this.nimbusRules} labelWidth={150}>
          <div className="hr">nimbus配置</div>
          <div className="row">
            <FormItem required label="IP/主机名" name="nimbusLocal">
              <RestrictInput className="form-control common-form-input" type="text" disabled={isLook}
                             value={that.state.nimbusModel.nimbusLocal}
                             restrict={RestrictConst.NUM_STRING_POINT_UNDERLINE}
                             tipString="只能输入字母、数字、点、下划线、中划线，长度小于128个字符"
                             onChange={that.nimbusModel_handleChange.bind(that,"nimbusLocal")}/>
            </FormItem>
          </div>
          <div className="row" style={{marginTop:'20px'}}>
            <FormItem required label="thrift port" name="thriPort">
              <RestrictInput className="form-control common-form-input" type="text" disabled={isLook}
                             value={that.state.nimbusModel.thriPort} restrict={/^[^\u4E00-\u9FA5]+$/g}
                             tipString="长度小于64个字符"
                             onChange={that.nimbusModel_handleChange.bind(that,'thriPort')}/>
            </FormItem>
          </div>
          <div className="row" style={{marginTop:'20px'}}>
            <FormItem required label="安装目录" name="installPath">
              <RestrictInput className="form-control common-form-input" type="text"
                             value={that.state.nimbusModel.installPath} disabled={isLook}
                             tipString="长度小于128个字符"
                             onChange={that.nimbusModel_handleChange.bind(that,'installPath')}/>
            </FormItem>
          </div>
        </Form>
        <div className="hr">supervisor配置</div>
        <div>
          <AddRowTable ref="stormTable" data={stromList} isCanAdd={isLook} column={stromListColumn}
                       notRequire={isLook}></AddRowTable>
        </div>
      </div>
    );
  }
}
export default StormForm
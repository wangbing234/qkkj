import React from "react"
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import {AddRowTable,BfdRequest,BaseValidate,RestrictInput,RestrictConst} from 'CommonComponent'
import AuthButton from 'CommonComponent/component/authbutton'
import {setItemXML,setModelXML} from '../../util/ResourceXmlUtil'

let isInit;
class KafkaForm extends React.Component {
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
    let baseModel = this.props.data ? this.getDataFromArr( "base" )[ 0 ] : { item: {} };
    let zkModel = this.props.data ? this.getDataFromArr( "zkConf" )[ 0 ] : { item: {} };
    let kafkaModel = this.props.data ? this.getDataFromArr( "kafkaConf" ) : [];
    kafkaModel = kafkaModel.map( ( _item, index )=> {
      return that.props.deserialization( _item.item );
    } );
    if ( !Array.isArray( kafkaModel ) ) {
      kafkaModel = [ kafkaModel ];
    }
    this.state = {
      isEdit: this.props.isEdit,
      validateState: false,
      jiqunList: [],
      baseModel: this.props.deserialization( baseModel.item ),
      zkModel: this.props.deserialization( zkModel.item ),
      kafkaModel: kafkaModel
    };
    console.log( "kafka data : ", this.state );
  }

  getDataFromArr( dataType ) {
    if ( Array.isArray( this.props.data ) ) {
      return this.props.data.filter( ( item ) => {
        return item.type == dataType;
      } );
    }
    return [ {} ];
  }

  base_handleChange( dataField, e ) {
    this.setState( { baseModel: { ...this.state.baseModel, [dataField]: e.target.value } } );
  }

  zkModel_handleChange( dataField, e ) {
    this.setState( { zkModel: { ...this.state.zkModel, [ dataField ]: e.target.value } } );
  }

  jiqun_handleChange( dataField, value ) {
    this.refs.jiqunSelect.validate( value );
    this.setState( { zkModel: { ...this.state.zkModel, [dataField]: value } } );
  }

  kafkaModel_handleChange( listOwnField, dataField, item, e ) {
    item[ dataField ] = e.target.value;
    this.setState( { [listOwnField]: this.state[ listOwnField ] } );
  }

  validate() {
    let successFlag;
    let baseSuccess = this.refs.stormForm_base.validate( this.state.baseModel );
    let zkSuccess = this.refs.stormForm_zk.validate( this.state.zkModel );
    let tableSucess = this.refs.kafkaTable.validate();
    if ( baseSuccess && zkSuccess && tableSucess ) {    //验证通过
      successFlag = true;
    } else {              //验证失败
      successFlag = false;
    }
    return successFlag;
  }

  delClick( item ) {
    let rowIndex = this.state.kafkaModel.indexOf( item );
    var arr = this.state.kafkaModel;
    if ( arr && arr.length > 1 ) {
      arr.splice( rowIndex, 1 );
    }
    this.setState( { kafkaModel: arr } );
  }

  getInput( dataField, item, label ) {
    let that = this;
    let itemValue = item ? item[ dataField ] : "";
    let itemView = null;
    let isLook = this.props.isLook;
    let strict;
    if ( [ "kafkaLocal", "confFileName", "kafkaPort" ].indexOf( dataField ) != -1 ) {
      strict = RestrictConst.NUM_STRING_POINT_UNDERLINE;
      if ( dataField == "kafkaPort" ) {
        strict = RestrictConst.NUM_PORT;
      }

    }
    itemView = <RestrictInput
      disabled={isLook}
      className="form-control"
      type="text" value={itemValue}
      restrict={strict}
      onChange={that.kafkaModel_handleChange.bind(that,"kafkaModel",dataField,item)}/>;
    return itemView;
  }

  componentDidMount() {
    let that = this;
    var typeUrl = Server.configCenter + "configCenterApi/getResourceConfigList/zookeeper";
    BfdRequest.ajaxGet( typeUrl, ( data ) => {
      if ( !Array.isArray( data.data ) ) {
        data.data = [ data.data ];
      }
      let jqList = [ { id: 0, resourceName: "请选择" } ];
      jqList = jqList.concat( data.data );
      if ( !this.state.zkModel.zkConfigId ) {
        this.state.zkModel.zkConfigId = 0;
      }
      this.setState( { jiqunList: jqList, zkModel: { ...this.state.zkModel } } );
    } )
  }

  setStateToData( xmlDoc, parentNode ) {
    let baseModelXML = setModelXML( xmlDoc, "base", "base", "基本配置" );
    parentNode.appendChild( baseModelXML );
    baseModelXML.appendChild( setItemXML( xmlDoc, "资源名称", "resourceName", this.state.baseModel.resourceName ) );
    let zkModelXML = setModelXML( xmlDoc, "zkConf", "zkConf", "zk配置" );
    zkModelXML.appendChild( setItemXML( xmlDoc, "zkRoot", "zkRoot", this.state.zkModel.zkRoot ) );
    zkModelXML.appendChild( setItemXML( xmlDoc, "选择集群", "zkConfigId", this.state.zkModel.zkConfigId ) );
    parentNode.appendChild( zkModelXML );
    this.setItemToData( xmlDoc, parentNode );
  }

  setItemToData( xmlDoc, parentNode ) {
    let that = this;
    let sourceArr = this.state.kafkaModel;
    sourceArr.map( ( data, index ) => {
      let tbModelXML = setModelXML( xmlDoc, `kafkaConf${index}`, "kafkaConf" );
      parentNode.appendChild( tbModelXML );
      that.getTableDataToXmlStr( xmlDoc, tbModelXML, data );
    } );
  }

  getTableDataToXmlStr( xmlDoc, parentNode, tableItem ) {
    for ( var key in tableItem ) {
      parentNode.appendChild( setItemXML( xmlDoc, "", key, tableItem[ key ] ) );
    }
  }

  render() {
    let that = this;
    let isLook = this.props.isLook;
    //tableIsSuccess = true;
    let kafaList = { totalList: this.state.kafkaModel };
    let kafkaListColumn = [ {
      title: "IP/主机名", key: "kafkaLocal",
      toolTip: "只能输入字母、数字、点、下划线、中划线，长度小于128个字符",
      maxLen: 128,
      isRequired: true,
      width: '130px',
      render( text, item ){
        return (that.getInput( "kafkaLocal", item, item.title ));
      }
    }, {
      title: "配置文件名称",
      key: "confFileName",
      toolTip: "只能输入字母、数字、点、下划线，长度小于128个字符",
      maxLen: 128,
      isRequired: true,
      width: '200px',
      render( text, item ){
        return (that.getInput( "confFileName", item, item.title ));
      }
    }, {
      title: "端口",
      key: "kafkaPort",
      toolTip: "只能输入数字，长度小于5个字符",
      isRequired: true,
      width: '100px',
      render( text, item ){
        return (that.getInput( "kafkaPort", item, item.title ));
      }
    }, {
      title: "安装目录",
      key: "installPath",
      maxLen: 128,
      isRequired: true,
      width: '200px',
      render( text, item ){
        return (that.getInput( "installPath", item, item.title ));
      }
    }, {
      title: "操作",
      key: "operation",
      width: '50px',
      render( item, record ){
        return (
          <AuthButton
            renderType="a"
            disabled={isLook}
            onClick={that.delClick.bind(that,item)}
            title="删除">删除</AuthButton>
          );
      }
    } ];
    return (
      <div style={{marginLeft:"15px",marginRight:"15px"}}>
        <Form className="resourcemanage-edit-form"
              ref="stormForm_base" rules={this.baseRules} labelWidth={150}>
          <div className="row">
            <FormItem required label="资源名称" name="resourceName">
              <RestrictInput
                disabled={isLook} className="form-control common-form-input" type="text"
                tipString="只能输入中文、字母、数字、下划线，长度小于64个字符"
                value={that.state.baseModel.resourceName} restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE}
                onChange={that.base_handleChange.bind(that,'resourceName')}/>
            </FormItem>
          </div>
        </Form>
        <Form className="resourcemanage-edit-form" ref="stormForm_zk" rules={this.zkRules} labelWidth={150}>
          <div className="hr">zk配置</div>
          <div className="row">
            <FormItem required label="zkRoot" name="zkRoot">
              <RestrictInput disabled={isLook} className="form-control common-form-input" type="text"
                             value={that.state.zkModel.zkRoot} tipString="长度小于64个字符" restrict={/^[^\u4E00-\u9FA5]+$/g}
                             onChange={that.zkModel_handleChange.bind(that,'zkRoot')}/>
            </FormItem>
          </div>
          <div className="row" style={{marginTop:'20px'}}>
            <FormItem ref="jiqunSelect" required label="选择集群" name="zkConfigId">
              <Select disabled={isLook} value={parseInt(this.state.zkModel.zkConfigId)} style={{width:"405px"}}
                      onChange={that.jiqun_handleChange.bind(that, 'zkConfigId')}>
                {this.state.jiqunList.map((item,index)=>{
                  return (<Option key={item.resourceName+"0"+index} value={item.id}>{item.resourceName}</Option>);
                  })}
              </Select>
            </FormItem>
          </div>
        </Form>
        <div className="hr">kafka配置</div>
        <div>
          <AddRowTable
            ref="kafkaTable"
            data={kafaList}
            column={kafkaListColumn}
            isCanAdd={isLook}
            notRequire={isLook}></AddRowTable>
        </div>

      </div>
    );
  }
}
export default KafkaForm
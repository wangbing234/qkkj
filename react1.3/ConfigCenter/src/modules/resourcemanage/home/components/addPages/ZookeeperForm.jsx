import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import {AddRowTable,BfdRequest,RestrictInput,RestrictConst,BaseValidate} from 'CommonComponent'
import AuthButton from 'CommonComponent/component/authbutton'
import {setItemXML,setModelXML} from '../../util/ResourceXmlUtil'

class ZookeeperForm extends React.Component {
  constructor( props ) {
    super( props );
    let that = this;
    this.baseRules = {
      resourceName: value => {
        return BaseValidate.validateInput( { isRequired: true, label: "资源名称", value: value, maxLength: 64 } );
      }
    };
    /*xml数据解析成object,并设置到state中*/
    let baseModel = this.props.data ? this.getDataFromArr( "base" )[ 0 ] : { item: {} };
    let zkModel = this.props.data ? this.getDataFromArr( "zkConfDetail" ) : [];
    zkModel = zkModel.map( ( _item, index )=> {
      return that.props.deserialization( _item.item );
    } );
    if ( !Array.isArray( zkModel ) ) {
      zkModel = [ zkModel ];
    }
    this.state = {
      validateState: false,
      baseModel: this.props.deserialization( baseModel.item ),
      zkModel: zkModel,
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
    this.setItemToData( xmlDoc, parentNode );
  }

  /*拼接item的xml*/
  setItemToData( xmlDoc, parentNode ) {
    let that = this;
    let sourceArr = this.state.zkModel;
    sourceArr.map( ( data, index ) => {
      let tbModelXML = setModelXML( xmlDoc, `zkConfDetail${index}`, "zkConfDetail" );
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

  /*基本配置输入修改后，将数据存入state中*/
  base_handleChange( dataField, e ) {
    this.setState( { baseModel: { ...this.state.baseModel, [dataField]: e.target.value }, validateState: false } );
  }

  /*zk配置输入修改后，将数据存入state中*/
  zkModel_handleChange( dataField, index, e ) {
    this.state.zkModel[ index ][ dataField ] = e.target.value;
    this.setState( { zkModel: this.state.zkModel, validateState: false } );
  }

  validate() {
    let successFlag;
    let baseSuccess = this.refs.stormForm_base.validate( this.state.baseModel );
    let tableSuccess = this.refs.zookeeperTable.validate();
    if ( baseSuccess && tableSuccess ) {    //验证通过
      successFlag = true;
    } else {              //验证失败
      successFlag = false;
    }
    return successFlag;
  }

  /*删除处理*/
  delClick( item ) {
    let rowIndex = this.state.zkModel.indexOf( item );
    var arr = this.state.zkModel;
    if ( arr && arr.length > 1 ) {
      arr.splice( rowIndex, 1 );
    }
    this.setState( { zkModel: arr } );
  }

  /*table单元格render*/
  getInput( dataField, item, label ) {
    let that = this;
    let rowIndex = this.state.zkModel.indexOf( item );
    let itemValue = item ? item[ dataField ] : "";
    let isLook = this.props.isLook;
    let restrict;
    if ( dataField == "host" ) {
      restrict = RestrictConst.NUM_STRING_POINT_UNDERLINE;
    } else if ( dataField == "port" ) {
      restrict = RestrictConst.NUM_PORT;
    }
    return (
      <RestrictInput
        className="form-control" type="text"
        restrict={restrict} value={itemValue} disabled={isLook}
        onChange={that.zkModel_handleChange.bind(that,dataField,rowIndex)}/>
    );
  }

  /*组件渲染*/
  render() {
    let that = this;
    let isLook = this.props.isLook;
    let zookeeperList = { totalList: this.state.zkModel };
    let zookeeperListColumn = [ {
      title: "IP/主机名", key: "host",
      toolTip: "只能输入字母、数字、点、下划线、中划线，长度小于128个字符", maxLen: 128, isRequired: true, render( text, item ){
        return (that.getInput( "host", item, item.title ));
      }
    }, {
      title: "端口", key: "port", toolTip: "只能输入数字，长度小于5个字符", maxLen: 5,
      isRequired: true, render( text, item ){
        return (that.getInput( "port", item, item.title ));
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
            title="删除">删除</AuthButton>
        );
      }
    } ];
    return (<Form
      className="resourcemanage-edit-form"
      style={{marginLeft:"15px",marginRight:"15px"}}
      ref="stormForm_base" rules={this.baseRules} labelWidth={150}>
      <div className="row">
        <FormItem required label="资源名称" name="resourceName">
          <RestrictInput className="form-control common-form-input" type="text"
                         value={that.state.baseModel.resourceName} disabled={isLook}
                         restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE}
                         tipString="只能输入中文、字母、数字、下划线，长度小于64个字符"
                         onChange={that.base_handleChange.bind(that,'resourceName')}/>
        </FormItem>
      </div>

      <div className="hr">集群配置</div>
      <div>
        <AddRowTable ref="zookeeperTable" data={zookeeperList} column={zookeeperListColumn} isCanAdd={isLook}
                     notRequire={isLook}></AddRowTable>
      </div>
    </Form>);
  }
}
export default ZookeeperForm
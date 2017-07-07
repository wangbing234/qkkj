/****************************************************
 * create by qing.feng
 * time 2016/7/21 11:23
 * desc：项目配置-业务配置
 *****************************************************/
import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import {Select,Option} from 'bfd-ui/lib/Select2'
import confirm from 'bfd-ui/lib/confirm'
import { MultipleSelect } from 'bfd-ui/lib/MultipleSelect'

import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'
import AddRowTable from 'CommonComponent/component/addrowtable'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import TableSelect from 'CommonComponent/component/tableselect'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import message from 'CommonComponent/component/bdosmessage'
import AuthButton from 'CommonComponent/component/authbutton'
import TableMultipleSelect from 'CommonComponent/component/tablemultipleselect'
import AjaxReq from '../../ajax/AjaxReq'

import DomainConfig from './DomainConfig'

class ServiceConfig extends React.Component {
  constructor( props ) {
    super( props );
    this.hiveDbList = [];
    this.hbaseList = [];
    this.selectKey = 1;
    this.domainCurrentPage = 1;
    this.pageSize = 100;
    this.state = {};
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getLevelList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*保存层级处理，先进行表格验证，通过后保存数据到后台*/
  saveHandle() {
    let isSuccess = this.refs.levelTable.validate();
    if ( isSuccess ) {
      let lvList = this.state.levelList.totalList;
      let that = this;
      let isRepeat = false;
      lvList.map( ( item ) => {
        if ( item[ "dbHiveName" ] && that.checkDataBase( "dbHiveName" ) ) {
          message.danger( "一个Hive库只能被一个层级使用" );
          isRepeat = true;
          return;
        }
        if ( item[ "dbHbaseName" ] && that.checkDataBase( "dbHbaseName" ) ) {
          message.danger( "一个HBase库只能被一个层级使用" );
          isRepeat = true;
          return;
        }
        if ( !item.projectCode ) {
          item.projectCode = window.projectCode;
        }
      } );
      if ( isRepeat ) {
        return;
      }
      let listStr = JSON.stringify( lvList );
      AjaxReq.saveLevel( { saveList: listStr }, ( data ) => {
        message.success( "保存成功" );
        that.getLevelList();
      } );
    }
  }

  /*校验数据库是否选择重复*/
  checkDataBase( dataField ) {
    let count = 0;
    let isRepeat = false;
    let lvList = this.state.levelList.totalList;
    let itemArr;
    let comparedArr;
    let resultArr;
    for ( let i = 0; i < lvList.length; i++ ) {
      itemArr = lvList[ i ][ dataField ] && lvList[ i ][ dataField ].split( "," );
      if ( !itemArr || (itemArr && !itemArr.length) ) continue;
      itemArr.map( ( _item ) => {
        for ( let j = i + 1; j < lvList.length; j++ ) {
          comparedArr = lvList[ j ][ dataField ] && lvList[ j ][ dataField ].split( "," );
          if ( !comparedArr || (comparedArr && !comparedArr.length) ) continue;
          resultArr = comparedArr.filter( ( citem ) => {
            return citem == _item
          } );
          if ( resultArr && resultArr.length ) {
            isRepeat = true;
            return;
          }
        }
      } );
    }
    return isRepeat;
  }

  /*表格render中input/select change 事件处理，将数据写入state*/
  itemChangeHandle( isSelect, item, dataField, evt ) {
    if ( isSelect ) {
      item[ dataField ] = evt.join( "," );
    } else {
      item[ dataField ] = evt.target.value;
    }
    this.setState( { ...this.state } );
  }


  /*删除层级处理*/
  deleteLevel( item ) {
    let that = this;
    /*默认层级不允许删除*/
    if ( item.type == 0 ) {
      return;
    }
    confirm( '确认删除吗', () => {
      if ( item.id ) {
        that.deleteLevelReq( item );
      } else {
        that.deleteItem( item );
        that.setState( { ...that.state } );
      }
    } )

  }

  /*删除层级请求*/
  deleteLevelReq( item ) {
    let that = this;
    AjaxReq.deleteLevel( { id: item.id }, () => {
      message.success( "删除成功" );
      that.deleteItem( item );
      that.setState( { ...that.state } );
    } );
  }

  /*从数组中删除匹配项*/
  deleteItem( item ) {
    let levelList = this.state.levelList.totalList;
    levelList.map( ( levelItem, index ) => {
      if ( levelItem === item ) {
        levelList.splice( index, 1 );
      }
    } );
  }

  /*上移处理*/
  goUp( item, isDisabled ) {
    //if(!isDisabled){
    let levelList = this.state.levelList.totalList;
    this.state.levelList.totalList = CommonUtil.upRecord( levelList, item );
    this.setState( { ...this.state } );
  }

  /*下移处理*/
  goDown( item, isDisabled ) {
    //if(!isDisabled) {
    let levelList = this.state.levelList.totalList;
    this.state.levelList.totalList = CommonUtil.downRecord( levelList, item );
    this.setState( { ...this.state } );
    //}
  }

  /*配置主题域处理*/
  configDomainClick( item, isDisabled ) {
    //获取层级下面的主题域，并弹出主题域配置窗口
    if ( !isDisabled ) {
      let that = this;
      AjaxReq.getDomainList( { hierarchyCode: item.code }, ( data ) => {
        let _data = data.data;
        if ( !(_data.totalList && _data.totalList.length) ) {
          _data = { totalList: [ {} ] };
        }
        that.refs.domainConfig.setState( {
          domainList: _data,
          levelCode: item.code
        } );
        that.refs.domainConfig.open();
      } );
    }
  }

  /*主题域-表格-页码更改处理*/
  onDomainPageChange( page ) {
    this.domainCurrentPage = page;
    this.getDomainList();
  }

  /*获取主题域表格数据*/
  getDomainList() {
    let that = this;
    AjaxReq.getDomainPageList( {
      projectCode: window.projectCode,
      pageSize: this.pageSize,
      pageNo: this.domainCurrentPage
    }, ( data ) => {
      that.setState( { domainList: data.data } );
    } );
  }


  /*获取层级表格数据*/
  getLevelList() {
    let that = this;
    AjaxReq.getLevelList( { projectCode: window.projectCode }, ( data ) => {
      if ( that.loadInterval ) {
        that.setState( { levelList: data.data } );
        that.selectKey = 1;
        that.getHiveList();
        that.getDomainList();
      }

    } );
  }

  /*获取hive库列表数据*/
  getHiveList() {
    let that = this;
    AjaxReq.getHiveList( {}, ( data ) => {
      if ( that.loadInterval ) {
        that.hiveDbList = data.data;
        that.getHbaseSourceList();
        that.setState( { ...that.state } );
      }
    } );
  }

  /*获取hbase源列表*/
  getHbaseSourceList() {
    let that = this;
    AjaxReq.getHbaseSourceList( { typeName: "hbase" }, ( data ) => {
      data = data.data;
      if ( that.loadInterval ) {
        if ( data && data.length ) {
          that.getHbaseDataBaseList( data[ 0 ].id );
        }
      }
    } );
  }

  /*获取hbase库列表*/
  getHbaseDataBaseList( sourceId ) {
    let that = this;
    AjaxReq.getHbaseDatabaseList( { hbaseId: sourceId }, ( data ) => {
      if ( that.loadInterval ) {
        that.hbaseList = data.data;
        that.setState( { ...that.state } );
      }
    } );
  }

  /*层级表格-列设置*/
  getLevelColumn() {
    let that = this;
    return [
      {
        title: '表层级',
        key: 'name',
        maxLen: 64,
        isRequired: true,
        render( text, item ){
          return (
            <RestrictInput
              className="form-control input-width"
              value={text}
              onChange={that.itemChangeHandle.bind(that,false,item,'name')}
            />);
        }
      },
      {
        title: '描述',
        key: 'comment',
        maxLen: 64,
        render( text, item ){
          return (
            <RestrictInput
              className="form-control input-width"
              value={text}
              onChange={that.itemChangeHandle.bind(that,false,item,'comment')}
            />);
        }
      },
      {
        title: 'Hive库',
        key: 'dbHiveName',
        isRequired: true,
        render( text, item ){
          let textArr = text && text.split( "," );
          textArr = textArr ? textArr : []
          that.selectKey++;//上移，下移时，组件key一样的时候不会重新渲染
          console.log( that.selectKey )
          return (
            <TableMultipleSelect
              key={that.selectKey}
              defaultValues={textArr}
              value={textArr}
              onChange={that.itemChangeHandle.bind(that,true,item,'dbHiveName')}
              optionList={that.hiveDbList}
            />
          );
          /*return (
           <RestrictInput
           className="form-control input-width"
           value={text}
           retrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
           onChange={that.itemChangeHandle.bind(that,false,item,'dbHiveName')}
           />
           );*/
        }
      },
      {
        title: 'HBase',
        key: 'dbHbaseName',
        render( text, item ){
          let hbaseArr = text && text.split( "," );
          hbaseArr = hbaseArr ? hbaseArr : [];
          that.selectKey++;
          return (
            <TableMultipleSelect
              defaultValues={hbaseArr}
              value={hbaseArr}
              key={that.selectKey}
              onChange={that.itemChangeHandle.bind(that,true,item,'dbHbaseName')}
              optionList={that.hbaseList}
            />);
          /*return (
           <RestrictInput
           className="form-control input-width"
           value={text}
           retrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
           onChange={that.itemChangeHandle.bind(that,false,item,'dbHbaseName')}
           />
           );*/
        }
      },
      {
        title: '表命名前缀',
        key: 'tablePref',
        width: "100px",
        //可修改
        render( text, item ){
          return <RestrictInput
            className="form-control input-width"
            value={text}
            restrict={RestrictConst.NUM_STRING_UNDERLINE_10}
            onChange={that.itemChangeHandle.bind(that,false,item,'tablePref')}
          />;
        }
      },
      {
        title: '操作',
        key: 'operation',
        width: '200px',
        render( record ){
          let lvList = that.state.levelList.totalList;
          let deleteEnabled = record.type == 0 ? true : false;//0不可以删除，1可以删除
          let upDisabled = (lvList[ 0 ] === record) ? true : false;
          let downDisabled = lvList[ lvList.length - 1 ] === record ? true : false;
          let canConfigDomain = record.id ? false : true;
          return (
            <div className="operation-td-div">
              <AuthButton
                data-code="1022104"
                renderType="a" disabled={deleteEnabled}
                onClick={that.deleteLevel.bind(that,record)} title="删除">删除
              </AuthButton>
              <AuthButton
                data-code="1022105"
                renderType="a"
                disabled={upDisabled}
                onClick={that.goUp.bind(that,record)} title="上移">上移</AuthButton>
              <AuthButton
                data-code="1022106"
                renderType="a"
                disabled={downDisabled}
                onClick={that.goDown.bind(that,record)} title="下移">下移</AuthButton>
              <AuthButton
                data-code="1022107"
                renderType="a" disabled={canConfigDomain}
                onClick={that.configDomainClick.bind(that,record,canConfigDomain)} title="配置主题域">配置主题域</AuthButton>
            </div>
          );
        }
      } ];
  }

  /*主题域表格-列设置*/
  getDomainColumn() {
    return [
      { title: '层级', key: 'hierarchyName' },
      { title: '主题域', key: 'name' },
      { title: '描述', key: 'comment' }
    ];
  }

  render() {
    let levelColumn = this.getLevelColumn();
    let domainColumn = this.getDomainColumn();
    return (
      <div className="service-config">
        <FormCategory>
          <FormCategoryItem name="表层级配置">
            <div
              className="bdos-edit-table"
              style={{marginLeft:"-100px",marginTop:"30px",marginBottom:"30px"}}>
              <AddRowTable
                ref="levelTable"
                data={this.state.levelList}
                column={levelColumn}
                howRow={this.pageSize} notRequire={true}/>

              <AuthButton
                type="button"
                className="btn btn-sm btn-primary"
                data-code="1022101"
                style={{marginLeft:"84px",marginTop:"-47px"}}
                onClick={this.saveHandle.bind(this)}>保存
              </AuthButton>
            </div>
          </FormCategoryItem>
          <FormCategoryItem name="主题域配置">
            <div className="bdos-table"
                 style={{marginLeft:"-100px",width:"700px",marginTop:"30px",marginBottom:"30px"}}>
              <DataTable
                data={this.state.domainList}
                column={domainColumn}
                howRow={this.pageSize}/>
            </div>
          </FormCategoryItem>
        </FormCategory>

        <DomainConfig ref="domainConfig" refreshList={this.getDomainList.bind(this)}/>
      </div>
    );
  }
}
export default ServiceConfig;
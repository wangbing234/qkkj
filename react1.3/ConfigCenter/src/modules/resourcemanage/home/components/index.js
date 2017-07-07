import React from 'react'

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'

import AddConfig from './addPages/AddConfigForm'
import ResourceInfo from './ResourceInfo'
import ListForm from './ListForm'
import AjaxReq from '../ajax/AjaxReq';

const LISTVIEW = "listView";//列表界面
const INFOVIEW = "infoView";//编辑/新增界面

import BreadCrumb from 'CommonComponent/component/breadcrumb'
let typeList = [ { name: "全部", id: 0 } ];//资源类型数组
let that;//当前类的副本
let addTypeList = [ { name: "请选择", id: 0 } ];//添加资源时过滤后的数组

class ResourceManage extends React.Component {
  constructor( prop ) {
    super( prop );
    this.state = { viewType: LISTVIEW, titleStr: '资源管理' };

    that = this;
  }

  /*实例化完成先获取当前用户名，成功在去获取资源类型等*/
  componentDidMount() {
    this.loadInterval = setInterval( AjaxReq.getUserName( ( data ) => {
      window.userName = data.data;
      that.getResourceTypes();
    } ), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取资源类型*/
  getResourceTypes() {
    AjaxReq.getResourceTypes( ( data ) => {
      typeList = [ { name: "全部", id: 0 } ];
      typeList = typeList.concat( data.data );
      if ( that.loadInterval ) {
        that.getSubTypes();
        that.setState( {} );
      }
    } );
  }

  getSubTypes(){
    AjaxReq.getSubTypes((data) => {
      addTypeList = data.data;
    });
  }

  /*切换到新增/编辑界面*/
  openHandler( formData, isEdit ) {
    that.setState( {
      viewType: INFOVIEW,
      formData: formData.formData,
      resourceId: formData.resourceId,
      createUser: formData.createUser,
      isLook: formData.isLook,
      isEdit: isEdit
    } );
  }

  /*关闭信息界面后切换到列表界面*/
  closeInfoView( isLookClose ) {
    this.setState( { viewType: LISTVIEW } );
    if ( this.refs.listForm && !isLookClose ) {
      this.refs.listForm.getListByUrl();
    }
  }

  /*资源名称输入框change后，将值写入state*/
  changeHandle( keyField, e ) {
    this.setState( { [keyField]: e.target.value } );
  }

  /*渲染界面*/
  render() {
    that = this;
    let view;
    switch ( this.state.viewType ) {
      case LISTVIEW://列表界面的渲染
        view = <ListForm
          ref="listForm" openHandler={this.openHandler.bind(this)} typeList={typeList}
          canNotRefresh={this.state.isLook}/>
        break;
      case  INFOVIEW://新增/编辑界面的渲染
        view = <ResourceInfo
          data={this.state.formData} isEdit={this.state.isEdit} isLook={this.state.isLook}
          resourceId={this.state.resourceId} createUser={this.state.createUser}
          typeList={addTypeList} closeHandler={this.closeInfoView.bind(this,this.state.isLook)}/>
        break;
    }
    return (
      <div className="module-container">
        {view}
      </div>
    );
  }
}

export default ResourceManage
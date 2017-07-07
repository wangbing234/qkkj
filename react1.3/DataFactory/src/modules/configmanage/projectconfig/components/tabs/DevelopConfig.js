/****************************************************
 * create by qing.feng
 * time 2016/7/21 13:58
 * desc：项目配置-开发规范
 *****************************************************/
import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import FormFooter from 'CommonComponent/component/formfooter'
import message from 'CommonComponent/component/bdosmessage'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import AuthButton from 'CommonComponent/component/authbutton'
import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'

import AjaxReq from '../../ajax/AjaxReq'

class DevelopConfig extends React.Component {
  constructor( prop ) {
    super( prop )
    this.pageSize = 10;
    this.currentPage = 1;
    this.state = {
      modal: { template: '' }
    }
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getDevelopList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*脚本input change事件处理，将新值写入state*/
  handleChange( e ) {
    let _data = this.state.modal;
    _data.template = e.target.value;
    this.setState( {} )
  }

  /*保存脚本模板*/
  handleSave() {
    let that = this;
    AjaxReq.saveDevelopConfigInfo( this.state.modal, ( data )=> {
      message.success( "保存成功" );
      that.refs.modal.close();
    } );

  }

  /*关闭脚本编辑框*/
  handleCancel() {
    this.refs.modal.close();
  }

  /*打开编辑脚本弹出框*/
  edit( item ) {
    let that = this;
    AjaxReq.getDevelopConfigInfo( { id: item.id }, ( data ) => {
      console.log( data );
      data = data.data;
      that.setState( { modal: data } )
      that.refs.modal.open();
    } );

  }
  /*设置脚本模板列表-列*/
  getTableColumn() {
    let that = this;
    return [
      { title: '脚本类型', key: 'typeName' },
      {
        title: '操作',
        key: 'operation',
        render( item ){
          return (
            <AuthButton
              renderType="a"
              data-code="1022201"
              href="javascript:void(0);"
              onClick={that.edit.bind(that,item)}
              title="编辑">编辑</AuthButton>
          );
        }
      } ];
  }

  /*获取脚本模板列表数据*/
  getDevelopList() {
    let that = this;
    AjaxReq.getDevelopConfigList( { projectCode: window.projectCode }, ( data )=> {
      if ( that.loadInterval ) {
        data = data.data;
        that.setState( { data: data } );
      }
    } );
  }

  render() {
    let column = this.getTableColumn();
    return (
      <div className="develop-config module-table">
        <FormCategory>
          <FormCategoryItem name="脚本模板">
            <div className="bdos-table"
                 style={{width:"400px",marginLeft:"-100px",marginTop:"30px",marginBottom:"30px"}}>
              <DataTable
                column={column}
                data={this.state.data}
                howRow={this.pageSize}></DataTable>
            </div>
          </FormCategoryItem>
        </FormCategory>
        <Modal ref="modal">
          <ModalBody>
            <RestrictTextarea
              value={this.state.modal.template}
              onChange={this.handleChange.bind(this)} className="form-control"
              style={{height:"160px"}} rows="5">
            </RestrictTextarea>
            <FormFooter
              className="footer" btnStyle={{width:"70px",marginBottom:"20px"}}
              submitClick={this.handleSave.bind(this)} cancelClick={this.handleCancel.bind(this)}/>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default DevelopConfig;
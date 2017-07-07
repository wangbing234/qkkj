import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import FormFooter from 'CommonComponent/component/formfooter'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import message from 'CommonComponent/component/bdosmessage'

import AjaxReq from '../../../model/AjaxReq'

class ApplyAuthority extends React.Component {

  constructor( prop ) {
    super( prop );
    this.state = {
      readOnly: true,
      data: { totalList: [] }
    };
    this.rules = {
      data: value => {
        if ( !value.totalList || (value.totalList && !value.totalList.length) ) {
          return "申请内容不能为空！";
        }
      },
      readOnly: value => {
        return BaseValidate.validateInput( { isRequired: true, label: "权限", value: value } );
      },
      applyReason: value => {
        return BaseValidate.validateInput( { isRequired: false, label: "申请理由", value: value, maxLength: '255' } );
}
    }
  }

  handleChange( dataField, evt ) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState( { [dataField]: value } );
  }

  //submit按钮提交操作
  handleSubmit( e ) {
    let that = this;
    let isSuccess = this.refs.form.validate( this.state );
    if ( isSuccess ) {
      //调用保存方法
      AjaxReq.saveShareListApply( {
        ids: this.ids,
        applyReason: this.state.applyReason
      }, ( data ) => {
        //message.success( data.msg );
        message.success('申请成功');
        that.close();
        that.props.refreshList();
      } );
    }
    if ( e ) {
      e.preventDefault()
    }
  }

  open( data ) {
    this.ids = data.join( "," );
    this.setState( { replyReson: "", applyReason: "" } );
    this.getTablesList( this.ids );
    this.refs.modal.open();
  }

  close() {
    this.refs.modal.close();
  }

  getTablesList( ids ) {
    let that = this;
    AjaxReq.getShareListApply( {
      ids: ids
    }, ( data )=> {
      that.setState( { data: data.data } );
    } );
  }

  getColumns() {
    return [ {
      title: '表',
      key: 'tableName',
      render(text){
        return <TextOverflow>
          <p style={{width:'120px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
      title: '所属项目',
      key: 'projectCode',
      render(text){
        return <TextOverflow>
          <p style={{width:'80px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
      title: '租户',
      key: 'tableTenantName',
      render(text){
        return <TextOverflow>
          <p style={{width:'80px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
      title: '存储量',
      key: 'memory',
      render(text){
        return <TextOverflow>
          <p style={{width:'60px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
      title: '创建人',
      key: 'tableCreateUser',
      render(text){
        return <TextOverflow>
          <p style={{width:'80px'}}>{text}</p>
        </TextOverflow>
      }
    } ];
  }

  render() {
    let column = this.getColumns();
    return (<div className="apply-authority-modal">
      <Modal ref="modal">
        <ModalHeader>
          <h4>申请权限</h4>
        </ModalHeader>
        <ModalBody>
          <Form ref="form" rules={this.rules}>
            <FormItem label="申请内容" name="data">
              <div className="module-table"
                   style={{width:'550px',maxHeight:"400px"}}>
                <DataTable data={this.state.data} column={column} showPage="false" howRow={1000000000}/>
              </div>

            </FormItem>
            <FormItem label="权限" name="readOnly">
              <Checkbox onChange={this.handleChange.bind(this,'readOnly')} checked={this.state.readOnly}>只读</Checkbox>
            </FormItem>
            <FormItem label="申请理由" name="applyReason">
              <RestrictTextarea
                className="form-control common-textarea"
                style={{width:'550px'}}
                value={this.state.applyReason}
                onChange={this.handleChange.bind(this,"applyReason")}/>
            </FormItem>
          </Form>
          <FormFooter
            submitLabel="提交" style={{marginLeft:'100px'}}
            submitClick={this.handleSubmit.bind(this)}
            cancelClick={this.close.bind(this)}/>
        </ModalBody>

      </Modal>

    </div>)
  }
}

export default ApplyAuthority;

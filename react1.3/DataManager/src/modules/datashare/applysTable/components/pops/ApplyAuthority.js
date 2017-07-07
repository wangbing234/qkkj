import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import TextOverflow from 'bfd-ui/lib/TextOverflow'

import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'

import AjaxReq from '../../../model/AjaxReq'
class ApplyAuthority extends React.Component {

  constructor( prop ) {
    super( prop );
    this.state = {
      data: { totalList: [] }
    };
    this.rules = {}
  }

  handleChange( dataField, evt ) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState( { [dataField]: value } );
  }

  open( data ) {
    this.data = data;
    this.getList( data.id );
    this.refs.modal.open();
  }

  getList( pid ) {
    let that = this;
    AjaxReq.getApplyDetail( {
      ids: pid
    }, ( data ) => {
      data = data.data;
      let others = data.totalList && data.totalList.length>0?data.totalList[0]:{}
      that.setState( { data: data,...others } );
    } );
  }

  close() {
    this.refs.modal.close();
  }

  getColumns() {
    /*applyTime: "2016-01-21 16:58:14"
     applyUser: "User1"
     approvalTime: "2016-01-21 16:58:14"
     key: "1"
     memorySize: "0.5G"
     owner: "租户2"
     project: "Project_2"
     status: "0"
     table: "table1"*/
    return [ {
      title: '申请人',
      key: 'applyUser',
      render(text){
        return <TextOverflow>
          <p style={{width:'80px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
      title: '所属租户',
      key: 'tableTenantName',
      render(text){
        return <TextOverflow>
          <p style={{width:'80px'}}>{text}</p>
        </TextOverflow>
      }
    }, {
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
      title: '存储量',
      key: 'memory',
      render(text){
        return <TextOverflow>
          <p style={{width:'60px'}}>{text}</p>
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
            <FormItem label="申请内容" name="applyContent">
              <div className="module-table" style={{width:'550px'}}>
                <DataTable data={this.state.data} column={column} showPage="false"/>
              </div>
            </FormItem>
            <FormItem label="权限" name="readOnly">
              <Checkbox
                onChange={this.handleChange.bind(this,'readOnly')}
                checked={true}
                disabled={true}
              >只读</Checkbox>
            </FormItem>
            <FormItem label="申请理由" name="applyReson">
              <RestrictTextarea
                className="form-control common-textarea"
                readOnly={true}
                style={{width:'550px'}}
                value={this.state.applyReson}
                onChange={this.handleChange.bind(this,"applyReson")}/>
            </FormItem>
            <FormItem label="批复" name="replyReson">
              <RestrictTextarea className="form-control common-textarea"
                                readOnly={true}
                                style={{width:'550px'}}
                                value={this.state.replyReson}
                                onChange={this.handleChange.bind(this,"replyReson")}/>
            </FormItem>
          </Form>
          <div style={{marginLeft:'100px'}}>
            <button className="btn btn-sm btn-primary" onClick={this.close.bind(this)}>关闭</button>
          </div>
        </ModalBody>

      </Modal>

    </div>)
  }
}

export default ApplyAuthority;

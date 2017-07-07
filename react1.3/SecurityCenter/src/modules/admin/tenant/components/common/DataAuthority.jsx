import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { MultipleSelect} from 'bfd-ui/lib/MultipleSelect'
import message from 'CommonComponent/component/bdosmessage'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import AjaxReq from '../../model/AjaxReq'
import commonAjaxReq from 'commonAjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'

let that;
let hiveSourceArr = [];
let hbaseSourceArr = [];
let hiveSqlArr = [];
let hbaseSqlArr = [];

const hiveAccesses = [{"type": "select","isAllowed": true},{"type": "update","isAllowed": true},
  {"type": "create","isAllowed": true},{"type": "drop","isAllowed": true},
  {"type": "alter","isAllowed": true},{"type": "index","isAllowed": true},
  {"type": "lock","isAllowed": true}];
const hbaseAccesses = [{"type": "read","isAllowed": true},{"type": "write","isAllowed": true},
  {"type": "create","isAllowed": true},{"type": "admin","isAllowed": true}];

class DataAuthority extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    let data = this.props.data;
    //获取角色id,如果是新增从新增租户传过来，如果是编辑从列表页面传过来
    let roleId = data?data.roleId:this.props.roleId;
    this.roles = [{roleId:roleId,roleName:''}];

    this.state = {
      hiveData: {id:0,accesses:hiveAccesses,tenantId:[this.props.tenantId],resourceType:'hive',users:[]},
      hbaseData: {id:0,accesses:hbaseAccesses,tenantId:[this.props.tenantId],resourceType:'hbase',users:[]}//新增测试
    };

    this.hiveRules = {
      resourceId: value => {
        let msg = BaseValidate.validateInput({isRequired: true, label: "Hive源", value: value});
        if(msg){
          msg = '如果新建hive源必须填写完整的源和库信息';
        }
        return msg;
      },
      database:value => {
      let msg = BaseValidate.validateInput({isRequired: true, label: "数据库", value: value});
      if(msg){
        msg = '如果新建hive源必须填写完整的源和库信息';
      }
      return msg;
    }
    };


    this.hbaseRules = {
      resourceId: value => {
        let msg = BaseValidate.validateInput({isRequired: true, label: "HBase源", value: value});
        if(msg){
          msg = '如果新建HBase源必须填写完整的源和库信息';
        }
        return msg;
      },
      database:value => {
        let msg = BaseValidate.validateInput({isRequired: true, label: "数据库", value: value});
        if(msg){
          msg = '如果新建HBase源必须填写完整的源和库信息';
        }
        return msg;
      }
    }

  }


  componentDidMount() {
    this.queryAuthority();
    this.getResource('hive');
    this.getResource('hbase');
  }

  /**查询数据授权**/
  queryAuthority() {
    if (that.props.tenantId) {
      let params = {tenantId: that.props.tenantId};//this
      AjaxReq.queryDataAuthority(params, (data)=> {
        that.fiterData(data.data);
      })
    }
  }

  /**获取hive/hbase源**/
  getResource(resourceType) {
    commonAjaxReq.getCommonResources({type: resourceType}, (data)=> {
      if (resourceType == 'hive') {
        hiveSourceArr = data;
      } else if (resourceType == 'hbase') {
        hbaseSourceArr = data;
      }
      this.setState({});
    });
  }

  //根据hive资源获取hive数据库
  getHiveDb(id){
    let parms = {resourceId: id};
    commonAjaxReq.getHiveDb(parms, (data)=> {
      hiveSqlArr = data;
      this.setState({});
    });
  }

  //根据hbase资源获取hbase数据库
  getHbaseDb(id){
    let parms = {resourceId: id};
    commonAjaxReq.getHbaseDb(parms, (data)=> {
      hbaseSqlArr = data;
      this.setState({});
    });
  }

  fiterData(data) {
    data.map((item, index)=> {
      item = AdminAuthorityStateTranfer.jsonTOState(item);

      if(item.resourceType=='hive'){
        that.setState({hiveData: item});
      } else if (item.resourceType=='hbase'){
        that.setState({hbaseData: item});
      }
    });





  }

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({hiveData:{...this.state.hiveData,[dataField]:value}});
    //if(dataField == 'resourceId'){
    //  this.getHiveDb(value);
    //}
  }

  hbasehandleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({hbaseData:{...this.state.hbaseData,[dataField]:value}});
    //if(dataField == 'resourceId'){
    //  this.getHbaseDb(value);
    //}

  }

  validate(){}

  //submit按钮提交操作
  handleSubmit() {
    let hiveResource = this.state.hiveData.resourceId;
    let hiveDatabase = this.state.hiveData.database && this.state.hiveData.database.length > 0?this.state.hiveData.database:[];
    let hbaseResource = this.state.hbaseData.resourceId;
    let hbaseDatabase = this.state.hbaseData.database && this.state.hbaseData.database.length > 0?this.state.hbaseData.database:[];
    let isPass = true;
    if(!hiveResource && hiveDatabase.length == 0 && !hbaseResource && hbaseDatabase.length == 0){
      message.danger('请输入要保存的信息');
      isPass = false;
    } else if((hiveResource && hiveDatabase.length == 0)||(!hiveResource && hiveDatabase.length > 0) ){
      message.danger('如果新建Hive源必须填写完整的源和库信息');
      isPass = false;
    }else if((hbaseResource && hbaseDatabase.length == 0)||(!hbaseResource && hbaseDatabase.length > 0)){
      message.danger('如果新建HBase源必须填写完整的源和库信息');
      isPass = false;
    }
    if(isPass){
      let hiveData;
      let hbaseData;
      let data = [];
      if(this.state.hiveData && this.state.hiveData.resourceId && this.state.hiveData.database){
        let obj = $.extend(true, {}, this.state.hiveData);
        hiveData = AdminAuthorityStateTranfer.stateToJson(obj,["database","column","table"],this.roles);
        data.push(hiveData);
      }

      if(this.state.hbaseData && this.state.hbaseData.resourceId && this.state.hbaseData.database){
        let obj = $.extend(true, {}, this.state.hbaseData);
        hbaseData = AdminAuthorityStateTranfer.stateToJson(obj,["database","column","table","column-family"],this.roles);
        data.push(hbaseData);
      }
      let params = {policies:data};
      //调用后台保存方法。。。
      AjaxReq.saveDataAuthority(params,(data)=>{
        message.success('数据授权成功');
        that.props.cancel();
      });
    }


  }

  render() {
    that = this;
    return (<div>
        <FormCategory>
          <FormCategoryItem name="Hive">
            <Form ref="form" rules={this.hiveRules}>
              <FormItem label="Hive源" name="resourceId">
                <Select value={this.state.hiveData?this.state.hiveData.resourceId:''} className="common-form-input common-margin-right"
                        onChange={this.handleChange.bind(this,'resourceId')}>
                  {
                    hiveSourceArr.map(function (item, index) {
                      return (<Option key={index}
                                      value={item.id}>{item.name}</Option>);
                    })
                  }
                </Select>
              </FormItem>

              <FormItem label="数据库名" name="database">
                <MultipleSelect className="common-select" values={this.state.hiveData?this.state.hiveData.database:[]} tagable
                                onChange={this.handleChange.bind(this,'database')}>
                  {
                    hiveSqlArr.map(function (item, index) {
                      return (<Option key={index}
                                      value={item}>{item}</Option>);
                    })
                  }

                </MultipleSelect>
              </FormItem>

              <FormItem label="描述" name="description">
                <RestrictTextarea type="textarea" value={this.state.hiveData?this.state.hiveData.description:''}
                               className="form-control common-textarea"
                               onChange={this.handleChange.bind(this,"description")}/>
              </FormItem>
            </Form>
          </FormCategoryItem>
          <FormCategoryItem name="hbase">
            <Form ref="hbaseForm" rules={this.hbaseRules}>
              <FormItem label="HBase源" name="resourceId">
                <Select value={this.state.hbaseData?this.state.hbaseData.resourceId:''} className="common-form-input common-margin-right"
                        onChange={this.hbasehandleChange.bind(this,'resourceId')}>
                  {
                    hbaseSourceArr.map(function (item, index) {
                      return (<Option key={index}
                                      value={item.id}>{item.name}</Option>);
                    })
                  }
                </Select>
              </FormItem>

              <FormItem label="数据库名" name="database">
                <MultipleSelect className="common-select" values={this.state.hbaseData?this.state.hbaseData.database:[]} tagable
                                onChange={this.hbasehandleChange.bind(this,'database')}>
                  {
                    hbaseSqlArr.map(function (item, index) {
                      return (<Option key={index}
                                      value={item}>{item}</Option>);
                    })
                  }
                </MultipleSelect>
              </FormItem>

              <FormItem label="描述" name="description">
                <RestrictTextarea type="textarea" value={this.state.hbaseData?this.state.hbaseData.description:''} className="form-control common-textarea"
                               onChange={this.hbasehandleChange.bind(this,"description")}/>
              </FormItem>
            </Form>
          </FormCategoryItem>

        </FormCategory>

      </div>
    );
  }
}

export default DataAuthority;
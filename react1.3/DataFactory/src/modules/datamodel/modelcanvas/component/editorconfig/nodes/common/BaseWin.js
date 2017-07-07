/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:公用基本信息类
 *
 ***************************************************/
import React from 'react'
import TreeSelect from 'CommonComponent/component/treeselect'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import RestrictInput from 'CommonComponent/component/restrictinput'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import { Select2 ,Option2} from 'bfd-ui/lib/Select2'
import Ajax from '../../../../ajax/AjaxReq'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import  TypeConst from '../../../../../common/TypeConst'
const Win = React.createClass({
  //初始化表单数据。
  getInitialState() {
    this.initState=false;
    this.rules = {
      //cnName(validateVal) {
      //  return BaseValidate.validateInput({isRequired: true, label: "中文名称", value: validateVal});
      //},
      tableName(value) {
        return BaseValidate.validateInput({isRequired: true, label: "表名称",regExp:RestrictConst.NUM_START_STRING_UNDERLINE_64, value: value, maxLength: 64});
      },
      hierarchyCode:value => {
        return BaseValidate.validateInput({isRequired:true,label:"",value:(value=="请选择"?"":value)});
      },
      tableType:value => {
        return BaseValidate.validateInput({isRequired:true,label:"",value:(value=="请选择"?"":value)});
      },
      dbName:value => {
        return BaseValidate.validateInput({isRequired:true,label:"",value:(value=="请选择"?"":value)});
      },
    }
    this.hierarchyCodeArray=[];
    this.subjectArray=[];
    this.subjectArray=[];
    this.tableNameArray=[];
    this.clusterArr=[];
    this.dbHiveNames=[];
    this.folderCodeArray=
        [{
          name: '全部',
          open: false,
          code:"",
          type:"",
          isParent: true,
          children: []
        }]

    return {  ...this.props.data,projectCode:window.projectCode};
  },

    componentDidMount() {
      this.queryHierarchyCode();
      if(this.props.data)
      {
        this.querySubjectByCode();
        this.queryFolderCode();
      }
    },

  /**
   * 获取基本信息
   */
  getTableProInfo(){
    if(this.props.viewType=="rdbms")
      return;
    let item=this.getSelectHierarchyCode();
    if(item)
    {
      let tablePref=item.tablePref;
      if(!this.state.tableName)
      {
        this.setState({tableName:tablePref});
      }
      else if(this.state.tableName && this.state.tableName.indexOf(tablePref)!=0){
        this.setState({tableName:tablePref});
      }
    }

  },

  /**
   * 获取层级
   */
    queryHierarchyCode() {
      let that=this;
      Ajax.queryHierarchyCode((data)=>{
        that.hierarchyCodeArray=data;
        that.queryHiveNames();
        that.setState({...that.state});
      });
    },

  /**
   * 查询主题域
   */
  querySubjectByCode() {
    let that=this;
    Ajax.querySubjectByCode(that.state,(data)=>{
      that.subjectArray=data;
      that.setState({...that.state});
    });
  },

  /**
   * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
   * @returns {*}
   */
  getData() {
    return this.state;
  },

  vaildate()
  {
    const obj = this.refs._from.validate(this.state);
    if (obj) {    //验证通过
      console.log('表单验证通过',obj);
      return true;
    } else {              //验证失败
      console.log('表单验证失败');
    }
    return false;
  },


  /**
   * 主题域修改
   * @param name
   * @param event
     */
  subjectChange(name, event){
    this.handleChange(name, event);
    this.queryFolderCode();
  },

  /**
   * 查询目录
   */
  queryFolderCode()
  {
    let that=this;
    Ajax.queryFolderByCode(that.state,(data)=>{
      that.folderCodeArray=data;
      that.setState({...that.state});
    });
  },

  /**
   * 层级修改
   * @param name
   * @param event
     */
  hierarchyCodeChange(name, event)
  {
    this.handleChange(name, event);
    this.getTableProInfo();
    this.querySubjectByCode();
    this.queryHiveNames();
  },

  /**
   * 层级修改
   * @param name
   * @param event
   */
  rdbmsChange(name, event)
  {
    this.handleChange(name, event);
    this.queryHiveNames();
  },

  /**
   *
   * @param name
   * @param event
     */
  handleDataBaseChange(name, event)
  {
    this.handleChange(name, event);
    if(this.props.viewType=="rdbms")
    {
      let dbName=this.state.dbName;
      let newDbArray=this.dbHiveNames.filter(item=>(item.name==dbName));
      if(newDbArray && newDbArray.length!=0){
        this.state.dbId=newDbArray[0].id;
      }
    }
    this.queryTableNames();
  },

  /**
   * 查询hive名称
   */
  queryTableNames(event){
    if(this.props.viewType!="rdbms")
      return;
    let rObj=this.dbHiveNames.filter(item=>item.name==this.state.dbName)
    if(rObj && rObj.length!=0)
    {
      Ajax.getTableList({id:rObj[0].id},(data)=>{
        this.tableNameArray=data.data;
        this.setState();
      })
    }
  },

  /**
   * 查询hive名称
   */
  queryHiveNames(){
    this.dbHiveNames=[];
    if(this.props.viewType=="rdbms")
    {
      if(!this.state.tableType)
        return;
      let that=this;
      Ajax.getRelativeDataSourceList({typeName:this.state.tableType},(data)=>{
        that.dbHiveNames=data.data;
        if(!that.initState)
        {
          that.initState=true;
          that.queryTableNames();
        }
        that.setState({...that.state});
      })
    }
    else {
        let obj=this.getSelectHierarchyCode();
        if(obj)
        {
          let dbNames=(this.props.viewType=="hive"?obj.dbHiveNames:obj.dbHbaseNames)||[];
          dbNames.map((item,index)=>{
            this.dbHiveNames.push({id:item,name:item});
          });
        }
    }
  },

  /**
   * 获取选中的层级
   * @returns {*}
     */
  getSelectHierarchyCode(){
    let hArray= this.hierarchyCodeArray.filter(item=>(item.code==this.state.hierarchyCode))
    return (hArray && hArray.length>=1)?hArray[0]:null;
  },


  /**
   * 公用处理修改
   * @param name
   * @param event
     */
  handleChange(name, event) {
    if (event && event.target) {
      this.state[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      this.state[name] = event;
    }
    this.setState({validateState: false});
  },

  /**
   * 下拉树点击事件
   * @param name
   * @param item
   */
  treeClickHandler(keyField, valueField, item) {
    this.state[keyField] = item.code
    this.state[valueField] = item.name
    this.setState()
  },

  /**
   * 获取Tree图标
   * @param data
   * @returns {string}
   */
  dataFilterHander(data) {
    return data.data;
  },


  render() {
    let isDisabled=this.props.data?true:false;
    //dbms
    let dataTypeForm=null;
    let dataTableForm=null;
    if(this.props.viewType=="rdbms") {
      dataTypeForm = <FormItem label="数据源类型" required name="tableType">
        <Select2 value={this.state.tableType} disabled={isDisabled} {...this.props.iDisabled}
                 onChange={this.rdbmsChange.bind(this,'tableType')} placeholder="请选择">
          <Option2 key={TypeConst.MySql.toLowerCase()} value={TypeConst.MySql.toLowerCase()}>MySQL</Option2>
          <Option2 key={TypeConst.Oracle.toLowerCase()} value={TypeConst.Oracle.toLowerCase()}>Oracle</Option2>
          <Option2 key={TypeConst.DB2.toLowerCase()} value={TypeConst.DB2.toLowerCase()}>DB2</Option2>
        </Select2>
      </FormItem>;
    }

    if(this.props.viewType=="rdbms" && !isDisabled)
    {
      //表下拉
      dataTableForm= <FormItem label="表名称" required name="tableName"> <Select2   disabled={isDisabled} {...this.props.iDisabled}
                                     value={this.state.tableName} placeholder="请选择"
                                     onChange={this.handleChange.bind(this,'tableName')}>
                              {
                                this.tableNameArray.map((item, index)=> {
                                  return <Option2 key={index} value={item}>{item}</Option2>
                                })
                              }
                      </Select2></FormItem>
    }
    else {
        dataTableForm=  <FormItem label="表名称" required name="tableName">
          <RestrictInput className="form-control " type="text"  disabled={isDisabled}
                       tipString = "只能输入字母、数字、下划线、长度小于64个字符;且必须以字母开头" maxLength="64" {...this.props.iDisabled}
                       value={this.state.tableName}  restrict={RestrictConst.NUM_STRING_UNDERLINE}
                       onChange={this.handleChange.bind(this,'tableName')}/></FormItem>
    }

    //是否存在表
    let isExistForm=null;
    if(this.props.errorMsg)
    {
      isExistForm=<span style={{color:"#FF3300",paddingLeft:100}}>{this.props.errorMsg}</span>;
    }

    let dbNameForm;

    if(isDisabled)
    {
      dbNameForm= <RestrictInput className="form-control " type="text"  disabled={isDisabled} {...this.props.iDisabled}
                                 value={this.state.dbName} maxLength="20" />
    }
    else {
      dbNameForm=  <Select2 value={this.state.dbName}  disabled={this.props.data?true:false} {...this.props.iDisabled}
                            onChange={this.handleDataBaseChange.bind(this,'dbName')} placeholder="请选择">
        {
          this.dbHiveNames.map((item, index)=> {
            return <Option2 key={index} value={item.name}>{item.name}</Option2>
          })
        }
      </Select2>
    }

    let isHasData=this.props.data?true:false;
    let isIconType=(this.props.iDisabled && this.props.iDisabled.disabled)?true:false;
    let hierarchyCodeForm;
    if(!isHasData && !isIconType)
    {
      hierarchyCodeForm=  <Select2 value={this.state.hierarchyCode}  disabled={isHasData}  {...this.props.iDisabled} onChange={this.hierarchyCodeChange.bind(this,'hierarchyCode')} placeholder="请选择">
        {
          this.hierarchyCodeArray.map((item, index)=> {
            return <Option2 key={item.code} value={item.code}>{item.name}</Option2>
          })
        }
      </Select2>
    }
    else{
      hierarchyCodeForm= <RestrictInput className="form-control " type="text" disabled="true" value={this.state.hierarchyName}/>
    }

    let subjectCodeForm;
    if(!isIconType)
    {
      subjectCodeForm=<Select2 value={this.state.subjectCode} onChange={this.subjectChange.bind(this,'subjectCode')}  placeholder="请选择">
                          {
                            this.subjectArray.map((item, index)=> {
                              return <Option2 key={index} value={item.code}>{item.name}</Option2>
                            })
                          }
                      </Select2>
    }
    else{
      subjectCodeForm= <RestrictInput className="form-control " type="text" disabled="true" value={this.state.subjectName}/>
    }

    return (
        <Form horizontal ref="_from"  labelWidth={130} className="popUpWinStyle"   rules={this.rules}>
            <FormItem label="所属层级"  required name="hierarchyCode">
              {hierarchyCodeForm}
            </FormItem>
            <FormItem label="所属主题域"  name="subjectCode">
              {subjectCodeForm}
            </FormItem>
          <FormItem label="所属目录"  name="folderCode">
            <TreeSelect value={this.state.folderCode}
                        data={this.folderCodeArray}  {...this.props.iDisabled}
                        valueField="code"
                        labelField="name"
                        getIcon={item => item.type===1 ? 'folder' : 'file'}
                        onChange={this.handleChange.bind(this,'folderCode')}/>
          </FormItem>

          {dataTypeForm}


          <FormItem label={this.props.viewType=="hbase"?"命名空间":"数据库"} required name="dbName">
            {dbNameForm}
          </FormItem>
            {dataTableForm}
          <FormItem label="表中文名称"  name="cnName"  >
          <RestrictInput className="form-control " type="text" restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE} {...this.props.iDisabled}
                         tipString = "只能输入中文字母、数字、下划线、长度小于20个字符"
                         value={this.state.cnName} maxLength="20"
                         onChange={this.handleChange.bind(this,'cnName')}/>
        </FormItem>

          <FormItem label="表描述"  name="remark" >
            <RestrictInput className="form-control " type="text" {...this.props.iDisabled}
                           tipString = "长度不能大于255个字符"
                           value={this.state.remark}  maxLength="255"
                           onChange={this.handleChange.bind(this,'remark')}/>
          </FormItem>
          {isExistForm}
        </Form>
    );
  }
});

export default Win;
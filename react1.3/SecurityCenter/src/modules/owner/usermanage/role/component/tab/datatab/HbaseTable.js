/***************************************************
 * 时间: 2016/7/21 16:11
 * 作者: bing.wang
 * 说明: hbase编辑页面
 *
 ***************************************************/
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable';
import confirm from 'bfd-ui/lib/confirm'
import {RestrictInput} from 'CommonComponent'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import DAjax from '../../../../../authority/datapolicy/ajax/AjaxReq'
import CommonModalWin from 'CommonModalWin'
import HbaseBaseWin from './win/HbaseBaseWin'
import AuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
var that;


class Hbase extends React.Component{

    constructor(prop){
        super(prop);
        that = this;
        this.state = {title:'Hbase',isChecked:false,dataJson:{totalList:[]},pageSize:15};

        this.ownerColumns = [
            {
                title: '策略名称',
                key: 'selected',
                width:"370px",
                maxWidth:"370px",
                render(item, text){
                    return ( <TextOverflow><Checkbox
                      style={{maxWidth:"95%"}}
                      checked={text.selected?true:false}
                      onChange={that.dataGridHandleChange.bind(that,item, text,this.key)}>{text.policyName}</Checkbox></TextOverflow> )
                }
            }, /*{
                title: 'hbase源',
                key: 'resourceName'
            },*/ {
                title: '数据库名',
                key: 'database',
                maxWidth:"340px",
                render(item, text){
                    let dString=text.database?text.database.join(" , "):"";
                   return <TextOverflow>
                        <div style={{maxWidth:'95%'}}>{dString}</div>
                    </TextOverflow>;
                }
            }, {
                title: '表',
                key: 'table',
                render(item, text){
                    let dString=text.table?text.table.join(" , "):"";
                    return <TextOverflow>
                        <div style={{maxWidth:'95%'}}>{dString}</div>
                    </TextOverflow>;
                }
            }, {
                title: '列簇',
                key: 'column-family',
                render(item, text){
                    let dString=text['column-family']?text['column-family'].join(" , "):"";
                    return <TextOverflow>
                        <div style={{maxWidth:'95%'}}>{dString}</div>
                    </TextOverflow>;
                }
            }
      //      ,{
      //          title: '操作',
      //          key: 'operation',
      //          render(text, record) {
      //              return (<span>
      //      <a href="javascript:void(0);" onClick={that.ownerEdit.bind(that,text)}>{that.props.type!="readOnly"?"编辑":"查看"}</a>
      //</span>);
      //          }
      //      }
        ];

    }

    componentDidMount() {
        that.getDataByUrl(1);
    }

    /**
     * 编辑
     * @param item
     * @param e
     */
    ownerEdit(item,e){
        that.refs._modal.refs._modal.open();
        let isReadOnly=this.props.operatorType=="userRoleDetail";
        let disabled= isReadOnly?{disabled:true}:{}
        that.refs._modal.setState({data:$.extend(true,[],item),btnClassName:isReadOnly?"displayNone":"",...disabled,operatorType:this.props.operatorType});
    }

    /**
     * 表给修改
     * @param value
     * @param item
     * @param key
     */
    dataGridHandleChange(value,item,key){
        let rowIndex = that.state.dataJson.totalList.indexOf(item);
        that.state.dataJson.totalList[rowIndex][key] = value?false:true;
        this.setState({alertConfigList: that.state.dataJson});
    }

    /**
     * 查询
     * @param e
     */
    searchClickHandler(e){
        that.getDataByUrl(1);
    }

    /**
     * 查询hbase列表
     * @param currentPage
     */
    getDataByUrl(currentPage) {
        if(!arguments[0])
            currentPage = 1;
        var parms={resourceType:"hbase",currentPage:currentPage,pageSize:this.state.pageSize}
        //角色列表
        if(this.props.operatorType=="userRoleDetail")
        {
            parms.roleId=this.props.data.id;
            DAjax.listPolicyByRole(parms,(data) => {
                that.fiterData(data.data);
            });
        }
        else {
            DAjax.listPolicysByThree(parms,(data) => {
                that.fiterData(data.data);
            });
        }
    }

    /**
     * 过滤数据
     * @param item
     */
    fiterData(item){
        item.totalList.map((item,index)=>{item=AuthorityStateTranfer.jsonTOState(item)});
        that.setState({dataJson:item});
    }

    /**
     * 数据修改
     * @param field
     * @param e
     */
    textChange(field,e){
        this.setState({[field]:e.target.value});
    }

    /**
     * 复选框修改
     * @param field
     * @param e
     */
    toggle(field,e){
        this.setState({[field]:e.target.checked});
    }

    /**
     * 分页修改
     * @param nextPage
     */
    onPageChange(nextPage) {
        that.getDataByUrl(nextPage);
    }

    /**
     * 提交编辑
     * @param e
     * @param item
     */
    submitEdit(e,item){
        that.refs._modal.refs._modal.close();
    }

    render(){
        that = this;
        let queryContion;//是否编辑
        if(this.props.type!="readOnly")
        {
            queryContion=(
                <div className="module-search-right">
                    <button className="btn btn-sm btn-primary common-right"
                            onClick={that.searchClickHandler.bind(that)}>查询
                    </button>

                    <RestrictInput type="text" value={this.state.userNameTxt}
                                   className="form-control common-input common-right"
                                   onChange={this.textChange.bind(this,'userNameTxt')} placeholder="请输入策略关键字"/>
                </div>
            );
        }

        return (
            <div className="module-container">
                <div className="module-search">
                    {   /** <Checkbox checked={this.state.isChecked} onChange={this.toggle.bind(that,"isChecked")}>选择本租户所有hdfs文件目录，包含未来创建的文件目录</Checkbox>
                   **/}
                    {queryContion}
                </div>
                <div className="module-table operatioinTable">
                    <DataTable data={this.state.dataJson} column={ this.ownerColumns} howRow={10} showPage="true"
                               onPageChange={this.onPageChange}/>
                </div>
                <CommonModalWin title="策略基本信息-hbase" ref="_modal" Child={HbaseBaseWin} {...this.props}
                                submit={this.submitEdit.bind(this)}/>
            </div>)
    }
}

export default Hbase;

/***************************************************
 * 时间: 2016/7/21 16:11
 * 作者: bing.wang
 * 说明: hdfs编辑页面
 *
 ***************************************************/
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable';
import confirm from 'bfd-ui/lib/confirm'
import {RestrictInput} from 'CommonComponent'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import DAjax from '../../../../../authority/datapolicy/ajax/AjaxReq'
import CommonModalWin from 'CommonModalWin'
import HdfsBaseWin from './win/HdfsBaseWin'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import AuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

var that;
class HdfsTable extends React.Component{
    constructor(prop){
        super(prop);
        that = this;
        this.state = {title:'HDFS',pageSize:15,isChecked:false,dataJson:{totalList:[]}};
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
            }, {
                title: '文件目录',
                key: 'path',
                maxWidth:"535px",
                render(item, text){
                    let dString=text.path?text.path.join(" , "):"";
                    return  <TextOverflow>
                        <div style={{maxWidth:"98%"}}>{dString}</div>
                    </TextOverflow>;
                }
            }
            //,
            //{
            //    title: '操作',
            //    key: 'operation',
            //    render(text, record)
            //    {
            //        return ( <span>
            //                <a href="javascript:void(0);" onClick={that.ownerEdit.bind(that,text)}>{that.props.type!="readOnly"?"编辑":"查看"}</a>
            //        </span>);
            //    }
            //}
        ];
    }

    componentDidMount() {
        that.getDataByUrl(1);
    }

    /**查询**/
    searchClickHandler(e){
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
        that.refs._modal.setState({data:$.extend(true,[],item),btnClassName:isReadOnly?"displayNone":"",...disabled});
    }

    /**
     * 查询hdfs列表
     * @param currentPage
     */
    getDataByUrl(currentPage) {
        if(!arguments[0]) currentPage = 1;
        var parms={resourceType:"hdfs",currentPage:currentPage,pageSize:this.state.pageSize}
        //角色列表
        if(this.props.operatorType=="userRoleDetail")
        {
            parms.roleId=this.props.data.id;
            DAjax.listPolicyByRole(parms,(data) => {
                that.fiterData(data.data);
            });
        }
        else {
            DAjax.listPolicysByThree(parms, (data) => {
                that.fiterData(data.data);
            });
        }
    }

    /**
     * 过滤，获取一维数据
     * @param item
     */
    fiterData(item){
        item.totalList.map((item,index)=>{item=AuthorityStateTranfer.jsonTOState(item)});
        that.setState({dataJson:item});
    }

    /**
     * 公用修改
     * @param field
     * @param e
     */
    textChange(field,e){
        this.setState({[field]:e.target.value});
    }

    /**
     * checkbox修改
     * @param field
     * @param e
     */
    toggle(field,e){
        this.setState({[field]:e.target.checked});
    }

    /**
     * 提交修改
     * @param e
     * @param item
     */
    submitEdit(e,item){
        that.refs._modal.refs._modal.close();
    }

    /**
     * 表格修改
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
     * 分页修改
     * @param nextPage
     */
    onPageChange(nextPage) {
        that.getDataByUrl(nextPage);
    }

    render(){
        that = this;
        let queryContion;//是否编辑
        if(this.props.type!="readOnly") {
            queryContion = ( <div className="module-search-right">
                <button className="btn btn-sm btn-primary common-right" onClick={that.searchClickHandler.bind(that)}>查询</button>

                <RestrictInput type="text" value={this.state.userNameTxt} className="form-control common-input common-right"
                               onChange={this.textChange.bind(this,'userNameTxt')}  placeholder="请输入策略关键字"/>
            </div>);
        }
        return (
            <div className="module-container">
                <div className="module-search">
                    { /**   <Checkbox checked={this.state.isChecked} onChange={this.toggle.bind(that,"isChecked")}>
                        选择本租户所有hdfs文件目录，包含未来创建的文件目录</Checkbox>**/}
                    {queryContion}
                </div>
                <div className="module-table operatioinTable">
                    <DataTable data={this.state.dataJson} column={this.ownerColumns} howRow={10} showPage="true" onPageChange={this.onPageChange}/>
                </div>
                <CommonModalWin title="策略基本信息-HDFS" ref="_modal" {...this.props} Child={HdfsBaseWin} submit={this.submitEdit.bind(this)}/>
            </div>)
    }
}

export default HdfsTable;

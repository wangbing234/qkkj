/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:我的申请列表页面
 *
 ***************************************************/
import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import message from 'CommonComponent/component/bdosmessage'
import RestrictInput from 'CommonComponent/component/restrictinput'
import AuthButton from 'CommonComponent/component/authbutton'
import Ajax from '../ajax/AjaxReq'
import ConstType  from '../../utils/ConstType'

var that;
const APPLY_TYPE=[{name:"待审批",value:0},{name:"已同意",value:1},{name:"已拒绝",value:2}];
const AUTH_TYPE=[{name:"功能权限",value:0},{name:"数据权限",value:1},{name:"资源权限",value:2}];

class MyApplyTable extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            selectData: {
                state: "",
                type: '',
                name:""
            },tableData: {totalList:[]}
        };

        this.pageSize=10;
        this.columns = [
            {
                title: '申请名称',
                key: 'applyName',
                render(text) {
                    return text;
                }
            }, {
                title: '申请类型',
                key: 'applyType',
                render(text) {
                    var renderText = "";
                    for (var toItem of AUTH_TYPE) {
                        if(toItem.value==text)
                        {
                            renderText=toItem.name;
                            break;
                        }
                    }
                    return renderText;
                }
            }, {
                title: '申请时间',
                key: 'applyTime'
                //render(item, text){
                //    var dataString=new Date(parseInt(item)).format("yyyy-MM-dd hh:mm:ss");
                //    return (
                //        <div>
                //            {dataString}
                //        </div>
                //    )
                //}
            }, {
                title: '审批人',
                key: 'approverName'
            }, {
                title: '审批时间',
                key: 'approveTime'
                //render(item, text){
                //    var dataString;
                //    if(item)
                //    {
                //        dataString=new Date(parseInt(item)).format("yyyy-MM-dd hh:mm:ss");
                //    }
                //    else {
                //        dataString="无";
                //    }
                //    return (
                //        <div>
                //            {dataString}
                //        </div>
                //    )
                //}
            }, {
                title: "处理状态",
                key: 'status',
                render(item) {
                    var color = '#0099FF';
                    var mapText = "待审批";
                    switch (item) {
                        case 0:
                            color = '#0099FF';
                            mapText = "待审批";
                            break;
                        case 1:
                            color = '#006600';
                            mapText = "已同意";
                            break;
                        case 2:
                            color = '#FF0000';
                            mapText = "已拒绝";
                            break;
                    }
                    return (<span style={{color:color}}>{mapText}</span>);
                }
            }, {
                title: '操作',
                key: 'operation',
                render(item) {
                    return (
                    <AuthButton renderType="a" type="eye" onClick={that.viewDetail.bind(that,item)} title="查看详情">查看详情</AuthButton>
                    );
                }
            }];
        that = this;
        EventEmitter.subscribe(ConstType.REFRESH_MY_APPLY,this.searchHandler);
    }

    componentWillUnmount() {
        EventEmitter.remove(ConstType.REFRESH_MY_APPLY);
    }

    componentDidMount() {
        this.getDataByUrl(1);
    }

    /**
     * 公用修改
     * @param key
     * @param select
     */
    changeHandler(key, select) {
        let newState = this.state.selectData;
        if (select && select.target) {
            newState[key] = select.target.value;
        } else {
            newState[key] = select;
        }
        that.setState({selectData: newState})
    }


    /**
     * 获取审批类别
     * @param page
     */
    getDataByUrl(page) {
        var info18={
            "status":that.state.selectData.state,//审批状态（0待审批，1 同意，2 驳回）
            "applyType":that.state.selectData.type,//申请类型 （0 功能权限1数据权限 2 资源权限）
            "applyName":that.state.selectData.name,//申请名字
            "currentPage":page,
            "pageSize":that.pageSize
        };
        if(this.props.viewType=="telantSp")
        {
            info18.approveType=1;
        }
        Ajax.authApproveList(info18,(data) => {
            that.setState({tableData: data.data});
        })
    }

    /**
     * 点击查询
     * @param page
     */
    searchHandler() {
        that.getDataByUrl(1);
    }

    /**
     * 查看详情
     * @param page
     */
    viewDetail(item) {
        let parms={applyId:item.id}
        let that=this;
        Ajax.applyDetailInfo(parms,(data)=>{
            that.props.mainPage.setState({viewType:1,formData:data.data});
        })
    }

    /**
     * 分页修改
     * @param nextPage
     */
    onPageChange(nextPage) {
        that.getDataByUrl(nextPage);
    }

    render() {
        that=this;
        return (
            <div className="module-container">
                <div className="module-search" style={{height:'30px'}}>
                    <div className="common-right" >
                            <Select value={this.state.selectData.state} className="common-margin-right" onChange={this.changeHandler.bind(this,'state')}
                                    placeholder="请选择">
                                <Option value="">所有状态</Option>
                                {APPLY_TYPE.map((item,index)=>{return (<Option key={item.value} value={item.value}>{item.name}</Option>)})}
                            </Select>
                            <Select value={this.state.selectData.type} className="common-margin-right" onChange={this.changeHandler.bind(this,'type')}  placeholder="请选择">
                                <Option value="">所有类型</Option>
                                {AUTH_TYPE.map((item,index)=>{return (<Option key={item.value} value={item.value}>{item.name}</Option>)})}
                            </Select>
                        <button type="button" className="btn btn-sm btn-primary common-right"  onClick={this.searchHandler.bind(this)}>查询</button>
                        <RestrictInput value={this.state.selectData.name} onChange={this.changeHandler.bind(this,'name')}
                                       type="text" className="form-control common-input common-right"  placeholder="请输入申请名称关键字"/>
                    </div>
                </div>
                <div className="module-table">
                    <DataTable data={this.state.tableData} showPage="true"  onPageChange={this.onPageChange} column={this.columns} howRow={this.pageSize}/>
                </div>
            </div>)
    }
}

export default MyApplyTable
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import AjaxReq from '../../../model/AjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import AdminEnum from 'AdminEnum'
import CommonDetailWin from 'CommonDetailWin'
import AdminBaseHdfs from 'AdminBaseHdfs'
import AuthButton from 'CommonComponent/component/authbutton'
import SeeAll from 'SeeAll'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import TextOverflow from 'bfd-ui/lib/TextOverflow'


class Hdfs extends React.Component{
    constructor(prop){
        super(prop);
        this.state = {
            data:{totalList:[]}
        }
    }

    componentDidMount() {
        //查询数据授权
        this.search();
    }

    search(){
        let param = {
            resourceType: "hdfs",
            tenantId:this.props.tenantId,
            currentPage: 1,
            pageSize: AdminEnum.PAGE_SIZE
        };
        AjaxReq.seeDataAuthority(param, (result)=> {
            this.fiterData(result.data);
        });
    }

    fiterData(item) {
        item.totalList.map((item, index)=> {
            item = AdminAuthorityStateTranfer.jsonTOState(item)
        });
        this.setState({data: item});
    }

    see(data) {
        this.refs.hdfsModal.setState({data:data,viewType:AdminEnum.SEE_UI});
        this.refs.hdfsModal.refs._modal.open();
    }

    getColumn(){
        return [
            {
                title: '策略名称',
                key: 'policyName',
                render:(text)=>{
                    return  <TextOverflow>
                        <div style={{maxWidth:'200px'}}>{text}</div>
                    </TextOverflow>;
                }
            }, {
                title: '文件目录',
                key: 'path',
                render: (text, record) => {
                    let dString=record.path?record.path.join(" , "):"";
                    return  <TextOverflow>
                        <div style={{maxWidth:'560px'}}>{dString}</div>
                    </TextOverflow>;
                }
            }, {
                title: '操作',
                key: 'operation',
                render: (item,text) =>{
                    return (
                    <AuthButton renderType="a" onClick={this.see.bind(this, item)} title="查看">查看</AuthButton>
                    )
                }
            }
        ];
    }

    seeMoreModal(text,title){
        this.setState({title:title});
        this.refs.seeAllModal.setData(text);
        this.refs.seeAllModal.open();
    }

    render() {
        let column = this.getColumn();
        return (<div>
            <DataTable data={this.state.data} column={column} howRow={AdminEnum.PAGE_SIZE} />
            <CommonDetailWin title="HDFS数据策略查看" ref="hdfsModal" Child={AdminBaseHdfs}/>
            <SeeAll ref="seeAllModal" title={this.state.title}/>
        </div>)
    }
}

export default Hdfs;

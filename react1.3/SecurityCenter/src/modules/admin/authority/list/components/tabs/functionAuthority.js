import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
//import SeeTenant from 'SeeTenant'
import AjaxReq from '../../../model/AjaxReq'
import SeeAll from 'SeeAll'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
let that;

class FunctionAuthority extends React.Component{

  constructor(prop){
    super(prop);
    that = this;
    this.state = {
      data:{totalList:[]}
      }
    }


  componentDidMount(){
    let that = this;
    this.listAjax = AjaxReq.queryFuncTree((result)=>{
      if(that){
        this.setState({data:result})
      }
    })
  }

  componentWillUnmount(){
    that = null;
    if(this.listAjax){
      this.listAjax.abort();
      this.listAjax = null;
    }
  }

  seeAllTenant(data){
    this.refs.modal.setData(data);
    this.refs.modal.open();
  }

  getColumns(){
    return [{
      title: "功能名称",
      width:'10%',
      key: 'functionName'
    }, {
      title: "租户",
      key: '90%',
      render:(text,record)=>{
        let dString=record.tenantNames?record.tenantNames.join(" , "):"";
        return  <TextOverflow>
          <div style={{maxWidth:'900px'}}>{dString}</div>
        </TextOverflow>;
      }
    }];
  }



    render() {
      that = this;
      let column = this.getColumns();
        return (<div className="authority-function module-table" style={{border:'0'}}>
          <DataTable ref="table" data={this.state.data} column={column} />
          {/*<SeeTenant ref="modal"/>*/}
      </div>)
    }
}

export default FunctionAuthority;

/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:DDL的tab页面
 *
 ***************************************************/
import React from 'react'
import Ajax from '../../../../ajax/AjaxReq'
const Win = React.createClass({
  //初始化表单数据。
  getInitialState() {
    return {
      ...this.props.data
    }
  },


    componentDidMount() {
        this.getDDLData();
    },


    /**
     * 查询第几页
     * @param page 第几页
     */
    getDDLData() {
        let pDoc=this.props.parent;
            if(pDoc.vaildate(true))
            {
                let that=this;
                let info14=pDoc.getData(true);
                let tableData= {table:JSON.stringify(info14)}
                Ajax.getDDLData(tableData,(data)=>{that.setState({remark:data.data})})
            }
    },

  render() {
    return (
       <div>
        <span style={{fontSize:"14px"}}> {this.props.titileName}代码</span>
        <textarea className="form-control"  readOnly="readonly"   style={{fontSize:"14px",marginTop:"10px",height:300}}
                  value={this.state.remark} type="textarea"  rows="3"  />
       </div>
    );
  }
});

export default Win;
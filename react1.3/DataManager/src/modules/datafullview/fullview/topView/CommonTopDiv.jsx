/****************************************
 * 时间: 16/7/21
 * 作者: liujingjing
 * 说明: 上部基本信息4个框的父类
 *
 ****************************************/
import React from 'react'

class CommonTopDiv extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lineUpString: "项目总数",
      lineUpValue: "3434",
      lineDownString: "总存储量",
      lineDownValue: "434",
      detail: "black",
      unit: "个"
    }
  }

  //componentWillReceiveProps(nextProps) {
  //  this.setState({
  //    lineUpValue: nextProps.lineUpValue,
  //    lineDownValue: nextProps.lineDownValue
  //  });
  //}

  render() {
    return (
      <div style={{position:'relative',backgroundColor:this.state.color,border:'1px solid #ccc',height:'117px',width:'100%',color:'#ffffff'}}>
        {/**详情**/}
        <div style={{position:"absolute",right:"10px",top:"10px"}}>
          <a href="javascript:void(0);" onClick={this.addDetailTab} style={{display:this.state.detail,color:'#ffffff'}}>详情</a>
        </div>

        {/**总数和图标**/}
        <div style={{position:"absolute",top:'20px',width:'100%'}}>
          <div style={{float:'left',position:'absolute',left:'20px'}}>
            <div style={{fontSize:"23px!important"}}>
              <nobr>{this.props.lineUpValue} {this.state.unit}</nobr>
            </div>
            <div style={{fontSize:"14px!important"}}>{this.state.lineUpString} </div>
          </div>

          <div style={{float:'right',position:'absolute',right:'6px'}}>
            <div style={{width:"35px",height:"35px", paddingTop: "5px",borderRadius:"50px",border:"solid #9fa8da 1px",backgroundColor:"#9fa8da",marginLeft:"-15px",marginTop:"20px"}}>
              <img src={this.state.icon} style={{width:'20px',height:'20px'}}/>
            </div>
          </div>
        </div>

        {/**底下一栏信息**/}
        <div style={{position:'absolute',bottom:'0px',height:"25px",width: "100%",paddingTop:"5px", backgroundColor:"#9fa8da"}}>
          <span style={{position:'absolute',left:'20px'}}>{this.state.lineDownString}</span>
          <span style={{position:'absolute',right:'12px'}}><nobr>{this.props.lineDownValue}</nobr></span>
        </div>

      </div>

    /*bootstrap布局方式*/
      /*<div className="container" style={{backgroundColor:this.state.color,border:'1px solid #ccc',height:'117px',width:'242px',color:'#ffffff'}}>

    {/!*详情*!/}
    <div className="row" style={{height:'10px'}}>
      <div className="col-md-4" style={{float:"right",marginRight:'5px',marginTop:'5px'}}>
        <a href="javascript:void(0);" onClick={this.addDetailTab} style={{display:this.state.detail,color:'#ffffff',}}>详情</a>
      </div>
    </div>

    {/!*总数和图标*!/}
    <div className="row" style={{height:"80px",paddingTop:"17px"}}>
      <div className="col-md-6">
        <div style={{fontSize:"23px!important"}}>
          <nobr>{this.props.lineUpValue} {this.state.unit}</nobr>
        </div>
        <div style={{fontSize:"14px!important"}}>{this.state.lineUpString} </div>
      </div>
      <div className="col-md-4"></div>
      <div className="col-md-2">
        <div style={{width:"35px",height:"35px", paddingTop: "5px",borderRadius:"50px",border:"solid #9fa8da 1px",backgroundColor:"#9fa8da",marginLeft:"-15px",marginTop:"20px"}}>
          <img src={this.state.icon} style={{width:'20px',height:'20px'}}/>
        </div>
      </div>
    </div>

    {/!*底下一栏信息*!/}
    <div className="row" style={{height:"25px",width: "240px",paddingTop:"5px", backgroundColor:"#9fa8da"}}>
      <div className="col-md-6" style={{textAlign:"left"}}>
        {this.state.lineDownString}
      </div>
      <div className="col-md-3"></div>
      <div className="col-md-3" style={{float:"right",textAlign:"right" ,marginRight:"2px"}}>
        <nobr>{this.props.lineDownValue}{this.state.unit}</nobr>
      </div>
    </div>

    </div>*/
    )
  }
}

export default CommonTopDiv;
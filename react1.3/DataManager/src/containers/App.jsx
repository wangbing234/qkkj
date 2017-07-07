import React from 'react'
import GlobalNav from './GlobalNav'
import LayoutBFD from './Layout_BFD'
import AjaxReq from './ajax/AjaxReq'
import Header from 'CommonComponent/component/header'


const App = React.createClass({
  getDefaultProps() {
    return {}
  },
  getInitialState() {
    window.tenantArr = [{id: "", tenantId: "", tenantName: "全部"}];
    return {
      userType: BFD.ENUM.UserType.ADMIN
    }
  },
  /*组建初始化实例后，获取初始化数据*/
  componentDidMount(){
    window.tenantArr = tenantArr;
    let that = this;
    AjaxReq.getTenantList({}, (data) => {
      window.tenantArr = window.tenantArr.concat(data.data);
      that.setState({...that.state});
    });
  },
  handleChange(value) {
    this.setState({userType: value});
  },
  render() {
    return (
      <div className="layout-container" style={{minWidth:'1000px'}}>
        {/*用户信息*/}
        <Header />
        {/*<GlobalNav onChange={this.handleChange}/>*/}
        {/*主体框架*/}
        <LayoutBFD {...this.props} userType={this.state.userType}/>
      </div>
    )
  }
});

export default App;

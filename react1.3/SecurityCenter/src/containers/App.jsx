import React from 'react'
import LayoutBFD from './Layout_BFD'
import Header from 'CommonComponent/component/header'
const App = React.createClass({
  getDefaultProps() {
    return {}
  },
  //
  handleChange(value) {
    this.setState({userType: value});
  },
  render() {
    return (
        <div className="layout-container" style={{minWidth:'1000px'}}>
          <Header/>
          <LayoutBFD {...this.props}/>
        </div>
    )
  }
})

module.exports = App

import React from 'react'
import Layout from './Layout'
import Header from 'CommonComponent/component/header'

const App = React.createClass({
  render() {
    return (
      <div className="layout-container" style={{minWidth:1000}}>
        <Header />
        <Layout {...this.props}/>
      </div>
    )
  }
})

export default App

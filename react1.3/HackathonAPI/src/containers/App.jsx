import React from 'react'
import GlobalNav from './GlobalNav'
import Layout from './Layout'

const App = React.createClass({
  render() {
    return (
      <div className="layout-container" style={{minHeight:500}}>
        <GlobalNav />
        <Layout {...this.props}/>
      </div>
    )
  }
})

export default App

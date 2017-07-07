import React from 'react'
import GlobalNav from './GlobalNav'
import Layout from './Layout'
import Header from 'Base/Header'

const App = React.createClass({
  render() {
    return (<div className="layout-container">
      <Header/>
      <Layout {...this.props}/>
    </div>)
  }
})

module.exports = App

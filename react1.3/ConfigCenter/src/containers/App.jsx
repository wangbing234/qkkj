import React from 'react'
import Layout from './Layout'
import Header from 'CommonComponent/component/header'

const App = React.createClass({
  render() {
    return (
      <div className="layout-container">
        <Header/>
        <Layout {...this.props}/>
      </div>
    )
  }
})

module.exports = App

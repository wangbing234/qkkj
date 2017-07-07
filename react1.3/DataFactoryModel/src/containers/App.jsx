import React from 'react'
import GlobalNav from './GlobalNav'
import Layout from './Layout'

const App = React.createClass({
    getDefaultProps() {
        return {}
    },
    getInitialState() {
        return {
        }
    },
    render() {
        return (<div>
            <GlobalNav onChange={this.handleChange}/>
            <div className='container' style={{width:'100%',paddingLeft:0,paddingRight:0}}>
                <Layout {...this.props}/>
            </div>
        </div>)
    }
})

module.exports = App

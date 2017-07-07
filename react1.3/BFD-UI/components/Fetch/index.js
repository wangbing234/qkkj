import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import xhr from '../xhr'
import './main.less'

class Fetch extends Component {

  constructor() {
    super()
    this.state = {
      xhr: 'success',
      msg: null
    }
    this.stateMap = {
      success() {
        return this.props.children
      },
      loading() {
        return (
          <div className="fetch-mask">
            <div className="state loading">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )
      },
      error() {
        return (
          <div className="fetch-mask">
            <div className="state error">{this.state.msg}</div>
          </div>
        )
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.url !== nextProps.url) {
      this.fetch()
      this.root.style.height = this.root.offsetHeight + 'px'
      return false
    }
    return true
  }

  componentDidMount() {
    if(this.props.url){
      this.loadInterval = setInterval(this.fetch(),100);
    }
    this.root = ReactDOM.findDOMNode(this)
  }

  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  fetch() {
    // this.setState({xhr: 'fetch-start'})
    this.lazyFetch()
    this.props.onFetch && this.props.onFetch()
    setTimeout(() => {
      xhr({
        url: this.props.url,
        complete: () => {
          clearTimeout(this.loadingTimer)
        },
        success: this.handleSuccess.bind(this),
        error: this.handleError.bind(this)
      })
    }, this.props.delay || 0)
  }

  lazyFetch() {
    this.loadingTimer = setTimeout(() => {
      if(this.loadInterval) {
        this.setState( { xhr: 'loading' } )
      }
    }, 150)
  }

  handleSuccess(data) {
    if(this.loadInterval){
      this.setState({xhr: 'success'})
      this.props.onSuccess && this.props.onSuccess(data)
    }
  }

  handleError(msg) {
    if(this.loadInterval) {
      this.setState( { xhr: 'error', msg } )
    }
  }


  render() {
    const { className, ...other } = this.props

    delete other.url
    delete other.onSuccess
    delete other.delay

    return (
      <div className={classnames('bfd-fetch', className)} {...other}>
        {(this.stateMap[this.state.xhr] || (() => null)).call(this)}
      </div>
    )
  }
}

Fetch.propTypes = {
  url: PropTypes.string,
  onSuccess: PropTypes.func
}

export default Fetch
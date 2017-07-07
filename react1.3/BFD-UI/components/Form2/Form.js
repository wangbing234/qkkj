import React, { PropTypes } from 'react'
import classnames from 'classnames'
import warning from 'warning'
import xhr from '../xhr'
import message from '../message'
import './Form.less'

const Form = React.createClass({

  getChildContext() {
    return {
      form: this
    }
  },

  componentWillMount() {
    this.items = []
  },

  addItem(newItem) {
    
    if (newItem.props.multiple) {
      newItem.uuid = Math.random().toString(16).slice(2)
      this.multipleMap || (this.multipleMap = {})
      this.multipleMap[newItem.uuid] = this.items.filter(item => item.props.name === newItem.props.name).length
    }

    this.items.push(newItem)
  },

  removeItem(item) {

    if (item.props.multiple) {
      delete this.multipleMap[item.uuid]
      // Reset index
      const name = item.props.name
      this.items.filter(item => item.props.name === name).forEach((item, i) => {
        this.multipleMap[item.uuid] = i
      })
    }

    this.items.splice(this.items.indexOf(item), 1)
  },

  validate(data) {
    data || (data = this.props.data)
    let isValid = true
    this.items.forEach(formItem => {
      const { name, multiple } = formItem.props
      if (!multiple) {
        formItem.validate(data[name]) || (isValid = false)
      } else {
        const index = this.multipleMap[formItem.uuid]
        formItem.validate(data[name] && data[name][index]) || (isValid = false)
      }
    })
    return isValid
  },

  handleSubmit(e) {
    e.preventDefault()
  },

  save(data) {
    if (this.validate()) {
      if (process.env.NODE_ENV !== 'production') {
        warning(this.props.action, 'No `action` provided, check the Form component you save.')
      }
      xhr({
        type: 'POST',
        url: this.props.action,
        data: data || this.props.data,
        success: data => {
          this.props.onSuccess && this.props.onSuccess(data)
        }
      })
    }
  },

  render() {
    const { className, data, children, onChange, onSubmit, ...other } = this.props
    return <form onSubmit={this.handleSubmit} className={classnames('bfd-form2', className)} {...other}>{children}</form>
  }
})

Form.childContextTypes = {
  form: PropTypes.instanceOf(Form)
}

Form.defaultProps = {
  labelWidth: 100
}

Form.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  rules: PropTypes.object,
  labelWidth: PropTypes.number,
  action: PropTypes.string,
  onSuccess: PropTypes.func
}

export default Form
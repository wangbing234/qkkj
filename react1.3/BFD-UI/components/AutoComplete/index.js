import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { Dropdown, DropdownToggle, DropdownMenu } from '../Dropdown'
import ClearableInput from '../ClearableInput'
import './index.less'

const AutoComplete = React.createClass({

  getInitialState() {
    return {
      open: false,
      index: -1,
      value: this.props.defaultValue || this.props.value || '',
      result: []
    }
  },

  componentWillReceiveProps(nextProps) {
    'value' in nextProps && this.setState({value: nextProps.value})  
  },

  handleChange(value) {
    const state = { value }
    if (!value && this.props.search!==false) {
      state.open = false
      return this.setState(state)
    }
    let result;
    if(this.props.search!==false)
    {
      result = this.props.source.filter(item => item.indexOf(value) > -1)
    }
    else {
      result=this.props.source;
    }

    if (result.length || this.props.search===false) {
      result[-1] = value
      state.open = true
      state.result = result
    } else {
      state.open = false
    }
    state.index = -1
    this.setState(state)
  },

  handleSelect(value) {
    this.setState({
      value,
      open: false
    })
    this.props.onChange && this.props.onChange(value)
  },

  handleKeyDown(e) {
    const input = e.target
    const key = e.key
    if (this.state.open) {
      let index = this.state.index
      const result = this.state.result
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        if (key === 'ArrowDown') {
          index++
          if (index === result.length) index = -1
        }
        if (key === 'ArrowUp') {
          e.preventDefault()
          if (index === -1) index = result.length - 1
          else index--
        }
        const value = result[index]
        this.setState({
          index,
          value
        })
      }
      if (key === 'Enter') {
        this.handleSelect(result[index])
        input.blur()
      }
    }
  },

  handleFocus() {
    if (!this.props.source.length) return;
    this.state.result = this.props.source.filter(item => (item.indexOf(this.state.value) > -1 ||  this.props.search===false));
    if(!this.state.result||!this.state.result.length) this.state.result = this.props.source;
    this.setState({...this.state,open: true})
  },

  setOpenState(openState){
    this.setState({...this.state,open: openState})
  },

  render() {
    const { className, onFocus, onKeyDown, value, onChange, ...other } = this.props
    return (
      <Dropdown 
        open={this.state.open}
        setOpenState={this.setOpenState}
        className={classnames('bfd-auto-complete', className)}
      >
        <ClearableInput 
          value={this.state.value}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          onChange={value => {
            this.handleChange(value)
            onChange && onChange(value)
          }}
          {...other} 
        />
        <DropdownMenu>
          <ul className="result">
          {this.state.result.map((item, i) => (
            <li 
              key={i}
              className={classnames({active: this.state.index === i})} 
              onClick={this.handleSelect.bind(this, item)}
            >
              {item}
            </li>
          ))}
          </ul>
        </DropdownMenu>
      </Dropdown>
    )
  }
})

AutoComplete.propTypes = {
  source: PropTypes.array.isRequired
}

export default AutoComplete
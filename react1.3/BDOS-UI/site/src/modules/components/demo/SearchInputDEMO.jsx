import React, { PropTypes } from 'react'
import classNames from 'classnames'
import SearchInput from 'Base/SearchInput'

let that;
class SearchInputDEMO extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  componentWillUnmount() {
    that = null;
  }

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }
    console.log("newState", newState)
    this.setState(newState);
  }

  render() {
    that = this;
    return (
      <div>
        <SearchInput style={{width:200}} onChange={this.handleChange.bind(this,'search')}/>
      </div>
    );
  }
}

export default SearchInputDEMO
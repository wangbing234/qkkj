/**
 * 下拉触发组件,Hover触发
 */
import React, { PropTypes } from 'react'

function DropdownHover(props, { dropdown }) {
  return (
    <div className="dropdown-hover"
         onMouseOver={dropdown.handleToggle}
         onMouseOut={dropdown.handleToggle}>{props.children}
    </div>
  )
}

DropdownHover.contextTypes = {
  dropdown: PropTypes.object
}

export default DropdownHover


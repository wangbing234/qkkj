import React from 'react'

/**
 * 选项组容器节点
 */
function TabList(props) {
  const autoWidth = props.autoWidth ? 'bdos-tab2-auto-width' : '';
  return <div className={`bdos-tab2-tabs clearfix ${autoWidth}`}>{props.children}</div>
}

export default TabList

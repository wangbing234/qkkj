import React, { PropTypes } from 'react'
import classNames from 'classnames'
import List from 'Base/List'

class Demo extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {}
    console.log("demo constructor...")
  }

  componentWillUnmount() {
    console.log("demo componentWillUnmount")
  }

  render() {
    console.log("render demo ....")
    return (
      <div>DEMO</div>
    )
  }
}

class ListDemo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  clickHandler(item) {
    console.log("item", item)
    this.setState({aa: 'adsf'})
  }

  render() {
    const data = [
      {
        key: 'zhongxia', value: '1',
        render: function (text, item) {
          return <button>{text}</button>
        }
      },
      {key: 'zhongxia1', value: '2'},
      {key: 'zhongxia2', value: '3'},
      {key: 'zhongxia3', value: '4'},
      {key: 'zhongxia4', value: '5'},
      {key: 'zhongxia5', value: '6'}
    ]
    return (
      <div>
        <List data={data} style={{width:150}}
              onDoubleClick={this.clickHandler.bind(this)}/>
        <Demo/>
      </div>
    );
  }
}

export default ListDemo
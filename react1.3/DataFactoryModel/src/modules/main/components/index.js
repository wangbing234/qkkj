import React from 'react'

import Collapse from './collapse'

const Main = React.createClass({

  getInitialState() {
    return {
      title: '',
      show: false
    }
  },
  callback(e){
    console.log("e", e)
  },

  render()
  {
    return (
      <div>
        <Collapse title="zhongxia"  callback={this.callback}>
          <div className="well">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil
            anim
            keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
          </div>
        </Collapse>
      </div>
    )
  }
})

module.exports = Main;

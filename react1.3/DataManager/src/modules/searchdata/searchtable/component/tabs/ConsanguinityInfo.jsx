import React from 'react'
import CanvasSpace from 'CanvasSpace';
import ConsanguinityInfoDetail from './ConsanguinityInfoDetail';
class ConsanguinityInfo extends React.Component{

  constructor(prop) {
    super(prop);
    this.state = {}
  }

    callbackHander(data){
        this.refs.consanguinityInfoDetail.setState(data);
    }

    render(){
        return (<div className="search-tableInfo-ddl-table">
                    <div className="consanguinity_table_div">
                             <CanvasSpace table={this.props.table} type="dataManager" callback={this.callbackHander.bind(this)}/>
                    </div>
                     <ConsanguinityInfoDetail ref="consanguinityInfoDetail"/>
                </div>);
    }
}

export default ConsanguinityInfo;
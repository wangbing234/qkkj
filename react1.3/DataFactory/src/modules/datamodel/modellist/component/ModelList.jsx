import React from 'react';

import ListLeft from './ListLeft'
import ListPanel from './ListPanel'
import HSplitPane from 'CommonComponent/component/hsplitpane'
class ModelList extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return (
            <div  className="model_list_div">
                <HSplitPane size={200}  minSize={200} maxSize={600}>
                    <ListLeft ref="listLeft"/>
                    <ListPanel ref="listPanel" parent={this} {...this.props}/>
               </HSplitPane>
        </div>);
    }
}
export default ModelList
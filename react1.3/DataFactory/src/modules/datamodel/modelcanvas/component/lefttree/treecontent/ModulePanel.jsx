/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:公用扇形tab
 *
 ***************************************************/

import React from 'react';
import ModelTree from '../../../../common/ModelTree'
class TreePanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    /**
     * 点击标题,供外部调用
     */
    titleClick()
    {
        this.props.owner.refs._modal.open();
    }

    render(){
        return (  <div className="panel-body dragTree" id={this.props.format} style={{height:"100%"}}>
                            <ModelTree operatorType="canvas"/>
                    </div>
        );
    }
}

export default TreePanel
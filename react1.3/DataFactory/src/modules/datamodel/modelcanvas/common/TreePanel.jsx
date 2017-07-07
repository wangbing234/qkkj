/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:公用扇形tab
 *
 ***************************************************/

import Tree from 'bfd-ui/lib/Tree/Tree'
import React from 'react';
class TreePanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        let tprops = {...this.props};
        let buttonBar;
        if(tprops.buttonString)
        {
            buttonBar= (<a style={{float:"right",marginRight:"10px"}} href="javascript:void(0);"
                           onClick={this.titleClick.bind(this)}>{tprops.buttonString}</a>);
        }

        return ( <div style={{width:"100%",marginBottom:"0px"}} className="panel panel-default" >
                        <div className="panel-body dragTree" id={this.props.format} style={{height:"100%"}}>
                            {this.props.chilidren}
                        </div>
                     </div>
        );
    }
}

export default TreePanel
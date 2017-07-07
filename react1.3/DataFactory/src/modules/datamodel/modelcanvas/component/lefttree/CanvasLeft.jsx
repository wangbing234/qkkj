/***************************************************
 * 时间: 2016/7/20 14:31
 * 作者: bing.wang
 * 说明: 左侧树
 *
 ***************************************************/
import React from 'react';
import ModulePanel from './treecontent/ModulePanel'
import MySharePanel from './treecontent/MySharePanel'
import OtherSystemPanel from './treecontent/OtherSystemPanel'
import {Accordion,AccordionItem} from 'CommonComponent/component/accordion'
import TypeConst from '../../../common/TypeConst'
class ListLeft extends React.Component{
    constructor(props){
        super(props);
        this.state = {shareTree: [],importTree:[],modelTree:[] };
    }

    render(){
        return (
            <div className="model_tree">
                <div style={{width:"100%"}} className="foldedButton"/>
                <Accordion>
                    <AccordionItem title="数据模型"        icon="database"   buttonString="spinner" dataCode="1020601"  Child={ModulePanel}   props={this.props} />
                    <AccordionItem title="其它项目表"      icon="th-large"  buttonString="paper-plane"  dataCode="1020602"   Child={OtherSystemPanel} props={this.props} />
                    <AccordionItem title="共享表"          icon="bookmark"  Child={MySharePanel} props={this.props}/>
                </Accordion>
            </div>
        );
    }
}
export default ListLeft
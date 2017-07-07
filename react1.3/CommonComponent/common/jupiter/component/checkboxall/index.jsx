/***************************************************
 * 时间: 2016年6月29日11:18:26
 * 作者: bing.wang
 * 包含权限的checkbox的组件
 *
 ***************************************************/
import React from 'react';
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import  './style.css'


class CheckboxGroupAll extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checkedAll: false,
      selects:this.props.selects,
      list:this.props.list
    }
  }

  componentDidMount() {
    this.checkAllSeleced();
  }


  clickAllHander() {
    let checkedField=this.props.checkedField;
    let _checkedAll=!this.state.checkedAll;
    this.state.checkedAll=_checkedAll;
    this.state.list.map((item,index)=>{
      item[checkedField]=_checkedAll;
      });
    this.setState({});
  }

  clickBoxHander(item,e) {
    let checkedField=this.props.checkedField;
    item[checkedField]=!item[checkedField];
    this.checkAllSeleced();
  }

  checkAllSeleced(){
    let isHasNoSeleced=false;
    let checkedField=this.props.checkedField;
    (this.state.list||[]).map((item,index)=>{
      if(!item[checkedField]){
        isHasNoSeleced=true;
        return;
      }
    });
    this.setState({checkedAll:!isHasNoSeleced});
  }


  render() {
        let key=this.props.key;
        let value=this.props.value;
        let list=this.state.list||[]//.filter(item => (item.hidden!=true));
        let checkedField=this.props.checkedField;
        if(this.props.type=="hdfs")
        {
          list.map((item,index)=>{
            let  readItem=list.filter(item => (item[value]=="read"))
            if(item[value]=="write" && item[checkedField])
            {
              if(readItem && readItem.length>0)
              {
                readItem[0][checkedField]=true;
                readItem[0].style={disabled:true}
              }
              return;
            }
            else {
              if(!this.props.disabled)
              {
                readItem[0].style={disabled:false}
              }
            }
          });
        }

    //如果是全部选择，全选变为全选
    if(list && list.length>0)
    {
      this.state.checkedAll=(list.filter(item => (item[checkedField]==true)).length==list.length);
    }



    return (
          <div className="CheckboxDiv" style={{display:'inline-block'}}>
            <Checkbox  onChange={this.clickAllHander.bind(this)} checked={this.state.checkedAll} {...this.props}>全部</Checkbox>
            {list.map((item,index)=>{return (<Checkbox {...this.props} {...item.style} onChange={this.clickBoxHander.bind(this,item)}  key={index} checked={item[checkedField]?true:false} value={item[key]} >{item[value]}</Checkbox>)})}
          </div>
    )
  }
}

export default CheckboxGroupAll
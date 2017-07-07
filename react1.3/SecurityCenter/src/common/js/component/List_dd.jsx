import React from 'react'

const List = React.createClass({
    getInitialState(){
        return {selectItems:[]};
    },
    setSelectItems(value,isSelected,itemIndex){
        if(isSelected){
            this.setState({selectItems:this.state.selectItems.push(value)});
        }else{
            this.setState({selectItems:this.state.selectItems.splice(itemIndex,1)});
        }
    },
    getSelectItems(){
        return this.state.selectItems;
    },

    render(){
        const that = this.props;
        return (
            <select multiple="multiple" className="common-list" {...this.props}>
                {that.dataProvider.map((item,index) => {
                    this.state.selectItems.map((selectItem,index)=>{
                        if(that.dataField == selectItem[that.dataField]){
                            return (<option key={index} selected="selected" onclick={this.setSelectItems.bind(this,item,this.selected,index)}>{item[that.labelField]}</option>);
                        }
                    });
                    return (<option  key={index} onclick={this.setSelectItems.bind(this,item,this.selected,index)}>{item[that.labelField]}</option>);
                 })}
            </select>
        );
    }
});

module.exports = List;
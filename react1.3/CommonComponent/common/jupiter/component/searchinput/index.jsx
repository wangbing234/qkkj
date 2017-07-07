import React from 'react';
import RestrictInput from '../restrictinput'
let that;
class SearchInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {text:""};
        that = this;
    }
    textChange(e){
        this.setState({text:e.target.value});
    }
    render(){
        return (<div className="input-group" style={{width:300,...this.props.style}} >
            <RestrictInput type="text" className="form-control" style={{borderColor:"#42A5F5",height:30}} placeholder={this.props.placeholder}
                   value={this.state.text} onChange={this.textChange.bind(that)} restrict={this.props.restrict}/>
            <span className="input-group-btn">
                <button type="button" className="btn btn-primary" style={{width:68,height:30,padding:"0",...this.props.btnStyle}} onClick={this.props.searchClick}>查询</button>
            </span>
        </div>);
    }
}
export default SearchInput;
import React from 'react';
let that;
class SearchInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
        that = this;
    }
    textChange(e){
        this.setState({text:e.target.value});
    }
    render(){
        return (<div className="input-group" style={{width:300,...this.props.style}} >
            <input type="text" className="form-control" style={{npm  :"#42A5F5",height:30}} placeholder={this.props.placeholder}
                   value={this.state.text} onChange={this.textChange.bind(that)}/>
            <span className="input-group-btn">
                <button type="button" className="btn btn-primary" style={{width:68,height:30,padding:"0 !important",...this.props.btnStyle}} onClick={this.props.searchClick}>查询</button>
            </span>
        </div>);
    }
}
export default SearchInput;
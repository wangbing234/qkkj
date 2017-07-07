import React from 'react';
import RestrictInput from '../restrictinput'
import RestrictConst from '../../utils/RestrictConst'
import './style.less'
class InputNumber extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {num:this.props.num?this.props.num:this.props.min};
  }
  /*点击向上的箭头，加1*/
  upClick(e) {
    let newValue = Number(this.state.num)+this.props.step;
    if(newValue < this.props.max){
      //this.refs.numberInput.value = newValue;
      if(this.props.onChange){
        this.props.onChange(newValue);
      }
      this.setState({num:newValue});
    }
  }
  /*点击向上的箭头，减1*/
  downClick(e){
    let newValue = Number(this.state.num)-this.props.step;
    if(newValue >= this.props.min){
      //this.refs.numberInput.value = newValue;
      if(this.props.onChange){
        this.props.onChange(newValue);
      }
      this.setState({num:newValue});
    }
  }

  /*不允许输入*/
  numChange(evt){
    //let newValue = Number(evt.target.value);
    //if( newValue < this.props.max && newValue >= this.props.min){
    //  this.setState({num:newValue});
    //}else {
    //  evt.target.value = this.props.min;
    //}
  }

  render() {
    this.value = this.state.num;
    return (
      <div className="input-number-container">
        <RestrictInput ref="numberInput" className="form-control" restrict={RestrictConst.NUM_POINT}
        onChange={this.numChange.bind(this)} value={this.state.num}/>
        <a href="javascript:void(0)" className="up-a" onClick={this.upClick.bind(this)}>∧</a>
        <a href="javascript:void(0)" className="down-a" onClick={this.downClick.bind(this)}>∨</a>
      </div>
    );
  }
}
export default InputNumber
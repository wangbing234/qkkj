/****************************************************
 * create by qing.feng
 * time 2016/7/22 11:34
 * desc：工作流维护- 定时计划- 脚本运行界面
 *****************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import AjaxReq from '../ajax/AjaxReq'
class ScriptPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.rules = {
      scriptTxt( value ){
        return BaseValidate.validateInput( { label: "脚本输入", isRequired: true, value } );
      }
    };
    this.state = {data:{}};
  }

  componentDidMount(){
    if(this.props.data)
      this.setState( { data:{scriptTxt: this.props.data.name} } );
  }

  componentWillReceiveProps(nextProp){
    if(nextProp.data){
      this.setState( { data:{scriptTxt: nextProp.data.name} } );
    }else {
      this.initState();
    }
  }


  initState(){
    let _newData = {scriptTxt:""};
    this.setState({data:_newData});
  }
  /*文本输入改变时的处理函数*/
  changeHandle( evt ) {
    this.setState( { data:{scriptTxt: evt.target.value }} );
    evt.stopPropagation();
  }

  /*从state中获取数据，并返回到父级调用*/
  getFormData() {
    return { name: this.state.data.scriptTxt };
  }

  /*脚本执行*/
  runHandle() {
    AjaxReq.runScript( { cron: this.state.data.scriptTxt }, ( data ) => {
      let resultStr = "";
      if ( data.data ) {
        data.data.map( ( item, index ) => {
          if ( resultStr ) resultStr += "\n";
          resultStr += item;
        } );
      }
      this.state.data.result = resultStr;
      this.setState( { ...this.state } );
    } );
  }

  /*验证当前组件，提供给外部调用*/
  validate() {
    return this.refs.form.validate( this.state.data );
  }

  render() {
    return (
      <div>
        <Form ref="form" rules={this.rules}>
          <FormItem ref="scriptItem" label="脚本输入" required name="scriptTxt">
            <RestrictTextarea
              className="form-control" style={{height:"60px"}}
              value={this.state.data.scriptTxt} onChange={this.changeHandle.bind(this)}/>
          </FormItem>
          <button type="button" style={{marginLeft: '100px',marginBottom:"15px"}} className="btn btn-sm btn-primary"
                  onClick={this.runHandle.bind(this)}>执行
          </button>
          <FormItem ref="resultItem" label="执行结果" name="result">
            <div style={{height:"60px",overflow:"hidden"}}>
              <RestrictTextarea
                className="form-control" style={{height:"100%",overflowX:"auto",overflowY:"auto"}}
                readOnly="readOnly"
                value={this.state.data.result}
              />
            </div>

          </FormItem>
        </Form>

      </div>
    );
  }
}
export default ScriptPanel
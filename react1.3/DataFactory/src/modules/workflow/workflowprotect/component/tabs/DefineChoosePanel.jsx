/****************************************************
 * create by qing.feng
 * time 2016/7/22 11:02
 * desc：工作流维护- 定时计划- 定时器选择tab页
 *****************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import DateRange from 'bfd-ui/lib/DatePicker/DateRange'
import { Select, Option } from 'bfd-ui/lib/Select2'
import CalenderTab from './CalenderTab'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
class DefineChoosePanel extends React.Component {
  constructor( props ) {
    super( props );
    this.rules = this.setRules();
    this.isNew = true;
    this.state = { data:{pianyiParam: 1} };
  }

  componentDidMount(){
    if(this.props.data){
      this.setData( this.props.data );
    }else{
      this.isNew = true;
    }
  }

  componentWillReceiveProps(nextProp){
    if(nextProp.data){
      this.setData( nextProp.data );
    }else{
      this.initState();
    }
  }

  initState(){
    this.isNew = true;
    this.setState({data:{pianyiParam:1}});
    this.calenderData = null;
    if(this.refs.calenderTab){
      this.refs.calenderTab.initState();
    }
  }

  /*设置验证规则*/
  setRules() {
    let that = this;
    return {
      startEndDate( value ){
        value = that.dataRange;
        let baseError = BaseValidate.validateInput( { label: "起止时间",value, isRequired: true } );
        if ( !baseError ) {
          let arr = value.split( "-" );
          if ( arr.length > 0 ) {
            if ( !arr[ 0 ] ) {
              return "请选择起始时间!";
            } else if ( !arr[ 1 ] ) {
              return "请选择结束时间!";
            } else if (arr.length > 1 && arr[ 0 ] > arr[ 1 ] ) {
              return "结束时间应该在起始时间之后!"
            }
          }
        } else {
          return baseError;
        }
      },
      pianyiParam( value ){
        return BaseValidate.validateInput( { label: "偏移量", value, isRequired: true } );
      }
    };
  }

  /*起止时间change的处理函数*/
  handleStartEndTimeSelect( start, end ) {
    start = new Date(start).getTime();
    end =  new Date(end).getTime();
    if(start && end){
      this.dataRange = `${start}-${end}`;
    }else if(start && !end){
      this.dataRange = `${start}`;
    }else if(!start && end){
      this.dataRange = `-${end}`;
    }
    this.refs.startEndDateItem.validate();
    let _data = this.state.data;
    _data.fromDate = start;
    _data.toDate = end;
    this.setState( { ...this.state} );
  }

  /*偏移量change事件处理*/
  selectChange( value ) {
    this.state.data.pianyiParam = value;
    this.setState( { ...this.state } );
  }

  /*写入数据*/
  setData( data ) {
    let fDate = new Date(data.fromDate).getTime();
    let eDate =  new Date(data.toDate).getTime();
    this.dataRange = `${fDate}-${eDate}`;
    let _data = { startEndDate: `${data.fromDate}-${data.toDate}` };
    this.setState( { data:{...data, tabIndex: data.type == "w" ? 2 : 0 } });
    this.calenderData = data;
  }

  /*验证方法调用，提供给外部调用*/
  validate() {
    return this.refs.chooseForm.validate( this.state.data );
  }

  /*获取form中的data*/
  getFormData() {
    let that = this;
    let fromDateStr = CommonUtil.dataFormatter( this.state.data.fromDate );
    fromDateStr = fromDateStr.split( " " )[ 0 ];
    let toDateStr = CommonUtil.dataFormatter( this.state.data.toDate );
    toDateStr = toDateStr.split( " " )[ 0 ]
    let _data = {
      pianyiParam: this.state.data.pianyiParam,
      fromDate: fromDateStr,
      toDate: toDateStr,
      ...that.refs.calenderTab.getFormData()
    };
    return _data;
  }

  /*调度计划tab页码change事件处理*/
  jobTabChange( newIndex ) {
    this.state.data.tabIndex = newIndex;
    this.setState( { ...this.state} );
  }

  render() {
    let pianyiDisabled = this.state.data.tabIndex == 2 ? true : false;
    let minDate = this.isNew?new Date().getTime():"";
    return (
      <div>
        <Form ref="chooseForm" rules={this.rules}>
          <FormItem ref="startEndDateItem" label="起止时间" required name="startEndDate">
            <div className="custom-choose-div">
              <DateRange
                onSelect={this.handleStartEndTimeSelect.bind(this)}
                start={this.state.data.fromDate} min={minDate}
                end={this.state.data.toDate}/>
            </div>
          </FormItem>
          <FormItem ref="faraway" label="偏移量" required name="pianyiParam">
            <Select value={this.state.data.pianyiParam} onChange={this.selectChange.bind(this)} disabled={pianyiDisabled}>
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
              <Option value={4}>4</Option>
              <Option value={5}>5</Option>
            </Select>
          </FormItem>
          <FormItem ref="dispatchPlanItem" label="调度计划" required name="dispatchPlan">
            <CalenderTab ref="calenderTab" tabsChange={this.jobTabChange.bind(this)} calenderData={this.calenderData}/>
          </FormItem>
        </Form>
      </div>
    );
  }
}
export default DefineChoosePanel
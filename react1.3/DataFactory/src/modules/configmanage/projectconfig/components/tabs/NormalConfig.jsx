/****************************************************
 * create by qing.feng
 * time 2016/7/21 16:13
 * desc：项目配置- 基础配置
 *****************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form'

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import message from 'CommonComponent/component/bdosmessage'
import AuthButton from 'CommonComponent/component/authbutton'
import { FormCategory,FormCategoryItem } from 'CommonComponent/component/formcategory'

import AjaxReq from '../../ajax/AjaxReq'

class NormalConfig extends React.Component {
  constructor( prop ) {
    super( prop );
    this.rules = {};
    this.state = { data: {} };
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getBaseConfigInfo(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*input change 处理*/
  textChangeHandle( dataField, e ) {
    let _data = this.state.data;
    _data[ dataField ] = e.target.value;
    this.setState( {} );
  }

  /*基础信息点击保存，直接保存到后台*/
  saveHandle() {
    let param = { code: window.projectCode, ...this.state.data };
    AjaxReq.saveBaseConfigInfo( param, ( data ) => {
      message.success( "保存成功" );
    } );
  }

  /*从后端获取基础信息数据并写入statet中*/
  getBaseConfigInfo() {
    let that = this;
    AjaxReq.getBaseConfigInfo( { code: window.projectCode }, ( data )=> {
      data = data.data;
      if ( that.loadInterval ) {
        that.setState( { data: data } );
      }
    } );
  }

  render() {
    let itemStyle = { height: "30px", lineHeight: "30px" };
    return (
      <div className="single-column-form normal-config" style={{marginTop:"20px"}}>
        <Form className="col-md-offset-1" rules={this.rules} horizontal labelWidth={120}>
          <FormItem label="项目名称" name="cnName">
            <span style={itemStyle}>{this.state.data.cnName}</span>
          </FormItem>
          <FormItem label="hdfs目录" name="hdfsPath">
            <span style={itemStyle}>{this.state.data.hdfsDir}&nbsp;</span>
          </FormItem>
          <FormItem label="临时表前缀" name="tempTableRule">
            <RestrictInput
              type="text" className="form-control"
              restrict={RestrictConst.NUM_START_STRING_UNDERLINE}
              placeholder="加载后台表时按此规则过滤临时表，格式：t_tmp_"
              value={this.state.data.tempTableRule}
              onChange={this.textChangeHandle.bind(this,"tempTableRule")}/>
          </FormItem>
          <FormItem label="查询默认显示条数" name="defaultRows">
            <RestrictInput
              type="text" className="form-control" restrict={RestrictConst.NOTZERONUM}
              value={this.state.data.defaultRows} onChange={this.textChangeHandle.bind(this,"defaultRows")}/>
          </FormItem>
        </Form>

        <AuthButton
          data-code="1022001"
          style={{marginLeft:"226px",marginTop:"20px"}}
          type="button" className="btn btn-primary"
                onClick={this.saveHandle.bind(this)}>保存
        </AuthButton>
      </div>

    );
  }
}
export default NormalConfig;
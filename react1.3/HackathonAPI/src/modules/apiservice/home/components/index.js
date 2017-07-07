import React, { PropTypes } from 'react'
import classNames from 'classnames'
import BDOSTable from  'common/components/BDOSTable'  // 表格

import DetailDoc from './DetailDoc'
import AuthDoc from './AuthDoc'

import Model from 'model/apiService'

let that;
class APIDoc extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      pageType: 0,  //0 API列表页面  1. 常规接口详情页面 2. OAuth 信息页面
      baseRecords: [{
        aliasName: 'OAuth 2.0授权接口',
        apiList: [
          {
            apiUrl: '/oauth/generate', digestContent: '请求授权', isAuth: 1,
            digestContent: "根据用户密钥,生成token",
            detailContent: "根据用户密钥,生成token",
            conditions: [{"name": "appSecret", "type": "string", "desc": "应用程序密钥"}],
            outParams: {
              "code": "000000",
              "msg": "成功",
              "data": "dd6ad0a50a8c8c76507da052dbee7f89"
            }
          },
          {
            apiUrl: '/oauth/getUserByToken', digestContent: '授权查询', isAuth: 1,
            conditions: [{"name": "accessToken", "type": "string", "desc": "用户授权时生成的access_token"}],
            digestContent: "根据token查询用户信息",
            detailContent: "根据token查询用户信息",
            outParams: {
              "code": "000000",
              "msg": "成功",
              "data": {
                "id": 1,
                "userName": "jupiter",
                "status": 0,
                "email": "222@qq.com",
                "phoneNumber": "12389172837",
                "accessToken": "54b8a3405db474044f6dac93c03cc89b"
              }
            }
          },
          {
            apiUrl: '/oauth/getUserBySecret', digestContent: '认证查询', isAuth: 1,
            conditions: [{"name": "appSecret", "type": "string", "desc": "应用程序密钥"}],
            digestContent: "根据应用程序密钥查询用户信息",
            detailContent: "根据应用程序密钥查询用户信息",
            outParams: {
              "code": "000000",
              "msg": "成功",
              "data": {
                "id": 1,
                "userName": "jupiter",
                "status": 0,
                "email": "222@qq.com",
                "phoneNumber": "12389172837",
                "accessToken": "448a9dabb7ce6b754d59dd6dab8c7ea6"
              }
            }
          }
        ]
      }],
      baseHeader: [
        {aliasName: "OAuth 2.0授权接口", configId: ''}
      ],
      columns: [{
        title: 'URL',
        key: 'apiUrl',
        width: '30%',
        render: function (text, item) {
          return (
            <a href="javascript:void(0)"
               onClick={that.goToDetailPage.bind(that,item)}>{text}</a>
          )
        }
      }, {
        title: '说明',
        key: 'digestContent'
      }]
    };
  }

  componentDidMount() {
    Model.getAPIs(function (result) {
      console.log("result", result)
      let data = {
        header: that.state.baseHeader.concat(result.data.header),
        records: that.state.baseRecords.concat(result.data.records),
      }
      console.log("data", data)
      that && that.setState({...data})
    })
  }

  componentWillUnmount() {
    that = null;
  }

  /**
   * 跳转到详情页
   */
  goToDetailPage(item) {

    if (item.isAuth) {
      //Oauth接口信息
      that.setState({apiData: [item], pageType: 2})
    } else {
      //常规接口
      that.setState({apiData: item, pageType: 1})
    }
  }

  /**
   * 跳转到指定位置
   */
  clickScroll(selector) {
    let scroll_offset = $(`div[data-id="${selector}"]`).offset();
    console.log("scroll_offset", scroll_offset)
    $(".layout-content").animate({
      scrollTop: scroll_offset.top - 50
    }, 10);
  }

  /**
   * 渲染API列表
   * @returns {XML}
   */
  renderApiList() {
    return (
      <div>
        <div className="api-service-alias">
          {
            that.state.header && that.state.header.map(function (item, index) {
              return (
                <div href={'#'+item.aliasName}
                     onClick={that.clickScroll.bind(that,item.aliasName)}
                     className="btn btn-sm btn-primary api-service-alias-item"
                     key={index}>
                  {item.aliasName}
                </div>
              )
            })
          }
        </div>
        <div className="api-service-table">
          {
            that.state.records && that.state.records.map(function (item, index) {
              return (
                <div key={index} data-id={item.aliasName}>
                  <div className="aliasName">别名: {item.aliasName}</div>
                  <BDOSTable columns={that.state.columns} data={item.apiList}/>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  /**
   * 调整到API详情页面
   * @returns {XML}
   */
  renderDetailAPIInfo() {
    return (<DetailDoc parent={that} data={that.state.apiData}/>)
  }

  /**
   * 渲染认证详情页面
   */
  renderOAuth() {
    return (<AuthDoc parent={that} data={that.state.apiData}/>)
  }

  render() {
    that = this;
    let jsx = that.renderApiList();

    switch (that.state.pageType) {
      case  0: //API列表页面
        jsx = that.renderApiList();
        break;
      case 1: //常规API详情页面
        jsx = that.renderDetailAPIInfo();
        break;
      case 2: //OAuthAPI详情页面
        jsx = that.renderOAuth();
        break;
    }
    return (
      <div className="module-container api-service-container">
        {jsx}
      </div>
    );
  }
}

export default APIDoc
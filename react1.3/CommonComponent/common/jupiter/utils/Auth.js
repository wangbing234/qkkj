import React, { PropTypes } from 'react'
import { Nav, NavItem } from 'bfd-ui/lib/Nav'
import BfdRequest from '../request/AjaxRequest'

const AUTHCODES = '__AUTHCODES__'  //权限数据
const CURRENTUSER = "_currentUser"; //当前用户
window.BFD = window.BFD || {};
window.BFD.ENUM = {
  UserType: {
    SUPERADMIN: "0",// 超级管理员
    ADMIN: "1",// 管理员
    OWNER: "2",// 租户所有者
    USER: "3" //普通用户
  }
};

export default{
  /**
   * 根据按钮code,获取是否有权限
   * @param code 按钮code
   * return  有权限 true, 没有权限 false
   */
  getAuthByCode(code){
    let authCodes = window[AUTHCODES] && window[AUTHCODES].btns || [];
    if (authCodes.indexOf(code) === -1)
      return true;
  },
  /**
   * 获取所有权限
   * @param functionCode 项目code
   */
  getAllAuth(functionCode) {
    //保存项目的所有 没有权限的 code
    window[AUTHCODES] = {
      nav: [],
      btns: []
    };

    //获取项目的所有按钮权限和导航权限
    let url = `${window.Server.securityCenterAuth}auth/getProjectFunctionAuth`
    //let url = `http://192.168.172.177:8080/aegis-auth/auth/getProjectFunctionAuth`
    BfdRequest.ajaxAsyncPost(url, {
      functionCode: functionCode
    }, function (result) {
      window[AUTHCODES] = result.data;
      console.info("getAuthCodes result:", result)
    })
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo(){
    let getUserUrl = `${window.Server.securityCenterUser}oauth/token/getUser`;
    BfdRequest.ajaxAsyncPost(getUserUrl, {}, function (result) {
      window[CURRENTUSER] = result.data;
      console.info("getUserInfo 2 window._currentUser ...", result.data)
    })
  },
  /**
   * 获取导航菜单
   * @param menuItemClick 导航点击事件, 需要在外部传入
   * @param menus 导航菜单配置, 默认去 window.__MENU__找, 也可以自己传入
   */
  getNavComp(menus, menuItemClick){
    menus = menus || [];
    //获取保存在变量的所有没有权限的功能
    let notAuthCode = window[AUTHCODES] && window[AUTHCODES].nav || [];
    return (
      <Nav onItemClick={menuItemClick}>
        {menus.map(function (item, index) {
          if (notAuthCode.indexOf(item.code) === -1) {
            let _prop = {
              key: item.href + index,
              href: item.href,
              icon: item.icon,
              'data-icon': item.icon,
              title: item.title,
              defaultOpen: item.defaultOpen
            }
            return (
              <NavItem ref={item.ref||null} {..._prop}>
                {item.children && item.children.map(function (subItem, subIndex) {
                  if (notAuthCode.indexOf(subItem.code) === -1) {
                    let _subProp = {
                      key: subItem.href + subIndex,
                      href: subItem.href,
                      'data-icon': subItem.icon,
                      title: subItem.title
                    }
                    return (<NavItem ref={subItem.ref||null} {..._subProp}/>)
                  }
                })}
              </NavItem>
            )
          }
        })}
      </Nav>
    )
  }
}

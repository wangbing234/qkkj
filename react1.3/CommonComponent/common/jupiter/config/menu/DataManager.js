/**
 * 数据管理 菜单配置
 * 导航根据这边的配置生成
 */

//超级管理员导航配置
const AdminNav = [
  {ref: "itemInit", href: '/datafullview/fullview', icon: 'pie-chart', title: '数据全景', code: '10301'},
  {
    href: '/searchData1', icon: 'search', title: '查找数据', code: '10302',
    children: [
      {href: '/searchData/searchTable', icon: 'search', title: '查找表', code: '10303'},
      {href: '/searchData/searchScript', icon: 'search', title: '查找脚本', code: '10304'},
      {href: '/searchData/searchWorkflow', icon: 'search', title: '查找工作流', code: '10305'},
    ]
  },
  {
    href: '/datashare1', icon: 'bar-chart-o', title: '数据共享', code: '10306',
    children: [
      {href: '/datashare/sharelist', icon: 'bar-chart', title: '共享清单', code: '10307'},
    ]
  },
]

//租户所有者导航配置
const OwnerNav = [
  {ref: "itemInit", href: '/datafullview/fullview', icon: 'pie-chart', title: '数据全景', code: '10301'},
  {
    href: '/searchData1', icon: 'search', title: '查找数据', code: '10302',
    children: [
      {href: '/searchData/searchTable', icon: 'search', title: '查找表', code: '10303'},
      {href: '/searchData/searchScript', icon: 'search', title: '查找脚本', code: '10304'},
      {href: '/searchData/searchWorkflow', icon: 'search', title: '查找工作流', code: '10305'},
    ]
  },
  {
    href: '/datashare1', icon: 'bar-chart-o', title: '数据共享', code: '10306',
    children: [
      {href: '/datashare/sharelist', icon: 'bar-chart', title: '共享清单', code: '10307'},
      {href: '/datashare/mysharetable', icon: 'bar-chart', title: '我共享的表', code: '10308'},
      {href: '/datashare/applyhistory', icon: 'bar-chart', title: '申请的表', code: '10309'},
      {href: '/datashare/authorizationhistory', icon: 'bar-chart', title: '我审批的表', code: '10310'},
    ]
  },
]

//普通用户导航配置
const UserNav = [
  {ref: "itemInit", href: '/datafullview/fullview', icon: 'pie-chart', title: '数据全景', code: '10301'},
  {
    href: '/searchData1', icon: 'search', title: '查找数据', code: '10302',
    children: [
      {href: '/searchData/searchTable', icon: 'search', title: '查找表', code: '10303'},
      {href: '/searchData/searchScript', icon: 'search', title: '查找脚本', code: '10304'},
      {href: '/searchData/searchWorkflow', icon: 'search', title: '查找工作流', code: '10305'},
    ]
  },
  {
    href: '/datashare1', icon: 'bar-chart-o', title: '数据共享', code: '10306',
    children: [
      {href: '/datashare/sharelist', icon: 'bar-chart', title: '共享清单', code: '10307'},
      //{href: '/datashare/mysharetable', icon: 'bar-chart', title: '共享的表', code: '10308'},
      {href: '/datashare/applyhistory', icon: 'bar-chart', title: '申请的表', code: '10309'},
    ]
  },
]

export {AdminNav,OwnerNav,UserNav}
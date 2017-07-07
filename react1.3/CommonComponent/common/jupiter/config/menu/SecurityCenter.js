/**
 * 数据管理 菜单配置
 * 导航根据这边的配置生成
 */

//超级管理员导航配置
const AdminNav = [
  {href: '/admin/tenant', icon: 'cog', title: '租户管理', code: '10102',ref: "itemInitAdmin"},
  {href: '/admin/usermanage', icon: 'users', title: '用户管理', code: '10101'},
  {
    href: '/admin/authority1', icon: 'key', title: '权限管理', code: '10103',
    children: [
      {href: '/admin/authority/datapolicy', icon: 'key', title: '数据策略', code: '10104'},
      {href: '/admin/authority/authoritysp', icon: 'key', title: '权限审批', code: '10108'},
      {href: '/admin/authority/list', icon: 'key', title: '查看权限', code: '10109'},
    ]
  },
  {
    href: '/admin/useraudit1', icon: 'search-plus', title: '用户审计', code: '10110',
    children: [
      {href: '/admin/useraudit/data', icon: 'search-plus', title: '数据审计', code: '10110'},
      {href: '/admin/useraudit/platform', icon: 'search-plus', title: '平台审计', code: '10111'},
    ]
  }
]

//租户所有者导航配置
const OwnerNav = [
  {
    href: '/owner/userManage', icon: 'users', title: '用户管理', code: '10114',
    children: [
      {ref: "itemInitOwner", href: '/owner/userManage/user', icon: 'users', title: '用户', code: '10114'},
      {href: '/owner/userManage/role', icon: 'users', title: '角色', code: '10116'},
    ]
  },
  {
    href: '/owner/authority1', icon: 'key', title: '权限管理', code: '10117',
    children: [
      {href: '/owner/authority/datapolicy', icon: 'key', title: '数据策略', code: '10118'},
      {href: '/owner/authority/myauthority', icon: 'key', title: '我的权限', code: '10122'},
      {href: '/owner/authority/authoritysp', icon: 'key', title: '权限审批', code: '10123'},
      {href: '/owner/authority/list', icon: 'key', title: '查看权限', code: '10124'},
    ]
  },
  {
    href: '/admin/useraudit1', icon: 'search-plus', title: '用户审计', code: '10125',
    children: [
      {href: '/admin/useraudit/data', icon: 'search-plus', title: '数据审计', code: '10126'},
      {href: '/admin/useraudit/platform', icon: 'search-plus', title: '平台审计', code: '10127'},
    ]
  }, {
    href: '/owner/tenant1', icon: 'cog', title: '租户管理', code: '',
    children: [
      {href: '/owner/tenant/tenantbaseinfo', icon: 'cog', title: '基础信息', code: ''},
    ]
  }
]

//普通用户导航配置
const UserNav = [
  {
    href: '/user/authority1', icon: 'key', title: '权限管理', code: '10129',defaultOpen:true,
    children: [
      {ref: "itemInitUser", href: '/user/authority/myauthority', icon: 'key', title: '我的权限', code: '10129'},
      {href: '/user/authority/myapply', icon: 'key', title: '我的申请', code: '10131'},
    ]
  }
]

export {AdminNav,OwnerNav,UserNav}

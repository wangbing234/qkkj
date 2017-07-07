/**
 * 数据工厂  菜单配置
 * 导航根据这边的配置生成
 * @type {*[]}
 * @private
 */
export default [
  {href: '/myworkbench/chartlist', ref:'homePageNav', title: '项目首页',icon: 'desktop', code: '10201'},
  {
    href: 'dataaccess1', icon: 'share', title: '数据同步', code: '10202',
    children: [
      {href: '/dataaccess/datainput', icon: 'share', title: '数据接入', code: '10203'},
      {href: '/dataaccess/dataoutput', icon: 'share', title: '数据导出', code: '10204'},
    ]
  },
  {
    href: 'dataModel1', icon: 'database', title: '数据模型', code: '10205',
    children: [
      {href: '/dataModel/modelCanvas', icon: 'database', title: '模型设计', code: '10206'},
      {href: '/dataModel/modelList', icon: 'database', title: '表管理', code: '10207'},
    ]
  },
  {
    href: 'ide1', icon: 'file-code-o', title: '数据开发', code: '10208',
    children: [
      {href: '/ide/ide', icon: 'file-code-o', title: '脚本管理', code: '10210'},
    ]
  },
  {
    href: 'dataaudit1', ref: 'dataAuditNav', icon: 'bold', title: '数据质量稽核', code: '10211',
    children: [
      {href: '/dataaudit/task', icon: 'bold', title: '稽核任务', code: '10212'},
      {href: '/dataaudit/report', ref: 'dataAuditReportNav', icon: 'bold', title: '稽核报告', code: '10213'},
    ]
  },
  {
    href: 'workflow1', ref: 'workflowNav', icon: 'gears', title: '工作流', code: '10214',
    children: [
      {href: '/workflow/workflowProtect', icon: 'gears', title: '工作流维护', code: '10215'},
      {href: '/workflow/workflowMonitor', ref: 'workflowMonitorNav', icon: 'gears', title: '工作流监控', code: '10216'},
    ]
  },
  {
    href: 'configmanage1', icon: 'gear', title: '配置管理', code: '10218',
    children: [
      {href: '/configmanage/projectconfig', icon: 'gear', title: '项目配置', code: '10219'},
    ]
  },
]
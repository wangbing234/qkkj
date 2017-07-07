/***************************************************
 * 时间: 16/6/1 14:13
 * 作者: zhongxia
 * 说明: 表单分类组件
 * 1. 支持多层嵌套, 比如头两个 FormCategoryItem 属于 一个 Form, 而最后一个 FormCategoryIten属于另一个Form
 * 使用方式:

 //引用组件的地址 根据实际变动
 import {FormCategory,FormCategoryItem} from 'Base/FormCategory'
 <FormCategory>
   <div>
     <FormCategoryItem name="基本信息">
       <span>随便内容....</span>
       <input className="form-control"/>
       <input className="form-control"/>
       <input className="form-control"/>
     </FormCategoryItem>
     <FormCategoryItem name="配置信息">
       <span>随便内容....</span>
       <input className="form-control"/>
       <input className="form-control"/>
       <input className="form-control"/>
     </FormCategoryItem>
   </div>
   <FormCategoryItem name="数据库连接配置">
     <span>随便内容....</span>
     <input className="form-control"/>
     <input className="form-control"/>
     <input className="form-control"/>
   </FormCategoryItem>
 </FormCategory>
 ***************************************************/

import FormCategory from './FormCategory'
import FormCategoryItem from './FormCategoryItem'

export { FormCategory,FormCategoryItem }
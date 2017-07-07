/***************************************************
 * 时间: 7/20/16 14:28
 * 作者: zhongxia
 * 说明:
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

//bfd-ui components
//import DataTable from 'bfd-ui/lib/DataTable'
import DataTable from 'Base/DataTable1'
import message from 'bfd-ui/lib/message'
import confirm from 'bfd-ui/lib/confirm'
//custom components
//import Model from 'xxx/xxx'  //TODO:导入Ajax相关操作类

//TODO:模拟数据,联调后去掉
const TableData = {
  "totalList": [{
    "id": "1",
    "name": "张三",
    "age": "11",
    "country": "中国中国中国中国中国中国中国中国中国中国中国中国中国中国中国中国中国中国",
    "height": "185cm",
    "weight": "65kg",
    "school": "六安一中",
    "birthday": "1990-03-16"
  }, {
    "id": "10",
    "name": "张柏仁",
    "age": "23",
    "country": "美国",
    "height": "170cm",
    "weight": "60kg",
    "school": "斯坦福大学斯坦福大学斯坦福大学斯坦福大学斯坦福大学斯坦福大学斯坦福大学斯坦福大学斯坦福大学",
    "birthday": "2016-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }, {
    "id": "11",
    "name": "黄冬冬",
    "age": "25",
    "country": "英国",
    "height": "168cm",
    "weight": "64kg",
    "school": "剑桥大学",
    "birthday": "2016-03-07"
  }, {
    "id": "16",
    "name": "邵冬梅",
    "age": "41",
    "country": "新疆",
    "height": "166cm",
    "weight": "66kg",
    "school": "日本陆军大学",
    "birthday": "1698-03-02"
  }],
  "totalPageNum": 32
}

class TablePage extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      tableData: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      },
      idFiled: 'id', //表格唯一标识字段
      selectIds: '', //选中行的唯一标识
    };
  }

  /**
   * 虚拟DOM渲染到真实DOM节点后
   */
  componentDidMount() {
    this.getTableData()
  }

  /**
   * 获取表格字段
   * @returns {*}
   */
  getColumns() {
    return [{
      title: '名称',
      key: 'name'
    }, {
      title: '年龄',
      key: 'age'
    }, {
      title: '身高',
      key: 'height'
    }, {
      title: '国家',
      key: 'country',
      width: '150px'
    }, {
      title: '生日',
      key: 'birthday'
    }, {
      title: '操作',
      key: 'operation',
      width: '100px',
      render: (item)=> {
        return (
          <span className="myproject-list-opration">
          <a href="javascript:void(0);"
             onClick={this.edit.bind(this,item)}>编辑</a>
          <a href="javascript:void(0);" style={{marginLeft:15}}
             onClick={this.del.bind(this,item)}>删除</a>
        </span>
        );
      }
    }]
  }

  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = {};
    //针对 多选框, 文本框
    if (event && event.target) {
      newState[name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /**
   * 表格多选功能
   * @param selects 数组, 返回选中行
   */
  checkboxSelect(selects) {
    let selectIds = [];
    selects && selects.map((item, index)=> {
      selectIds.push(item[this.state.idFiled])
    })
    console.log("selectIds", selectIds.join(','))
    this.setState({selectIds: selectIds.join(',')})
  }

  /**
   * 表格翻页
   */
  onPageChange(currentPage) {
    this.setState({pageNum: currentPage})
    this.getTableData(this.state.searchVal, currentPage);
  }

  /**
   * 获取表格数据
   * @param searchVal 搜索条件
   */
  getTableData(searchVal, currentPage) {
    let that = this;
    that && that.setState({tableData: TableData})  //TODO:模拟数据,联调后去掉
    //Model.getTable({
    //  searchVal: searchVal,
    //  pageSize: that.state.pageSize,
    //  pageNum: currentPage || that.state.pageNum,
    //}, function (result) {
    //  that && that.setState({tableData: result.data})
    //})
  }

  /**
   * 搜索
   */
  search() {
    this.getTableData(this.state.searchVal)
  }

  /**
   * 创建
   */
  add() {
    console.log('add ...')
  }

  /**
   * 编辑
   */
  edit(item) {
    console.log("edit ...")
  }

  /**
   * 删除,表格操作列
   * 批量删除的时候, item 会为false , 在 删除按钮的 onclick bind 方法传了false
   */
  del(item) {
    let that = this;
    let ids = item ? item[that.state.idFiled] : that.state.selectIds;
    if (ids) {
      confirm('确定删除?', () => {
        Model.del(ids, function (result) {
          console.log("删除", result)
          message.success("删除成功!")
          that.getTableData(that.state.searchVal, that.state.pageNo)
        })
      })
    }
  }

  /**
   * 渲染表格列表
   * @returns {XML}
   */
  renderTable() {
    return (
      <div className="module-container" style={{display:this.props.display}}>

        <div className="row" style={{marginBottom:10}}>
          <div className="module-btns  col-sm-6" style={{margin:0}}>
            <button className="btn btn-sm btn-primary"
                    onClick={this.add.bind(this)}>新增
            </button>
            <button className="btn btn-sm btn-primary"
                    disabled={this.state.selectIds?false:true}
                    onClick={this.del.bind(this,false)}>删除
            </button>
          </div>

          <div className="module-search col-sm-6" style={{margin:0,textAlign:'right'}}>
            <button className="btn btn-sm btn-primary"
                    style={{float:'right'}}
                    onClick={this.search.bind(this)}>查询
            </button>
            <input style={{float:'right'}}
                   className="form-control"
                   placeholder="请输入关键字"
                   value={this.state.searchVal}
                   onChange={this.handleChange.bind(this,'searchVal')}/>
          </div>
        </div>

        <div className="module-table checkbox-table" style={{marginTop:0}}>
          <DataTable column={this.getColumns()}
                     showPage="true"
                     howRow={10}
                     autoPage={true}
                     data={this.state.tableData}
                     onPageChange={this.onPageChange.bind(this)}
                     onCheckboxSelect={this.checkboxSelect.bind(this)}/>
        </div>
      </div>)
  }

  render() {
    let jsx = this.renderTable();
    return (
      <div>
        {jsx}
      </div>
    )
  }
}

export default TablePage

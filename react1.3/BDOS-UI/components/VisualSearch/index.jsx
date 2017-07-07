/***************************************************
 * 时间: 16/7/15 15:11
 * 作者: zhongxia
 * 说明: 查询组件, 一个查询框里面有多一个条件可以查询,
 * 目前支持 文本输入, 下拉框输入
 * 使用说明:
 * 使用该组件,需要在 index.html 文件中引入 dependencies.js
 * <script src="../../CommonComponent/common/jupiter/component/visualsearch/lib/dependencies.js"></script>
 config 格式:
 [{
     name: 'name',
     data: [
       {name: '1', label: 'zhongxia'},
       {name: '11', label: 'zhongxia1'},
       {name: '12', label: 'zhongxia2'},
       {name: '13', label: 'zhongxia3'},
       {name: '14', label: 'zhongxia4'},
     ]
   },
 {
    name: 'age'
 }, {
     name: 'type',
     data: ['1', '2', '3', '4']
  }}

 下拉展示值字段 labelField: string  默认 label
 下拉实际值字段 valueField: string  默认 value
 查询字段名     queryField: string  默认 name

 <VisualSearch onSearch={this.handleSearch} style={{width:400}} config={this.state.config || []}/>
 ***************************************************/
import React, { PropTypes } from 'react'
import ReactDom from 'react-dom'
import classNames from 'classnames'
//import './lib/dependencies.js'
import './lib/visualsearch.js'
import './lib/visualsearch.less'

class VisualSearch extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      value: prop.value || ''
    };
  }

  /**
   * 渲染到DOM节点的时候,初始化组件
   */
  componentDidMount() {
    let that = this;
    let domVisualSearch = ReactDom.findDOMNode(this.refs.refComp)
    that.visualSearch = VS.init({
        container: domVisualSearch,
        query: that.state.value,
        callbacks: {
          /**
           * 查询条件
           * @param query 查询框的内容
           * @param searchCollection 查询框内容的对象
           */
          search: function (query, searchCollection) {
            //格式化查询的结果
            let queryObj = that.formatQuery(searchCollection);

            that.props.onSearch && that.props.onSearch(queryObj)
          },
          /**
           * 根据查询条件,当前条件的值
           * @param facet
           * @param searchTerm
           * @param callback
           */
          valueMatches: function (facet, searchTerm, callback) {
            let config = that.props.config || [];

            let data = that.getDataByKey(config, facet) || [];
            data = that.getValueMatches(data);

            data && callback(data)
          },
          /**
           * 显示的查询条件下拉框
           * @param callback
           */
          facetMatches: function (callback) {
            let config = that.props.config || [];
            let keys = config.map(function (item) {
              return item[that.props.queryField];
            })
            callback(keys);
          }
        }
      }
    )
  }

  /**
   * 获取查询条件匹配的值
   * 页面上只能展示字符串,这边做数据处理,提供值字段设置
   */
  getValueMatches(data) {
    data = data || [];
    var newData = [];
    data.map((item)=> {
      if (typeof item === "object") {
        //newData.push({label: item[this.props.labelField], value: item[this.props.valueField]})
        newData.push({label: item[this.props.labelField]})
      } else {
        newData.push('' + item);
      }
    })
    return newData;
  }

  /**
   * 根据key获取配置信息
   */
  getDataByKey(config, key) {
    for (var i = 0; i < config.length; i++) {
      var obj = config[i];
      if (obj.name === key) {
        return obj.data;
      }
    }
  }

  /**
   * 根据查询条件和label显示值,获取真实的value值
   * @param category
   * @param label
   */
  getValueByCategoryAndLabel(category, label) {
    const config = this.props.config || [];
    const valueMatchData = this.getDataByKey(config, category) || [];
    let value;

    valueMatchData.map(item=> {
      if (item[this.props.labelField] === label) {
        value = item[this.props.valueField];
      }
    })
    return value || label;
  }

  /**
   * 格式化查询的结果
   * @param searchCollection 查询的所有对象
   * @returns {Array}
   */
  formatQuery(searchCollection) {
    let queryModels = searchCollection.models;
    let queryObj = queryModels.map(item=> {
      //获取label 获取下拉框中的值
      let value = this.getValueByCategoryAndLabel(item.attributes.category, item.attributes.value);
      return {label: item.attributes.category, value: value}
    })
    return queryObj;
  }

  render() {
    return (
      <div className="bdos-visual-search" {...this.props} ref="refComp">
      </div>
    );
  }
}

VisualSearch.propTypes = {
  queryField: PropTypes.string,  //查询条件的字段
  labelField: PropTypes.string,  //下拉框显示值的字段
  valueField: PropTypes.string,  //下拉框实际获取值的字段
}
VisualSearch.defaultProps = {
  queryField: 'name',
  labelField: 'label',
  valueField: 'value'
}

export default VisualSearch


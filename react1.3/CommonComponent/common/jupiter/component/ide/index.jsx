/***************************************************
 * 时间: 16/6/3 10:27
 * 作者: zhongxia
 * 说明: IDE组件
 * 1. 支持自定义关键字
 * 2. 支持开启自动补全
 * 3. 支持动态设置代码提示类型
 *
 * onChange(editor,e) IDE内容修改的事件
 * @param editor IDE对象
 * @param e  事件对象
 *
 * onComplete(prefix, callback)  IDE遇到 . 弹出提示内容
 * @param prefix    关键字
 * @param callback  callback 接受一个表格数组展示 ['nam1','name2']
 *
 <IDE keys={['key1','key2']} onChange={(editor,e)=>{   }}/>
 ***************************************************/
import './ide.less'
import React,{PropTypes} from 'react'
import tooltip from './tooltip'

class IDE extends React.Component {
  constructor(prop) {
    super(prop);

    this.state = {
      readOnly: prop.readOnly || false,
      mode: prop.mode || 'sql',
      autoCompletion: prop.autoCompletion || true
    };

    this.editorId = `_editor_${this.getUUID()}`
    this.editor;
  }

  componentDidMount() {
    //自动补全, 需要加载这个
    this.languageTools = ace.require("ace/ext/language_tools");
    this.Autocomplete = ace.require("ace/autocomplete").Autocomplete;

    this.editor = ace.edit(this.editorId)   //初始化编辑器
    this.editor.$blockScrolling = Infinity

    this.editor.getSession().setMode("ace/mode/" + this.state.mode)  //设置代码提示类型(sql/java/javascript)

    //开启自动提示
    this.editor.setOptions({
      enableBasicAutocompletion: this.state.autoCompletion,
      enableSnippets: false,
      enableLiveAutocompletion: this.state.autoCompletion
    });

    //设置只读
    this.editor.setReadOnly(this.state.readOnly)

    //添加自定义提示
    this.addCustomKeyWord(this.props.keys)

    this.bindEvent()
  }

  /**
   * 组件更新
   * @param nextProps
   * @param nextState
   */
  componentWillUpdate(nextProps, nextState) {
    this.editor.setReadOnly(nextState.readOnly)  //只读
    this.editor.getSession().setMode("ace/mode/" + nextState.mode)
    this.editor.setOptions({
      enableBasicAutocompletion: nextState.autoCompletion,
      enableSnippets: false,
      enableLiveAutocompletion: nextState.autoCompletion
    });
  }


  /**
   * 事件监听
   */
  bindEvent() {
    let that = this;
    //监听 onchange事件
    this.editor.getSession().on('change', function (e) {
      let editor = that.editor;

      tooltip.hide();

      that.props.onChange && that.props.onChange(editor, e);
      // insert 操作, 并且当输入 . 的时候
      if (e.action === "insert" && e.lines && e.lines[0] === ".") {
        let range = {start: {row: e.start.row, column: 0}, end: e.end};
        let value = editor.session.getTextRange(range)
        let keys = value.split(' ')

        let prefix = keys[keys.length - 1];

        prefix = prefix.replace(/\.+/, '')

        // 存在关键字, 并且关键字不是为 .
        if (prefix && prefix !== '.') {
          that.props.onComplete && that.props.onComplete(prefix, that.addCustomAutoComplete.bind(that));
        }
      }
    });
  }

  /**
   * 添加自定义补全代码
   * @param autoKeys 自动补全的内容, 数组
   */
  addCustomAutoComplete(autoKeys) {
    let that = this;
    let editor = that.editor;
    let renderer = editor.renderer;
    that.editor.$mouseHandler.cancelContextMenu();

    autoKeys = autoKeys || [];

    if (autoKeys.length > 0) {
      var pos = renderer.$cursorLayer.getPixelPosition(this.base, true);
      var rect = editor.container.getBoundingClientRect();
      pos.top += rect.top - renderer.layerConfig.offset;
      pos.left += rect.left - editor.renderer.scrollLeft;
      pos.left += renderer.gutterWidth;
      that.editor.blur();

      //if (pos.top > 250) {
      //  pos.top = pos.top - 160;
      //}
      tooltip.show({
        selector: `#${that.editorId} .ace_content`,
        x: pos.left + 10,
        y: pos.top + 10,
        data: autoKeys,
        callback: (item)=> {
          that.editor.insert(item);
          that.editor.focus();
        }
      })
    }
  }

  /**
   * 添加自定义关键字
   * @param keywords
   */
  addCustomKeyWord(keywords) {
    keywords = keywords || [];
    this.languageTools.addCompleter({
      getCompletions: function (editor, session, pos, prefix, callback) {
        let arrs = keywords.map(function (word) {
          return {
            name: word,
            value: word,
            score: 1000,
            meta: "table"
          };
        });
        callback(null, arrs);
      }
    });
  }

  /**
   * 生成UUID
   * @param len 指定生成项的长度
   * @param radix 范围  比如设置 2 , 就只会生成 0101010之类的
   * @returns {string}
   */
  getUUID(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }

  /**
   * 获取选中的值
   */
  getSelectedValue() {
    return this.editor.session.getTextRange(this.editor.getSelectionRange());
  }

  /**
   * 设置只读[提供外部使用]
   */
  changeReadOnly() {
    this.setState({readOnly: !this.state.readOnly})
  }

  /**
   * 修改代码提示类型[提供外部使用]
   * @param e
   */
  changeLanguage(e) {
    this.setState({mode: e.target.value})
  }

  /**
   * 设置自动提示[提供外部使用]
   */
  enableAutoCompletion() {
    this.setState({autoCompletion: !this.state.autoCompletion})
  }

  /**
   * 插入值[提供外部使用]
   */
  insertValue(value) {
    this.editor.insert(value);
  }

  render() {
    return (
      <div disabled={this.state.readOnly} id={this.editorId} className="bdos-ide">
        {this.props.children}
      </div>
    );
  }
}


IDE.propTypes = {
  keys: PropTypes.array,  //自定义关键字
  completes: PropTypes.array,  //自定义提示内容

  onComplete: PropTypes.func,  //遇到 . 则获取提示信息,弹出提示
  onChange: PropTypes.func
}
IDE.defaultProps = {
  keys: [],
  completes: []
}

export default IDE
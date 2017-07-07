export default (function () {
  /**
   * 设置某个标签可以拖动
   * @param config bar 可以拖动的位置   target 移动的容器  callback 拖动的回调，返回坐标
   * @constructor
   */
  function Drag(config) {
    this.bar = config.bar
    this.target = config.target || config.bar
    this.callback = config.callback || null

    this.params = {
      left: 0,
      top: 0,
      currentX: 0,
      currentY: 0,
      flag: false
    }

    /**
     * 获取相关CSS属性[公用的]
     * @param  {[type]} o   [对象]
     * @param  {[type]} key [样式名]
     * @return {[type]}     [description]
     */
    const getCss = function (o, key) {
      return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key]
    }

    /**
     * 拖拽的实现
     * @param  {[type]}   bar      [拖拽栏]
     * @param  {[type]}   target   [拖拽目标，如果没有拖拽栏，则设置 bar 和 callback]
     * @param  {Function} callback [拖拽的回调函数]
     * @return {[type]}            [description]
     */
    this.startDrag = function () {
      const that = this

      if (getCss(that.target, 'left') !== 'auto') {
        that.params.left = getCss(that.target, 'left')
      }
      if (getCss(that.target, 'top') !== 'auto') {
        that.params.top = getCss(that.target, 'top')
      }
      // o是移动对象
      that.bar.onmousedown = function (event) {
        that.params.flag = true
        if (!event) {
          event = window.event
          // 防止IE文字选中
          that.bar.onselectstart = function () {
            return false
          }
        }
        const e = event
        that.params.currentX = e.clientX
        that.params.currentY = e.clientY

        document.onmouseup = function () {
          that.params.flag = false
          if (getCss(that.target, 'left') !== 'auto') {
            that.params.left = getCss(that.target, 'left')
          }
          if (getCss(that.target, 'top') !== 'auto') {
            that.params.top = getCss(that.target, 'top')
          }
          if (typeof that.callback == 'function') {
            // 返回移动控件的左上角坐标
            that.callback && that.callback(parseInt(that.params.left), parseInt(that.params.top), event)
          }
        }
        document.onmousemove = function (event) {
          const e = event ? event : window.event
          if (that.params.flag) {
            const nowX = e.clientX,
              nowY = e.clientY
            const disX = nowX - that.params.currentX,
              disY = nowY - that.params.currentY

            let x = parseInt(that.params.left) + disX
            let y = parseInt(that.params.top) + disY

            if (x < 0) x = 0
            if (y < 0) y = 0

            that.target.style.left = x + 'px'
            that.target.style.top = y + 'px'
          }
        }
      }

    }
    // 启动拖拽
    this.startDrag()
  }


  /**
   * 设置图元拖动到工作区的功能
   * @param id 工作区间的 id
   * @param callbackDrop 放下的回调函数
   */
  function dragNode2Paper(id, callbackDrop) {

    const elePapers = document.getElementsByName(id),
      eleDrags = document.querySelectorAll('.dialog-group-content img'),
      lDrags = eleDrags.length || 0
    let elePaper;
    if(elePapers)
      elePaper=elePapers[elePapers.length-1];
    for (let i = 0; i < lDrags; i += 1) {
      eleDrags[i].onselectstart = null;
      eleDrags[i].ondragstart = null;
      eleDrags[i].ondragend = null;
      eleDrags[i].ondragstart = null;

      // 清除选中文字的节点
      eleDrags[i].onselectstart = function () {
        return false
      }

      /* 拖拽开始 */
      eleDrags[i].ondragstart = function (ev) {
        ev.dataTransfer.effectAllowed = 'move'
        const data = {
          format:"tools",//重从具栏中拖拽
          id: ev.target.getAttribute('data-id'),
          label: ev.target.title,
          src: ev.target.src
        }
        ev.dataTransfer.setData('data', JSON.stringify(data))
        ev.dataTransfer.setDragImage(ev.target, 0, 0)
        return true
      }

      /* 拖拽结束 */
      eleDrags[i].ondragend = function (ev) {
        //ev.dataTransfer.clearData('data')
        return true
      }
    }

    if (elePaper) {
      elePaper.ondragover = null;
      elePaper.ondragenter = null;
      elePaper.ondrop = null;

      /*拖拽元素在目标元素头上移动的时候*/
      elePaper.ondragover = function (ev) {
        ev.preventDefault()
        return true
      }

      /*拖拽元素进入目标元素头上的时候*/
      elePaper.ondragenter = function (ev) {
        //this.style.color = '#ffffff'
        return true
      }
      /*拖拽元素进入目标元素头上，同时鼠标松开的时候*/
      elePaper.ondrop = function (ev) {
        ev.preventDefault();
        //因为 dataTransfer 只保存了 字符串，所有需要把字符串变成对象
        let data = JSON.parse(ev.dataTransfer.getData('data'))
        callbackDrop && callbackDrop(ev, data)
      }
    }
  }

  return {
    Drag: Drag,
    dragNode2Paper: dragNode2Paper
  }
})()
1,去掉折点：在joint.js
        删除这个  this._vertexIdx = this.addVertex({ x: x, y: y });
2,前进后退joint.commandmanager.js中：
        addCommand: function (a, b, c, d) {//：  if(window.__tempLine__===true)  标识是否记录撤销前进操作
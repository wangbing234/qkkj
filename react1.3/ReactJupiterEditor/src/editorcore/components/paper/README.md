#Paper组件说明

---

## 1. paper 组件数据格式要求:

    不同的图元类型,对数据的要求是不一样的,但是一些最基本的属性是必须的

## 2. 当前 paper 组件 里面的组件 只支持一种 类型的 图元 .  上面图片,下面文字
### 2.1 nodeShape.js 组件(上面图片,下面文字)
    configId:                         图元对应配置的id    [必须] 
    position: {x: x, y: y}            图元位置坐标        [必须] 
    size: {width: 60, height: 60}     图元大小           [必须] 
    label                             图元显示的名字      [根据图元类型来] 
    src                               图元显示的图片地址   [根据图元类型来] 
    data                              图元上保存的业务逻辑数据(不会改动.直接赋值到图元上) 
    
    在框架外部需要实现一个中间件, 把数据解析成 框架需要的格式,这样不管什么样的数据格式,都可以相对应的解析出来.
    
---

这些事件已经在paper里面注册了,可以 dispatch 事件 来触发

    /**
     * 注册,派发的事件名
     * @type {{}}
     */
    const EVENTNAMES = {
      ADDLINE: '_paper_addLine',      //添加线段,提供给工具栏拖拽生成节点
      DELETE: 'paper_delete',         //删除,删除节点
      UNDO: 'paper_undo',             //后退
      REDO: 'paper_redo',             //前进
      CLEAN: 'paper_clean',           //清除
      SAVE: 'paper_save',             //保存
      CREATENODE: 'paper_createNode', //创建节点
      SAVECELLS: 'paper_saveCells',   //触发保存事件时抛出 工作区间的所有节点
      FORMSAVE: '_paper_formSave',    //节点弹窗保存派发出的事件
    }


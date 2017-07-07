/***************************************************
 * 时间: 16/4/27 14:12
 * 作者: zhongxia
 * 说明: 创建一个图元节点控件  Create a custom element.
 *      上面展示图片,下面展示文字
 ***************************************************/

joint.shapes.html = {
  Element: joint.shapes.basic.Rect.extend({
    defaults: joint.util.deepSupplement({
      type: 'html.Element',
      attrs: {
        rect: {stroke: 'none', 'fill-opacity': 0}
      }
    }, joint.shapes.basic.Rect.prototype.defaults)
  }),
  ElementView: joint.dia.ElementView.extend({
    template: [
      '<div class="html-element">',
      '<button class="addLine">U</button>',
      '   <img class="img" src="src/common/imgs/editor/Decision.png"/>',
      '   <div class="text"> <label>label</label> </div>',
      '</div>'
    ].join(''),

    initialize: function () {
      _.bindAll(this, 'updateBox');
      joint.dia.ElementView.prototype.initialize.apply(this, arguments);

      this.$box = $(_.template(this.template)());

      this.$box.find('.addLine').on('mousedown', this.model, this.addLine);

      this.model.on('change', this.updateBox, this);
      this.model.on('remove', this.removeBox, this);

      this.updateBox();
    },
    render: function () {
      joint.dia.ElementView.prototype.render.apply(this, arguments);
      this.paper.$el.prepend(this.$box);
      this.updateBox();
      return this;
    },
    updateBox: function () {
      // Set the position and dimension of the box so that it covers the JointJS element.
      var bbox = this.model.getBBox();
      // Example of updating the HTML with a config stored in the cell model.
      this.$box.find('label').text(this.model.get('label'));
      this.$box.find('img').attr('src', this.model.get('src'));
      this.$box.css({
        width: bbox.width,
        height: bbox.height,
        left: bbox.x,
        top: bbox.y,
        transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
      });
    },
    removeBox: function (evt) {
      this.$box.remove();
    },
    addLine: function (evt) {
      EventEmitter.dispatch('_paper_addLine', evt.data);
    }
  })
};

export default joint.shapes.html.Element;
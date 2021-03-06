joint.ui.Navigator = Backbone.View.extend({
  className: "navigator",
  events: {
    "mousedown .paper": "scrollTo",
    "touchstart .paper": "scrollTo",
    mousedown: "startAction",
    touchstart: "startAction"
  },
  options: {
    paperConstructor: joint.dia.Paper,
    paperOptions: {},
    zoomOptions: {min: .1, max: 10},
    width: 300,
    height: 200,
    padding: 10
  },
  initialize: function (a) {
    this.options = _.extend({}, _.result(this, "options"), a || {}), _.bindAll(this, "updateCurrentView", "doAction", "stopAction"), this.updateCurrentView = _.debounce(this.updateCurrentView, 0);
    var b = this.options.paperScroller;
    b.$el.on("scroll.navigator", this.updateCurrentView);
    var c = this.sourcePaper = b.options.paper;
    this.listenTo(c, "resize", this.updatePaper);
    this.targetPaper = new this.options.paperConstructor(_.merge({
      model: c.model,
      interactive: !1
    }, this.options.paperOptions));
    $(document.body).on({
      "mousemove.navigator touchmove.navigator": this.doAction,
      "mouseup.navigator touchend.navigator": this.stopAction
    })
  },
  render: function () {
    return this.targetPaper.$el.appendTo(this.el), this.sourcePaper.model.get("cells").each(this.targetPaper.renderView, this.targetPaper), this.$currentViewControl = $("<div>").addClass("current-view-control"), this.$currentView = $("<div>").addClass("current-view").append(this.$currentViewControl), this.$el.append(this.$currentView).css({
      width: this.options.width,
      height: this.options.height,
      padding: this.options.padding
    }), this.updatePaper(this.sourcePaper.options.width, this.sourcePaper.options.height), this
  },
  updatePaper: function (a, b) {
    var c = this.sourcePaper.options.origin, d = V(this.sourcePaper.viewport).scale(), e = this.options.width - 2 * this.options.padding, f = this.options.height - 2 * this.options.padding;
    a /= d.sx, b /= d.sy;
    var g = this.ratio = Math.min(e / a, f / b), h = c.x * g / d.sx, i = c.y * g / d.sy;
    a *= g, b *= g, this.targetPaper.setDimensions(a, b), this.targetPaper.setOrigin(h, i), this.targetPaper.scale(g, g), this.updateCurrentView()
  },
  updateCurrentView: function () {
    var a = this.ratio, b = V(this.sourcePaper.viewport).scale(), c = this.options.paperScroller, d = c.toLocalPoint(0, 0), e = this.targetPaper.$el.position(), f = V(this.targetPaper.viewport).translate();
    f.ty = f.ty || 0, this.currentViewGeometry = {
      top: e.top + d.y * a + f.ty,
      left: e.left + d.x * a + f.tx,
      width: c.$el.innerWidth() * a / b.sx,
      height: c.$el.innerHeight() * a / b.sy
    }, this.$currentView.css(this.currentViewGeometry)
  },
  startAction: function (a) {
    a = joint.util.normalizeEvent(a), this._action = $(a.target).hasClass("current-view-control") ? "zooming" : "panning", this._clientX = a.clientX, this._clientY = a.clientY
  },
  doAction: function (a) {
    if (this._action) {
      a = joint.util.normalizeEvent(a);
      var b = V(this.sourcePaper.viewport).scale(), c = (a.clientX - this._clientX) * b.sx, d = (a.clientY - this._clientY) * b.sy;
      switch (this._action) {
        case"panning":
          this.options.paperScroller.el.scrollLeft += c / this.ratio, this.options.paperScroller.el.scrollTop += d / this.ratio;
          break;
        case"zooming":
          var e = -c / this.currentViewGeometry.width;
          this.options.paperScroller.zoom(e, this.options.zoomOptions)
      }
      this._clientX = a.clientX, this._clientY = a.clientY
    }
  },
  stopAction: function () {
    delete this._action
  },
  scrollTo: function (a) {
    a = joint.util.normalizeEvent(a);
    var b = V(this.targetPaper.viewport).translate();
    b.ty = b.ty || 0;
    var c, d;
    if (_.isUndefined(a.offsetX)) {
      var e = this.targetPaper.$el.offset();
      c = a.pageX - e.left, d = a.pageY - e.top
    } else c = a.offsetX, d = a.offsetY;
    var f = (c - b.tx) / this.ratio, g = (d - b.ty) / this.ratio;
    this.options.paperScroller.center(f, g)
  },
  remove: function () {
    this.targetPaper.remove(), this.options.paperScroller.$el.off(".navigator"), $(document.body).off(".navigator"), Backbone.View.prototype.remove.apply(this, arguments)
  }
});

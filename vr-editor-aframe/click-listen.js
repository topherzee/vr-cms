// Component to change to a sequential color on click.
// var is_dragging = false;

AFRAME.registerComponent("cursor-listener", {
  // schema: {
  //   is_dragging: { type: "boolean", default: false },
  // },
  init: function () {
    var lastIndex = -1;
    var COLORS = ["red", "green", "blue"];
    this.el.addEventListener("mousedown", function (evt) {
      lastIndex = (lastIndex + 1) % COLORS.length;
      this.setAttribute("material", "color", COLORS[lastIndex]);
      console.log("I was mousedown at: ", evt.detail.intersection.point);
      this.is_dragging = true;
    });

    this.el.addEventListener("mouseup", function (evt) {
      //lastIndex = (lastIndex + 1) % COLORS.length;
      //this.setAttribute("material", "color", COLORS[lastIndex]);

      this.is_dragging = false;
      if (evt.detail.intersection) {
        console.log("upp: ", evt.detail.intersection.point);
      }
    });
    this.el.addEventListener("mouseleave", function (evt) {
      this.is_dragging = false;
    });

    // this.el.addEventListener("click", function (evt) {
    //   lastIndex = (lastIndex + 1) % COLORS.length;
    //   this.setAttribute("material", "color", COLORS[lastIndex]);
    //   console.log("I was click at: ", evt.detail.intersection.point);
    // });
  },

  tick: function () {
    //this.el.object3D.rotation.y += 0.001;
    if (this.el.is_dragging) {
      //console.log("DraGGY:" + this.el.getAttribute("id"));
    }
  },
});

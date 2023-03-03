// Component to change to a sequential color on click.
// var is_dragging = false;

let desktop = false;

AFRAME.registerComponent("x-button-listener", {
  init: function () {
    var el = this.el;
    el.addEventListener("xbuttondown", function (evt) {
      el.setAttribute("visible", !el.getAttribute("visible"));
    });
  },
});

AFRAME.registerComponent("pointer", {
  init: function () {
    let mesh = document
      .querySelector("#intersection-signal")
      .getObject3D("mesh");

    this.el.addEventListener("raycaster-intersection", function (event) {
      this.setAttribute("line", "color", "#FFFFFF");
      mesh.material.color.set("#CCCCCC");
    });

    this.el.addEventListener(
      "raycaster-intersection-cleared",
      function (event) {
        this.setAttribute("line", "color", "#CCCCCC");
        mesh.material.color.set("#444444");
      }
    );
  },
});

AFRAME.registerComponent("cursor-listener", {
  // schema: {
  //   is_dragging: { type: "boolean", default: false },
  // },

  init: function () {
    var lastIndex = -1;
    var COLORS = ["red", "green", "blue"];

    let that = this;
    this.setColor = this.setColor.bind(this);

    // var el = this.el;
    // el.addEventListener("xbuttondown", function (evt) {
    //   el.setAttribute("visible", !el.getAttribute("visible"));
    // });

    this.el.addEventListener("click", function (evt) {
      if (!desktop) {
        return;
      }

      lastIndex = (lastIndex + 1) % COLORS.length;
      // this.setAttribute("material", "color", COLORS[lastIndex]);

      console.log("I was mousedown at: ", evt.detail.intersection.point);
      this.is_dragging = true;
      that.setColor();

      let c = document.getElementById("cursor");
      let c2 = c.object3D;
      //console.log("c: ", c2);
      let d = this.object3D;
      console.log("d: ", d);
      //.attach(this.el.object3D);
      c2.attach(d);
    });

    this.el.addEventListener("click", function (evt) {
      if (!desktop) {
        return;
      }

      lastIndex = (lastIndex + 1) % COLORS.length;
      // this.setAttribute("material", "color", COLORS[lastIndex]);

      console.log("I was mousedown at: ", evt.detail.intersection.point);
      this.is_dragging = true;
      that.setColor();

      let c = document.getElementById("cursor");
      let c2 = c.object3D;
      //console.log("c: ", c2);
      let d = this.object3D;
      console.log("d: ", d);
      //.attach(this.el.object3D);
      c2.attach(d);
    });

    this.el.addEventListener("mouseup", function (evt) {
      //lastIndex = (lastIndex + 1) % COLORS.length;
      //this.setAttribute("material", "color", COLORS[lastIndex]);

      this.is_dragging = false;
      if (evt.detail.intersection) {
        console.log("upp: ", evt.detail.intersection.point);
      }
      that.setColor();

      let s = document.getElementById("scene");
      let s2 = s.object3D;
      //console.log("d: ", d);
      //.attach(this.el.object3D);
      s2.attach(this.object3D);
    });

    this.el.addEventListener("mouseleave", function (evt) {
      this.is_dragging = false;
      that.setColor();
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
  setColor: function () {
    console.log("setColor()");
    if (this.el.is_dragging) {
      //console.log("DraGGY:" + this.el.getAttribute("id"));
      this.el.setAttribute("material", "color", "green");
    } else {
      this.el.setAttribute("material", "color", "red");
    }
  },
});

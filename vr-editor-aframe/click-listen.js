// Component to change to a sequential color on click.
// var is_dragging = false;

let desktop = false;

let hoverEl = null;

AFRAME.registerComponent("mover", {
  init: function () {
    let that = this;
    this.setHover = this.setHover.bind(this);
    this.setColors = this.setColors.bind(this);

    this.el.addEventListener("raycaster-intersection", function (event) {
      let el = this.components.raycaster.intersectedEls[0] || null;
      console.log("mover intersect. Top: ", el.id); //event.detail.intersection.point);
      that.setHover(el);
    });

    this.el.addEventListener(
      "raycaster-intersection-cleared",
      function (event) {
        let el = this.components.raycaster.intersectedEls[0] || null;
        let id = el ? el.id : "nothing";
        console.log("mover cleared. Top: ", id); //event.detail.intersection.point);
        that.setHover(el);
      }
    );

    this.el.addEventListener("mousedown", function (evt) {
      console.log("mousedown()");
      this.is_dragging = true;
      if (hoverEl) {
        // hoverEl.setAttribute("material", "emmisive", "#000");
        hoverEl.setAttribute("material", "color", "pink");

        // let c = document.getElementById("cursor");
        let c2 = this.object3D;
        // console.log("c: ", c2);
        let d = hoverEl.object3D;
        // console.log("d: ", d);
        c2.attach(d);
        console.log("start drag");
      }

      //that.setHover(hoverEl);
    });

    this.el.addEventListener("mouseup", function (evt) {
      console.log("mouseup()");
      //lastIndex = (lastIndex + 1) % COLORS.length;
      //this.setAttribute("material", "color", COLORS[lastIndex]);

      this.is_dragging = false;
      // if (evt.detail.intersection) {
      //   console.log("upp: ", evt.detail.intersection.point);
      // }
      // that.setColor();
      if (hoverEl) {
        // hoverEl.setAttribute("material", "emmisive", "#000");
        hoverEl.setAttribute("material", "color", hoverColor);

        let s = document.getElementById("scene");
        let s2 = s.object3D;
        //console.log("d: ", d);
        //.attach(this.el.object3D);
        s2.attach(hoverEl.object3D);
        console.log("stop drag");
      } else {
        //if there was no hover... check if we are now intersecting something
        let el = this.components.raycaster.intersectedEls[0] || null;
        console.log("mover mouseup. Top: ", el ? el.id : "nothing"); //event.detail.intersection.point);
        that.setHover(el);
      }
    });
  },

  setHover: function (el) {
    console.log("setHover() 1");

    if (this.el.is_dragging) {
      return;
    }

    console.log("setHover() 2 - not dragging");

    //cleaar the old one
    if (hoverEl) {
      // hoverEl.setAttribute("material", "emmisive", "#000");
      hoverEl.setAttribute("material", "color", hoverColor);
      hoverEl = null;
    }

    if (!el) {
      // console.log("mover cleared", "NO ELEMENT");
    } else {
      //element is on top
      //activate the new one
      hoverColor = el.getAttribute("color");

      el.setAttribute("material", "color", "green");
      hoverEl = el;
    }
  },

  setColors: function (el) {
    console.log("setColors(): ");
  },
});

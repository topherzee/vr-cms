// Component to change to a sequential color on click.
// var is_dragging = false;

let desktop = false;

let hoverEl = null;
let hoverDropEl = null;
let is_dragging = false;

function getIntersectedItemWithClass(that, className) {
  let els = that.components.raycaster.intersectedEls;
  let dropEl = null;
  for (let i = 0; i < els.length; i++) {
    let el = els[i];
    if (el.classList.contains(className)) {
      dropEl = el;
      break;
    }
  }
  return dropEl;
}

AFRAME.registerComponent("mover", {
  init: function () {
    let that = this;
    this.setHover = this.setHover.bind(this);
    this.setColors = this.setColors.bind(this);

    this.el.addEventListener("raycaster-intersection", function (event) {
      if (is_dragging) {
        // check for droptarget.
        console.log("intersect while dragging: ");
        let el = getIntersectedItemWithClass(this, "droptarget");
        that.setDropHover(el);
      } else {
        // check for movable.
        let el = getIntersectedItemWithClass(this, "movable");
        //let el = this.components.raycaster.intersectedEls[0] || null;
        console.log("intersect. Top: ", el.id); //event.detail.intersection.point);
        that.setHover(el);
      }
    });

    this.el.addEventListener(
      "raycaster-intersection-cleared",
      function (event) {
        // console.log("cleared while dragging: ");
        //do we need thiss? TODO
        let dropEl = getIntersectedItemWithClass(this, "droptarget");
        that.setDropHover(dropEl);

        // let el = this.components.raycaster.intersectedEls[0] || null;
        let el = getIntersectedItemWithClass(this, "movable");
        let id = el ? el.id : "nothing";
        console.log("mover cleared. Top: ", id); //event.detail.intersection.point);
        that.setHover(el);
      }
    );

    this.el.addEventListener("mousedown", function (evt) {
      console.log("mousedown()");

      if (hoverEl) {
        is_dragging = true;
        // hoverEl.setAttribute("material", "emmisive", "#000");
        // hoverEl.setAttribute("material", "color", "pink");
        hoverEl.setAttribute("material", "opacity", 0.5);

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
      is_dragging = false;

      if (hoverDropEl) {
      }
      that.setDropHover(null);

      if (hoverEl) {
        hoverEl.setAttribute("material", "opacity", 1.0);

        let s = document.getElementById("scene");
        let s2 = s.object3D;
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

    if (is_dragging) {
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

  setDropHover: function (el) {
    console.log("setDropHover() 1");

    //cleaar the old one
    if (hoverDropEl) {
      // hoverEl.setAttribute("material", "emmisive", "#000");
      hoverDropEl.setAttribute("material", "color", "#999");
      hoverDropEl = null;
    }

    if (el) {
      console.log("drop: ", el.id);
      el.setAttribute("material", "color", "#9f9");
      hoverDropEl = el;
    } else {
      // console.log("NO DROPP");
      // hoverDropEl && hoverDropEl.setAttribute("material", "color", "#999");
      // hoverDropEl = null;
    }
  },

  setColors: function (el) {
    console.log("setColors(): ");
  },
});

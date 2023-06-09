// Component to change to a sequential color on click.
// var is_dragging = false;

let desktop = false;

let hoverEl = null;
let hoverDropEl = null;
let is_dragging = false;
let tentative_id = null;

let HOVER_COLOR = "orange";
let DROP_TARGET_COLOR = "orange";
let DROP_TARGET_OFF_COLOR = "#999";
let DRAG_COLOR = "blue";

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
let POS_LEN = 30;

AFRAME.registerComponent("mover", {
  tick: function (time, timeDelta) {
    // Prevent the dragged item getting hidden behind the UI.
    if (hoverEl) {
      if (is_dragging) {
        var world = new THREE.Vector3();
        hoverEl.object3D.getWorldPosition(world);
        //console.log("tick: z:", world.z);
        if (world.z < SCREEN_Z + SCREEN_Z_DRAG_BUFFER) {
          //console.log("tick: less-than z:", world.z);
          const debugConsole = document.getElementById("debugConsole");
          debugConsole.setAttribute("value", "Z:" + world.z.toFixed(2));
          hoverEl.object3D.getWorldPosition(world);
          console.log("tick: move back to :", world.z);
          let p = hoverEl.object3D.position;
          p.divideScalar(1.01);
        }
      }
    }
  },
  init: function () {
    let that = this;
    this.setHover = this.setHover.bind(this);
    this.setColors = this.setColors.bind(this);
    this.startDrag = this.startDrag.bind(this);

    // IN PROGRESS
    this.el.addEventListener("controllerconnected", function (evt) {
      console.log("Controlller CONNECRED");

      //Remove the Gaze cursor.
      let c = document.getElementById("cursor");
      if (c) {
        c.parentElement.removeChild(c);
      }
    });

    // this.el.addEventListener("controllerconnected", function (evt) {
    //   console.log("controllerdisconnected DISCONNECRED");
    // });

    this.el.addEventListener("raycaster-intersection", function (event) {
      if (is_dragging) {
        // check for droptarget.
        //console.log("intersect while dragging: ");
        let el = getIntersectedItemWithClass(this, "droptarget");
        that.checkForDropHover(el);
      } else {
        // check for movable.
        let el = getIntersectedItemWithClass(this, "movable");
        //let el = this.components.raycaster.intersectedEls[0] || null;
        // console.log("intersect. Top: ", el.id); //event.detail.intersection.point);

        //IN_PROGRESS
        that.setHover(el);
      }
    });

    this.el.addEventListener(
      "raycaster-intersection-cleared",
      function (event) {
        // console.log("cleared while dragging: ");
        //do we need thiss? TODO
        if (is_dragging) {
          let dropEl = getIntersectedItemWithClass(this, "droptarget");
          that.checkForDropHover(dropEl);
        }

        // let el = this.components.raycaster.intersectedEls[0] || null;
        let el = getIntersectedItemWithClass(this, "movable");
        let id = el ? el.id : "nothing";
        console.log("RAYCASTER cleared. Top: ", id); //event.detail.intersection.point);
        // (IN_PROGRESS)
        that.setHover(el);
      }
    );

    this.el.addEventListener("mousedown", function (evt) {
      console.log("mousedown()");

      if (hoverEl) {
        that.startDrag(this, null);
        return;
      }

      // Check for top nav
      let el = getIntersectedItemWithClass(this, "top-nav");
      if (el) {
        console.log("CLICK ON TOP NAV");

        if (DEMO_STATE == 0) {
          let assetsEl = document.getElementById("assetsHolder");
          if (assetsEl) {
            assetsEl.setAttribute("visible", true);
          }
          DEMO_STATE++;
          return;
        }

        if (DEMO_STATE == 1) {
          let toursEl = document.getElementById("toursHolder");
          if (toursEl) {
            toursEl.setAttribute("visible", true);
          }
          DEMO_STATE++;
          return;
        }
      }

      //that.setHover(hoverEl);
    });

    this.el.addEventListener("mouseup", function (evt) {
      console.log("mouseup()");

      //if dragging something
      if (!is_dragging) {
        return;
      }

      let is_thrown = false;
      is_dragging = false;
      hoverEl.classList.add("movable");
      tentative_id = null;

      hoverEl.setAttribute("material", "opacity", 1.0);
      let is_menu_item =
        hoverEl.getAttribute("elementType") === ELEMENT_TYPE_MENU;

      if (hoverDropEl) {
        hoverDropEl.setAttribute("material", "color", DROP_TARGET_OFF_COLOR);
      }

      //If hovering on drop target - Put the item there.
      if (hoverDropEl) {
        console.log("StopDrag 1 - Drop on Item");
        // Handle drop on target!
        // Change the tentative item into fixed item.
        let id = getId(hoverDropEl);
        let t = document.getElementById(id);
        let parentArray = getParentArray(t);
        var i = parentArray.findIndex((c) => c.name == id);
        parentArray[i + 1].tentative = false;
        renderPage();
        // hoverEl.parentElement.removeChild(hoverEl);

        console.log("content-tree: ", content_tree);
        console.log("content-menu: ", component_menu);
        renderMenu();
        renderView_Assets();
        renderView_Tours();
      } else {
        // Not dropped on Target.

        // Check Speed of hand. If fast throw the object. IN_PROGRESS.
        var speed = hoverEl.components.throwable.speed;
        console.log("WORKING HERE");
        console.log("HOVER SPEED: ", speed);

        if (speed > 0.01) {
          // Handle Throw - the dragged item should snap back to original position.
          console.log("StopDrag 2 - Throw in Space");
          let vel_local = hoverEl.components.throwable.velocity;
          console.log(
            "vel:" +
              JSON.stringify(hoverEl.components.throwable.velocity, null, 2)
          );
          let s = document.getElementById("pageHolder"); //or to the scene itself?
          let s2 = s.object3D;

          s2.attach(hoverEl.object3D);

          is_thrown = true;

          hoverEl.setAttribute("throwable", {
            flying: true,
          });

          let d = document.getElementById("draggy");
          let throwEl = cloneElement(d);
          throwEl.setAttribute("id", "thrown");
          // throwEl.setAttribute("material", "color", "red");
          s.appendChild(throwEl);

          throwEl.setAttribute("throwable", {
            vel: vel_local,
          });

          console.log("StopDrag 2 b");
        } else {
          // Slow - Put the item back where it was.
          console.log("StopDrag 3 - Slow No Throw");

          if (!is_menu_item) {
            content_tree = JSON.parse(JSON.stringify(content_tree_backup));
          }
        }
      } //hoverEl - Not dropped on Target.

      renderPage();
      renderMenu();
      renderView_Assets();
      renderView_Tours();

      if (hoverEl) {
        console.log("StopDrag 4");
        draggedBlockConfig = null;

        if (true || !is_thrown) {
          console.log("KILL DRAGGY");
          let d = document.getElementById("draggy");
          hoverEl.parentElement.removeChild(hoverEl);
          that.setHover(null);
        }
      } else {
        console.log("stop drag 4 B");

        //if there was no hover... check if we are now intersecting something
        let el = this.components.raycaster.intersectedEls[0] || null;
        console.log("mover mouseup. Top: ", el ? el.id : "nothing"); //event.detail.intersection.point);
      }
    });
  },

  startDrag: function (controlObject) {
    console.log("startDrag() 1", hoverEl.getAttribute("elementType"));

    is_dragging = true;
    //Try to get the laser to go throgh the dragged item
    //TODO - add it back with done dragging?
    hoverEl.classList.remove("movable");

    let is_menu_item =
      hoverEl.getAttribute("elementType") === ELEMENT_TYPE_MENU;

    hoverEl.setAttribute("material", "opacity", 0.3);
    for (var i = 0; i < hoverEl.children.length; i++) {
      let child = hoverEl.children[i];
      child.setAttribute("material", "opacity", 0.3);
      console.log("child: ", i, child.classList);
    }
    hoverEl.removeAttribute("outline");

    //attach item to controller to drag...
    let c2 = controlObject.object3D;
    let d = hoverEl.object3D;
    c2.attach(d);
    console.log("startDrag()) 2");

    //remove from content tree
    if (!is_menu_item) {
      content_tree_backup = JSON.parse(JSON.stringify(content_tree));
    }

    t = hoverEl;
    var id = t.getAttribute("id").split("_")[0];
    console.log("hover id: " + id);
    var item = document.getElementById(id);

    var parentArray = item.parentArray;
    if (!parentArray) {
      return;
    }
    var i = parentArray.findIndex((c) => c.name == id);
    console.log("i: " + i);

    // parentArray[i].tentative = true;
    if (is_menu_item) {
      //draggedBlockConfig is a CLONE, changes DONT affect the original.
      let clone = JSON.parse(JSON.stringify(parentArray[i]));
      draggedBlockConfig = clone;
      draggedBlockConfig.name = draggedBlockConfig.name + "-" + index;
    } else {
      //draggedBlockConfig is a REFERENCE to the conenttree. Changes apply to it.
      draggedBlockConfig = parentArray[i];
    }

    draggedBlockConfig.tentative = true;

    // Remove the item from the configuration. (If its not a menu)

    if (!is_menu_item) {
      // Take out of array.
      parentArray.splice(i, 1);
    }

    //Prep so we can put it back to original location if need be:
    dragged_parentArray = parentArray;
    dragged_index = i;

    //Clone to new element.

    let el = hoverEl;
    let position = el.object3D.position;
    let rotation = el.object3D.rotation;
    let scale = el.object3D.scale;

    // Create new element, copy the current one on it
    el.removeAttribute("outline");
    let newEl = cloneElement(el);
    newEl.parentArray = el.parentArray;

    newEl.setAttribute("id", "draggy");
    // Listener for location, rotation,... when the new el is laded
    relocate = function () {
      newEl.object3D.location = location;
      newEl.object3D.rotation = rotation;
      newEl.object3D.scale = scale;
      // newEl.setAttribute("throwable", "");
    };
    newEl.addEventListener("loaded", relocate, { once: true });

    hoverEl = newEl;
    hoverEl.removeAttribute("outline");
    hoverEl.setAttribute("outline", "color:" + DRAG_COLOR);
    hoverEl.setAttribute("throwable", "");

    // hoverEl.setAttribute("outline", "opacity:" + "0.1");

    controlObject.appendChild(newEl);
    el.parentElement.removeChild(el);

    //clearRender();
    renderPage();
    //renderContent(topBlock, content_tree.content, 100, 0);
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
      // hoverEl.setAttribute("material", "color", hoverColor);
      hoverEl.removeAttribute("outline");

      hoverEl = null;
    }

    if (!el) {
      // console.log("mover cleared", "NO ELEMENT");
    } else {
      //element is on top
      //activate the new one
      // hoverColor = el.getAttribute("color");

      // el.setAttribute("material", "color", "green");
      el.setAttribute("outline", "color:" + HOVER_COLOR);

      hoverEl = el;
    }
  },

  //Hovering on a drop target.
  checkForDropHover: function (el) {
    if (hoverDropEl) {
      //Currently hovering
      //Did we drop it?
      if (!el || el != hoverDropEl) {
        //yes

        stopDropHover();
      }
    }

    // if not currently hovering - and just moved over a drop target
    if (!hoverDropEl && el) {
      startDropHover(el);
    }
  },

  setColors: function (el) {
    console.log("setColors(): ");
  },
});

function cloneElement(el) {
  let newEl = document.createElement(el.tagName);
  if (el.hasAttributes()) {
    let attrs = el.attributes;
    for (var i = attrs.length - 1; i >= 0; i--) {
      let attrName = attrs[i].name;
      let attrVal = el.getAttribute(attrName);
      newEl.setAttribute(attrName, attrVal);
    }

    for (var i = el.children.length - 1; i >= 0; i--) {
      if (!el.children[i].classList.contains("droptarget")) {
        newEl.appendChild(cloneElement(el.children[i]));
      }
    }
  }

  return newEl;
}

//el is the little drop bar.
function startDropHover(el) {
  console.log("startDropHover: ", el.id);
  el.setAttribute("material", "color", DROP_TARGET_COLOR);
  hoverDropEl = el;

  // el.setAttribute("visible", "true");
  // el.setAttribute("material", "opacity", 0.5);
  // hoverEl.setAttribute("visible", "false");
  //TODO. Does not work for some reason
  // hoverEl.setAttribute("material", "opacity", 0.0);
  // for (var i = 0; i < hoverEl.children.length; i++) {
  //   let child = hoverEl.children[i];
  //   child.setAttribute("material", "opacity", 0.0);
  //   // console.log("child: ", i, child.classList);
  // }

  // Put tentatative item in the config
  let t = hoverDropEl;

  let id = getId(t);
  if (!id) {
    return;
  }

  insertBlockAfter(id);
}
/**
 *
 * @param {*} id - Insert draggedBlockConfig after element with this id.
 */
function insertBlockAfter(id) {
  console.log("insertBlockAfter: ", id);
  let t = document.getElementById(id);
  let parentArray = getParentArray(t);
  var i = parentArray.findIndex((c) => c.name == id);
  console.log("insertBlockAfter i: " + i);

  //Put the config in the content_tree.
  tentative_id = draggedBlockConfig.name;
  let clone = JSON.parse(JSON.stringify(draggedBlockConfig));

  console.log(content_tree);
  parentArray.splice(i + 1, 0, clone);

  console.log(content_tree);

  renderPage();
  // hoverEl.setAttribute("material", "opacity", 0.0);
}

// let time_last_add = new Date().getTime();
// let TIME_DELAY = 100;

function stopDropHover() {
  console.log("stopDropHover()");
  hoverDropEl.setAttribute("material", "color", DROP_TARGET_OFF_COLOR);
  // hoverDropEl.setAttribute("visible", "true");
  // hoverDropEl.setAttribute("material", "opacity", 0.5);

  //hoverDropEl = null;
  // hoverEl.setAttribute("visible", "true");

  //let t = hoverDropEl;
  let id = tentative_id;
  tentative_id = null;
  hoverDropEl = null;

  console.log("id: ", id);
  if (!id) {
    return;
  }

  //remove item from config
  let t = document.getElementById(id);

  let parentArray = getParentArray(t);
  var i = parentArray.findIndex((c) => c.name == id);
  console.log("i: " + i);

  parentArray.splice(i, 1);

  //remove DOM element
  t.parentNode.removeChild(t);

  renderPage();
}

function getId(t) {
  var id = t.getAttribute("id").split("_")[0];
  return id;
}

function getParentArray(t) {
  let id = getId(t);
  console.log("hover id: " + id);
  var item = document.getElementById(id);
  console.log("array:" + item);
  var parentArray = item.parentArray;
  return parentArray;
}

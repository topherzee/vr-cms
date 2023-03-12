// Component to change to a sequential color on click.
// var is_dragging = false;

let desktop = false;

let hoverEl = null;
let hoverDropEl = null;
let is_dragging = false;
let tentative_id = null;

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
    this.startDrag = this.startDrag.bind(this);

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
        console.log("mover cleared. Top: ", id); //event.detail.intersection.point);
        that.setHover(el);
      }
    );

    this.el.addEventListener("mousedown", function (evt) {
      console.log("mousedown()");

      if (hoverEl) {
        that.startDrag(this, null);
      }

      //that.setHover(hoverEl);
    });

    this.el.addEventListener("mouseup", function (evt) {
      console.log("mouseup()");

      //if dragging something
      if (!is_dragging) {
        return;
      }
      is_dragging = false;
      tentative_id = null;
      hoverEl.setAttribute("material", "opacity", 1.0);
      let is_menu_item =
        hoverEl.getAttribute("elementType") === ELEMENT_TYPE_MENU;

      //If hovering on drop target - Put the item there.
      if (hoverDropEl) {
        console.log("stop drag 1 - Drop on Item");
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
      } else {
        // Handle drop in space - the dragged item should snap back to original position.
        console.log("stop drag 2 - Drop in Space");
        if (!is_menu_item) {
          content_tree = JSON.parse(JSON.stringify(content_tree_backup));
        }
        renderPage();
        renderMenu();
        //that.checkForDropHover(null);
      } //hoverEl

      if (hoverEl) {
        console.log("stop drag 3");
        draggedBlockConfig = null;

        // let s = document.getElementById("scene");

        // Current problem - when you let go of the item it should dissapear - the draaggy, but now it creates a hole in the layout.
        //KILL DRAGGY
        if (hoverEl.classList.contains("3d-movable")) {
          //OR IF WE WANTED TO DROP ITEM in 3D Space...
          let s = document.getElementById("pageHolder"); //or to the scene itself?
          let s2 = s.object3D;
          s2.attach(hoverEl.object3D);
        } else {
          console.log("KILL DRAGGY");

          let d = document.getElementById("draggy");
          hoverEl.parentElement.removeChild(hoverEl);
          hoverEl = null;
        }

        console.log("stop drag 3");
      } else {
        //if there was no hover... check if we are now intersecting something
        let el = this.components.raycaster.intersectedEls[0] || null;
        console.log("mover mouseup. Top: ", el ? el.id : "nothing"); //event.detail.intersection.point);
        that.setHover(el);
      }
    });
  },

  startDrag: function (controlObject) {
    console.log("startDrag() 1", hoverEl.getAttribute("elementType"));

    is_dragging = true;

    let is_menu_item =
      hoverEl.getAttribute("elementType") === ELEMENT_TYPE_MENU;

    hoverEl.setAttribute("material", "opacity", 0.1);
    for (var i = 0; i < hoverEl.children.length; i++) {
      let child = hoverEl.children[i];
      child.setAttribute("material", "opacity", 0.1);
      // console.log("child: ", i, child.classList);
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
    };
    newEl.addEventListener("loaded", relocate, { once: true });

    hoverEl = newEl;
    hoverEl.removeAttribute("outline");
    hoverEl.setAttribute("outline", "color:blue");

    controlObject.appendChild(newEl);
    el.parentElement.removeChild(el);

    //clearRender();
    renderPage();
    //renderContent(topBlock, content_tree.content, 100, 0);
  },

  setHover: function (el) {
    //console.log("setHover() 1");

    if (is_dragging) {
      return;
    }

    console.log("setHover() 2 - not dragging");

    //cleaar the old one
    if (hoverEl) {
      // hoverEl.setAttribute("material", "emmisive", "#000");
      hoverEl.setAttribute("material", "color", hoverColor);
      hoverEl.removeAttribute("outline");

      hoverEl = null;
    }

    if (!el) {
      // console.log("mover cleared", "NO ELEMENT");
    } else {
      //element is on top
      //activate the new one
      hoverColor = el.getAttribute("color");

      el.setAttribute("material", "color", "green");
      el.setAttribute("outline", "color:orange");

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

function startDropHover(el) {
  console.log("startDropHover: ", el.id);
  el.setAttribute("material", "color", "#9f9");
  hoverDropEl = el;

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
}

// let time_last_add = new Date().getTime();
// let TIME_DELAY = 100;

function stopDropHover() {
  console.log("stopDropHover()");
  hoverDropEl.setAttribute("material", "color", "#999");
  //hoverDropEl = null;

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

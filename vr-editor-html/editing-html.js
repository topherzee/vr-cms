//t is the drag handle.
function startDragHover(t) {
  console.log("startDragHover");
  t.classList.add("hover");
}
function stopDragHover(t) {
  console.log("stopDragHover");
  t.classList.remove("hover");
}

//t is the droptarget.
function startDropHover(t) {
  console.log("startHover");
  dragy.classList.add("overDrop");
  t.classList.add("hover");
  let id = getId(t);
  let parentArray = getParentArray(t);
  var i = parentArray.findIndex((c) => c.name == id);
  console.log("i: " + i);

  // Put the tentative draggedBlockConfig there.
  element_count++;
  let clone = JSON.parse(JSON.stringify(draggedBlockConfig));
  clone.name = `${clone.name}-${element_count}`;
  parentArray.splice(i + 1, 0, clone);
  destConfig = parentArray[i + 1];
  clearRender();
  renderContent(topBlock, content_tree.content, 100, 0);
}
var destConfig = null;

//t is the droptarget.
function stopDropHover(t) {
  console.log("stopHover");
  dragy.classList.remove("overDrop");
  t.classList.remove("hover");
  let id = getId(t);
  let parentArray = getParentArray(t);
  var i = parentArray.findIndex((c) => c.name == id);
  console.log("i: " + i);

  //remove the item from the configuration.
  parentArray.splice(i + 1, 1);
  clearRender();
  renderContent(topBlock, content_tree.content, 100, 0);
}

function getId(t) {
  var id = t.getAttribute("id").split("_")[0];
  return id;
}
function getParentArray(t) {
  let id = getId(t);
  console.log("hover id: " + id);
  var item = document.getElementById(id);
  var parentArray = item.parentArray;
  return parentArray;
}

function checkForDropHover() {
  var hoverDrop = null;

  drops.forEach((t) => {
    // t.classList.remove("hover");
    var r = t.getBoundingClientRect();
    if (x >= r.left && x <= r.right) {
      if (y >= r.top && y <= r.bottom) {
        hoverDrop = t;
      }
    }
  });
  if (hoverDrop != null) {
    if (activeDrop == null) {
      startDropHover(hoverDrop);
      activeDrop = hoverDrop;
    }
  } else {
    if (activeDrop != null) {
      stopDropHover(activeDrop);
      activeDrop = null;
    }
  }
}

function checkForDragHover() {
  // console.log("checkForDragHover")
  var hoverDrag = null;

  drags.forEach((t) => {
    // t.classList.remove("hover");
    var r = t.getBoundingClientRect();
    if (x >= r.left && x <= r.right) {
      if (y >= r.top && y <= r.bottom) {
        hoverDrag = t;
      }
    }
  });
  if (hoverDrag != null) {
    if (activeDrag == null) {
      startDragHover(hoverDrag);
      activeDrag = hoverDrag;
    }
  } else {
    if (activeDrag != null) {
      stopDragHover(activeDrag);
      activeDrag = null;
    }
  }
}

function startMove() {
  console.log("startMove() " + activeDrag.mode);
  var t = activeDrag;

  // mark the item "tentative"
  var id = t.getAttribute("id").split("_")[0];
  console.log("hover id: " + id);
  var item = document.getElementById(id);

  var parentArray = item.parentArray;
  var i = parentArray.findIndex((c) => c.name == id);
  console.log("i: " + i);

  draggedBlockConfig = parentArray[i];

  draggedBlockConfig.tentative = true;

  //remove the item from the configuration.
  if (t.mode == "content-mode") {
    // Take out of array.
    parentArray.splice(i, 1);
  }

  //Prep so we can put it back to original location if need be:
  dragged_parentArray = parentArray;
  dragged_index = i;
  // }else if (t.mode =="menu-mode"){

  // }

  //Start dragging the item.
  dragy.innerHTML = item.innerHTML;
  dragy.classList = item.classList;
  dragy.style.width = item.offsetWidth + "px";
  dragy.style.hieght = item.offsetHeight + "px";
  dragy.style.zIndex = 100;
  dragy.style.display = "block";

  clearRender();
  renderContent(topBlock, content_tree.content, 100, 0);
}

// Add the event listeners for mousedown, mousemove, and mouseup
window.addEventListener("mousedown", (e) => {
  x = e.pageX;
  y = e.pageY;

  if (activeDrag) {
    isDragging = true;
  }

  if (isDragging) {
    startMove();
    moveDragyToMouse();
  }
});

function moveDragyToMouse() {
  dragy.style.top = y + "px";
  dragy.style.left = x + "px";
}

window.addEventListener("mousemove", (e) => {
  x = e.pageX;
  y = e.pageY;

  if (isDragging) {
    moveDragyToMouse();
    checkForDropHover();
  } else {
    checkForDragHover();
  }
});

window.addEventListener("mouseup", (e) => {
  if (isDragging) {
    isDragging = false;

    //put the dragged element where it is - remove dragging

    dragy.style.display = "none";

    if (activeDrop) {
      activeDrop = null;

      var a = document
        .getElementsByClassName("tentative")[0]
        .classList.remove("tentative");
      draggedBlockConfig.tentative = false;
      if (destConfig) {
        destConfig.tentative = false;
      }
    } else {
      //If its not on a drop when you let go of mouse..
      // Put it back!
      if (activeDrag) {
        let t = activeDrag;
        console.log("put dragged item back in original location");

        if (t.mode == "content-mode") {
          // Put the tentative draggedBlockConfig there.
          dragged_parentArray.splice(dragged_index, 0, draggedBlockConfig);
        }
        draggedBlockConfig.tentative = false;

        clearRender();
        renderContent(topBlock, content_tree.content, 100, 0);

        dragged_parentArray = null;
        dragged_index = null;
        activeDrag = null;
      }
    }
  }
});

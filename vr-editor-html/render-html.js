function addDragHandles(id, parent, mode) {
  const newDiv = document.createElement("div");

  parent.appendChild(newDiv);
  newDiv.setAttribute("id", id + "_drag");
  newDiv.className = "dragHandle";
  newDiv.style.top = "0px";
  newDiv.style.left = "0px";
  newDiv.innerHTML = "DRAG";

  newDiv.mode = mode; //"menu-mode" or "content-mode"

  drags.push(newDiv);
}

function addDelete(id, parent) {
  const newDiv = document.createElement("div");

  parent.appendChild(newDiv);
  newDiv.setAttribute("id", id + "_delete");
  newDiv.className = "delete";
  newDiv.style.top = "0px";
  newDiv.style.right = "0px";
  newDiv.innerHTML = "X";

  //drags.push(newDiv);
  newDiv.addEventListener("click", deleteBlock);
}
function deleteBlock(event) {
  var id_delete = event.target.getAttribute("id");
  console.log("delete: " + id_delete);

  var id = id_delete.split("_")[0];
  console.log("hover id: " + id);
  var item = document.getElementById(id);

  var parentArray = item.parentArray;
  var i = parentArray.findIndex((c) => c.name == id);
  console.log("i: " + i);

  // Take out of array.
  parentArray.splice(i, 1);

  clearRender();
  renderContent(topBlock, content_tree.content, 100, 0);
}

//Should they be overlayed?
//Should they be inside the element?
function addDropTargets(id, x, y, width, height, text, parent, orientation) {
  var horiz = orientation && orientation == "horizontal";
  var targets;
  if (horiz) {
    // targets = ["left","right"]
    targets = ["right"];
  } else {
    // targets = ["top","bottom"]
    targets = ["bottom"];
  }

  targets.forEach((t) => {
    const newDiv = document.createElement("div");

    parent.appendChild(newDiv);
    newDiv.setAttribute("id", id + "_drop");
    newDiv.className = "dropTarget";
    if (t === "top") {
      newDiv.style.top = "0px";
      newDiv.innerHTML = "DROP TOP.";
    } else if (t === "bottom") {
      newDiv.style.bottom = "0px";
      newDiv.innerHTML = "DROP " + id;
    } else if (t === "left") {
      newDiv.style.top = "0px";
      newDiv.style.left = "0px";
      newDiv.style.width = "10px";
      newDiv.style.height = "100%";
      newDiv.innerHTML = "L.";
    } else if (t === "right") {
      newDiv.style.top = "0px";
      newDiv.style.right = "0px";
      newDiv.style.height = "100%";
      newDiv.style.width = "10px";
      newDiv.innerHTML = "R.";
    }

    drops.push(newDiv);
  });
}

function addElement(id, x, y, width, height, text, orientation, parentArray) {
  const newDiv = document.createElement("div");
  //   const newContent = document.createTextNode(text||"-");
  //   newDiv.appendChild(newContent);
  newDiv.innerHTML = text || "-";

  // document.body.insertBefore(newDiv, currentDiv);

  newDiv.setAttribute("id", id);
  newDiv.className = "panel";
  newDiv.style.left = x + "px";
  newDiv.style.top = y + "px";

  newDiv.style.width = width + "px";

  newDiv.parentArray = parentArray;

  addDropTargets(id, x, y, width, height, text, newDiv, orientation);
  addDragHandles(id, newDiv, "content-mode");
  addDelete(id, newDiv);
  //return newDiv.offsetHeight;
  return newDiv;
}

function renderItemContent(c, x, y, width, orientation, parentArray) {
  let type = c.type;
  let innerHTML = "";
  if (type === "banner") {
    innerHTML = "<h1>" + c.text + "</h1>";
  } else if (type === "image") {
    innerHTML = "<h1>" + c.text + "</h1>";
  } else {
    innerHTML = c.text;
  }

  // var width = c.width;
  var height = c.height;
  var newDiv = addElement(
    c.name,
    x,
    y,
    width,
    height,
    innerHTML,
    orientation,
    parentArray
  );
  if (c.tentative) {
    newDiv.classList.add("tentative");
  }
  return newDiv;
  //return height;
}

//p = parent.
function renderContent(
  parentBlock,
  content,
  x,
  y,
  width_to_share,
  orientation
) {
  // console.log("renderContent ");
  x = 0;
  var height = 0;

  var horiz = orientation && orientation == "horizontal";
  // console.log("horiz:" + horiz)

  //Get pixels and subtract that from rest
  var width_for_percent = width_to_share - widthOfAllPixels(content);

  var maxHeight = 0; //Need to find max height of any of these items.
  content.forEach((c) => {
    //Width: Change percents to pixels.
    let width = 0;
    if (c.width.indexOf("%") < 1) {
      width = c.width;
    } else {
      let percent = parseInt(c.width.replace("%", ""));
      width = (width_for_percent * percent) / 100;
      // console.log("width: " + width)
    }

    let newBlock = renderItemContent(c, x, y, width, orientation, content);
    parentBlock.appendChild(newBlock);
    height = newBlock.offsetHeight;
    // console.log("height: " + height)

    if (horiz) {
      x += width + 10;
    } else {
      y += height + 10;
    }

    //Recursion
    if (c.content) {
      var heightChildren = renderContent(
        newBlock,
        c.content,
        x,
        height,
        width,
        c.orientation
      );
      let totalHeight = height + heightChildren;
      // console.log(c.name + " height kids: " + heightChildren)
      newBlock.style.height = totalHeight + "px";
      // console.log(c.name + " height: " + totalHeight)

      y += heightChildren;

      //newBlock.style.height = (height + heightChildren) + "px";
      // var bump = y - previousY;
    }
    //TODO Ensure y position of next row - takes these into account.
    //Basically we need the tallest hight of any of the items.
    maxHeight = Math.max(maxHeight, height);
  }); //loop content array.

  if (horiz) {
    y += maxHeight + 10;
  }

  // return y;
  if (horiz) {
    return maxHeight + 10;
  } else {
    return y + 10;
  }
}

function clearRender() {
  const currentDiv = document.getElementById("editor");
  // currentDiv.innerHTML = "";
  currentDiv.replaceChildren();
  //currentDiv.remove();
}

function renderMenu(parentBlock, content) {
  console.log("renderMenu ");
  x = 0;
  y = 0;
  var height = 0;
  var width = 100;

  content.forEach((c) => {
    let innerHTML = "<h1>" + c.text + "</h1>";
    const newDiv = document.createElement("div");
    newDiv.innerHTML = innerHTML;

    newDiv.setAttribute("id", c.name);
    newDiv.className = "panel menuItem";
    newDiv.style.left = x + "px";
    newDiv.style.top = y + "px";

    newDiv.style.width = width + "px";

    newDiv.parentArray = content; //parentArray;

    parentBlock.appendChild(newDiv);
    height = newDiv.offsetHeight;
    // console.log("height: " + height)

    addDragHandles(c.name, newDiv, "menu-mode");

    y += height + 10;
  }); //loop content array.
}

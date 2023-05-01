let SCREEN_Y = 1.4;
let SCREEN_Z = -0.7;
let SCREEN_WIDTH = 0.7;

let DEFAULT_HEIGHT = 0.2;
let APP_HEIGHT = 1.0;

let APP_HEADER_HEIGHT = 0.05;
let APP_HEADER_WIDTH = 0.2;

let THICKNESS = 0.001;

var MARGIN = 0.01;

let DROP_WIDTH = 0.05; //meters

var index = 0;

let ELEMENT_TYPE_BLOCK = "ELEMENT_TYPE_BLOCK";
let ELEMENT_TYPE_MENU = "ELEMENT_TYPE_MENU";

var element_count = 0;

function addDropTarget(parentEl, width) {
  // console.log(" addDropTarget:");
  var targetEl = document.createElement("a-entity");
  var w = width - 0.03;
  setGeoPlane(targetEl, w, DROP_WIDTH);

  let y = parentEl.height / 2 - DROP_WIDTH / 2;
  targetEl.setAttribute("position", { x: 0, y: -y, z: THICKNESS + 0.025 });
  targetEl.setAttribute("rotation", { x: 0, y: 0, z: 0 });

  targetEl.setAttribute("material", {
    color: DROP_TARGET_OFF_COLOR,
    side: "double",
    // shader: "flat",
    transparent: true,
    opactiy: 0.5,
  });

  // targetEl.getObjectmaterial = new THREE.MeshBasicMaterial({
  //   color: DROP_TARGET_OFF_COLOR,
  //   side: "double",
  //   transparent: true,
  //   opactiy: 0.5,
  // });
  targetEl.setAttribute("material", "opacity", 0.5);

  // this.material.opacity.set(0.1);

  targetEl.setAttribute("id", parentEl.id + "_droptarget");
  targetEl.classList.add("droptarget");

  parentEl.appendChild(targetEl);
}

function buildText(
  block,
  entityEl,
  width,
  height,
  xPos,
  elementType,
  wrapCount
) {
  //Base component must be a box otherwise the OUTLINE will not function properly.
  entityEl.setAttribute("geometry", {
    primitive: "box",
    width: width,
    height: height,
    depth: THICKNESS,
  });
  entityEl.setAttribute("material", {
    color: "#ddd",
    side: "double",
    shader: "flat",
  });

  // entityEl.setAttribute("material", {
  //   color: "green",
  //   side: "double",
  //   shader: "flat",
  // });

  //entityEl.setAttribute("position", { x: 0, y: 0, z: 0.01 });
  //console.log("buildText. elementType:" + elementType);
  entityEl.setAttribute("elementType", elementType);

  var isHeader = block["text"].indexOf("<h2>") > -1;
  var text = htmlToText(block["text"]);

  if (block.tentative) {
    text += "-tentative";
  }

  var textEl;

  //if we already have a text - dont make another one. //But changge text if need be.
  if (entityEl.querySelector(".text")) {
    textEl = entityEl.querySelector(".text");
    //textEl.setAttribute("text", "value: " + text);
    textEl.setAttribute("text", "value: " + text);
    return;
  } else {
    textEl = document.createElement("a-entity");
  }

  textEl.classList.add("text");

  textEl.setAttribute("geometry", {
    primitive: "plane",
    width: width,
    height: height,
  });
  textEl.setAttribute("position", {
    x: xPos,
    y: 0,
    z: THICKNESS / 2 + 0.01,
  });
  entityEl.appendChild(textEl);

  textEl.setAttribute("material", {
    color: "#fff",
    side: "double",
    shader: "flat",
  });

  if (isHeader) {
    textEl.setAttribute(
      "text",
      `side: front; color: black; align: center; wrap-count: ${wrapCount}; value:${text}`
    );
  } else {
    textEl.setAttribute(
      "text",
      `side: front; color: black; wrap-count: ${wrapCount}; value:${text}`
    );
  }
}

function addTextColumn(
  entityEl,
  width,
  height,
  ratio,
  columnName,
  text,
  wrapCount
) {
  var textEl;

  //if we already have a text - dont make another one. //But changge text if need be.
  if (entityEl.querySelector(`.text-${columnName}`)) {
    textEl = entityEl.querySelector(`.text-${columnName}`);
    //textEl.setAttribute("text", "value: " + text);
    textEl.setAttribute("text", "value: " + text);
    return;
  } else {
    textEl = document.createElement("a-entity");
  }

  textEl.classList.add(`text-${columnName}`);

  textEl.setAttribute("position", {
    x: 0 + ratio * width * 2,
    y: 0,
    z: THICKNESS / 2 + 0.01,
  });

  textEl.setAttribute("material", {
    color: "#fff",
    side: "double",
    shader: "flat",
  });

  textEl.setAttribute("geometry", {
    primitive: "plane",
    width: width,
    height: height,
  });
  console.log("HEIGHT:", height);

  textEl.setAttribute(
    "text",
    `side: front; color: black; align: left; wrap-count: ${wrapCount}; value:${text}`
  );

  entityEl.appendChild(textEl);
}

function addIcon(entityEl, width, height, xPos, url) {
  var imageEl;

  //if we already have a text - dont make another one. //But changge text if need be.
  if (entityEl.querySelector(`.icon`)) {
    imageEl = entityEl.querySelector(`.icon`);
    //textEl.setAttribute("text", "value: " + text);
    return;
  } else {
    imageEl = document.createElement("a-entity");
  }
  imageEl.classList.add(`icon`);

  // console.log("WWW:", entityEl.getAttribute("geometry").width);
  imageEl.setAttribute("position", {
    x: xPos,
    y: 0,
    z: THICKNESS / 2 + 0.01,
  });

  imageEl.setAttribute("material", {
    color: "#fff",
    side: "double",
    shader: "flat",
    src: `url(${url})`,
  });

  imageEl.setAttribute("geometry", {
    primitive: "plane",
    width: width,
    height: height,
  });

  entityEl.appendChild(imageEl);
}

//Method is ugly - but it works!
function buildAsset(block, entityEl, width, height, elementType) {
  //Base component must be a box otherwise the OUTLINE will not function properly.
  entityEl.setAttribute("geometry", {
    primitive: "box",
    width: width,
    height: height,
    depth: THICKNESS,
  });
  entityEl.setAttribute("material", {
    color: "#ddd",
    side: "double",
    shader: "flat",
  });

  //  var url = "images/magnolia-header.jpg";
  //CORS !!!
  // var url =
  //   "https://demopublic.magnolia-cms.com/.imaging/mte/travel-demo-theme/960x720/dam/tours/flickr_beach_greece_horia_varlan_by20_4332387580_dc593654a3_o.jpg/jcr:content/flickr_beach_greece_horia_varlan_by20_4332387580_dc593654a3_o.jpg";
  // var url = "images/tours-test/" + tour_images[0];
  var imageEl;
  //if we already have a image - dont make another one. //But changge text if need be.
  if (entityEl.querySelector(".asset-image")) {
    imageEl = entityEl.querySelector(".asset-image");
    return;
  } else {
    imageEl = document.createElement("a-entity");
  }
  imageEl.classList.add("asset-image");

  // imageEl = document.createElement("a-entity");

  imageEl.setAttribute("geometry", {
    primitive: "plane",
    width: width,
    height: height,
  });
  imageEl.setAttribute("position", {
    x: 0,
    y: 0,
    z: THICKNESS / 2 + 0.01,
  });

  //force geometry to update.

  imageEl.setAttribute("fit-image", {
    updater: Date.now(),
  });

  entityEl.appendChild(imageEl);

  var url = block.image;

  imageEl.setAttribute("material", {
    color: "#ddd",
    side: "double",
    shader: "flat",
    repeat: { x: 1, y: 1 },
    offset: { x: 0, y: 0 },
    src: `url(${url})`,
  });

  entityEl.setAttribute("elementType", elementType);

  var text = htmlToText(block["text"]);

  var textEl;

  //if we already have a text - dont make another one. //But changge text if need be.
  if (entityEl.querySelector(".text")) {
    textEl = entityEl.querySelector(".text");
    textEl.setAttribute("text", "value: " + text);
    return;
  } else {
    textEl = document.createElement("a-entity");
  }
  textEl.classList.add("text");
  textEl.setAttribute("geometry", {
    primitive: "plane",
    width: width,
    height: height / 4,
  });
  textEl.setAttribute("position", {
    x: 0,
    y: -height / 2 + height / 4 - height / 8,
    z: THICKNESS / 2 + 0.01 + 0.01,
  });
  entityEl.appendChild(textEl);

  textEl.setAttribute("material", {
    color: "#fff",
    side: "double",
    shader: "flat",
  });
  //console.log(" text:" + text);

  // entityEl.height = 0.5;

  textEl.setAttribute(
    "text",
    "side: front; color: black; wrap-count: 20;   value: " + text
  );
}

function buildGeneric(block, entityEl, width, height) {
  setGeoPlane(entityEl, width, height);
}

function generateElementFromContent(block, parentArray) {
  block.name += "_THING";

  var width = 1;
  let orientation = "";
  let content = null;
  let parentBlock = null;
  let el = renderBlock(
    block,
    0,
    0,
    -1,
    width,
    DEFAULT_HEIGHT,
    orientation,
    parentArray,
    parentBlock,
    ELEMENT_TYPE_BLOCK
  );

  return el;
}

function renderBlock(
  block,
  x,
  y,
  z,
  width,
  height,
  orientation,
  parentArray,
  parentBlock,
  elementType
) {
  index++;

  let entityEl = document.getElementById(block.name);
  let is_new = false;
  if (!entityEl) {
    is_new = true;
    entityEl = document.createElement("a-entity");
  }
  entityEl.setAttribute("id", block.name);

  var type = block.type;

  entityEl.parentArray = parentArray;

  entityEl.height = height;

  entityEl.setAttribute("position", { x: x, y: y, z: z });
  entityEl.setAttribute("rotation", { x: 0, y: 0, z: 0 });
  entityEl.setAttribute("data-managed", true);

  entityEl.classList.add("movable");

  if (type == "text" || type == "banner") {
    if (containsLink(block)) {
      //console.log("index:" + index + " contains Link. Skipping:" + type);
      return false;
    }
    buildText(block, entityEl, width, entityEl.height, 0, elementType, 20);
  } else if (type == "content-item") {
    buildText(block, entityEl, width, entityEl.height, 0, elementType, 40);

    // addTextColumn(
    //   entityEl,
    //   width / 3,
    //   entityEl.height,
    //   0.75,
    //   "date",
    //   "Sept 09, 2024",
    //   15
    // );
    // addIcon(
    //   entityEl,
    //   entityEl.height,
    //   entityEl.height,
    //   -(width / 2) + entityEl.height / 2,
    //   `images/icon-content-item.png`
    // );
  } else if (type == "asset") {
    buildAsset(block, entityEl, width, entityEl.height, elementType);
  } else {
    console.log("index:" + index + "item type not supported:" + type);
    buildGeneric(block, entityEl, width, entityEl.height, elementType);
    //return null;
  }

  // if (type === "heading") {
  //   return false;
  // }
  // return true;
  if (is_new) {
    if (elementType === ELEMENT_TYPE_BLOCK) {
      addDropTarget(entityEl, width);
    }

    if (parentBlock) {
      parentBlock.appendChild(entityEl);
    }
  }

  //TODO.

  return entityEl;
}

function htmlToText(html) {
  var div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText;
}

function containsLink(block) {
  return block["text"].indexOf("<a") > -1;
}

function setGeoPlane(entityEl, width, height) {
  entityEl.setAttribute("geometry", {
    primitive: "plane",
    width: width,
    height: height,
  });
}
// function addBox(entityEl, width, height) {
//   var el = document.createElement("a-entity");
//   el.setAttribute("geometry", {
//     primitive: "box",
//     width: width,
//     height: height,
//     depth: 0.1,
//   });
//   el.setAttribute("position", { x: 0, y: 0, z: -0.1 });
//   entityEl.appendChild(el);
// }

//p = parent.
function renderContent(
  parentBlock,
  content,
  x,
  y,
  z,
  width_to_share,
  orientation,
  elementType
) {
  //x = x - width_to_share / 2;

  var height = 0;
  var horiz = orientation && orientation == "horizontal";

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
      //console.log("width: " + width);
    }

    //DOES BLOCK EXIST?

    let newBlock = renderBlock(
      c,
      x - width * 0.5,
      y,
      z,
      width,
      DEFAULT_HEIGHT,
      orientation,
      content,
      parentBlock,
      elementType
    );
    if (newBlock) {
      //parentBlock.appendChild(newBlock);
      height = newBlock.height;
      // console.log("height: " + height)

      if (horiz) {
        x += width + MARGIN;
      } else {
        y -= height + MARGIN;
      }

      //Recursion
      if (c.content) {
        var heightChildren = renderContent(
          newBlock,
          c.content,
          0,
          0,
          0.01,
          width,
          c.orientation,
          elementType
        );
        let totalHeight = height + heightChildren;

        // y -= heightChildren;
      }
    }

    //TODO Ensure y position of next row - takes these into account.
    //Basically we need the tallest hight of any of the items.
    maxHeight = Math.max(maxHeight, height);
  }); //loop content array.

  if (horiz) {
    y -= maxHeight + MARGIN;
  }

  // return y;
  if (horiz) {
    return maxHeight + MARGIN;
  } else {
    return y - MARGIN;
  }
}

function widthOfAllPixels(content) {
  //figure out width for each item in group.

  let pxCount = 0;
  content.forEach((c) => {
    if (c.width.indexOf("%") < 0) {
      pxCount += parseInt(c.width);
    }
  });
  return pxCount;
}

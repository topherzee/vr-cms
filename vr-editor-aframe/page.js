let DROP_WIDTH = 0.08; //meters

function addDropTarget(parentEl, width) {
  // console.log(" addDropTarget:");
  var targetEl = document.createElement("a-entity");
  var w = width - 0.03;
  setGeoPlane(targetEl, w, DROP_WIDTH);

  let y = parentEl.height / 2 - DROP_WIDTH / 2;
  targetEl.setAttribute("position", { x: 0, y: -y, z: THICKNESS + 0.015 });
  targetEl.setAttribute("rotation", { x: 0, y: 0, z: 0 });

  targetEl.setAttribute("material", {
    color: DROP_TARGET_OFF_COLOR,
    side: "double",
    shader: "flat",
  });

  targetEl.setAttribute("id", parentEl.id + "_droptarget");
  targetEl.classList.add("droptarget");

  parentEl.appendChild(targetEl);
}

let THICKNESS = 0.1;
function buildText(block, entityEl, width, height, elementType) {
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
  //entityEl.setAttribute("position", { x: 0, y: 0, z: 0.01 });
  console.log("buildText. elementType:" + elementType);
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
  textEl.setAttribute("position", { x: 0, y: 0, z: THICKNESS / 2 + 0.01 });
  entityEl.appendChild(textEl);

  textEl.setAttribute("material", {
    color: "#fff",
    side: "double",
    shader: "flat",
  });
  //console.log(" text:" + text);

  entityEl.height = 0.5;

  // console.log("TEXT: ", entityEl.components.text);
  // if (entityEl.components.text) {
  //   console.log("TEXT: REMOVE");
  //   // return; //need this - otherwise get errors about removing text object3d.
  // }

  if (isHeader) {
    textEl.setAttribute(
      "text",
      "side: front; color: black; align: center; wrap-count: 20; value: " + text
    );
  } else {
    textEl.setAttribute(
      "text",
      "side: front; color: black; wrap-count: 20;   value: " + text
    );
  }
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

  //console.log("renderBlock type:" + type);

  entityEl.parentArray = parentArray;

  entityEl.height = DEFAULT_HEIGHT;

  entityEl.setAttribute("position", { x: x, y: y, z: z });
  entityEl.setAttribute("rotation", { x: 0, y: 0, z: 0 });
  entityEl.setAttribute("data-managed", true);

  entityEl.classList.add("movable");

  if (type == "text" || type == "banner") {
    if (containsLink(block)) {
      //console.log("index:" + index + " contains Link. Skipping:" + type);
      return false;
    }
    buildText(block, entityEl, width, entityEl.height, elementType);
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
var MARGIN = 0.01;
var index = 0;

let ELEMENT_TYPE_BLOCK = "ELEMENT_TYPE_BLOCK";
let ELEMENT_TYPE_MENU = "ELEMENT_TYPE_MENU";

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

function createPageHolder(parentEl) {
  var el = document.createElement("a-entity");
  // var w = width - 0.03;
  setGeoPlane(el, PAGE_WIDTH, 2);

  // let y = 1;
  el.setAttribute("position", { x: PAGE_X, y: PAGE_Y, z: PAGE_Z });
  el.setAttribute("rotation", { x: 0, y: 0, z: 0 });

  el.setAttribute("material", {
    color: "#333",
    side: "double",
    shader: "flat",
  });

  el.setAttribute("id", "pageHolder");

  parentEl.appendChild(el);
  return el;
}

function createMenuHolder(parentEl) {
  var el = document.createElement("a-entity");
  // var w = width - 0.03;
  setGeoPlane(el, MENU_WIDTH, 2);

  // let y = 1;
  el.setAttribute("position", { x: MENU_X, y: MENU_Y, z: MENU_Z });
  el.setAttribute("rotation", { x: 0, y: 0, z: 0 });

  el.setAttribute("material", {
    color: "#999",
    side: "double",
    shader: "flat",
  });

  el.setAttribute("id", "menuHolder");

  parentEl.appendChild(el);
  return el;
}

let pageHolder;
let menuHolder;

let PAGE_Y = 0;
let PAGE_X = 1;
let PAGE_Z = -2;
let PAGE_WIDTH = 1;

let DEFAULT_HEIGHT = 0.5;

let MENU_Y = 0;
let MENU_X = -0.5;
let MENU_Z = -1.9;

let MENU_WIDTH = 0.5;

// function clearRender() {
//   pageHolder.innerHTML = ""; //remove all child elements.
// }
function renderPage() {
  console.log("renderPage()");
  // renderItemContent(test_obj, 1, 1, 100, "horiz", null);
  // renderBlock(test_obj, 1, 1, 100, "horiz", null);

  let width_to_share = 1.0;
  let orientation = "";

  let parentBlock = pageHolder;
  let x = 0 + width_to_share / 2;
  let y = 0 + DEFAULT_HEIGHT + DEFAULT_HEIGHT / 2;
  let z = 0.1;

  renderContent(
    parentBlock,
    content_tree.content,
    x,
    y,
    z,
    width_to_share,
    orientation,
    ELEMENT_TYPE_BLOCK
  );
}

function renderMenu() {
  console.log("renderMenu()");
  // renderItemContent(test_obj, 1, 1, 100, "horiz", null);
  // renderBlock(test_obj, 1, 1, 100, "horiz", null);

  let parentBlock = menuHolder;
  let x = 0 + MENU_WIDTH / 2;
  let y = DEFAULT_HEIGHT + DEFAULT_HEIGHT / 2;
  let z = 0.11;
  //let width_to_share = 1.0;
  let orientation = "";

  renderContent(
    parentBlock,
    component_menu,
    x,
    y,
    z,
    MENU_WIDTH,
    orientation,
    ELEMENT_TYPE_MENU
  );
}

AFRAME.registerComponent("page", {
  init: function () {
    //this.originalRotation = this.el.object3D.rotation.y;

    var sceneEl = document.querySelector("a-scene");
    //renderBlock(test_obj, 0, sceneEl, 0);

    pageHolder = createPageHolder(sceneEl);

    // renderPage();
    renderPage();
  },

  remove: function () {
    this.el.object3D.rotation.y = this.originalRotation;
  },

  tick: function () {
    //this.el.object3D.rotation.y += 0.001;
  },
});

AFRAME.registerComponent("menu", {
  init: function () {
    var sceneEl = document.querySelector("a-scene");
    menuHolder = createMenuHolder(sceneEl);

    renderMenu();
  },

  remove: function () {
    this.el.object3D.rotation.y = this.originalRotation;
  },

  tick: function () {
    //this.el.object3D.rotation.y += 0.001;
  },
});

var test_obj = {
  tentative: true,

  name: "super 1",
  type: "text",
  width: "70%",
  text: "DROP!",
};

var element_count = 0;

var component_menu = [
  {
    name: "Banner-m1",
    type: "banner",
    width: "100%",
    text: "Banner",
  },
  {
    name: "Header-m2",
    type: "banner",
    width: "100%",
    text: "Header",
  },
  {
    name: "Image-m3",
    type: "banner",
    width: "100%",
    text: "Image",
  },
];

var WIDTH_PAGE = "1";

var content_tree_backup;
var content_tree = {
  content: [
    // {
    //   name: "page",
    //   type: "column",
    //   width: WIDTH_PAGE,
    //   content: [

    {
      name: "header-1",
      type: "banner",
      width: "100%",
      text: "I am Header!",
    },

    {
      name: "main-2",
      type: "area",
      width: "100%",
      text: "<div>I am area2.<br/>Area51.</div>",
      orientation: "horizontal",
      content: [
        {
          name: "content-1",
          type: "banner",
          width: "50%",
          text: "On the one is done, very cool.",
        },
        {
          name: "content-2",
          type: "banner",
          width: "50%",
          text: "2 for you and me, that's the way its got to be. And so I ask you - are you with me? That is whaat we need to discuss. Noone knows now.",
        },
      ],
    },

    {
      name: "section-1",
      type: "banner",
      width: "100%",
      text: "Section 1",
    },
    {
      name: "section-2",
      type: "banner",
      width: "50%",
      text: "Offers 2",
    },

    // {
    //   name: "main-3",
    //   type: "area",
    //   width: "100%",
    //   text: "<div>MAIN 3</div>",
    //   orientation: "horizontal",
    //   content: [
    //     {
    //       name: "content-A",
    //       type: "banner",
    //       width: "33%",
    //       text: "A A A",
    //     },
    //     {
    //       name: "content-B",
    //       type: "banner",
    //       width: "33%",
    //       text: "B B B",
    //     },
    //     {
    //       name: "content-C",
    //       type: "banner",
    //       width: "33%",
    //       text: "C C C",
    //     },
    //   ],
    // },
    {
      name: "footer-10",
      type: "banner",
      width: "100%",
      text: "Foot.",
    },
    // ],
    // },
  ],
};

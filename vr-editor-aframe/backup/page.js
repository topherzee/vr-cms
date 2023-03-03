function buildText(block, entityEl, width, height) {
  setGeoPlane(entityEl, width, height);

  var isHeader = block["text"].indexOf("<h2>") > -1;
  var text = htmlToText(block["text"]);

  if (isHeader) {
    entityEl.setAttribute(
      "text",
      "side: front; color: black; align: center; wrap-count: 20; value: " + text
    );
  } else {
    entityEl.setAttribute(
      "text",
      "side: front; color: black; wrap-count: 20;   value: " + text
    );
  }
  entityEl.setAttribute("material", {
    color: "#ddd",
    side: "double",
    shader: "flat",
  });
  console.log(" text:" + text);

  entityEl.height = 0.5;
}

function buildGeneric(block, entityEl, width, height) {
  setGeoPlane(entityEl, width, height);
}

function renderBlock(block, x, y, z, width, orientation) {
  index++;

  var type = block["mgnl:type"];
  var type = block.type;

  console.log("renderBlock type:" + type);

  var entityEl = document.createElement("a-entity");

  entityEl.height = 0.5;

  entityEl.setAttribute("position", { x: x, y: y, z: z });
  entityEl.setAttribute("rotation", { x: 0, y: 0, z: 0 });
  entityEl.setAttribute("data-managed", true);

  entityEl.setAttribute("cursor-listener", true);

  if (type == "text" || type == "banner") {
    if (containsLink(block)) {
      console.log("index:" + index + " contains Link. Skipping:" + type);
      return false;
    }
    buildText(block, entityEl, width, entityEl.height);
  } else {
    console.log("index:" + index + "item type not supported:" + type);
    buildGeneric(block, entityEl, width, entityEl.height);
    //return null;
  }

  // if (type === "heading") {
  //   return false;
  // }
  // return true;
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
var MARGIN = 0.01;
var index = 0;

//p = parent.
function renderContent(
  parentBlock,
  content,
  x,
  y,
  z,
  width_to_share,
  orientation
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
      console.log("width: " + width);
    }

    let newBlock = renderBlock(c, x - width * 0.5, y, z, width, orientation);
    if (newBlock) {
      parentBlock.appendChild(newBlock);
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
          c.orientation
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

AFRAME.registerComponent("page", {
  init: function () {
    //this.originalRotation = this.el.object3D.rotation.y;
    console.log("init page component 4");
    // renderItemContent(test_obj, 1, 1, 100, "horiz", null);
    // renderBlock(test_obj, 1, 1, 100, "horiz", null);
    var sceneEl = document.querySelector("a-scene");
    //renderBlock(test_obj, 0, sceneEl, 0);

    let parentBlock = sceneEl;
    let x = 0;
    let y = 2;
    let z = -2;
    let width_to_share = 1.0;
    let orientation = "";

    renderContent(
      parentBlock,
      content_tree.content,
      x,
      y,
      z,
      width_to_share,
      orientation
    );
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
    type: "header",
    width: "100%",
    text: "Header",
  },
  {
    name: "Image-m3",
    type: "image",
    width: "100%",
    text: "Image",
  },
];

var WIDTH_PAGE = "1";

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
      text: "Section",
    },
    // {
    //   name: "section-2",
    //   type: "banner",
    //   width: "50%",
    //   text: "Offers",
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

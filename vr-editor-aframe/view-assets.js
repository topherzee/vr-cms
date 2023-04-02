let ASSET_Y = 0;
let ASSET_X = -0.8; //-0.5;
let ASSET_Z = -1.9;

let ASSET_WIDTH = 0.2;
let ASSET_HEIGHT = 0.3;
let ASSET_PANEL_WIDTH = 0.6;

let assetsHolder;

AFRAME.registerComponent("view-assets", {
  init: function () {
    var sceneEl = document.querySelector("a-scene");
    assetsHolder = createAssetsHolder(sceneEl);

    renderViewAssets();
  },

  remove: function () {
    this.el.object3D.rotation.y = this.originalRotation;
  },

  tick: function () {
    //this.el.object3D.rotation.y += 0.001;
  },
});

function createAssetsHolder(parentEl) {
  var el = document.createElement("a-entity");
  // var w = width - 0.03;
  setGeoPlane(el, ASSET_WIDTH, 2);

  // let y = 1;
  el.setAttribute("position", { x: ASSET_X, y: ASSET_Y, z: ASSET_Z });
  el.setAttribute("rotation", { x: 0, y: 0, z: 0 });

  el.setAttribute("material", {
    color: "#999",
    side: "double",
    shader: "flat",
  });

  el.setAttribute("id", "assetsHolder");

  parentEl.appendChild(el);
  return el;
}

function renderViewAssets() {
  console.log("renderViewAssets()");

  let parentBlock = assetsHolder;
  let x = 0; /// + ASSET_PANEL_WIDTH / 2;
  let y = DEFAULT_HEIGHT + DEFAULT_HEIGHT / 2;
  let z = 0.11;
  //let width_to_share = 1.0;
  let orientation = "";

  renderContentGrid(
    parentBlock,
    assets_content,
    x,
    y,
    z,
    ASSET_WIDTH,
    orientation,
    ELEMENT_TYPE_MENU
  );
}

function renderContentGrid(
  parentBlock,
  content,
  x,
  y,
  z,
  width_to_share,
  orientation,
  elementType
) {
  content.forEach((c) => {
    //Width: Change percents to pixels.
    let width = ASSET_WIDTH;
    let height = ASSET_HEIGHT;

    //DOES BLOCK EXIST?

    let newBlock = renderBlock(
      c,
      x - width * 0.5,
      y,
      z,
      width,
      height,
      orientation,
      content,
      parentBlock,
      elementType
    );

    if (newBlock) {
      x += width + MARGIN;

      if (x > ASSET_PANEL_WIDTH) {
        y -= height + MARGIN;
        x = 0;
      }
      //   console.log("x: ", x, " y: ", y);
    }
  }); //loop content array.
}

var assets_content = [];
for (i = 0; i < 20; i++) {
  let node = {
    name: "Asset-m" + i,
    type: "banner",
    width: "100%",
    text: "Asset " + i,
  };
  assets_content.push(node);
}

var assets_content_sample = [
  {
    name: "Asset-m1",
    type: "banner",
    width: "100%",
    text: "Asset 1",
  },
  {
    name: "Asset-m2",
    type: "banner",
    width: "100%",
    text: "Asset 2",
  },
  {
    name: "Asset-m3",
    type: "banner",
    width: "100%",
    text: "Asset 3",
  },
  {
    name: "Asset-m4",
    type: "banner",
    width: "100%",
    text: "Asset 4",
  },
];

let MENU_Y = 0;
let MENU_X = 0; //-0.5;
let MENU_Z = -1.9;

let MENU_WIDTH = 0.5;

let menuHolder;

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

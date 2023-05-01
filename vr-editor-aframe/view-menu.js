// let MENU_WIDTH = SCREEN_WIDTH * (1 - PAGE_RATIO);
// let PANEL_WIDTH
let MENU_WIDTH = 0.1;

let APP_POSITION_MENU = {
  x: -SCREEN_WIDTH / 2 - MENU_WIDTH / 2 - MARGIN * 3,
  y: SCREEN_Y - APP_HEIGHT / 2,
  z: SCREEN_Z,
};

let menuHolder;

AFRAME.registerComponent("menu", {
  init: function () {
    var sceneEl = document.querySelector("a-scene");

    menuHolder = createHolder_App(
      sceneEl,
      "components",
      APP_POSITION_MENU,
      MENU_WIDTH,
      APP_HEIGHT
    );

    var x = -MENU_WIDTH / 2 + APP_HEADER_WIDTH / 2;
    var y = APP_HEIGHT / 2 - APP_HEADER_HEIGHT / 2;
    renderHeader_App(
      menuHolder,
      "Components",
      { x: x, y: y, z: THICKNESS + 0.01 },
      APP_HEADER_WIDTH,
      APP_HEADER_HEIGHT
    );

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

function renderMenu() {
  console.log("renderMenu()");

  let parentBlock = menuHolder;
  let x = MENU_WIDTH / 2;
  // let y = DEFAULT_HEIGHT + DEFAULT_HEIGHT / 2;
  let y = APP_HEIGHT / 2 - APP_HEADER_HEIGHT - DEFAULT_HEIGHT / 2 - MARGIN;
  let z = 0.0;
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

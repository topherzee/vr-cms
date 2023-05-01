let ITEM_WIDTH_TOURS = 0.4;
let ITEM_HEIGHT_TOURS = 0.025;
let PANEL_WIDTH_TOURS = 0.4;

let APP_POSITION_TOURS = {
  x: SCREEN_WIDTH / 2 + PANEL_WIDTH_TOURS / 2 + MARGIN * 3,
  y: SCREEN_Y - APP_HEIGHT / 2,
  z: SCREEN_Z,
};

let holder_Tours;

AFRAME.registerComponent("view-tours", {
  init: async function () {
    var sceneEl = document.querySelector("a-scene");

    holder_Tours = createHolder_App(
      sceneEl,
      "tours",
      APP_POSITION_TOURS,
      PANEL_WIDTH_TOURS,
      APP_HEIGHT
    );

    var x = -PANEL_WIDTH_TOURS / 2 + APP_HEADER_WIDTH / 2;
    var y = APP_HEIGHT / 2 - APP_HEADER_HEIGHT / 2;
    renderHeader_App(
      holder_Tours,
      "Tours",
      { x: x, y: y, z: THICKNESS + 0.01 },
      APP_HEADER_WIDTH,
      APP_HEADER_HEIGHT
    );

    await fetch_Tours();
    prepare_Tours();
    renderView_Tours();
  },

  remove: function () {
    this.el.object3D.rotation.y = this.originalRotation;
  },

  tick: function () {
    //this.el.object3D.rotation.y += 0.001;
  },
});

function renderView_Tours() {
  renderView_App(
    holder_Tours,
    tours_content,
    ITEM_WIDTH_TOURS,
    ITEM_HEIGHT_TOURS,
    PANEL_WIDTH_TOURS
  );
}

let tours;
let tours_url = "https://demopublic.magnolia-cms.com/.rest/delivery/tours/v1/";
async function fetch_Tours() {
  const response = await fetch(tours_url);
  let json = await response.json();
  tours = json.results;
  console.log("TOURS:", tours);
}

//"flickr_iran_ninara_by20_13974556578_ee8d3923c0_k.jpeg",

const MAX_TOURS = 20; //20
var tours_content = [];

function prepare_Tours() {
  for (i = 0; i < MAX_TOURS; i++) {
    let node = {
      name: "Tour-m" + i,
      type: "content-item",
      width: "100%",
      text: tours[i].name,
      image: "images/tours-test/" + tour_images[i % tour_images.length],
    };
    tours_content.push(node);
  }
}

let APP_POSITION_TOURS = { x: 1.7, y: 0, z: -1.9 };

let ITEM_WIDTH_TOURS = 0.8;
let ITEM_HEIGHT_TOURS = 0.05;
let PANEL_WIDTH_TOURS = 0.8;

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

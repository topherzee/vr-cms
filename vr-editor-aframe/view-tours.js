let APP_POSITION_TOURS = { x: 1.7, y: 0, z: -1.9 };

let ITEM_WIDTH_TOURS = 0.8;
let ITEM_HEIGHT_TOURS = 0.05;
let PANEL_WIDTH_TOURS = 0.8;

let holder_Tours;

AFRAME.registerComponent("view-tours", {
  init: async function () {
    var sceneEl = document.querySelector("a-scene");
    holder_Tours = createHolder_Tours(sceneEl);
    await fetchTours();
    prepareTours();
    renderView_Tours();
  },

  remove: function () {
    this.el.object3D.rotation.y = this.originalRotation;
  },

  tick: function () {
    //this.el.object3D.rotation.y += 0.001;
  },
});

let tours;
let tours_url = "https://demopublic.magnolia-cms.com/.rest/delivery/tours/v1/";
async function fetchTours() {
  const response = await fetch(tours_url);
  let json = await response.json();
  tours = json.results;
  console.log("TOURS:", tours);
}

function createHolder_Tours(parentEl) {
  var el = document.createElement("a-entity");
  // var w = width - 0.03;
  setGeoPlane(el, PANEL_WIDTH_TOURS, 2);

  // let y = 1;
  el.setAttribute("position", APP_POSITION_TOURS);
  el.setAttribute("rotation", { x: 0, y: 0, z: 0 });

  el.setAttribute("material", {
    color: "#999",
    side: "double",
    shader: "flat",
  });

  el.setAttribute("id", "holder_tours");

  parentEl.appendChild(el);
  return el;
}

function renderView_Tours() {
  console.log("renderView_Tours()");

  let parentBlock = holder_Tours;
  let x = 0; /// + ASSET_PANEL_WIDTH / 2;
  let y = DEFAULT_HEIGHT + DEFAULT_HEIGHT / 2;
  let z = 0.11;
  //let width_to_share = 1.0;
  let orientation = "";

  renderContent_List(
    parentBlock,
    tours_content,
    x,
    y,
    z,
    ITEM_WIDTH_TOURS,
    orientation,
    ELEMENT_TYPE_MENU,
    ITEM_WIDTH_TOURS,
    ITEM_HEIGHT_TOURS,
    PANEL_WIDTH_TOURS
  );
}

function renderContent_List(
  parentBlock,
  content,
  x,
  y,
  z,
  width_to_share,
  orientation,
  elementType,
  item_width,
  item_height,
  panel_width
) {
  content.forEach((c) => {
    //Width: Change percents to pixels.
    let width = item_width;
    let height = item_height;

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

    y -= height + MARGIN;
    x = 0;
  }); //loop content array.
}

//"flickr_iran_ninara_by20_13974556578_ee8d3923c0_k.jpeg",

const MAX_TOURS = 20; //20
var tours_content = [];

function prepareTours() {
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

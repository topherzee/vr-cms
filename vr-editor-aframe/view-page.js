// let PAGE_RATIO = 3 / 4;
let PAGE_WIDTH = SCREEN_WIDTH; // * PAGE_RATIO;

let PAGE_BLOCK_HEIGHT = 0.2;

let PAGE_Y = SCREEN_Y;
let PAGE_X = 0;
let PAGE_Z = SCREEN_Z;

let pageHolder;

// function clearRender() {
//   pageHolder.innerHTML = ""; //remove all child elements.
// }

AFRAME.registerComponent("page", {
  init: function () {
    //this.originalRotation = this.el.object3D.rotation.y;

    var sceneEl = document.querySelector("a-scene");

    pageHolder = createPageHolder(sceneEl);

    renderPage();
  },

  remove: function () {
    this.el.object3D.rotation.y = this.originalRotation;
  },

  tick: function () {
    //this.el.object3D.rotation.y += 0.001;
  },
});

function createPageHolder(parentEl) {
  var el = document.createElement("a-entity");
  // var w = width - 0.03;
  setGeoPlane(el, PAGE_WIDTH, APP_HEIGHT);

  // let y = 1;
  el.setAttribute("position", {
    x: PAGE_X,
    y: PAGE_Y - APP_HEIGHT / 2,
    z: PAGE_Z,
  });
  el.setAttribute("rotation", { x: 0, y: 0, z: 0 });

  el.setAttribute("material", {
    color: COLOR_APP_BACKGROUND,
    side: "double",
    shader: "flat",
  });

  el.setAttribute("id", "pageHolder");

  parentEl.appendChild(el);
  return el;
}

function renderPage() {
  console.log("renderPage()");

  let width_to_share = PAGE_WIDTH;
  let orientation = "";

  let parentBlock = pageHolder;
  let x = 0 + PAGE_WIDTH / 2; // + width_to_share / 2;
  let y = 0 + APP_HEIGHT / 2 - DEFAULT_HEIGHT / 2;
  let z = 0;

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

var test_obj = {
  tentative: true,

  name: "super 1",
  type: "text",
  width: "70%",
  text: "DROP!",
};

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
      name: "image-test-1",
      type: "asset",
      width: "100%",
      text: "I am ASSET!",
      image: "images/tours-test/" + "tall-centered-image.jpg",
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

    // {
    //   name: "section-1",
    //   type: "banner",
    //   width: "100%",
    //   text: "Section 1",
    // },
    // {
    //   name: "section-2",
    //   type: "banner",
    //   width: "50%",
    //   text: "Offers 2",
    // },

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

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

var tour_images = [
  "vietnam_jan_16323513143_82062f3a9a_k.jpeg",
  "flickr_amazon_zach_dischner_by20_13317569555_7d567284b3_k.jpeg",
  "flickr_angkor_chi_king_1071292582_1ed88ac42f_o.jpeg",
  "flickr_antarctica_Christopher_Michel_8370647648_a57a86bab4_o.jpeg",
  "flickr_arctic_roderick_eime_16067347724_bfba426794_k.jpeg",
  "flickr_basel_reinald_kirchner_sa20_7700005688_388fc69f8e_k.jpeg",
  "flickr_botswana_malcolm_macgregor_6226853168_c4a4be4467_o.jpeg",
  "flickr_christoph_meier_baikal_boat_14631748310_70ed1f03ae_k.jpeg",
  "flickr_costa_rica_SaraYeomans_475571502_a06729c672_o.jpeg",
  "flickr_czech_Roman Boed_12033279054_fae78935fe_k.jpeg",
  "flickr_dubai_mattharvey1_16087410975_e8e0ce2de8_k.jpeg",
  "flickr_halligen_jaym.s_14844840920_12546a2afe_k.jpeg",
  "flickr_hanoi_motorbike_by20_Khanh_Hmoong_15358008654_4081834552_k.jpeg",
  "flickr_indonesia_michael_day_2564067897_8d17df6972_b.jpeg",
  "flickr_jordan_petra_jcookfisher_13348246373_efe64f0880_k.jpeg",
  "flickr_kitesurfing_toby_charlton-taylor_nd20_6451407677_4c8335f95d_o.jpeg",
  "flickr_lapland_sleddogs_guido_da_rozze_5506836395_864f4ec955_o.jpeg",
  "flickr_mayan_tikal18_graeme_churchard_5975034842_86140bfe7a_b.jpeg",
  "flickr_transib_christoph_meier_14763739493_d586e99041_k.jpeg",
  "flickr_vancouver_kayak_zack_kuzins_nd20_4770124492_0d2dda7082_o.jpeg",
  "paris_eiffel_Louis Pellissier_IMG_8643.jpeg",
  "photo-highway1_joshua-sortino-1421091242698-34f6ad7fc088.jpeg",
  "shark_brian_warrick_0824.JPG",
];

//"flickr_iran_ninara_by20_13974556578_ee8d3923c0_k.jpeg",

var assets_content = [];
for (i = 0; i < 20; i++) {
  let node = {
    name: "Asset-m" + i,
    type: "asset",
    width: "100%",
    text: "Asset " + i,
    image: "images/tours-test/" + tour_images[i % tour_images.length],
  };
  assets_content.push(node);
}

var assets_content_sample = [
  {
    name: "Asset-m1",
    type: "asset",
    width: "100%",
    text: "Asset 1",
  },
  {
    name: "Asset-m2",
    type: "asset",
    width: "100%",
    text: "Asset 2",
  },
  {
    name: "Asset-m3",
    type: "asset",
    width: "100%",
    text: "Asset 3",
  },
  {
    name: "Asset-m4",
    type: "asset",
    width: "100%",
    text: "Asset 4",
  },
];

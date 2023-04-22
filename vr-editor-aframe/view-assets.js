let APP_POSITION_ASSETS = { x: -0.8, y: 0, z: -1.9 };

let ITEM_WIDTH_ASSETS = 0.2;
let ITEM_HEIGHT_ASSETS = 0.2;
let PANEL_WIDTH_ASSETS = 0.6;

//Assumption about aall imported images.
const IMAGE_ASPECT_RATIO = 4 / 3;

let holder_Assets;

AFRAME.registerComponent("view-assets", {
  init: async function () {
    var sceneEl = document.querySelector("a-scene");
    holder_Assets = createHolder_App(
      sceneEl,
      "assets",
      APP_POSITION_ASSETS,
      PANEL_WIDTH_ASSETS,
      APP_HEIGHT
    );
    prepare_Assets();
    renderView_Assets();
  },

  remove: function () {
    this.el.object3D.rotation.y = this.originalRotation;
  },

  tick: function () {
    //this.el.object3D.rotation.y += 0.001;
  },
});

function renderView_Assets() {
  renderView_App(
    holder_Assets,
    assets_content,
    ITEM_WIDTH_ASSETS,
    ITEM_HEIGHT_ASSETS,
    PANEL_WIDTH_ASSETS
  );
}

var tour_images = [
  "tall-centered-image.jpg",
  "paris_eiffel_Louis Pellissier_IMG_8643.jpeg",
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

const MAX_ASSETS = 20; //20
var assets_content = [];

function prepare_Assets() {
  for (i = 0; i < MAX_ASSETS; i++) {
    let node = {
      name: "Asset-m" + i,
      type: "asset",
      width: "100%",
      text: "Asset " + i,
      image: "images/tours-test/" + tour_images[i % tour_images.length],
    };
    assets_content.push(node);
  }
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

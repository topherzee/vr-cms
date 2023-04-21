// https://github.com/nylki/aframe-fit-texture-component/blob/master/index.js

console.log("YOOO");

if (typeof AFRAME === "undefined") {
  throw new Error(
    "Component attempted to register before AFRAME was available."
  );
}

/**
 * Fit Texture component for A-Frame.
 */
AFRAME.registerComponent("fit-image", {
  dependencies: ["geometry", "material"],
  schema: {
    type: "boolean",
    default: true,
    updater: 0,
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    console.log("fit-image init!!!");
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function () {
    if (this.data === false) return;

    var el = this.el;
    var self = this;
    if (self.dimensions) {
      // If texture has already been loaded, and `fit-texture` was reset.
      self.applyTransformation(e);
    } else {
      var textureLoaded = function (e) {
        var w =
          e.detail.texture.image.videoWidth || e.detail.texture.image.width;

        var h =
          e.detail.texture.image.videoHeight || e.detail.texture.image.height;

        // console.log("img dim", w, h);

        // Don't apply transformation on incomplete info
        if (h === 0 || w === 0) return;

        // Save dimensions for later updates to `fit-texture`, see above.
        self.dimensions = { w: w, h: h };

        // https://stackoverflow.com/questions/65872503/aframe-updating-material-offset-for-each-object
        // grab the object
        let obj = this.getObject3D("mesh");
        // grab the texture
        let map = obj.material.map;
        // let map = e.detail.texture;
        // create a new one - we need this to have different offsets for different textures.. but it is hurting performance. likely.
        const texture = new THREE.TextureLoader().load(map.image.src);
        // without wrapping, it will just "stretch" instead of "repeating"
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // assign the new texture
        obj.material.map = texture;
        // e.detail.texture = texture;
        // update the material
        obj.material.needsUpdate = true;
        // e.detail.texture.needsUpdate = true;

        // console.log("texture", e.detail.texture);
        self.applyTransformation(e);
      };
      el.addEventListener("materialvideoloadeddata", textureLoaded);
      el.addEventListener("materialtextureloaded", textureLoaded);
    }
  },

  applyTransformation: function (e) {
    console.log("applyTransformation");
    var el = this.el;
    var geometry = el.getAttribute("geometry");

    // Use self.dimension data from previous texture/video loaded events
    // var widthHeightRatio = this.dimensions.h / this.dimensions.w;
    var imageRatio = this.dimensions.w / this.dimensions.h;

    // let blockRatio = width / height;
    let blockRatio = geometry.width / geometry.height;

    let repeat;
    let offset;
    if (imageRatio > blockRatio) {
      //crop off sides.
      let r = blockRatio / imageRatio;
      repeat = { x: r, y: 1 };
      offset = { x: 0.5 - 0.5 * r, y: 0 };
      // offset = { x: 0.4, y: 0 };
    } else {
      // crop off top & bottom
      let r = imageRatio / blockRatio;
      repeat = { x: 1, y: r };
      offset = { x: 0, y: 0.5 - 0.5 * r };
    }
    // repeat = { x: 4, y: 1 };

    el.setAttribute("material", {
      repeat: repeat,
      offset: offset,
    });

    // e.detail.texture.repeat.set(repeat.x, repeat.y);
    // e.detail.texture.offset.set(repeat.x, offset.y);
    // e.detail.texture.needsUpdate = true;

    // console.log("repeat/offset", repeat, offset);

    //   if (geometry.width && geometry.height) {
    //     console.warn('Using `fit-texture` component on an element with both width and height. Therefore keeping width and changing height to fit the texture. If you want to manually set both width and height, set `fit-texture="false"`. ');
    //   }
    //   if (geometry.width) {
    //     el.setAttribute('height', geometry.width * widthHeightRatio);
    //   } else if (geometry.height) {
    //     el.setAttribute('width', geometry.height / widthHeightRatio);
    //   } else {
    //     // Neither width nor height is set.
    //     var tempWidth = 1.0;
    //     el.setAttribute('width', '' + tempWidth);
    //     el.setAttribute('height', tempWidth * widthHeightRatio);
    //   }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {},

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () {},

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () {},
});

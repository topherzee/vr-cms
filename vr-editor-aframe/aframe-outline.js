//https://github.com/EricEisaman/aframe-outline

AFRAME.registerComponent("outline", {
  schema: {
    color: { default: "red" },
    scale: { default: 1.1 },
    pulse: { default: false },
    frequency: { default: 1 },
    opacity: { default: 1 },
  },

  init: function () {
    // console.log("INIT OUTLINE 1");
    this.material = new THREE.MeshBasicMaterial({
      color: this.data.color,
      side: "double",
      transparent: true,
    });
    this.mesh = new THREE.Mesh(
      this.el.components.geometry.geometry,
      this.material
    );
    this.scale = this.data.scale;
    this.mesh.scale.multiplyScalar(this.scale);
    this.el.object3D.add(this.mesh);
    this.frequency = this.data.frequency;
    // console.log("INIT OUTLINE 2");
  },

  setColor: function (color) {
    this.material.color.set(color);
    this.material.opacity.set(0.1);
    this.material.needsUpdate = true;
  },

  setOpacity: function (opacity) {
    this.material.opacity.set(0.1);
    this.material.needsUpdate = true;
  },

  tick: function (t, dt) {
    if (this.data.pulse)
      this.mesh.scale.setScalar(
        0.04 * Math.cos((this.frequency * t) / 120) + this.scale
      );
  },

  remove: function () {
    // console.log("REMOVE HOVER 2");
    // console.log("REMOVE OUTLINE");
    this.el.object3D.remove(this.mesh);
  },

  pulse: function (frequency) {
    this.frequency = frequency ? frequency : 1;
    this.data.pulse = true;
  },

  stopPulse: function () {
    this.data.pulse = false;
    this.scale = this.data.scale;
  },
});

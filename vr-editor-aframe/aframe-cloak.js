//https://stackoverflow.com/questions/56192021/how-to-declare-a-mask-material-using-a-frame-js

AFRAME.registerComponent("cloak", {
  init: function () {
    let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    // geometry.faces.splice(4, 2); // cut out the top faces
    let material = new THREE.MeshBasicMaterial({
      colorWrite: false,
      side: THREE.DoubleSide,
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(1.1, 1.1, 1.1);
    this.el.object3D.add(mesh);
    this.el.object3D.renderOrder = 100;
  },
});

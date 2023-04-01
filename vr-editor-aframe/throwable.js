AFRAME.registerComponent("throwable", {
  schema: {
    flying: { type: "boolean", default: false },
    vel: { type: "vec3" },
  },

  update: function () {
    console.log("THROWABLE UPDATE VEL ", JSON.stringify(this.data.vel));
    let v = this.data.vel;
    this.velocity = new THREE.Vector3(v.x, v.y, v.z);
  },

  init: function () {
    console.log("THROWABLE INIT ");

    // Closure to access fresh `this.data` from event handler context.
    var self = this;
    // console.log("THROW INIT!!!");

    //this.flying = false;

    this.velocity = new THREE.Vector3();
    this.vel = new THREE.Vector3(0.0, 0.0, 0.0);

    this.pos_diff = new THREE.Vector3();
    this.pos_prev = new THREE.Vector3();
    this.gravity = new THREE.Vector3(0, -0.001, 0);
    this.speed = 0.1;

    this.lastTime = 0;
  },

  tick: function (time, timeDelta) {
    // IN_PROGRESS
    //10 times per second...roughly...
    if (time - this.lastTime < 10) {
      return;
    }
    this.lastTime = time;

    //console.log("THROW TICK!!!");
    if (this.data.flying) {
      // console.log("FYING: ", this.el.object3D.position.y);
      console.log("FYING: ", this.velocity.x);
      this.el.object3D.position.add(this.velocity);
      this.velocity.add(this.gravity);

      if (this.el.object3D.position.y < -2) {
        console.log("THROWABLE Remove. ");
        this.el.parentElement.removeChild(this.el);
      }
    } else {
      // IN_PROGRESS
      //   console.log(
      //     "THROW: ",
      //     this.pos_prev.x.toFixed(3),
      //     "-",
      //     this.pos_diff.x.toFixed(3)
      //   );

      let SPEED_SCALE = 0.3; //0.5

      //determine how fast it moves...
      if (this.el.object3D) {
        var world = new THREE.Vector3();
        this.el.object3D.getWorldPosition(world);
        this.pos_diff.copy(world);
        this.pos_diff.sub(this.pos_prev);

        this.pos_prev.copy(world);
        var distance = this.pos_diff.length();
        this.speed = distance;
        this.velocity.copy(this.pos_diff);
        this.velocity.multiplyScalar(SPEED_SCALE);
      }

      //test
      let c = document.getElementById("cyl-1");
      if (distance > 0) {
        // console.log("MOVE:" + distance.toFixed(5));
        c.setAttribute("material", "color", "green");
      } else {
        c.setAttribute("material", "color", "red");
      }
    }
  },
});

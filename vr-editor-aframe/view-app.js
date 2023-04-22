let APP_HEIGHT = 2;

function createHolder_App(parentEl, appName, appPosition, appWidth, appHeight) {
  var el = document.createElement("a-entity");
  // var w = width - 0.03;
  setGeoPlane(el, appWidth, appHeight);

  // let y = 1;
  el.setAttribute("position", appPosition);
  el.setAttribute("rotation", { x: 0, y: 0, z: 0 });

  el.setAttribute("material", {
    color: "#999",
    side: "double",
    shader: "flat",
  });

  el.setAttribute("id", `${appName}Holder`);

  parentEl.appendChild(el);
  return el;
}

function renderView_App(holder, content, width, height, panel_width) {
  console.log("renderView_App()");

  let parentBlock = holder;
  let x = 0; /// + ASSET_PANEL_WIDTH / 2;
  let y = DEFAULT_HEIGHT + DEFAULT_HEIGHT / 2;
  let z = 0.11;
  //let width_to_share = 1.0;
  let orientation = "";

  renderContentGrid(
    parentBlock,
    content,
    x,
    y,
    z,
    orientation,
    ELEMENT_TYPE_MENU,
    width,
    height,
    panel_width
  );
}

function renderContentGrid(
  parentBlock,
  content,
  x,
  y,
  z,
  orientation,
  elementType,
  item_width,
  item_height,
  panel_width
) {
  content.forEach((c) => {
    //Width: Change percents to pixels.
    //DOES BLOCK EXIST?

    let newBlock = renderBlock(
      c,
      x - item_width * 0.5,
      y,
      z,
      item_width,
      item_height,
      orientation,
      content,
      parentBlock,
      elementType
    );

    if (newBlock) {
      x += item_width + MARGIN;

      if (x > panel_width) {
        y -= item_height + MARGIN;
        x = 0;
      }
      //   console.log("x: ", x, " y: ", y);
    }
  }); //loop content array.
}

// function renderContent_List(
//     parentBlock,
//     content,
//     x,
//     y,
//     z,
//     orientation,
//     elementType,
//     item_width,
//     item_height,
//     panel_width
//   ) {
//     content.forEach((c) => {
//       //Width: Change percents to pixels.

//       //DOES BLOCK EXIST?

//       let newBlock = renderBlock(
//         c,
//         x - item_width * 0.5,
//         y,
//         z,
//         item_width,
//         item_height,
//         orientation,
//         content,
//         parentBlock,
//         elementType
//       );

//       y -= item_height + MARGIN;
//       x = 0;
//     }); //loop content array.
//   }

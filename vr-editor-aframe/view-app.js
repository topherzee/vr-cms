var COLOR_APP_BACKGROUND = "#111";

function createHolder_App(parentEl, appName, appPosition, appWidth, appHeight) {
  var el = document.createElement("a-entity");
  // var w = width - 0.03;
  setGeoPlane(el, appWidth, appHeight);

  // let y = 1;
  el.setAttribute("position", appPosition);
  el.setAttribute("rotation", { x: 0, y: 0, z: 0 });

  el.setAttribute("material", {
    color: COLOR_APP_BACKGROUND,
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
  let x = 0;
  let y = APP_HEIGHT / 2 - APP_HEADER_HEIGHT - height / 2;
  let z = 0.01;
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

function renderHeader_App(parentEl, appName, pos, width, height) {
  var textEl = document.createElement("a-entity");

  textEl.classList.add(`header-${appName}`);

  // textEl.setAttribute("position", position);
  textEl.setAttribute("position", {
    x: pos.x,
    y: pos.y,
    z: pos.z,
  });

  textEl.setAttribute("material", {
    color: "#fff",
    side: "double",
    shader: "flat",
  });

  textEl.setAttribute("geometry", {
    primitive: "plane",
    width: width,
    height: height,
  });

  textEl.setAttribute(
    "text",
    `side: front; color: black; align: left; wrap-count: 15; value:${appName}`
  );

  parentEl.appendChild(textEl);
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
      x - panel_width / 2 + item_width / 2,
      y,
      z,
      item_width - MARGIN,
      item_height - MARGIN,
      orientation,
      content,
      parentBlock,
      elementType
    );

    if (newBlock) {
      x += item_width; // + MARGIN;

      if (x >= panel_width) {
        y -= item_height; // + MARGIN;
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

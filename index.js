window.onload = function () {
  console.log("loaded");
  let c = document.getElementById("canvas");
  if (!c) {
    return console.log("no canvas");
  }

  // for the canvas, the width and height are the size of the canvas in pixels, to get the each side of the canvas, we divide the width and height by 2, and then we can use the top, bottom, left, right to get the position of the canvas
  const WIDTH = c.width; // 1200
  const HEIGHT = c.height; // 600
  const TOP = -HEIGHT / 2; // -300
  const BOTTOM = HEIGHT / 2; // 300
  const LEFT = -WIDTH / 2; // -600
  const RIGHT = WIDTH / 2; // 600

  // UI elements to show the position of the focusPoint, doubleFocusPoint, objectPoint, imagePoint
  let focusPoint = document.getElementById("focusPoint");
  let doubleFocusPoint = document.getElementById("doubleFocusPoint");
  let objectPoint = document.getElementById("objectPoint");
  let imagePoint = document.getElementById("imagePoint");

  // let canvas_scale = 50; // 50 pixels = 1 unit

  let isDraggingfocus = false;
  let isDraggingObject = false;
  let focusLength;
  let objectX;
  let objectY;
  let objectPos;
  let distanceDoubleFocus;
  let distancefocus;
  let imagePos;


  let ctx = c.getContext("2d");
  ctx.translate(RIGHT, BOTTOM); // move the central point originated from top left of canvas, to the middle of canvas
  function toBorder(x1, y1, x2, y2) {
    var dx, dy, py, vx, vy;
    vx = x2 - x1;
    vy = y2 - y1;
    dx = vx < 0 ? LEFT : RIGHT;
    dy = py = vy < 0 ? TOP : BOTTOM;
    if (vx === 0) {
      dx = x1;
    } else if (vy === 0) {
      dy = y1;
    } else {
      dy = y1 + (vy / vx) * (dx - x1);
      if (dy < TOP || dy > BOTTOM) {
        dx = x1 + (vx / vy) * (py - y1);
        dy = py;
      }
    }
    return { x: dx, y: dy };
  }
  function updateDoubleFocusPoint() {
    let doubleFocusLength = (focusPoint.offsetLeft - RIGHT) * 2;
    doubleFocusPoint.style.left = `${doubleFocusLength + RIGHT}px`;
  }; 

  function updateImagePoint() {
    let focusLength = focusPoint.offsetLeft - RIGHT;
    let distanceObject = objectPoint.offsetLeft - RIGHT;
    let heightObject = objectPoint.offsetTop - BOTTOM;
    distanceImage = (focusLength * distanceObject) / (distanceObject - focusLength);
    heightImage = -((distanceImage * heightObject) / distanceObject);
    imagePoint.style.left = `${distanceImage + RIGHT}px`;
    imagePoint.style.top = `${heightImage + BOTTOM}px`;
  }

  // draw line that connect the object to the doubleFocus Point first
  function drawDoubleFocusLine() {
    objectPos = {
      x: objectPoint.offsetLeft - RIGHT,
      y: objectPoint.offsetTop - BOTTOM,
    };
    imagePos = {
      x: imagePoint.offsetLeft - RIGHT,
      y: imagePoint.offsetTop - BOTTOM,
    };
    distanceDoubleFocus = doubleFocusPoint.offsetLeft - RIGHT;
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.moveTo(objectPos.x, objectPos.y);
    let lineToBorder = toBorder(objectPos.x, objectPos.y, imagePos.x, imagePos.y);
    ctx.lineTo(lineToBorder.x, lineToBorder.y);


    ctx.stroke();
    // ctx.lineTo(distanceDoubleFocus, 0);
    // ctx.lineTo(imagePos.x, imagePos.y);
    // let lineToBorder = toBorder(0, objectPos.y, imagePos.x, imagePos.y);
    // ctx.lineTo(lineToBorder.x, lineToBorder.y);
    // ctx.stroke();
    ctx.closePath();
  }

  // draw line that connect the object to the doubleFocus Prime Point first
  function drawObjectLine() {
    objectPos = {
      x: objectPoint.offsetLeft - RIGHT,
      y: objectPoint.offsetTop - BOTTOM,
    };
    imagePos = {
      x: imagePoint.offsetLeft - RIGHT,
      y: imagePoint.offsetTop - BOTTOM,
    };
    distancefocus = focusPoint.offsetLeft - RIGHT;
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.moveTo(objectPos.x, objectPos.y);
    ctx.lineTo(0, objectPos.y);
    ctx.lineTo(distancefocus, 0);
    let lineToBorder = toBorder(distancefocus, 0, imagePos.x, imagePos.y);
    ctx.lineTo(lineToBorder.x, lineToBorder.y);
    // if (distancefocus < 0) {
    //   ctx.lineTo(objectPos.x, objectPos.y);
    // } else {
    //   ctx.lineTo(0, imagePos.y);
    // }
    // ctx.lineTo(0, imagePos.y);
    // ctx.lineTo(imagePos.x, imagePos.y);
    //
    // if (imagePos.x < 0) {
    //   ctx.lineTo(LEFT, imagePos.y);
    // } else {
    //   ctx.lineTo(RIGHT, imagePos.y);
    // }

    ctx.stroke();
    ctx.closePath();
  }

  // draw line that connect the object to the image point first
  function drawImageLine() {
    objectPos = {
      x: objectPoint.offsetLeft - RIGHT,
      y: objectPoint.offsetTop - BOTTOM,
    };
    ctx.beginPath();
    let imageX = imagePoint.offsetLeft - RIGHT;
    let imageY = imagePoint.offsetTop - BOTTOM;
    imagePos = { x: imageX, y: imageY };
    ctx.strokeStyle = "#000";
    if (imagePos.x < 0) {
    ctx.moveTo(LEFT, imagePos.y);
    } else {
    ctx.moveTo(RIGHT, imagePos.y);
    }
    ctx.lineTo(0, imagePos.y);
    ctx.lineTo(distancefocus, 0);
    ctx.lineTo(objectPos.x, objectPos.y);

    // ctx.moveTo(objectPos.x, objectPos.y);
    // // ctx.lineTo(imagePos.x, imagePos.y);
    // let lineToBorder = toBorder(
    //   objectPos.x,
    //   objectPos.y,
    //   imagePos.x,
    //   imagePos.y,
    // );
    // ctx.lineTo(lineToBorder.x, lineToBorder.y);
    ctx.stroke();
    ctx.closePath();
  }

  // Add Cartesian grid
  function drawGrid() {
    ctx.beginPath();
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = "#eee";
    // draw horizontal lines
    for (let i = LEFT; i < RIGHT; i += 50) {
      ctx.moveTo(i, TOP);
      ctx.lineTo(i, BOTTOM);
      ctx.stroke();
    }
    // draw vertical lines
    for (let i = TOP; i < BOTTOM; i += 50) {
      ctx.moveTo(LEFT, i);
      ctx.lineTo(RIGHT, i);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.closePath();
  }

  // Add cartesian axis x and axis y
  function drawAxis() {
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    // horizontal line
    ctx.moveTo(LEFT, 0);
    ctx.lineTo(RIGHT, 0);
    ctx.stroke();
    // vertical line
    ctx.moveTo(0, TOP);
    ctx.lineTo(0, BOTTOM);
    ctx.stroke();
    // label x and y
    ctx.fillText("+ x", RIGHT - 20, -10);
    ctx.fillText("- y", 10, BOTTOM - 20);
    ctx.fillText("- x", LEFT + 10, -10);
    ctx.fillText("+ y", 10, TOP + 20);
    ctx.closePath();
  }

  // add numbers to the axis
  function drawNumbers() {
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.font = "10px Arial";

    // x axis
    for (let i = LEFT + 50; i < RIGHT; i += 50) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 6);
      ctx.stroke();
      if (i / 50 == 0) continue; // skip 0
      ctx.fillText(i / 50, i - 4, 15);
    }

    // y axis
    for (let i = TOP + 50; i < BOTTOM; i += 50) {
      ctx.moveTo(0, i);
      ctx.lineTo(-6, i);
      ctx.stroke();
      if (i / 50 == 0) {
        ctx.fillText(-i / 50, -15, i + 15); // position 0 on both axis
        continue;
      }
      ctx.fillText(-i / 50, -15, i + 5);
    }
    ctx.closePath();
  }

  // function to draw canvas
  function drawCanvas() {
    ctx.clearRect(LEFT, TOP, WIDTH, HEIGHT);
    drawGrid();
    drawAxis();
    drawNumbers();
    drawDoubleFocusLine();
    drawObjectLine();
    drawImageLine();
  }

  focusPoint.addEventListener("mousedown", (e) => {
    isDraggingfocus = true;
    focusLength = e.clientX - focusPoint.getBoundingClientRect().left;
    focusPoint.style.cursor = "grabbing";
  });

  objectPoint.addEventListener("mousedown", (e) => {
    isDraggingObject = true;
    objectX = e.clientX - objectPoint.getBoundingClientRect().left;
    objectY = e.clientY - objectPoint.getBoundingClientRect().top;
    objectPoint.style.cursor = "grabbing";
  });

  // Add event listener to focusPoint to drag it, moves the focusPoint and the doubleFocusPoint and the imagePoint
  document.addEventListener("mousemove", (e) => {
    if (isDraggingfocus) {
      const x = e.clientX - focusLength;

      // Set limits to the x position
      const maxDistance = WIDTH / 2 -1;
      const minDistance = 0;

      // Ensure the x position stays within the limits
      const clampedDistancefocus = Math.min(
        maxDistance,
        Math.max(minDistance, x),
      );
      focusPoint.style.left = `${clampedDistancefocus}px`;
      updateDoubleFocusPoint();
      updateImagePoint();

      drawCanvas();
    }
    if (isDraggingObject) {
      const x = e.clientX - objectX;
      const y = e.clientY - objectY;

      // Set limits to the x position
      const maxDistanceObject = WIDTH;
      const minDistanceObject = 0;

      // Set limits to the y position
      const maxHeightObject = HEIGHT;
      const minHeightObject = 0;

      // Ensure the x position stays within the limits
      const clampedX = Math.min(
        maxDistanceObject,
        Math.max(minDistanceObject, x),
      );
      const clampedY = Math.min(maxHeightObject, Math.max(minHeightObject, y));

      objectPoint.style.left = `${clampedX}px`;
      objectPoint.style.top = `${clampedY}px`;
      updateImagePoint();

      drawCanvas();
    }
  });

  document.addEventListener("mouseup", () => {
    isDraggingfocus = false;
    isDraggingObject = false;
    focusPoint.style.cursor = "grab";
    objectPoint.style.cursor = "grab";
  });

  drawCanvas();
};

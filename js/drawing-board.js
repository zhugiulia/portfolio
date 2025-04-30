let currentColor = 'black';
let redIcon, greenIcon, blueIcon, rubberIcon;
let activeToolOffsetY = 0;
let clearBtn, saveBtn;

function preload() {
  redIcon = loadImage('assets/red.svg');
  greenIcon = loadImage('assets/green.svg');
  blueIcon = loadImage('assets/blue.svg');
  rubberIcon = loadImage('assets/rubber.svg');
}

function setup() {
  pixelDensity(window.devicePixelRatio || 1);
  noSmooth();
  const canvasWidth = windowWidth * 0.9;
  const canvasHeight = windowHeight * 0.6;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  background(255);
  strokeWeight(3);

  document.getElementById('clearBtn').addEventListener('click', () => {
    background(255);
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    saveCanvas('myart', 'png');
  });
}

function draw() {
  // clear(); // Prevent icon overlap (removed to preserve drawings)
  push();
  noStroke();
  fill(255);
  rect(0, 60, 100, 250); // clear vertical icon area
  pop();
  // Draw tool icons
  imageMode(CENTER);
  image(redIcon, 33 + (currentColor === 'red' ? 10 : 0), 80, 66, 43);
  image(greenIcon, 33 + (currentColor === 'green' ? 10 : 0), 140, 66, 43);
  image(blueIcon, 33 + (currentColor === 'blue' ? 10 : 0), 200, 66, 43);
  image(rubberIcon, 33 + (currentColor === 'white' ? 10 : 0), 260, 66, 43);

  // Drawing
  if (mouseIsPressed && !overToolIcons(mouseX, mouseY)) {
    strokeWeight(3);
    stroke(currentColor);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function mousePressed() {
  if (dist(mouseX, mouseY, 33, 80) < 33) {
    currentColor = 'red';
  } else if (dist(mouseX, mouseY, 33, 140) < 33) {
    currentColor = 'green';
  } else if (dist(mouseX, mouseY, 33, 200) < 33) {
    currentColor = 'blue';
  } else if (dist(mouseX, mouseY, 33, 260) < 33) {
    currentColor = 'white'; // eraser
  }
}

function overToolIcons(x, y) {
  return (
    dist(x, y, 33, 80) < 33 ||
    dist(x, y, 33, 140) < 33 ||
    dist(x, y, 33, 200) < 33 ||
    dist(x, y, 33, 260) < 33
  );
}

function keyPressed() {
  if (key === 's') {
    saveCanvas('myart', 'png');
  }
}

function touchMoved() {
    const insideCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  const fingerIsDrawing = touches.length > 0 && touches[0].x >= 0 && touches[0].x <= width;
    if (insideCanvas && fingerIsDrawing && !overToolIcons(mouseX, mouseY)) {
    strokeWeight(3);
    stroke(currentColor);
    line(mouseX, mouseY, pmouseX, pmouseY);
        return false;
  }
<<<<<<< HEAD
  return true;
=======
  window.scrollBy(0, 1); // Helps enable scrolling on touch
  return false;
>>>>>>> 9670edf (Update portfolio)
}

function windowResized() {
  const canvasWidth = windowWidth * 0.9;
  const canvasHeight = windowHeight * 0.6;
  resizeCanvas(canvasWidth, canvasHeight);
  background(255);
}

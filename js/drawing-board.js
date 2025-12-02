let canvas;
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
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  background(255);
  strokeWeight(3);

  document.getElementById('clearBtn').addEventListener('click', () => {
    background(255);
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    saveCanvas('myart', 'png');
  });

  const floatBtn = document.getElementById('floatBtn');
  if (floatBtn) {
    floatBtn.addEventListener('click', () => {
      showFloatingDrawing();
    });
  }
}

function draw() {
  push();
  noStroke();
  fill(255);
  rect(0, 60, 100, 250); // clear vertical icon area
  pop();

  imageMode(CENTER);
  image(redIcon, 33 + (currentColor === 'red' ? 10 : 0), 80, 66, 43);
  image(greenIcon, 33 + (currentColor === 'green' ? 10 : 0), 140, 66, 43);
  image(blueIcon, 33 + (currentColor === 'blue' ? 10 : 0), 200, 66, 43);
  image(rubberIcon, 33 + (currentColor === 'white' ? 10 : 0), 260, 66, 43);

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
    return false; // evita lo scroll durante il disegno
  }

  return true; // consente lo scroll se non si disegna
}

function windowResized() {
  const canvasWidth = windowWidth * 0.9;
  const canvasHeight = windowHeight * 0.6;
  resizeCanvas(canvasWidth, canvasHeight);
  background(255);
}

function showFloatingDrawing() {
  if (!canvas) return;

  const sourceCanvas = canvas.elt;
  const ctx = sourceCanvas.getContext('2d');
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  const WHITE_THRESHOLD = 245;     // treat very light pixels as background
  const TOOLBAR_CUTOFF = 200;       // ignore pixels left of the tools

  // Find bounding box of drawn pixels ONLY in the drawing area (right side)
  for (let y = 0; y < height; y++) {
    for (let x = TOOLBAR_CUTOFF; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Skip fully transparent
      if (a === 0) continue;

      // Skip "almost white" background pixels
      if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) continue;

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  // If nothing was drawn, do nothing
  if (maxX === -1 || maxY === -1) {
    return;
  }

  // Add a little padding around the drawing
  const PADDING = 10;
  minX = Math.max(TOOLBAR_CUTOFF, minX - PADDING);
  minY = Math.max(0, minY - PADDING);
  maxX = Math.min(width - 1, maxX + PADDING);
  maxY = Math.min(height - 1, maxY + PADDING);

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;

  // Create an offscreen canvas with only the drawn area
  const offCanvas = document.createElement('canvas');
  offCanvas.width = cropWidth;
  offCanvas.height = cropHeight;
  const offCtx = offCanvas.getContext('2d');

  offCtx.drawImage(
    sourceCanvas,
    minX, minY, cropWidth, cropHeight,
    0, 0, cropWidth, cropHeight
  );

  const dataURL = offCanvas.toDataURL('image/png');

  const img = document.createElement('img');
  img.src = dataURL;
  img.classList.add('floating-drawing');

  // Random starting position in viewport
  img.style.top = Math.random() * 60 + 10 + '%';
  img.style.left = Math.random() * 60 + 10 + '%';

  // Randomize animation duration and delay so each drawing feels different
  const duration = 16 + Math.random() * 12; // 16–28s
  const delay = Math.random() * 5;          // 0–5s
  img.style.animationDuration = `${duration}s`;
  img.style.animationDelay = `${delay}s`;

  document.body.appendChild(img);
}
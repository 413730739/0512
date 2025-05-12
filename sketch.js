// Face Mesh Detection - Triangulated Face Mapping  
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/facemesh  
// https://youtu.be/R5UZsIwPbJA  

let video;
let faceMesh;
let faces = [];
let triangles;
let uvCoords;
let img;
let state = "NOTHING"; // States: NOTHING, BUBBLEGROW, BUBBLESHRINK, BUBBLEPOP, GUMONFACE
let bubblePercent = 0;

function preload() {
  // Load FaceMesh model and gum image
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
  img = loadImage("gum_face.png"); // Replace with your gum image path
}

function mousePressed() {
  console.log(faces);
}

function gotFaces(results) {
  // Update the faces array with the detected faces
  faces = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Set canvas size to full window
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting faces
  faceMesh.detectStart(video, gotFaces);

  // Get predefined triangle connections and UV coordinates
  triangles = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
}

function drawBubble(face, distMouthH, maxBubbleSize) {
  noStroke();
  ambientLight(255);
  ambientMaterial(255, 119, 188); // Pink bubble color
  translate(face.keypoints[13].x, face.keypoints[13].y + distMouthH / 2, 0);
  pointLight(255, 255, 255, -100, -50, 100);
  sphere(maxBubbleSize * bubblePercent / 100);
}

function draw() {
  background(144, 238, 144); // Set background to light green

  // Center the video feed on the canvas
  let videoX = (width - video.width) / 2;
  let videoY = (height - video.height) / 2;

  // Display the video feed at the center
  image(video, videoX, videoY);

  if (faces.length == 0) {
    state = "NOTHING";
  }

  if (faces.length > 0) {
    let face = faces[0];
    let blow = false;

    // Calculate distances for mouth and nose
    let distMouthW = round(dist(face.keypoints[78].x, face.keypoints[78].y, face.keypoints[308].x, face.keypoints[308].y), 1);
    let distMouthH = round(dist(face.keypoints[14].x, face.keypoints[14].y, face.keypoints[13].x, face.keypoints[13].y), 1);
    let distNoseW = round(dist(face.keypoints[60].x, face.keypoints[60].y, face.keypoints[290].x, face.keypoints[290].y), 1);
    let maxBubbleSize = (face.box.height) / 1.6;

    // Check if the user is blowing
    if (distMouthW <= (distNoseW * 2.2) && distMouthH > (distMouthW / 7)) {
      blow = true;
    }

    // Handle bubble states
    switch (state) {
      case 'NOTHING':
        bubblePercent = 0;
        if (blow) {
          state = 'BUBBLEGROW';
        }
        break;
      case 'BUBBLEGROW':
        if (!blow) {
          state = 'BUBBLESHRINK';
          break;
        }
        bubblePercent = bubblePercent + 1 - (bubblePercent / 105);
        drawBubble(face, distMouthH, maxBubbleSize);
        if (bubblePercent > 100) {
          state = "BUBBLEPOP";
        }
        break;
      case 'BUBBLESHRINK':
        bubblePercent = bubblePercent - 3;
        drawBubble(face, distMouthH, maxBubbleSize);
        if (bubblePercent <= 0) {
          state = "NOTHING";
        }
        break;
      case 'BUBBLEPOP':
        background(255, 119, 188); // Flash pink background
        bubblePercent = 0;
        state = "GUMONFACE";
        break;
      case 'GUMONFACE':
        // Apply the texture from the image
        push();
        texture(img);
        textureMode(NORMAL);
        noStroke();
        beginShape(TRIANGLES);

        // Draw each triangle of the face mesh with UV mapping
        for (let i = 0; i < triangles.length; i++) {
          let tri = triangles[i];
          let [a, b, c] = tri;
          let pointA = face.keypoints[a];
          let pointB = face.keypoints[b];
          let pointC = face.keypoints[c];
          let uvA = uvCoords[a];
          let uvB = uvCoords[b];
          let uvC = uvCoords[c];

          vertex(pointA.x, pointA.y, uvA[0], uvA[1]);
          vertex(pointB.x, pointB.y, uvB[0], uvB[1]);
          vertex(pointC.x, pointC.y, uvC[0], uvC[1]);
        }
        endShape();
        pop();
        break;
    }

    // Define the indices for different parts
    let deepRedIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    let redIndices = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
    let leftEyeOuter = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112];
    let leftEyeInner = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
    let rightEyeOuter = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249]; // Adjusted for arc
    let rightEyeInner = [359, 467, 260, 259, 257, 258, 286, 444, 463, 341, 256, 252, 253, 254, 339, 255];

    strokeWeight(5); // Set line thickness to 5
    noFill(); // Disable fill

    // Function to draw lines connecting points
    function drawConnections(indices, color) {
      stroke(color); // Set stroke color
      beginShape();
      for (let i = 0; i < indices.length; i++) {
        let point = face.keypoints[indices[i]];
        let x = point.x + videoX;
        let y = point.y + videoY;
        vertex(x, y);
      }
      endShape(CLOSE);
    }

    // Draw connections with specified colors
    drawConnections(deepRedIndices, color(139, 0, 0)); // Deep red
    drawConnections(redIndices, color(255, 0, 0)); // Normal red

    // Draw left eye connections
    drawConnections(leftEyeOuter, color(255, 0, 0)); // Normal red
    drawConnections(leftEyeInner, color(255, 0, 0)); // Normal red

    // Draw right eye connections
    drawConnections(rightEyeOuter, color(255, 0, 0)); // Normal red
    drawConnections(rightEyeInner, color(255, 0, 0)); // Normal red
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust canvas size when window is resized
}

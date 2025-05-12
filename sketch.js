// Face Mesh Detection - Triangulated Face Mapping  
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/facemesh  
// https://youtu.be/R5UZsIwPbJA  

let video;
let faceMesh;
let faces = [];
let triangles;

function preload() {
  // Load FaceMesh model 
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
}

function mousePressed() {
  console.log(faces);
}

function gotFaces(results) {
  faces = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting faces
  faceMesh.detectStart(video, gotFaces);

  // Get predefined triangle connections
  triangles = faceMesh.getTriangles();
}

function draw() {
  background(144, 238, 144); // Set background to light green

  // Center the video feed on the canvas
  let videoX = (width - video.width) / 2;
  let videoY = (height - video.height) / 2;

  // Display the video feed at the center
  image(video, videoX, videoY);

  if (faces.length > 0) {
    let face = faces[0];

    // Define the indices for the mouth, left eye, and right eye
    let mouthIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
    let leftEyeIndices = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112, 133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
    let rightEyeIndices = [359, 467, 260, 259, 257, 258, 286, 444, 463, 341, 256, 252, 253, 254, 339, 255, 263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

    stroke(255, 0, 0); // Set stroke color to red
    strokeWeight(2); // Set line thickness

    // Function to draw lines connecting points
    function drawConnections(indices) {
      beginShape();
      for (let i = 0; i < indices.length; i++) {
        let point = face.keypoints[indices[i]];
        let x = point.x + videoX;
        let y = point.y + videoY;
        vertex(x, y);
      }
      endShape(CLOSE);
    }

    // Draw connections for mouth, left eye, and right eye
    drawConnections(mouthIndices);
    drawConnections(leftEyeIndices);
    drawConnections(rightEyeIndices);
  }
}

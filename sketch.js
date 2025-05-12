// Face Mesh Texture Mapping
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/facemesh
// https://youtu.be/R5UZsIwPbJA

let video;
let faceMesh;
let faces = [];
let triangles;
let uvCoords;
let img;

function preload() {
  // Initialize FaceMesh model with a maximum of one face
  faceMesh = ml5.faceMesh({ maxFaces: 1 });

  // Load the texture image that will be mapped onto the face mesh
  img = loadImage("Zombie_Dan_mesh_map.png");
}

function mousePressed() {
  // Log detected face data to the console
  console.log(faces);
}

function gotFaces(results) {
  faces = results;
}

function setup() {
  createCanvas(640, 480, WEBGL);
  video = createCapture(VIDEO);
  video.hide();

  // Start detecting faces
  faceMesh.detectStart(video, gotFaces);

  // Retrieve face mesh triangles and UV coordinates
  triangles = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
}

function draw() {
  // Center the 3D space to align with the canvas
  translate(-width / 2, -height / 2);
  background(144, 238, 144); // Set background to light green

  // Display the video feed
  image(video, 0, 0);

  if (faces.length > 0) {
    let face = faces[0];

    // Define the indices for the mouth, left eye, and right eye
    let mouthIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
    let leftEyeIndices = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112, 133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
    let rightEyeIndices = [359, 467, 260, 259, 257, 258, 286, 444, 463, 341, 256, 252, 253, 254, 339, 255, 263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

    noFill();
    stroke(255, 0, 0); // Red for mouth
    strokeWeight(2);

    // Draw lines connecting the mouth points
    beginShape();
    for (let i = 0; i < mouthIndices.length; i++) {
      let point = face.keypoints[mouthIndices[i]];
      vertex(point.x, point.y);
    }
    endShape(CLOSE);

    stroke(0, 255, 0); // Green for left eye

    // Draw lines connecting the left eye points
    beginShape();
    for (let i = 0; i < leftEyeIndices.length; i++) {
      let point = face.keypoints[leftEyeIndices[i]];
      vertex(point.x, point.y);
    }
    endShape(CLOSE);

    stroke(0, 0, 255); // Blue for right eye

    // Draw lines connecting the right eye points
    beginShape();
    for (let i = 0; i < rightEyeIndices.length; i++) {
      let point = face.keypoints[rightEyeIndices[i]];
      vertex(point.x, point.y);
    }
    endShape(CLOSE);
  }
}

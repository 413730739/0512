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
  translate(-width / 2, -height / 2);
  background(144, 238, 144);
  image(video, 0, 0);
}

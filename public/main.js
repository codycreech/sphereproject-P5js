/*
Author: Cody Creech
Copyright 2022
Description: Custom Ornament Design Program - Allows the user
to see the finished product before it's made.
*/
let g;
let n = [[null],[null]];
let socket;
//start main sketch (3D globe)
function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  createEasyCam();

  g = new Globe(100, 75);
  g.create();
  n = g.getNodes();

  socket = io.connect("http://192.168.0.114:3000");

  //Preload existing data from the database
  socket.on('nData', nData => {
    for(let i = 0; i < nData.length; i++) {
      n[nData[i].a][nData[i].b].x = nData[i].x;
      n[nData[i].a][nData[i].b].y = nData[i].y;
      n[nData[i].a][nData[i].b].z = nData[i].z;
      n[nData[i].a][nData[i].b].color = nData[i].color;
    }
    console.log('Received node data from server.');
  })

  if(n) {
    g.loadNodes(n);
  }
}

function draw() {
  background(75);
  strokeWeight(10);
  g.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
  createEasyCam();
}
//end main sketch

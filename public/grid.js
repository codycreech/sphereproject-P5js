/*
Author: Cody Creech
Copyright 2022
Description: Custom Ornament Design Program - Allows the user
to see the finished product before it's made.
*/
let col, row, nSize, socket, g, colorPicker, table, btnUpdate, btnTable, btnColor, select, sum;
let inputText, btnAdd, btnLoad;
let n = [];
let saves = [];

function setup() {
  var canvas = createCanvas(1000, 1000);
  textSize(20);
  sum = width + height;
  // canvas2.parent('grid');
  nSize = 10;
  col = ceil(width / nSize);
  row = ceil(height / nSize);

  g = new Globe(100, 75);
  g.create();
  n = g.getNodes();

  btnUpdate = createButton('Update');
  btnUpdate.mouseClicked(updateData);
  btnUpdate.size(75,25);
  btnUpdate.position(width + 10,0);
  colorPicker = createColorPicker(color(235, 149, 52));
  colorPicker.position(width + 10,35);
  colorPicker.size(50,25);
  select = createSelect();
  select.position(width + 10,75);
  select.size(125,25);
  btnLoad = createButton('Load');
  btnLoad.size(75,25);
  btnLoad.position(width + 10, 110);
  btnLoad.mouseClicked(loadData);
  inputText = createInput();
  inputText.size(100,20);
  inputText.position(width + 10,140);
  btnAdd = createButton('Add Save');
  btnAdd.size(75,25);
  btnAdd.position(width + 10,175);
  btnAdd.mouseClicked(addSaveData);

  socket = io.connect("http://192.168.0.114:3000");

  // socket.emit('currentSel', select.value());

  //Preload existing data from the database
  socket.on('nData', nData => {
    for(let i = 0; i < nData.length; i++) {
      n[nData[i].a][nData[i].b].x = nData[i].x;
      n[nData[i].a][nData[i].b].y = nData[i].y;
      n[nData[i].a][nData[i].b].z = nData[i].z;
      n[nData[i].a][nData[i].b].color = nData[i].color;
      n[nData[i].a][nData[i].b].name = nData[i].name;
    }
    select.selected(nData[0].name);
    console.log('Received node data from server.');
  });

  socket.on('sData', sData => {
    for(let i = 0; i < sData.length; i++) {
      select.option(sData[i].name);
      // select.selected(sData[i].name);
      console.log(select.value());
    }
    console.log('Received save data from server.');
  });

  setTableData();

}

function draw() {
  background(150);

  drawNodes();
  drawSelection();

  translate(10,500)
  fill(0);
  text('Bottom', 0, 0);
  translate();

  translate(920,0)
  fill(0);
  text('Top', 0, 0);
  translate();
}

function mousePressed() {
  let nCol, nRow;
  if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    nCol = floor((mouseX) / nSize);
    nRow = floor((mouseY) / nSize);
    if(n[nCol][nRow]){
      n[nCol][nRow].color = colorPicker.value();
    }
  }
}

function mouseDragged() {
  let nCol, nRow;
  if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    nCol = floor((mouseX) / nSize);
    nRow = floor((mouseY) / nSize);
    if(n[nCol][nRow]){
      n[nCol][nRow].color = colorPicker.value();
    }
  }
}

function drawSelection() {
  let xCol = floor((mouseX) / nSize);
  let xRow = floor((mouseY) / nSize);
  fill(colorPicker.color());
  noStroke();
  square(xCol * nSize, xRow * nSize, nSize);
}

function drawNodes() {
  push();
  stroke(200);
  for(let i = 0; i < col; i++){
    for(let j = 0; j < row; j++){
      if(n[i][j]){
        fill(n[i][j].color);
        square(i * nSize, j * nSize, nSize);
      }
    }
  }
  pop();
}

function loadData() {
  socket.emit('load', select.value());
}

function addSaveData() {
  setTableData(inputText.value());
  socket.emit('save', table.getArray());
}

function updateData() {
  setTableData(select.value());
  socket.emit('update', table.getArray());
}

function setTableData(text) {
  table = new p5.Table();
  table.addColumn('id1');
  table.addColumn('id2');
  table.addColumn('X');
  table.addColumn('Y');
  table.addColumn('Z');
  table.addColumn('Color');
  table.addColumn('Name');
  for(var i = 0; i < n.length; i++){
    for(var j = 0; j < n[i].length; j++){
      let v = n[i][j];
      if(v){
        let tableRow = table.addRow();
        tableRow.set('id1', i);
        tableRow.set('id2', j);
        tableRow.set('X', v.getX());
        tableRow.set('Y', v.getY());
        tableRow.set('Z', v.getZ());
        tableRow.set('Color', v.getColor());
        tableRow.set('Name', text);
      }
    }
  }
}

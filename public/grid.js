let col, row, nSize, socket, g, colorPicker, table, btnUpdate, btnTable, btnColor, sum;
let n = [];

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

  socket = io.connect("http://192.168.0.114:3000");

  //Preload existing data from the database
  socket.on('newData', nData => {
    for(let i = 0; i < nData.length; i++) {
      n[nData[i].a][nData[i].b].x = nData[i].x;
      n[nData[i].a][nData[i].b].y = nData[i].y;
      n[nData[i].a][nData[i].b].z = nData[i].z;
      n[nData[i].a][nData[i].b].color = nData[i].color;
    }
    console.log('Received table data from server.');
  })

  setTableData();

  btnUpdate = createButton('Update');
  btnUpdate.mouseClicked(updateData);
  btnColor = createButton('Color');
  colorPicker = createColorPicker(color(235, 149, 52));
  colorPicker.position(75, height);
  colorPicker.size(50,50);
}

function draw() {
  background(150);
  // sketch.drawGrid();
  fill(colorPicker.value());
  square(100,height,50);
  // translate();
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
  nCol = floor((mouseX) / nSize);
  nRow = floor((mouseY) / nSize);
  if(n[nCol][nRow]){
    n[nCol][nRow].color = colorPicker.value();
  }
}

function mouseDragged() {
  let nCol, nRow;
  nCol = floor((mouseX) / nSize);
  nRow = floor((mouseY) / nSize);
  if(n[nCol][nRow]){
    n[nCol][nRow].color = colorPicker.value();
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

function updateData() {
  setTableData();
  socket.emit('update', table.getArray());
}

function setTableData() {
  table = new p5.Table();
  table.addColumn('id1');
  table.addColumn('id2');
  table.addColumn('X');
  table.addColumn('Y');
  table.addColumn('Z');
  table.addColumn('Color');
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
      }
    }
  }
}

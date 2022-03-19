let g;
let n = [[null],[null]];
let socket;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('sphere');
  createEasyCam();

  g = new Globe(100, 75);
  g.create();
  n = g.getNodes();

  socket = io.connect("http://192.168.0.114:3000");

  socket.on('newData', nData => {
    for(let i = 0; i < nData.length; i++) {
      n[nData[i].a][nData[i].b].x = nData[i].x;
      n[nData[i].a][nData[i].b].y = nData[i].y;
      n[nData[i].a][nData[i].b].z = nData[i].z;
      n[nData[i].a][nData[i].b].color = nData[i].color;
    }
    console.log('Received table data from server.');
  })

  if(n) {
    g.loadNodes(n);
  }
}

function draw() {
  background(75);
  g.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
  createEasyCam();
}

const s = (sketch) => {
  let col, row, nSize, canvas2, gridWidth, gridHeight;

  let sf = 1.0;
  let tx = 0;
  let ty = 0;

  sketch.setup = () => {
    canvas2 = sketch.createCanvas(1000, 1000);
    sketch.textSize(20);
    // canvas2.parent('grid');
    nSize = 10;
    gridWidth = 1000;
    gridHeight = 1000;
    col = ceil(sketch.width / nSize);
    row = ceil(sketch.height / nSize);
  }

  sketch.draw = () => {
    let angle = frameCount;
    let angle_rad = radians(angle);
    sketch.background(150);
    // sketch.drawGrid();
    sketch.translate();
    sketch.drawNodes();
    sketch.drawSelection();

    sketch.translate(10,500)
    sketch.fill(0);
    sketch.text('Bottom', 0, 0);
    sketch.translate();

    sketch.translate(920,0)
    sketch.fill(0);
    sketch.text('Top', 0, 0);
    sketch.translate();
  }

  // sketch.windowResized = () => {
  //   sketch.resizeCanvas(windowWidth, windowHeight);
  // }

  sketch.mousePressed = () => {
    let nCol, nRow;
    if((mouseX > 0) && (mouseX < sketch.width) && (mouseY > 0) && (mouseY > sketch.height)){
      nCol = floor((sketch.mouseX) / nSize);
      nRow = floor((sketch.mouseY) / nSize);
    }else{
      return false;
    }
    if(n[nCol][nRow]){
      n[nCol][nRow].color = colorPicker.value();
    }
    return false;
  }

  sketch.mouseDragged = () => {
    let nCol, nRow;
    if((mouseX > 0) && (mouseX < sketch.width) && (mouseY > 0) && (mouseY > sketch.height)){
      nCol = floor((sketch.mouseX) / nSize);
      nRow = floor((sketch.mouseY) / nSize);
    }else{
      return false;
    }
    if(n[nCol][nRow]){
      n[nCol][nRow].color = colorPicker.value();
    }
    return false;
  }

  sketch.drawSelection = () => {
    let xCol = floor((sketch.mouseX) / nSize);
    let xRow = floor((sketch.mouseY) / nSize);
    sketch.fill(colorPicker.color());
    sketch.noStroke();
    sketch.square(xCol * nSize, xRow * nSize, nSize);
    return false;
  }

  sketch.drawNodes = () => {
    push();
    // sketch.noStroke();
    sketch.stroke(200);
    for(let i = 0; i < col; i++){
      for(let j = 0; j < row; j++){
        if(n[i][j]){
          sketch.fill(n[i][j].color);
          sketch.square(i * nSize, j * nSize, nSize);
        }
      }
    }
    pop();
  }

  // sketch.drawGrid = () => {
  //   push();
  //   sketch.stroke(200);
  //   for(x = 0; x < sketch.width; x+= nSize){
  //     sketch.line(x, 0, x, sketch.height);
  //   }
  //   for(y = 0; y < sketch.height; y+= nSize){
  //     sketch.line(0, y, sketch.width, y);
  //   }
  //   pop();
  // }
}
let myp5 = new p5(s, 'grid');

const s2 = (sketch2) => {
  let btnSave, btnLoad, btnTable, btnUpdate, colorPicker, table;

  sketch2.setup = () => {
    var canvas3 = sketch2.createCanvas(100, 100);
    // canvas3.parent('options');
    this.colorPicker = sketch2.createColorPicker(color(235, 149, 52));
    this.setTableData();
    this.btnSave = sketch2.createButton('Save');
    this.btnLoad = sketch2.createButton('Load');
    this.btnUpdate = sketch2.createButton('Update');
    // this.btnTable = createButton('Show Table');
    this.btnSave.mouseClicked(this.saveData);
    this.btnLoad.mouseClicked(this.loadData);
    this.btnUpdate.mouseClicked(this.updateData);
    // this.btnTable.mouseClicked(this.showTable);
  }

  sketch2.draw = () => {

  }

  this.setTableData = () => {
    this.table = new p5.Table();
    this.table.addColumn('id1');
    this.table.addColumn('id2');
    this.table.addColumn('X');
    this.table.addColumn('Y');
    this.table.addColumn('Z');
    this.table.addColumn('Color');
    for(var i = 0; i < n.length; i++){
      for(var j = 0; j < n[i].length; j++){
        let v = n[i][j];
        if(v){
          let tableRow = this.table.addRow();
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

  this.showTable = () => {
    if(this.table){
      console.table(this.table.getArray());
    }
  }

  this.saveData = () => {
    setTableData();
    socket.emit('save', this.table.getArray());
  }

  this.updateData = () => {
    setTableData();
    socket.emit('update', this.table.getArray());
  }

  this.loadData = () => {
    socket.emit('load');
  }
}
let myp5_2 = new p5(s2, 'options');

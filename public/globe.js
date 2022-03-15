class Globe {
  #globe;
  #nodes;

  constructor(total, radius) {
    this.total = total;
    this.radius = radius;
    this.globe = [];
    this.nodes = [];
  }

    create() {
      for (let i = 0; i < this.total; i++) {
        this.globe[i] = [];

        const lat = map(i, 0, this.total, 0, PI);
        for (let j = 0; j < this.total; j++) {
          const lon = map(j, 0, this.total, 0, TWO_PI);
          const x = this.radius * sin(lat) * cos(lon);
          const y = this.radius * sin(lat) * sin(lon);
          const z = this.radius * cos(lat);

          if (i >= 10 && i <= this.total - 10) {
            if (i % 10 == 0 && j % 10 == 0) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
            if (i % 10 == 1 && (j % 10 == 1 || j % 10 == 9)) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
            if (i % 10 == 2 && (j % 10 == 2 || j % 10 == 8)) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
            if (i % 10 == 3 && (j % 10 == 3 || j % 10 == 7)) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
            if (i % 10 == 4 && (j % 10 == 4 || j % 10 == 6)) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
            if (i % 10 == 5 && (j % 10 == 5)) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
            if (i % 10 == 6 && (j % 10 == 4 || j % 10 == 6)) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
            if (i % 10 == 7 && (j % 10 == 3 || j % 10 == 7)) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
            if (i % 10 == 8 && (j % 10 == 2 || j % 10 == 8)) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
            if (i % 10 == 9 && (j % 10 == 1 || j % 10 == 9)) {
              this.globe[i][j] = new Node(createVector(x, y, z));
            }
          }
        }
      }
    }

    show() {
      push();
      scale(2.2);
      rotateX(degrees(90));
      for(var i = 0; i < this.globe.length; i++) {
        for(var j = 0; j < this.globe[i].length; j++){
          var v = this.globe[i][j];
          if(v){

            v.showGlobe();

          }
        }
      }
      noStroke();
      fill(75);
      sphere(74);
      pop();
    }

    getNodes() {
      return this.globe;
    }

    getSize() {
      return this.globe.length;
    }

    loadNodes(x) {
      if(x){
        this.nodes = x;
      }
    }

}

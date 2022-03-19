const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');

let con = mysql.createConnection({
  host: 'localhost',
<<<<<<< HEAD
  user: 'nodejs',
  password: 'password',
=======
  user: 'codyc',
  password: '*',
>>>>>>> e823d7d852ce3d1012aa7dfd7882ea970e3f991b
  database: 'sphere_db'
});
let app = express();
let server = app.listen(3000, listen);
let createTable = 'create table if not exists nodes(id int auto_increment primary key, a int not null, b int not null, x varchar(150) not null, y varchar(150) not null, z varchar(150) not null, color varchar(150) not null)';
let stmt = 'INSERT INTO nodes(a,b,x,y,z,color) VALUES(?,?,?,?,?,?)';
let upd = 'UPDATE nodes SET color = ? WHERE a = ? AND b = ?';
let qry = 'SELECT a,b,x,y,z,color FROM nodes';

con.connect(function(err) {
  if(err) throw err;
  console.log('Connected to database!');
  con.query(createTable, function(err, results, fields) {
    if(err) {
      console.log(err.message);
    }
    // console.log("'nodes' table created.");
  });
});

app.use(express.static('public'));

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}

var io = socket(server, {
  cors: {
    origin: "http://192.168.0.114:3000",
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('disconnect', function() {
  console.log('Client has disconnected');
});

io.on('connect', (socket) => {
  con.query(qry, function(err, results, fields) {
    if(err) {
      return console.error(err.message);
    }
    socket.emit('newData', results);
    console.log('Sent table to client.');
  });

  socket.on('data', data => {
    console.log(data);
  });
  socket.on('update', table => {
      for(let i = 0; i < table.length; i++) {
        let tmp = [table[i][5],table[i][0],table[i][1]];
        con.query(upd, tmp, (err, results, fields) => {
          if(err) {
            return console.error(err.message);
          }
        });
      }
      console.log('Updated nodes.');
  });
  socket.on('save', table => {
      for(let i = 0; i < table.length; i++) {
        con.query(stmt, table[i], (err, results, fields) => {
          if(err) {
            return console.error(err.message);
          }
        });
      }
      console.log('Loaded nodes.');
  });
  socket.on('load', function() {
    con.query(qry, function(err, results, fields) {
      if(err) {
        return console.error(err.message);
      }
      socket.emit('newData', results);
      console.log('Sent table to client.');
    });
  });
  console.log('new connection: ' + socket.id);
});

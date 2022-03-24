const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');

//Mysql connection info
let con = mysql.createConnection({
  host: 'localhost',
  user: 'nodejs',
  password: 'password',
  database: 'sphere_db'
});

//Creates the server
let app = express();
let server = app.listen(3000, listen);

//List of SQL queries
let createTable = 'create table if not exists nodes(id int auto_increment primary key, a int not null, b int not null, x varchar(150) not null, y varchar(150) not null, z varchar(150) not null, color varchar(150) not null)';
let stmt = 'INSERT INTO nodes(a,b,x,y,z,color) VALUES(?,?,?,?,?,?)';
let upd = 'UPDATE nodes SET color = ? WHERE a = ? AND b = ?';
let qry = 'SELECT a,b,x,y,z,color FROM nodes';

//Creates initial table when a user connects to the site if it doesn't exist
con.connect(function(err) {
  if(err) throw err;
  console.log('Connected to database!');
  con.query(createTable, function(err, results, fields) {
    if(err) {
      console.log(err.message);
    }
  });
});

app.use(express.static('public'));


//Listens for new clients
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}

//CORS info so chrome doesn't yell at me
var io = socket(server, {
  cors: {
    origin: "http://192.168.0.114:3000",
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

//Shows if client has disconnected
io.on('disconnect', function() {
  console.log('Client has disconnected');
});

//Preloads existing table data to the client
io.on('connect', (socket) => {
  con.query(qry, function(err, results, fields) {
    if(err) {
      return console.error(err.message);
    }
    socket.emit('newData', results);
    console.log('Sent table to client.');
  });

  //Me testing sending/receiving data through a socket
//  socket.on('data', data => {
//    console.log(data);
//  });
  
  //Update any changes to the table
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
  
  //Loads initial table data into the db if it doesn't exist
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
  
  //Get the table data from the db and send to the client
  socket.on('load', function() {
    con.query(qry, function(err, results, fields) {
      if(err) {
        return console.error(err.message);
      }
      socket.emit('newData', results);
      console.log('Sent table to client.');
    });
  });
  
  //Shows the id for each client connected
  console.log('new connection: ' + socket.id);
});

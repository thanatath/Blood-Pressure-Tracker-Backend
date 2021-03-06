require('dotenv').config();
var mysql = require('mysql');
var dateFormat = require('dateformat');

const http = require('http');
const express = require('express');
const { clearScreenDown } = require('readline');
const app = express();

//start Express server
app.listen(process.env.Express_Port, () => {
  console.log('Start server at port', process.env.Express_Port);
});

//Mysql Environment
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
//check mysql is Connected ?
con.connect(function (err) {
  if (err) throw err;
  console.log('SQL Connected!');
});

//Func & OP Part

app.get('/', (req, res) => {
  if (req.query.top > 0 && req.query.buttom > 0) {
    console.log('Get Top: ', req.query.top, ' Buttom: ', req.query.buttom, ' HeartRate: ', req.query.heartrate);
    saveBlood(req.query.top, req.query.buttom, req.query.heartrate);
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendStatus(200);
});

app.get('/history', (req, res) => {
  con.query('SELECT * FROM EURO', function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end;
});

app.get('/del', (req, res) => {
  if (req.query.idBlood) {
    console.log('Get ID: ', req.query.idBlood);
    delBlood(req.query.idBlood);
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendStatus(200);
});

function delBlood(idBlood) {
  var sql = 'DELETE FROM EURO WHERE id = ' + idBlood;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log('Number of records deleted: ' + result.affectedRows);
  });
}

function saveBlood(top, buttom,heartrate) {
  var sql =
    'INSERT INTO EURO (top, buttom,heartrate,time) VALUES (' +
    top +
    ', ' +
    buttom +
    ',' +
    heartrate +
    ',NOW())';
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log('record inserted');
  });
}

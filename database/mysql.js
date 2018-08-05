
var mysql = require('mysql');
var conn  = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : 'hzp',
    database : 'PicShare'
});

conn.connect();

exports.connection = function () {
    return conn;
};

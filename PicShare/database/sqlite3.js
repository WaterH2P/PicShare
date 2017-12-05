
var util = require('util');

var path = require('path');
var sqlite = require('sqlite3').verbose();

var userTable = 'user';

var db = new sqlite.Database( 'PicShare.db' );

exports.addUser = function (uid, upassword, uname, uemail) {
    var stmt = db.prepare("INSERT INTO " + userTable + " VALUES(?,?,?,?)");
    stmt.run( uid, upassword, uname, uemail );
    stmt.finalize();
};


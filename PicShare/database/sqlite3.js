
var util = require('util');

var path = require('path');
var sqlite = require('sqlite3').verbose();

var userTable = 'user';
var imgTable = 'img';

var db = new sqlite.Database( path.join(__dirname, 'PicShare.db') );
global.deafultLogo = "/images/user_logos/default.png";

exports.addUser = function (userID, userPassword, userName, userEmail) {
    var stmt = db.prepare("INSERT INTO " + userTable + " VALUES(?,?,?,?,?)");
    stmt.run( userID, userPassword, userName, userEmail, deafultLogo, function (err) {
        if( err ) {
            util.log("database insert wrong");
        }
        else {
            util.log("add user " + userID);
        }
    });
    stmt.finalize();
};

exports.selectUserLogo = function (userID, callback) {
    util.log("database search logo: " + userID);
    db.all("SELECT userLogo FROM " + userTable + " WHERE userID = ?", userID, function(err, rows) {
        if( err ){
            util.log("search logo wrong : select wrong");
            // return JSON.stringify({userLogo:deafultLogo});
            callback( {userLogo:deafultLogo} );
        }
        else{
            if( rows.length>0 ){
                util.log("search logo succeed :" + rows[0].userLogo );
                // return JSON.stringify(rows[0]);
                callback( {userLogo:rows[0].userLogo} );
            }
            else{
                util.log("search logo wrong : no path");
                // return JSON.stringify({userLogo:deafultLogo});
                callback( {userLogo:deafultLogo} );
            }
        }
    });
};

exports.selectUserInfo = function (userID, callback) {
    util.log("database search info: " + userID);
    db.all("SELECT * FROM " + userTable + " WHERE userID = ?", userID, function(err, rows) {
        if( err ){
            util.log("search logo wrong : select wrong");
            // return JSON.stringify({userLogo:deafultLogo});
            callback(null);
        }
        else{
            if( rows.length>0 ){
                util.log("search logo succeed :" + rows[0].userLogo );
                // return JSON.stringify(rows[0]);
                callback(rows[0]);
            }
            else{
                util.log("search logo wrong : no path");
                // return JSON.stringify({userLogo:deafultLogo});
                callback(null);
            }
        }
    });
};

exports.updateUserInfo = function (userID, userName, userEmail, callback) {
    db.run("UPDATE " + userTable + " SET userName = ?, userEmail=? WHERE userID =?", userName, userEmail, userID, function (err) {
        if( err ){
            util.log("update info wrong : update wrong");
            callback( false );
        }
        else {
            util.log("user " + userID + " update info succeed");
            callback( true );
        }
    });
};

exports.selectHotImages = function (callback) {
    db.all("SELECT imgPath FROM " + imgTable, function(err, rows) {
        if( err ){
            util.log("search img wrong : select img");
            // return JSON.stringify({userLogo:deafultLogo});
            callback(false);
        }
        else{
            if( rows.length>0 ){
                // util.log( "databse : " + JSON.stringify(rows) );
                var imgPaths = "";
                rows.forEach(function (row) {
                    imgPaths += row.imgPath + ";";
                });
                imgPaths.substr(0,imgPaths.length-1);
                callback( imgPaths );
            }
            else{
                util.log("search img wrong : no img");
                // return JSON.stringify({userLogo:deafultLogo});
                callback("none");
            }
        }
    });
};

exports.selectMyImagePaths = function (userID, callback) {
    db.all("SELECT imgPath FROM " + imgTable + " WHERE userID=?", userID,  function(err, rows) {
        if( err ){
            util.log("search my imgPath wrong : select img");
            // return JSON.stringify({userLogo:deafultLogo});
            callback(null);
        }
        else{
            if( rows.length>0 ){
                // util.log( "databse : " + JSON.stringify(rows) );
                var imgPaths = "";
                rows.forEach(function (row) {
                    imgPaths += row.imgPath + ";";
                });
                imgPaths.substr(0,imgPaths.length-1);
                callback( imgPaths );
            }
            else{
                util.log("search my imgPath wrong : no img");
                // return JSON.stringify({userLogo:deafultLogo});
                callback("none");
            }
        }
    });
};

exports.selectMyImageNames = function (userID, callback) {
    db.all("SELECT imgName FROM " + imgTable + " WHERE userID=?", userID,  function(err, rows) {
        if( err ){
            util.log("search my imgName wrong : select img");
            // return JSON.stringify({userLogo:deafultLogo});
            callback(null);
        }
        else{
            if( rows.length>0 ){
                // util.log( "databse : " + JSON.stringify(rows) );
                var imgNames = [];
                var index = 0;
                rows.forEach(function (row) {
                    imgNames[index] = row.imgName;
                    index++;
                });
                callback( imgNames );
            }
            else{
                util.log("search my imgName wrong : no img");
                // return JSON.stringify({userLogo:deafultLogo});
                callback([]);
            }
        }
    });
};

exports.selectImagesFuzzily = function (keyWord, callback) {
    db.all("SELECT imgPath FROM " + imgTable + " WHERE imgName LIKE '%" + keyWord + "%'",  function(err, rows) {
        if( err ){
            util.log("search img wrong : select img");
            // return JSON.stringify({userLogo:deafultLogo});
            callback(null);
        }
        else{
            if( rows.length>0 ){
                // util.log( "databse : " + JSON.stringify(rows) );
                var imgPaths = "";
                rows.forEach(function (row) {
                    imgPaths += row.imgPath + ";";
                });
                imgPaths.substr(0,imgPaths.length-1);
                callback( imgPaths );
            }
            else{
                util.log("search img wrong : no img");
                // return JSON.stringify({userLogo:deafultLogo});
                callback(null);
            }
        }
    });
};

exports.insertImage = function (userID, imgDescription, imgName) {
    db.all("SELECT max(imgRank) as maxRank FROM " + imgTable + " WHERE userID=?", userID, function (err, rows) {
        if( err ){
            util.log("fail to select " + userID + " image maxRank");
        }
        else {
            var maxRank = 1;
            if( rows!==undefined && rows ){
                maxRank = rows[0].maxRank + 1;
            }
            var imgID = "" + userID +"_"+ maxRank;
            var imgPath = "/images/" + userID + "/" + imgName;
            var likeNum = 0;
            db.run("INSERT INTO " + imgTable + " VALUES(?,?,?,?,?,?,?)",
                imgID, userID, imgPath, imgDescription, likeNum, imgName, maxRank, function(err) {
                    if( err ){
                        util.log(userID + " fail to insert img : " + imgName);
                    }
                    else{
                        util.log(userID + " succeed inserting img : " + imgName);
                    }
                });
        }
    })
};


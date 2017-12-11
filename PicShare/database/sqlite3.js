
var util = require('util');

var path = require('path');
var sqlite = require('sqlite3').verbose();

var userTable = 'user';
var imgTable = 'img';
var followTable = 'follow';

var db = new sqlite.Database( path.join(__dirname, 'PicShare.db') );
var deafultLogo = "/images/user_logos/default.png";

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
            callback( {"userLogo":deafultLogo} );
        }
        else{
            var logoPath = "";
            if( rows.length>0 ){
                util.log("search logo succeed :" + rows[0].userLogo );
                logoPath = rows[0].userLogo;
            }
            else{
                util.log("search logo wrong : no path");
                logoPath = deafultLogo;
            }
            var result = {"userLogo":logoPath};
            callback( result );
        }
    });
};

exports.updateUserLogo = function (userID, logoPath, callback) {
    db.run("UPDATE " + userTable + " SET userLogo=? WHERE userID=?", logoPath, userID, function (err) {
        if( err ){
            util.log("update user logo : update wrong");
            callback( false );
        }
        else {
            util.log("user " + userID + " update logo succeed");
            callback( true );
        }
    });
};

exports.selectUserInfo = function (userID, callback) {
    util.log("database search info: " + userID);
    db.all("SELECT * FROM " + userTable + " WHERE userID = ?", userID, function(err, rows) {
        if( err ){
            util.log("search logo wrong : select wrong");
        }
        else{
            if( rows.length>0 ){
                util.log("search logo succeed :" + rows[0].userLogo );
                callback(rows[0]);
            }
            else{
                util.log("search logo wrong : no path");
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

exports.selectFollowInfo = function (followerID, callback) {
    util.log("database search followInfo: " + followerID);
    db.all("SELECT userID, userName, userEmail FROM " + followTable + "," + userTable +
        " WHERE followerID = ? and userID=followedID", followerID, function(err, rows) {
        if( err ){
            util.log("search followInfo wrong : select wrong");
            callback(null);
        }
        else{
            if( rows.length>0 ){
                util.log("search followInfo succeed ");
                var followListInfo = [];
                var index = 0;
                var followInfo = {};
                rows.forEach(function (row) {
                    followInfo = {"userID":row.userID, "userName":row.userName, "userEmail":row.userEmail};
                    followListInfo[index] = followInfo;
                    index++;
                });
                callback( followListInfo );
            }
            else{
                util.log("search followInfo wrong : no info");
                callback([]);
            }
        }
    });
};

exports.addFollow = function (userID, followedID, callback) {
    var followID = userID + "_" + followedID;
    db.run("INSERT INTO " + followTable + " VALUES(?,?,?)", followID, userID, followedID, function (err) {
        if( err ){
            util.log( userID + " fail to follow " + followedID );
            var result = {"status":false};
            callback( result );
        }
        else{
            util.log( userID + " succeed following " + followedID );
            var result = {"status":true};
            callback( result );
        }
    })
};

exports.deleteFollow = function (followerID, followedID, callback) {
    db.run("DELETE FROM " + followTable + " WHERE followerID=? and followedID=?", followerID, followedID, function (err) {
        var status = true;
        if( err ){
            status = false;
            util.log(followerID + " fail to cancel follow " + followedID);
        }
        else{
            status = true;
            util.log(followerID + " succeed canceling follow " + followedID);
        }
        var result = {"status":status};
        callback( result );
    })
};

exports.selectUserFuzzily = function (userID, keyWord, callback) {
    db.all("SELECT userID, userName, userEmail FROM " + userTable
        + " WHERE userID<>? and userName LIKE '%" + keyWord + "%' and userID NOT IN(" +
        "SELECT followedID FROM " + followTable + " WHERE followerID=?)", userID, userID, function(err, rows) {
        if( err ){
            util.log("search follow wrong : select follow");
            callback(false);
        }
        else{
            if( rows.length>0 ){
                var info = {};
                var usersInfo = [];
                var index = 0;
                rows.forEach(function (row) {
                    info = {"userID":row.userID, "userName":row.userName, "userEmail":row.userEmail};
                    usersInfo[index] = info;
                    index++;
                });
                callback( usersInfo );
            }
            else{
                util.log("search follow wrong : no follow");
                callback(false);
            }
        }
    });
};

exports.selectHotImages = function (userID, callback) {
    db.all("SELECT imgID, userID, imgPath FROM " + imgTable + " ORDER BY likeNum", function(err, rows) {
        if( err ){
            util.log("search img wrong : select img");
            callback(false);
        }
        else{
            if( rows.length>0 ){
                var imgInfos = [];
                var index = 0;
                var imgInfo = {};
                rows.forEach(function (row) {
                    imgInfo = {"imgID":row.imgID, "userID":row.userID, "imgPath":row.imgPath};
                    imgInfos[index] = imgInfo;
                    index++;
                });
                callback( imgInfos );
            }
            else{
                util.log("search img wrong : no img");
                callback(false);
            }
        }
    });
};

exports.selectFollowImages = function (userID, callback) {
    db.all("SELECT imgID, userID, imgPath FROM " + imgTable + "," + followTable +
        " WHERE followerID=? and userID=followedID", userID, function(err, rows) {
        if( err ){
            util.log("search img wrong : select img");
            callback(false);
        }
        else{
            if( rows.length>0 ){
                var imgInfos = [];
                var index = 0;
                var imgInfo = {};
                rows.forEach(function (row) {
                    imgInfo = {"imgID":row.imgID, "userID":row.userID, "imgPath":row.imgPath};
                    imgInfos[index] = imgInfo;
                    index++;
                });
                callback( imgInfos );
            }
            else{
                util.log("search img wrong : no img");
                callback(false);
            }
        }
    });
};

exports.updateImageLikeNum = function (userID, imgID, callback) {
    db.run("UPDATE " + imgTable + " SET likeNum=likeNum+1 WHERE imgID=?", imgID, function (err) {
        var status = true;
        if( err ){
            status = false;
            util.log(userID + " fail to good image " + imgID);
        }
        else{
            status = true;
            util.log(userID + " succeed good image " + imgID);
        }
        var result = {"status":status};
        callback( result );
    })
};

exports.selectMyImagePaths = function (userID, callback) {
    db.all("SELECT imgID, imgPath, likeNum FROM " + imgTable + " WHERE userID=?", userID,  function(err, rows) {
        if( err ){
            util.log("search my imgPath wrong : select img");
            callback(null);
        }
        else{
            if( rows.length>0 ){
                var imgPaths = [];
                var index = 0;
                var imgPath = {};
                rows.forEach(function (row) {
                    imgPath = {"imgID":row.imgID, "imgPath":row.imgPath, "likeNum":row.likeNum};
                    imgPaths[index] = imgPath;
                    index++;
                });
                callback( imgPaths );
            }
            else{
                util.log("search my imgPath wrong : no img");
                callback("none");
            }
        }
    });
};

exports.selectMyImageNames = function (userID, callback) {
    db.all("SELECT imgName FROM " + imgTable + " WHERE userID=?", userID,  function(err, rows) {
        if( err ){
            util.log("search my imgName wrong : select img");
            callback(null);
        }
        else{
            if( rows.length>0 ){
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
                callback([]);
            }
        }
    });
};

exports.selectMyImageFuzzily = function (userID, keyWord, callback) {
    db.all("SELECT imgID, imgPath, likeNum FROM " + imgTable +
        " WHERE userID=? and imgName LIKE '%" + keyWord + "%'", userID,  function(err, rows) {
        if( err ){
            util.log("search my img info wrong : select img");
            callback(null);
        }
        else{
            if( rows.length>0 ){
                var imgInfos = [];
                var index = 0;
                var imgInfo = {};
                rows.forEach(function (row) {
                    imgInfo = {"imgID":row.imgID, "imgPath":row.imgPath, "likeNum":row.likeNum};
                    imgInfos[index] = imgInfo;
                    index++;
                });
                callback( imgInfos );
            }
            else{
                util.log("search my img info wrong : no img");
                callback([]);
            }
        }
    });
};

exports.deleteMyImage = function (userID, imgID, callback) {
    db.run("DELETE FROM " + imgTable + " WHERE userID=? and imgID=?", userID, imgID, function (err) {
        var status = true;
        if( err ){
            status = false;
            util.log(userID + " fail to delete img " + imgID);
        }
        else{
            status = true;
            util.log(userID + " succeed deleting img " + imgID);
        }
        var result = {"status":status};
        callback( result );
    })
};

exports.selectImagesFuzzily = function (keyWord, callback) {
    db.all("SELECT imgPath FROM " + imgTable + " WHERE imgName LIKE '%" + keyWord + "%'",  function(err, rows) {
        if( err ){
            util.log("search img wrong : select img");
            callback(false);
        }
        else{
            if( rows.length>0 ){
                var imgPaths = [];
                var index = 0;
                var imgPath = {};
                rows.forEach(function (row) {
                    imgPath = {"imgID":row.imgID, "imgPath":row.imgPath};
                    imgPaths[index] = imgPath;
                    index++;
                });
                callback( imgPaths );
            }
            else{
                util.log("search img wrong : no img");
                callback(false);
            }
        }
    });
};

exports.insertImage = function (userID, imgDescription, imgName, callback) {
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
                        callback({"status":false});
                    }
                    else{
                        util.log(userID + " succeed inserting img : " + imgName);
                        callback({"status":true, "imgID":imgID, "imgPath":imgPath, "likeNum":likeNum});
                    }
                });
        }
    })
};




var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var express = require('express');
var router = express.Router();
var util = require('util');

var sqlite = require('../database/sqlite3');

router.route('/profile')
    .get(function (req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectUserLogo(userID, function(data) {
            res.render('info/profile',data);
        });
    });

router.route('/uploadLogo')
    .post(function (req, res, next) {
        var userID = userOnline[req.session.user];
        var form = new formidable.IncomingForm();
        var uploadDir = path.join(__dirname, '../public/images/' + userID);
        form.keepExtensions = true;             //保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
        form.parse(req, function (err, fields, files) {
            sqlite.selectMyImageNames(userID, function (data) {
                var message = "";
                var status = false;
                var logoPath = "";
                var result = {};
                if( !data ){
                    message = "Sorry, fail to upload logo! Try again or Cancel!";
                    status = false;
                    result = {"status": status, "message": message};
                    res.send( JSON.stringify(result) );
                }
                else {
                    var exist = false;
                    for(item in files) {
                        for( var i=0; i<data.length; i++ ){
                            if( data[i] == files[item].name ) {
                                exist = true;
                                status = true;
                                logoPath = "/images/" + userID + "/" + files[item].name;
                                break;
                            }
                        }
                    }
                    if( exist ){
                        sqlite.updateUserLogo(userID, logoPath, function (result) {
                            if( result ){
                                util.log(userID + ' upload image successfully');
                                message = "Congratulations! Success!";
                                status = true;
                                result = {"status": status, "logoPath":logoPath};
                                res.send( JSON.stringify(result) );
                            }
                            else{
                                message = "Sorry, fail to upload logo! Try again or Cancel!";
                                status = false;
                                result = {"status": status, "message": message};
                                res.send( JSON.stringify(result) );
                            }
                        });
                    }
                    else {
                        form.uploadDir = uploadDir;
                        for(item in files) {
                            var oldname = files[item].path;
                            var newname = form.uploadDir + '/' + files[item].name;
                            fs.rename(oldname, newname, function (err) {
                                if (err) {
                                    util.log('upload image: fs.rename wrong');
                                    message = "Sorry, fail to upload picture! Try again or Cancel!";
                                    status = false;
                                    var result = {"status": status, "message": message};
                                    res.send( JSON.stringify(result) );
                                }
                                else {
                                    var imgDescription = "update logo";
                                    sqlite.insertImage(userID, imgDescription, files[item].name);
                                    logoPath = newname;
                                    sqlite.updateUserLogo(userID, logoPath, function (result) {
                                        if( result ){
                                            util.log(userID + ' upload image ' + files[item].name + ' successfully');
                                            message = "Congratulations! Success!";
                                            status = true;
                                            logoPath = "/images/" + userID + "/" + files[item].name;
                                            result = {"status": status, "logoPath":logoPath};
                                            res.send( JSON.stringify(result) );
                                        }
                                        else{
                                            message = "Sorry, fail to upload logo! Try again or Cancel!";
                                            status = false;
                                            result = {"status": status, "message": message};
                                            res.send( JSON.stringify(result) );
                                        }
                                    })
                                }
                            });
                        }
                    }
                }
            });
        });
    });

router.route('/userInfo')
    .get(function (req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectUserInfo(userID, function(data) {
            res.send( data );
        });
    });

router.route('/changeInfo')
    .post(function (req, res, next) {
        var userID = userOnline[req.session.user];
        var userName = req.body.userName;
        var userEmail = req.body.userEmail;
        sqlite.updateUserInfo(userID, userName, userEmail, function (status) {
            res.send( {status:status} );
        })
    });

router.route('/followList')
    .get(function (req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectUserLogo(userID, function(data) {
            res.render('info/followList',data);
        });
    });

router.route('/followInfo')
    .get(function (req, res, next) {
        var followerID = userOnline[req.session.user];
        sqlite.selectFollowInfo( followerID, function (data) {
            if( data ){
                res.send( JSON.stringify(data) );
            }
            else {
                res.send( null );
            }
        })
    });

router.route('/cancelFollow')
    .post(function (req, res, next) {
       var followedID = req.body.followedID;
       var followerID = userOnline[req.session.user];
       sqlite.deleteFollow(followerID, followedID, function (data) {
           res.send( JSON.stringify(data) );
       })
    });

router.route('/followUser')
    .post(function (req, res, next) {
        var userID = userOnline[req.session.user];
        var followedID = req.body.followedID;
        sqlite.addFollow(userID, followedID, function (data) {
            var result = {"status":data};
            res.send( JSON.stringify(result) );
        })
    });

router.route('/searchUser')
    .post(function (req, res, next) {
        var userID = userOnline[req.session.user];
        var keyWord = req.body.keyWord;
        sqlite.selectUserFuzzily(userID, keyWord, function (data) {
            if( data ){
                res.send( JSON.stringify(data) );
            }
            else{
                res.send(null);
            }
        })
    });

module.exports = router;
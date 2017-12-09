
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var express = require('express');
var router = express.Router();
var util = require('util');

var sqlite = require('../database/sqlite3');

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.render('index');
});

router.route('/indexFind')
    .get(function(req, res, next) {
        res.render('index/indexFind');
});

router.route('/indexMine')
    .get(function(req, res, next) {
        res.render('index/indexMine');
    });

router.route('/userLogo')
    .get(function (req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectUserLogo(userID, function(data) {
            // util.log('logic get logo path : ' + data.userLogo);
            res.send( data );
        });
});

router.route('/hotImages')
    .get(function (req, res, next) {
        sqlite.selectHotImages(function (data) {
            // util.log( " logic imagePaths : " + data);
            res.send( data );
        })
    });

router.route('/myImages')
    .get(function (req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectMyImagePaths(userID, function (data) {
            res.send( data );
        })
    });

// router.route('/uploadImg')
//     .get(function (req, res, next) {
//         res.render('index/uploadImg');
//     });

router.route('/uploadImage')
    .post(function (req, res, next) {
        var userID = userOnline[req.session.user];
        var imgDescription = "hahaha";
        var form = new formidable.IncomingForm();
        var uploadDir = path.join(__dirname, '../public/images/' + userID);
        form.keepExtensions = true;             //保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
        form.parse(req, function (err, fields, files) {
            sqlite.selectMyImageNames(userID, function (data) {
                var message = "";
                if( !data ){
                    message = "Sorry, fail to upload picture!";
                    // res.send( JSON.stringify({message: message}) );
                    res.send( message );
                    return;
                }
                else {
                    var exist = false;
                    for(item in files) {
                        for( var i=0; i<data.length; i++ ){
                            if( data[i] == files[item].name ) {
                                exist = true;
                                message = "Picture has existed, please choose again!";
                                // res.send( JSON.stringify({message: message}) );
                                res.send( message );
                                util.log(message);
                                return;
                            }
                        }
                    }
                    if( !exist ){
                        form.uploadDir = uploadDir;
                        for(item in files) {
                            var oldname = files[item].path;
                            var newname = form.uploadDir + '/' + files[item].name;
                            fs.rename(oldname, newname, function (err) {
                                if (err) {
                                    util.log('upload image: fs.rename wrong');
                                    message = "Sorry, fail to upload picture!";
                                    return;
                                }
                                else {
                                    util.log(userID + ' upload image ' + files[item].name + ' successfully');
                                    message = "Congratulations! Success!";
                                }
                                // res.send( JSON.stringify({message: message}) );
                                res.send( message );
                                util.log(message);
                            });
                            sqlite.insertImage(userID, imgDescription, files[item].name);
                        }
                    }
                }
            });
        });
    });

router.route('/searchImage')
    .post(function (req, res, next) {
        var keyWord = req.body.keyWord;
        sqlite.selectImagesFuzzily(keyWord, function (data) {
            res.send( data );
        })
    });

router.route('/profile')
    .get(function (req, res, next) {
        res.render('profile');
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

module.exports = router;

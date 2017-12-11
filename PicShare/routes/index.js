
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
        var userID = userOnline[req.session.user];
        sqlite.selectUserLogo(userID, function(data) {
            res.render('index/indexFind',data);
        });
});

router.route('/indexMine')
    .get(function(req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectUserLogo(userID, function(data) {
            res.render('index/indexMine',data);
        });
    });

router.route('/indexFollow')
    .get(function(req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectUserLogo(userID, function(data) {
            res.render('index/indexFollow',data);
        });
    });

router.route('/hotImages')
    .get(function (req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectHotImages(userID, function (data) {
            if( data ){
                res.send( JSON.stringify(data) );
            }
            else {
                res.send( false );
            }
        })
    });

router.route('/followImages')
    .get(function (req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectFollowImages(userID, function (data) {
            if( data ){
                res.send( JSON.stringify(data) );
            }
            else {
                res.send( false );
            }
        })
    });

router.route('/goodImage')
    .post(function (req, res, next) {
        var userID = userOnline[req.session.user];
        var imgID = req.body.imgID;
        sqlite.updateImageLikeNum(userID, imgID, function (result) {
            res.send( JSON.stringify(result) );
        })
    });

router.route('/myImages')
    .get(function (req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.selectMyImagePaths(userID, function (data) {
            if( data ){
                res.send( JSON.stringify(data) );
            }
            else {
                res.send( false );
            }
        })
    });

router.route('/searchMyImage')
    .post(function (req, res, next) {
        var userID = userOnline[req.session.user];
        var keyWord = req.body.keyWord;
        sqlite.selectMyImageFuzzily(userID, keyWord, function (result) {
            res.send( JSON.stringify(result) );
        })
    });

router.route('/delMyImage')
    .post(function (req, res, next) {
        var userID = userOnline[req.session.user];
        var imgID = req.body.imgID;
        sqlite.deleteMyImage(userID, imgID, function (result) {
            res.send( JSON.stringify(result) );
        })
    });

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
                var status = false;
                var imgPath = "";
                if( !data ){
                    message = "Sorry, fail to upload picture!";
                    status = false;
                    var result = {"status": status, "message": message};
                    res.send( JSON.stringify(result) );
                }
                else {
                    var exist = false;
                    for(item in files) {
                        for( var i=0; i<data.length; i++ ){
                            if( data[i] == files[item].name ) {
                                exist = true;
                                message = "Picture has existed, please choose again!";
                                status = false;
                                util.log(message);
                                break;
                            }
                        }
                    }
                    if( exist ){
                        var result = {"status": status, "message": message};
                        res.send( JSON.stringify(result) );
                    }
                    else {
                        form.uploadDir = uploadDir;
                        for(item in files) {
                            var oldname = files[item].path;
                            var newname = form.uploadDir + '/' + files[item].name;
                            fs.rename(oldname, newname, function (err) {
                                if (err) {
                                    util.log('upload image: fs.rename wrong');
                                    message = "Sorry, fail to upload picture!";
                                    status = false;
                                }
                                else {
                                    util.log(userID + ' upload image ' + files[item].name + ' successfully');

                                    // var result = {"status": status, "message": message, "imgPath":imgPath};
                                    sqlite.insertImage(userID, imgDescription, files[item].name, function (result) {
                                        if( result.status ){
                                            message = "Congratulations! Success!";
                                            status = true;
                                            imgPath = "/images/" + userID + "/" + files[item].name;
                                        }
                                        else {
                                            message = "Sorry, fail to upload picture!";
                                            status = false;
                                        }
                                        result.status = status;
                                        result.message = message;
                                        res.send( JSON.stringify(result) );
                                    });
                                }
                            });
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
            if( data ){
                res.send( JSON.stringify(data) );
            }
            else {
                res.send( false );
            }
        })
    });


module.exports = router;

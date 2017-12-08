
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
        sqlite.searchUserLogo(userID, function(data) {
            util.log("logic get logo path : " + data.userLogo);
            res.send( data );
        });
});

router.route('/hotImages')
    .get(function (req, res, next) {
        sqlite.findHotImages(function (data) {
            // util.log( " logic imagePaths : " + data);
            res.send( data );
        })
    });

router.route('/myImages')
    .get(function (req, res, next) {
        var userID = userOnline[req.session.user];
        sqlite.findMyImages(userID, function (data) {
            res.send( data );
        })
    });

// router.route('/uploadImg')
//     .get(function (req, res, next) {
//         res.render('index/uploadImg');
//     });

router.route('/uploadImg')
    .get(function (req, res, next) {
        res.render('uploadImg');
    });

router.route('/searchImage')
    .post(function (req, res, next) {
        var keyWord = req.body.keyWord;
        sqlite.searchImages(keyWord, function (data) {
            util.log(data);
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
        sqlite.searchUserInfo(userID, function(data) {
            res.send( data );
        });
    });

router.route('/changeInfo')
    .post(function (req, res, next) {
        var userID = userOnline[req.session.user];
        var userName = req.body.userName;
        var userEmail = req.body.userEmail;
        sqlite.changeUserInfo(userID, userName, userEmail, function (status) {
            res.send( {status:status} );
        })
});

module.exports = router;


var express = require('express');
var router = express.Router();
var util = require('util');

var sqlite = require('../database/sqlite3');

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.render('index');
});

router.route('/index')
    .get(function(req, res, next) {
        res.render('index');
});

router.route('/userLogo')
    .get(function (req, res, next) {
        var uid = userOnline[req.session.user];
        sqlite.searchUserLogo(uid, function(data) {
            util.log("logic get logo path : " + data.userLogo);
            res.send( data );
        });
});

router.route('/profile')
    .get(function (req, res, next) {
        res.render('profile');
});

router.route('/userInfo')
    .get(function (req, res, next) {
        var uid = userOnline[req.session.user];
        sqlite.searchUserInfo(uid, function(data) {
            res.send( data );
        });
    });

module.exports = router;

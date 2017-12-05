
var util = require('util');
var path = require('path');
var async = require('async');
var fs = require('fs');

var express = require('express');
var router = express.Router();

var sqlite = require('../database/sqlite3');

var IDDistance = 5;

/* GET sign page. */

router.get('/signIn', function(req, res, next) {
    res.render('signIn', {title: 'Express'});
});

router.route('/signUp')
    .get(function(req, res) {
        res.render('signUp', {title: 'Express'});
    })
    .post(function (req, res) {
        var upassword = req.body.upassword;
        var uname = req.body.uname;
        var uemail = req.body.uemail;
        var uid = signUp(upassword, uname, uemail);
        res.render('tellID', {title: uid-IDDistance});
    });

module.exports = router;


/* ============================================== 内部函数 ============================================== */


function signUp(upassword, uname, uemail) {
    var uid = undefined;
    try {
        var IDs = fs.readFileSync(path.join(__dirname, './ID.txt'), 'utf8');
        IDs = IDs.split(';');
        var uid = IDs.length * IDDistance + 3432;
        if( upassword!==undefined || upassword.length!==0 ) {
            fs.appendFile(path.join(__dirname, './ID.txt'), uid + "," + upassword + ";\n", function (err) {
                if (err) {
                    util.log("write id wrong");
                }
            });
            sqlite.addUser(uid, upassword, uname, uemail);
        }
    }catch(err){
        util.log("read file wrong");
    }
    return uid;
}
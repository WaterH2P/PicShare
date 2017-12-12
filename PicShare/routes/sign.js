
var util = require('util');
var path = require('path');
var fs = require('fs');

var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var sqlite = require('../database/sqlite3');
var cf = require('./commonFunc');

var IDtxtPath = path.join(__dirname, './ID.txt');

var md5 = crypto.createHash('md5');
var IDDistance = 5;

/* GET sign page. */

router.route('/signIn')
    .get(function(req, res) {
        res.render('sign/signIn');
    })
    .post(function (req, res) {
        var userID = req.body.userID;
        var userPassword = req.body.userPassword;
        if( signIn(userID, userPassword) ){
            var identification = "" + userID + new Date().getTime() + userPassword;
            req.session.logged_in = true;
            req.session.user = identification;
            userOnline[req.session.user] = userID;
            res.send( JSON.stringify({"status":true}) );
        }
        else{
            res.send( JSON.stringify({"status":false}) );
        }
    });

router.route('/signUp')
    .get(function(req, res) {
        res.render('sign/signUp');
    })
    .post(function (req, res) {
        var userPassword = req.body.userPassword;
        var userName = req.body.userName;
        var userEmail = req.body.userEmail;
        var userID = signUp(userPassword, userName, userEmail);
        res.send( JSON.stringify({"status":true, "userID":userID}) );
    });

module.exports = router;


/* ============================================== 内部函数 ============================================== */


var signUp = function(userPassword, userName, userEmail) {
    var userID = undefined;
    try {

        var IDs = fs.readFileSync(IDtxtPath, 'utf8');
        IDs = IDs.split(';');
        userID = IDs.length * IDDistance + 3432;
        if( userPassword!==undefined || userPassword.length!==0 ) {
            fs.appendFile(IDtxtPath, userID + "," + userPassword + ";\n", function (err) {
                if (err) {
                    util.log("write id wrong");
                }
            });

            var dirPath = path.join(__dirname, '../public/images/'+userID)
            fs.exists(dirPath, function (res) {
                if( res ){
                    util.log( userID + " image dir has existed!");
                }
                else {
                    fs.mkdir(dirPath, function (err) {
                        if( err ){
                            util.log( userID + " fail to create image dir !");
                        }
                    });
                }
            });

            var userLogPath = path.join(__dirname, '../database/userLog/'+userID);
            var signUpMessage = userID + " sign up successfully at " + cf.getNowTime();
            fs.writeFile( userLogPath, signUpMessage, 'utf8', function (err) {
                if( err ){
                    util.log( "fail to write sign up message!");
                }
            });

            sqlite.addUser(userID, userPassword, userName, userEmail);
        }
    }catch(err){
        util.log("sign up read file wrong");
    }
    return userID;
};

var signIn = function(userID, userPassword) {
    try{
        var IDs = fs.readFileSync(IDtxtPath, 'utf8');
        IDs = IDs.split(';\n');
        for( var i=0; i<IDs.length; i++ ){
            var IDAndPassword = IDs[i].split(",");
            if( IDAndPassword[0].length>0 && IDAndPassword[1].length>0 && IDAndPassword[0]===userID && IDAndPassword[1]===userPassword ){
                fs.appendFile(path.join(__dirname, './log.txt'), userID + " sign in at " + new Date().getTime() + "\n", 'utf8', function (err) {
                    if (err) {
                        util.log("write sign in log wrong");
                    }
                });
                util.log(userID + "succeed signing in");
                return true;
            }
        }
        return false;
    }catch(err){
        var message = userID + " fail to sign in at " + cf.getNowTime();
        // fs.appendFile(path.join(__dirname, './log.txt'), userID + " fail to sign in at " + new Date().getTime() + "\n", 'utf8', function (err) {
        //     if (err) {
        //         util.log("fail to write 'fail to sign in log' ");
        //     }
        // });
        cf.writeLog( userID, message );
        return false;
    }
};

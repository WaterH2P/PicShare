
var util = require('util');
var path = require('path');
var fs = require('fs');

exports.getNowTime = function () {
    var oDate = new Date(); //实例一个时间对象；
    var year = oDate.getFullYear();   //获取系统的年；
    var month = oDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
    var day = oDate.getDate(); // 获取系统日，
    var hour = oDate.getHours(); //获取系统时，
    var minute = oDate.getMinutes(); //分
    var second = oDate.getSeconds(); //秒
    var time = "" + year + "." + month + "." + day + " " + hour + ":" + minute + ":" + second;
    return time;
};

exports.writeLog = function (userID, message) {
    var userLogPath = path.join(__dirname, '../database/userLog/'+userID);
    fs.appendFile( userLogPath, message + "\n", 'utf8', function (err) {
        if (err) {
            util.log(" Fail to write : " + message);
        }
    });
};
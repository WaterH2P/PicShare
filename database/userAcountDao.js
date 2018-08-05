
var conn   = require('./mysql').connection();
var helper = require('./helper');

var tableName = 'userAccount';

exports.selectPasswordById = function (id, callback) {
    var sql       = 'SELECT password FROM ' + tableName + ' WHERE id=?';
    var sqlParams = [id];
    var password = '';
    conn.query(sql, sqlParams, function (err, res) {
        if(err){
            helper.printErrorMessage('selectPasswordById', {id : id}, err.message);
            return;
        }

        if( res.length > 0 ){
            password = res[0].password;
        }
        console.log(password);
        callback(password);
    });
};


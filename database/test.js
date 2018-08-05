
var userAccountDao = require('./userAcountDao');

var password = userAccountDao.selectPasswordById('2236');
console.log( password );
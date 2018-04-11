
var User = require('./model/userBO');
var ServiceGenerator = require('../../common/serviceGenerator');

var UserService = ServiceGenerator.generate(User, '_id');

module.exports = UserService;

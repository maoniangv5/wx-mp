let express = require('express');
let md5 = require('md5');
let router = express.Router();

let RestMsg = require('../../common/restmsg');
let UserService = require('../../service/user/userService');
let UserBO = require('../../service/user/model/userBO');
let EncryptService = require('../../common/encryptService');

let _privateFun = router.prototype;

_privateFun.prsBO2VO = function (obj) {
    let result = obj.toObject({
        transform: function (doc, ret, options) {
            return {
                id: ret._id,
                username: ret.username,
                avatar: ret.avatar ? ret.avatar : null
            }
        }
    });
    return result;
}

router.route('/register')
    .post(function (req, res, next) {
        let restmsg = new RestMsg();
        let user = new UserBO();
        let query = req.body;

        query.password = EncryptService.md5Hash(req.body.password, md5(req.body.username));

        UserService.count({ username: query.username }, function (err, count) {
            if (err) {
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }
            if (count === 0) {
                UserService.save(query, function (err, obj) {
                    if (err) {
                        restmsg.errorMsg(err);
                        res.send(restmsg);
                        return;
                    }

                    restmsg.successMsg('注册成功！');
                    restmsg.setResult(_privateFun.prsBO2VO(obj));
                    res.send(restmsg)
                });
            } else {
                restmsg.errorMsg('此用户名已被注册，请重试！');
                res.send(restmsg);
                return;
            }
        })
    });

router.route('/login')
    .post(function (req, res, next) {
        let restmsg = new RestMsg();

        UserService.findOne({ username: req.body.username }, function (err, obj) {
            if (err) {
                restmsg.errorMsg(err);
                res.send(restmsg);
                return;
            }

            if (!obj) {
                restmsg.errorMsg('此用户名尚未注册，请注册后重试！');
                res.send(restmsg)
                return;
            }

            if (obj.password === EncryptService.md5Hash(req.body.password, md5(req.body.username))) {
                restmsg.successMsg();
                restmsg.setResult(_privateFun.prsBO2VO(obj));
                res.send(restmsg)
                return;
            } else {
                restmsg.errorMsg('用户名或密码错误，请重试！');
                res.send(restmsg);
                return;
            }
        });
    });

module.exports = router;

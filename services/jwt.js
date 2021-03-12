const jwt = require("jwt-simple");
const moment = require("moment");
const { SECRET_KEY } = require("../config");

exports.createAccessToken = function(user) {
    const payload = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createToken: moment().unix(),
        exp: moment()
        .add(3, "hours")
        .unix()
    };

    return jwt.encode(payload,SECRET_KEY);
};

exports.createRefreshToken = function(user) {

    const payload = {
        id: user._id,
        exp: moment()
        .add(30, "days")
        .unix()
    };

    return jwt.encode(payload,SECRET_KEY);
}

exports.decodedToken = function(user) {
    return jwt.decode(user,SECRET_KEY,true);
}
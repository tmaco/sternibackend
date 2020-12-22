const jwt = require("jwt-simple");
const moment = require("moment");
const { SECRET_KEY } = require("../config");

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res
        .status(403)
        .send({ message: "La petición no tiene cabecera de Autenticación." });
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        var payload = jwt.decode(token, SECRET_KEY);

        if(payload.exp <= moment.unix()) {
            return res.status(404).send({ message: "El token ha expirado." })
        } else {

        }
    } catch(ex) {
        //console.log(ex);
        return res.status(404).send({ message: "Token invalido." });
    }

    req.user = payload;
    next();
}

exports.ensureAdmin = (req, res, next) => {
    if(!req.headers.authorization) {
        return res
        .status(403)
        .send({ message: "La petición no tiene cabecera de Autenticación." });
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        var payload = jwt.decode(token, SECRET_KEY);

        if(payload.exp <= moment.unix()) {
            return res.status(404).send({ message: "El token ha expirado." })
        } else {
            if( payload.role !== 'admin') {
                return res.status(403).send({ message: "El usuario logueado no es admin." });
            } else{

            }

        }
    } catch(ex) {
        //console.log(ex);
        return res.status(404).send({ message: "Token invalido." });
    }

    req.user = payload;
    next();
}
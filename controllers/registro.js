const Registro = require("../models/registro");
const utiles = require("../utils/normalizationNames");

function getRegistros(req, res) {
    Registro.find({
        fecha : {
            $gte: "2020-12-28T00:00:00.000Z"        
        }
    })
    .sort({fecha: "desc"})
    .then(registros => {
        if(!registros) {
            res.status(404).send({ message: "No se ha encontrado ningun registro."});
        } else {
            res.status(200).send({ registros });
        }
    });
}


module.exports = {
    getRegistros
};
const Registro = require("../models/registro");
const utiles = require("../utils/normalizationNames");

function getRegistros(req, res) {
    const { league } = req.query;

    Registro.find({tabla: "fantasyLineup", league: league,
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

function getRegistrosPlayer(req, res) {
    const playerId = req.params.playerId;
    const { league } = req.query;

    Registro.find({tabla: "fantasyLineup", league: league, player_id: playerId,
        fecha : {
            $gte: "2020-12-28T00:00:00.000Z"        
        }
    })
    .sort({fecha: "desc"})
    .then(registros => {
        if(!registros || registros.length===0) {
            res.status(404).send({ message: "No se ha encontrado ningun registro."});
        } else {
            res.status(200).send({ registros });
        }
    });
}





module.exports = {
    getRegistros,
    getRegistrosPlayer
};
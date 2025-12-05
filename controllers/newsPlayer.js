const NewsPlayer = require("../models/newsPlayer");
const jwt = require("jwt-simple");
const moment = require('moment');

async function getNewsData(req, res) {
    try {
        const news = req.body;

        // Verificar que 'news' sea un array
        if (!Array.isArray(news)) {
            return res.status(400).send({ code: 400, message: "El body debe ser un array de noticias." });
        }

        // Calcular la fecha límite (hace un mes desde hoy)
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);  // Establecer la fecha a 1 mes atrás

        // Borrar las noticias anteriores a un mes
        await NewsPlayer.collection.deleteMany({ lastUpdatedOn: { $lt: oneMonthAgo } });

        const insertedNews = [];
        // Insertar cada noticia uno a uno
        for (const item of news) {
            try {
                if (item.lastUpdatedOn) {
                    item.lastUpdatedOn = new Date(item.lastUpdatedOn); // Asegurarse de que la fecha sea un objeto Date
                }

                // Insertar la noticia en la colección
                const result = await NewsPlayer.collection.insertOne(item);
                insertedNews.push(result.ops[0]); // Guardar la noticia insertada
            } catch (err) {
                if (err.code === 11000) {
                    // Si el error es un duplicado, lo ignoramos
                    console.warn("Noticia duplicada.");
                } else {
                    // Si es otro tipo de error, respondemos con un mensaje de error
                    return res.status(500).send({ code: 500, message: "Error al insertar noticia: " + err.message });
                }
            }
        }

        // Responder al cliente con las noticias insertadas
        res.status(200).send({ code: 200, message: "Noticias insertadas en DB", insertedNews });
    } catch (error) {
        // Si ocurre algún error, respondemos con un mensaje genérico
        res.status(500).send({ code: 500, message: "Error general: " + error.message });
    }
}


function getNewsPlayers(req,res) {
    NewsPlayer.find({},{"_id":0,"player_id":1,"player_name":1,"currentTitle":1,
        "currentDescription":1,"lastUpdatedOn":1})
        .sort({ lastUpdatedOn: "desc"})
        .exec((err, newsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(newsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ninguna noticia de jugador."});
                } else {
                    res.status(200).send({ code: 200, news: newsStored });
                }
            }
        });
}

function getNewsPlayer(req, res) {
    NewsPlayer.find({ player_id: req.params.playerId },{"_id":0,"player_id":1,"player_name":1,"currentTitle":1,
        "currentDescription":1,"lastUpdatedOn":1}) // Corregido aquí
        .sort({ lastUpdatedOn: "desc" })
        .exec((err, newsStored) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." });
            } else {
                if (newsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ninguna noticia de jugador." });
                } else {
                    res.status(200).send({ code: 200, news: newsStored });
                }
            }
        });
}

function getListNewsPlayers(req,res){

    let players = req.params.playersName.split(',');

    NewsPlayer.find({ player_name : { $in: players }},{"_id":0,"player_id":1,"player_name":1,"currentTitle":1,
        "currentDescription":1,"lastUpdatedOn":1})
        .sort({ lastUpdatedOn: "desc"})
        .exec((err, newsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(newsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ninguna noticia de los jugadores." });
                } else {
                    res.status(200).send({ code: 200, news: newsStored });
                }
            }
        });

}

async function updateNewsKey(req, res) {
  try {
    // Obtén los documentos que coinciden con player_id: 144253
    const players = await NewsPlayer.find({ });

    if (players.length === 0) {
      return res.status(404).json({ message: 'No se encontraron jugadores con ese ID.' });
    }

    // Genera el JWT para cada documento y actualiza en la base de datos
    const updates = players.map(async (player) => {
      const payload = {
        title: player.currentTitle,
        player_id: player.player_id,
        fecha:  moment(player.lastUpdatedOn).format('YYYY-MM-DD')
      };

      // Genera el JWT con los datos del jugador y la clave secreta
      const token = jwt.encode(payload, "lol", 'HS256');  // Usa una clave secreta más segura en producción

      // Actualiza el documento con el JWT generado
      await NewsPlayer.updateOne(
        { _id: player._id },  // Usamos el _id del documento para la actualización
        { $set: { key: token } }
      );
    });

    // Espera a que todas las actualizaciones terminen
    await Promise.all(updates);

    res.json({ message: 'JWTs generados y documentos actualizados exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({
      message: 'Error al actualizar los documentos.',
      error: error.message
    });
  }
}

module.exports = {
    getNewsData,
    getNewsPlayers,
    getNewsPlayer,
    getListNewsPlayers,
    updateNewsKey
};
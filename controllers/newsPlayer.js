const NewsPlayer = require("../models/newsPlayer");

async function getNewsData(req, res) {
    try {
        const news = req.body;

        // Verificar que 'news' sea un array
        if (!Array.isArray(news)) {
            return res.status(400).send({ code: 400, message: "El body debe ser un array de noticias." });
        }
        const insertedNews = [];
        // Insertar cada noticia uno a uno
        for (const item of news) {
            try {
                const result = await NewsPlayer.collection.insertOne(item);
                insertedNews.push(result.ops[0]); // Guardar la noticia insertada
            } catch (err) {
                if (err.code === 11000) {
                    // Código de error para duplicados
                    console.warn("Duplicada.");
                } else {
                    //console.error("Error al insertar noticia: ", err);
                    return res.status(500).send({ code: 500, message: "Error al insertar noticia: " + err.message });
                }
            }
        }
        // Responder al cliente con las noticias insertadas
        res.status(200).send({ code: 200, message: "Noticias insertadas en DB" });
    } catch (error) {
        //console.error("Error general al procesar las noticias: ", error);
        res.status(500).send({ code: 500, message: "Error general: " + error.message });
    }
}

    /*try {
    NewsPlayer.collection.deleteMany({});
    const resultado = await NewsPlayer.insertMany(news);
    //console.log("Inserciones completadas:", resultado);
    res.status(200).send({ code: 200, message: "Inserciones completadas en DB"});

  } catch (error) {
    //console.error("Error al insertar jugadores:", error);
    res.status(500).send({ code: 500, message: "Error al insertar noticias:" +error });

  }*/


function getNewsPlayers(req,res) {
    NewsPlayer.find({})
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
    NewsPlayer.find({ player_id: req.params.playerId }) // Corregido aquí
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


module.exports = {
    getNewsData,
    getNewsPlayers,
    getNewsPlayer
};
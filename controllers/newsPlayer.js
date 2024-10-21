const NewsPlayer = require("../models/newsPlayer");

async function getNewsData(req,res) {
   let news=req.body;

   try {
    NewsPlayer.collection.deleteMany({});
    const resultado = await NewsPlayer.insertMany(news);
    //console.log("Inserciones completadas:", resultado);
    res.status(200).send({ code: 200, message: "Inserciones completadas en DB"});

  } catch (error) {
    //console.error("Error al insertar jugadores:", error);
    res.status(500).send({ code: 500, message: "Error al insertar noticias:" +error });

  }
}



function getNewsPlayers(req,res) {
    NewsPlayer.find({})
        .sort({ last_name: "asc"})
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

module.exports = {
    getNewsData,
    getNewsPlayers
};
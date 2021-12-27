const StatusPlayer = require("../models/statusPlayer");
const utiles = require("../utils/normalizationNames");

function getStatusData(req,res){

    //borramos el estado anterior de los jugadores
    StatusPlayer.collection.deleteMany({});
    
    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate("363e84d9-dc73-4fa6-9c91-dc2378", "MYSPORTSFEEDS");
    //msf.getData('nba', '2021-2022-regular', 'player_injuries', 'json', {force: 'false' })
    //.then(async response => {
        const fs = require('fs');
        var path = require('path');

        var jsonPath = path.join(__dirname, '..', '.', 'results', 'player_injuries-nba-2021-2022-regular.json');
        //await fs.readFile(jsonPath, (err, data) => {
            fs.readFile(jsonPath, (err, data) => {
        if (err) throw err;
        let statusData = JSON.parse(data);

            console.log(utiles.count(statusData.players));
            for(var i=0; i<utiles.count(statusData.players); i++){
                var status = statusData.players[i];
                //console.log(status);
                var statusPlayer = new StatusPlayer({
                    player_id: status.id,
                    last_name: utiles.removeDiacritics(status.lastName), 
                    first_name: utiles.removeDiacritics(status.firstName), 
                    player_name: utiles.removeDiacritics(status.firstName) + " " +utiles.removeDiacritics(status.lastName), 
                    currentInjury: status.currentInjury.description,
                    currentStatus: status.currentInjury.playingProbability,
                    lastUpdatedOn: statusData.lastUpdatedOn                    
                });

                //console.log(statusPlayer);
                StatusPlayer.collection.insertOne(statusPlayer, function (err, docs) {
                    if (err){ 
                        //return console.error(err);
                        console.warn("Duplicado");
                    } else {
                        //console.log("Player inserted to Collection");
                    }
                });
            }
        
        });
    //});

    res.status(200).jsonp({
        "status": 200,
        "message": `Player Status inserted into Database`
      });	
}

function getStatusPlayers(req,res) {
    StatusPlayer.find({})
        .sort({ last_name: "asc"})
        .exec((err, statusStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(statusStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun estado de jugador."});
                } else {
                    //console.log(playersStored.length);
                    res.status(200).send({ code: 200, status: statusStored });
                }
            }
        });
}

module.exports = {
    getStatusData,
    getStatusPlayers
};
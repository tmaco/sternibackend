//const { response } = require("express");
const utiles = require("../utils/normalizationNames");
const Player = require("../models/player");
const { log } = require("console");
const { API_KEY, PASSWORD } = require("../config");


function getPlayers(req,res) {
    Player.find({season_id: "26_27", roster_status: "active"})
        .sort({ team_id: "asc", last_name: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    res.status(200).send({ code: 200, players: playersStored });
                }
            }
        });
}

function getPlayersAll(req,res) {
    Player.find({season_id: "26_27"})
        .sort({ team_id: "asc", last_name: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    res.status(200).send({ code: 200, players: playersStored });
                }
            }
        });
}

function getPlayersByTeam(req,res) {

    const TeamName = req.params.teamName;

    Player.find({ season_id: "26_27", team_id : TeamName, roster_status: "active"})
        .sort({ last_name: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador de " + TeamName + "."});
                } else {
                    res.status(200).send({ code: 200, players: playersStored });
                }
            }
        });
}

function getPlayersByPosition(req,res) {

    let position = [];

    switch(req.params.position) {
        case 'G':
            position = [ "PG", "SG", "G" ];
            break;
        case 'F':
            position = [ "SF", "PF", "F" ];
            break;
        case 'C':
            position = [ "C" ];
            break;
        default:
            position = [ "C" ];
    };

    Player.find({ season_id: "26_27", position : { $in: position }, roster_status: "active"})
        .sort({ last_name: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador con la posición " + position + "."});
                } else {
                    res.status(200).send({ code: 200, players: playersStored });
                }
            }
        });
}

function getPlayer(req,res){

    const playerName = req.params.playerName;

    // Crear una expresión regular que permita coincidencias en medio y al final
    const regex = new RegExp(playerName.replace(/\*/g, '.*'), 'i'); // 'i' para que sea insensible a mayúsculas

    Player.findOne({ season_id: "26_27", display_name: { $regex: regex } })
        .exec((err, playerStored) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor." });
            } else {
                if (!playerStored) {
                    res.status(404).send({ message: "No se ha encontrado ningún jugador llamado " + playerName + "." });
                } else {
                    res.status(200).send({ code: 200, player: playerStored });
                }
            }
        });
}

function getListPlayers(req,res){

    let players = req.params.playersName.split(',');

    Player.find({ season_id: "26_27", display_name : { $in: players }})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador llamado " + players + "."});
                } else {
                    res.status(200).send({ code: 200, players: playersStored });
                }
            }
        });

}

function getPlayerId(req,res){

    const playerId = parseInt(req.params.playerId);

    var season = req.query.season;

    Player.findOne({ season_id: season, player_id : playerId})
        .exec((err, playerStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(!playerStored || (playerStored && playerStored.length <= 0)) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador con id " + playerId + "."});
                } else {
                    res.status(200).send({ code: 200, player: playerStored });
                }
            }
        });

}

function getPlayersDataOld(req,res){
    console.log(req.params.team);
    var TeamName = req.params.team;
    let team_id = TeamName;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate(API_KEY, PASSWORD);
    msf.getData('nba', '2026-2027-regular', 'players', 'json', {team: TeamName,  force: 'false' })
    .then(async response => {
        const fs = require('fs');
        var path = require('path');

        var jsonPath = path.join(__dirname, '..', '.', 'results', 'players-nba-2026-2027-regular.json');
        //var jsonPath = '/tmp/players-nba-2023-2024-regular.json';
        await fs.readFile(jsonPath, (err, data) => {
            if (err) throw err;
            let playersData = JSON.parse(data);

            team_id = utiles.checkNewAPISportsFeeds(TeamName);
            
            //res.status(200).send({ code: 200, data: playersData.players[0] });
            console.log(utiles.count(playersData.players));
            //for(var i=0; i<utiles.count(playersData.players); i++){
            playersData.players.forEach(async (registro) => {                 

                    //let ply = playersData.players[i].player;
                    let ply = registro.player;
                    //console.log(ply.lastName);
                    var player = new Player({
                        player_id: ply.id,
                        season_id: "26_27",
                        team_id: team_id,
                        last_name: utiles.removeDiacritics(ply.lastName), 
                        first_name: utiles.removeDiacritics(ply.firstName), 
                        display_name: utiles.removeDiacritics(ply.firstName) + " " +utiles.removeDiacritics(ply.lastName), 
                        birthdate: ply.birthDate,
                        age: ply.age, 
                        birthplace: ply.birthCity + ", " + ply.birthCountry,
                        height_formatted: ply.height,
                        weight_lb: ply.weight, 
                        weight_kg: ply.weight,
                        position: ply.primaryPosition, 
                        uniform_number: ply.jerseyNumber,
                        roster_status: ply.currentRosterStatus === "ROSTER" ? "active" : "inactive",
                        avatar: ply.officialImageSrc,
                        rookie: ply.drafter.year===2026 && ply.rookie ? ply.rookie : "false"
                    });

                    //console.log(player);
                    Player.collection.insertOne(player, function (err, docs) {
                    //Player.collection.updateOne({ player_id: player.player_id, season_id: player.season_id}, player, {upsert:true}, function (err, docs) {
                        if (err){ 
                            //return console.error(err);
                            if (err.code === 11000) {
                                // Código de error para duplicados
                                console.warn("Duplicado: " + player.display_name);
                            } else {
                                console.error("Error al insertar registro: ", err);
                            }
                        } else {
                            console.log("Player inserted to Collection: "+ player.display_name);
                        }
                    });
                //}
            });

            /*player.save((err, playerStored) => {
                    if(err){
                        res.status(500).send({ message: "El usuario ya existe." });
                    } else {
                        if(!playerStored) {
                            res.status(500).send({ message: "Error al crear el nuevo jugador." });
                        } else {
                            res.status(200).send({ message: "Jugador creado correctamente."});
                        }
                    }
                })
        */
        });
    });

    res.status(200).jsonp({
        "status": 200,
        "message": `Team ${team_id} inserted into Database`
      });	
}

function getPlayersData(req,res){
    console.log(req.params.team);
    var TeamName = req.params.team;
    let team_id = TeamName;

    var MySportsFeeds = require("mysportsfeeds-node");

    var msf = new MySportsFeeds("2.1", true);
    msf.authenticate(API_KEY, PASSWORD);
    
    // Consumimos la API directamente
    msf.getData('nba', '2026-2027-regular', 'players', 'json', { team: TeamName, force: 'false' })
    .then(response => { // 'response' ya contiene el objeto JSON parseado de la API

        team_id = utiles.checkNewAPISportsFeeds(TeamName);
        
        // Validamos que la respuesta contenga la estructura esperada
        if (!response || !response.players) {
            console.warn("No se encontraron jugadores en la respuesta de la API.");
            return;
        }

        console.log("Total jugadores recibidos de la API: " + response.players.length);

        response.players.forEach((registro) => {                 
            let ply = registro.player;
            
            // Definimos los campos identificadores únicos
            const filtro = { 
                player_id: ply.id, 
                season_id: "26_27" 
            };

            // El valor de rookie como booleano puro (true / false)
            const valorRookie = ply.drafted?.year === 2026 && ply.rookie ? true : false;
            console.log(utiles.removeDiacritics(ply.firstName) + " " + utiles.removeDiacritics(ply.lastName) + " " + valorRookie);

            // Construimos la operación de actualización
            const actualizacion = {
                $set: { 
                    rookie: valorRookie 
                },
                $setOnInsert: {
                    team_id: team_id,
                    last_name: utiles.removeDiacritics(ply.lastName), 
                    first_name: utiles.removeDiacritics(ply.firstName), 
                    display_name: utiles.removeDiacritics(ply.firstName) + " " + utiles.removeDiacritics(ply.lastName), 
                    birthdate: ply.birthDate,
                    age: ply.age, 
                    birthplace: (ply.birthCity || "") + ", " + (ply.birthCountry || ""),
                    height_formatted: ply.height,
                    weight_lb: ply.weight, 
                    weight_kg: ply.weight,
                    position: ply.primaryPosition, 
                    uniform_number: ply.jerseyNumber,
                    roster_status: ply.currentRosterStatus === "ROSTER" ? "active" : "inactive",
                    avatar: ply.officialImageSrc
                }
            };

            // Usamos updateOne con upsert: true
            Player.collection.updateOne(filtro, actualizacion, { upsert: true }, function (err, result) {
                if (err){ 
                    console.error("Error al procesar el jugador: ", err);
                } else {
                    if (result.upsertedCount > 0) {
                        console.log("Jugador CREADO: " + ply.firstName + " " + ply.lastName);
                    } else if (result.modifiedCount > 0) {
                        console.log("Jugador ACTUALIZADO (Rookie): " + ply.firstName + " " + ply.lastName);
                    } else {
                        console.log("Jugador sin cambios: " + ply.firstName + " " + ply.lastName);
                    }
                }
            });
        });
    })
    .catch(error => {
        console.error("Error al conectar con la API de MySportsFeeds:", error);
    });

    res.status(200).jsonp({
        "status": 200,
        "message": `Team ${team_id} processed`
    });	
}

function updateDisplayName(req,res) {
    Player.find({season_id: "19_20"})
        .sort({ team_id: "asc", uniform_number: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    for(var i=0; i<playersStored.length; i++){
                        Player.findByIdAndUpdate({_id: playersStored[i].id }, { 
                            last_name: utiles.removeDiacritics(playersStored[i].last_name), 
                            first_name: utiles.removeDiacritics(playersStored[i].first_name), 
                            display_name: utiles.removeDiacritics(playersStored[i].display_name),
                            team_id: playersStored[i].team_id,
                            birthdate: playersStored[i].birthdate,
                            age: playersStored[i].age,
                            birthplace: playersStored[i].birthplace,
                            height_in: playersStored[i].height_in,
                            height_cm: playersStored[i].height_cm,
                            height_m: playersStored[i].height_m,
                            height_formatted : playersStored[i].height_formatted,
                            weight_lb: playersStored[i].weight_lb,
                            weight_kg: playersStored[i].weight_kg,
                            position: playersStored[i].position,
                            uniform_number: playersStored[i].uniform_number,
                            roster_status: playersStored[i].roster_status,
                            season_id: playersStored[i].season_id
                        }, (err, playerUpdate) => {
                            if(err) {
                                err.status(500).send({ message: "Error del servidor."});
                            } else {
                                if(!playerUpdate) {
                                    err.status(404).send({ message: "Jugador no encontrado."});
                                } 
                            }
                        });
                        
                    }
                    res.status(200).send({ message: "Jugadores actualizados correctamente."});
                }
            }
        });
    
}

function updateAvatar(req,res) {
    Player.find({season_id: "26_27"})
        .sort({ team_id: "asc", uniform_number: "asc"})
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    for(var i=0; i<playersStored.length; i++){
                        if(playersStored[i].avatar !== null){
                            Player.updateOne(
                                { player_id: playersStored[i].player_id, season_id: "26_27", avatar: null}, 
                                { avatar: playersStored[i].avatar }, 
                                { upsert: false }, 
                                (err, playerUpdate) => {
                                if(err) {
                                    err.status(500).send({ message: "Error del servidor."});
                                } else {
                                    if(!playerUpdate) {
                                        err.status(404).send({ message: "Jugador no encontrado."});
                                    } 
                                }
                            });
                        }                        
                    }
                    res.status(200).send({ message: "Jugadores actualizados correctamente."});
                }
            }
        });
    
}

function updatePlayerTeam(req,res) {
    const { id } = req.params;
    const { team_id } = req.body;

    Player.findByIdAndUpdate(id, 
        { team_id:  team_id}, (err, playerStored) => {
            if(err) {
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(!playerStored) {
                    res.status(404).send({ message: "Jugador no encontrado."});
                } else {
                        res.status(200).send({ message: "Jugador actualizado correctamente."});
                }
            }
        } );
}

function updatePlayerStatus(req,res) {
    const { id } = req.params;
    const { roster_status } = req.body;

    Player.findByIdAndUpdate(id, 
        { roster_status:  roster_status}, (err, playerStored) => {
            if(err) {
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(!playerStored) {
                    res.status(404).send({ message: "Jugador no encontrado."});
                } else {
                    if(roster_status==="inactive")
                        res.status(200).send({ message: "Jugador desactivado correctamente."});
                    else if(roster_status==="active")
                        res.status(200).send({ message: "Jugador activado correctamente."});
                    else
                    res.status(404).send({ message: "Estado no correcto"});
                }
            }
        } );
}

function getRookies(req,res) {

    const seasonId = req.params.season;

    // Usamos .select('player_id -_id') para traer SOLO el player_id y excluir el _id de Mongo
    Player.find({season_id: seasonId, rookie: true})
        .select('player_id -_id') 
        .exec((err, playersStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(playersStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun jugador."});
                } else {
                    // Mapeamos para devolver un array plano de IDs: [102, 105, 204...]
                    const rookiesIds = playersStored.map(p => p.player_id);
                    
                    res.status(200).send({ 
                        code: 200, 
                        players: rookiesIds 
                    });
                }
            }
        });
}



module.exports = {
    getPlayers,
    getPlayersByTeam,
    getPlayer,
    getPlayerId,
    getPlayersData,
    updateDisplayName,
    getPlayersByPosition,
    getListPlayers,
    updateAvatar,
    updatePlayerTeam,
    updatePlayerStatus,
    getPlayersAll,
    getRookies
};
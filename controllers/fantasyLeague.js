const FantasyLeague = require("../models/fantasyLeague");
const utiles = require("../utils/normalizationNames");
const bcrypt = require("bcrypt-nodejs");


function getTotalFantasyLeagues(req,res){

    FantasyLeague.find({})
        .sort({ league_id: "asc"})
        .exec((err, leagueStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(leagueStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado fantasy leagues."});
                } else {
                    res.status(200).send({ code: 200, fantasyLeague: leagueStored });
                }
            }
        });

}

function getFantasyLeague(req,res){

    const nameLeague = req.params.league;
    const seasonId = req.query.season;

    FantasyLeague.findOne({ season_id: seasonId, league_id: nameLeague })
        .exec((err, leagueStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else{
                if(leagueStored !== null){
                    if(leagueStored.length <= 0) {
                        res.status(404).send({ message: "No se ha encontrado la liga fantasy."});
                    } else {
                        res.status(200).send({ code: 200, fantasyLeague: leagueStored });
                    }
                }else{
                    res.status(404).send({ message: "No se ha encontrado la liga fantasy."});
                }
                
            }
        });

}

function createFantasyLeague(req,res){
    const fleague = new FantasyLeague();

    const { 
        season_id, league_id, name_league, theme, password_league,maximum_teams, scoring, offensive_rebounds,
        defensive_rebounds, assisting, stealing, blocking, turnovers, personal_fouls, field_goals_attempted,
        field_goals_made, field_goals_missed, two_point_attempted, two_point_made, two_point_missed, three_point_attempted,
        three_point_made, three_point_missed, free_throws_attempted, free_throws_made, free_throws_missed, is_winner,
        is_loser, is_home, is_away, is_starter, is_double_double, is_triple_double, is_PointsPerMinute, position_format
    
    } = req.body;

    fleague.season_id = season_id;
    fleague.league_id = league_id;
    fleague.name_league = name_league;
    fleague.theme = theme;
    fleague.maximum_teams = maximum_teams;
    fleague.scoring = scoring;
    fleague.offensive_rebounds = offensive_rebounds;
    fleague.defensive_rebounds = defensive_rebounds;
    fleague.assisting = assisting;
    fleague.stealing = stealing;
    fleague.blocking = blocking;
    fleague.turnovers = turnovers;
    fleague.personal_fouls = personal_fouls;
    fleague.field_goals_attempted = field_goals_attempted;
    fleague.field_goals_made = field_goals_made;
    fleague.field_goals_missed = field_goals_missed;
    fleague.two_point_attempted = two_point_attempted;
    fleague.two_point_made = two_point_made;
    fleague.two_point_missed = two_point_missed;
    fleague.three_point_attempted = three_point_attempted;
    fleague.three_point_made = three_point_made;
    fleague.three_point_missed = three_point_missed;
    fleague.free_throws_attempted = free_throws_attempted;
    fleague.free_throws_made = free_throws_made;
    fleague.free_throws_missed = free_throws_missed;
    fleague.is_winner = is_winner;
    fleague.is_loser = is_loser;
    fleague.is_home = is_home;
    fleague.is_away = is_away;
    fleague.is_starter = is_starter;
    fleague.is_double_double = is_double_double;
    fleague.is_triple_double = is_triple_double;
    fleague.is_PointsPerMinute = is_PointsPerMinute;
    fleague.position_format = position_format;

    if(!password_league) {
        res.status(500).send({ message: "La contraseña es obligatoria." });
    } else {
        bcrypt.hash(password_league, null, null, (err, hash) => {
            if(err){
                res.status(500).send({ message: "Error al encriptar la contraseña." });
            } else {
                fleague.password_league = hash;
                FantasyLeague.collection.insertOne(fleague, function (err, docs) {
                    console.log(err);
                    if (err){ 
                        res.status(500).send({ message: "Error al crear la liga fantasy." });
                    } else {
                        res.status(200).send({ message: "Liga fantasy creada correctamente."});
                    }
                });
            }
        });
    }
}

function deleteFantasyLeague(req, res){
    const { league } = req.params;
    
    FantasyLeague.findOneAndRemove({league_id: league}, (err, leagueDeleted) => {
        if(err) {
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(!leagueDeleted) {
                res.status(404).send({ message: "Liga fantasy no encontrada."});
            } else {
                res.status(200).send({ message: "Liga fantasy eliminada correctamente."});
            }
        }
    })
}

module.exports = {
    getTotalFantasyLeagues,
    getFantasyLeague,
    createFantasyLeague,
    deleteFantasyLeague

}
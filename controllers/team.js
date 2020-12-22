const Team = require("../models/team");

function getTeams(req,res) {
    Team.find()
        .sort({ team_id: "asc"})
        .exec((err, teamsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(teamsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun equipo."});
                } else {
                    res.status(200).send({ code: 200, teams: teamsStored });
                }
            }
        });
}

function getTeamByTeamId(req,res) {

    const TeamName = req.params.teamName;

    Team.find({ team_id : TeamName})
        .exec((err, teamsStored) => {
            if(err){
                res.status(500).send({ message: "Error del servidor."});
            } else {
                if(teamsStored.length <= 0) {
                    res.status(404).send({ message: "No se ha encontrado ningun equipo llamado " + TeamName+"."});
                } else {
                    res.status(200).send({ code: 200, team: teamsStored });
                }
            }
        });
}

module.exports = {
    getTeams,
    getTeamByTeamId
};
const utiles = require("../utils/normalizationNames");
const FantasyCalendar = require("../models/fantasyCalendar");

const EventsTeam = require("../models/eventsTeam");


function getFantasyCalendar(req,res){
    const seasonId = req.query.season;
    const leagueID = req.query.league;
}

function addFantasyCalendar(req,res){
    const fantasyCalendar = new FantasyCalendar;
    
    const seasonId = req.query.season;
    const leagueID = req.query.league;

    const from_date = req.query.from;
    const to_date = req.query.to;
    const jornada = req.query.jornada;

    fantasyCalendar.season_id = seasonId;
    fantasyCalendar.league_id = leagueID;
    fantasyCalendar.jornada = jornada;

    /*
    event_start_date_time : {
        $gte: "2020-12-21T12:00:00.000Z",
        $lt: "2020-12-28T12:00:00.000Z"
    }
    */

    EventsTeam.find({ season_id: seasonId, event_season_type: "regular", event_start_date_time : {
        $gte: from_date,
        $lt: to_date
    }})
    .sort({ event_start_date_time: "asc" })
    .exec((err, eventsStored) => {
        if(err){
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(eventsStored.length <= 0) {
                res.status(404).send({ message: "No se ha encontrado ningun evento."});
            } else {

                eventsStored.forEach(function (item, index){
                    if(index ===0){
                        fantasyCalendar.eventos.push({"event_id": item.event_id}); 
                    } else {
                        var encontrado = false;
                        for(var i=0; i<fantasyCalendar.eventos.length;i++){
                            if(fantasyCalendar.eventos[i].event_id === item.event_id) {
                                encontrado = true;       
                            }
                        }
                        if(!encontrado){
                            fantasyCalendar.eventos.push({"event_id": item.event_id}); 
                        }
                    }                      
                });

                fantasyCalendar.save((err, calendarStored) => {
                    if(err)
                        res.status(500).send({message: err.message});
                    else {
                        if(!calendarStored)
                            res.status(404).send({message: "Error al crear el calendario."});
                        else
                            res.status(200).send({calendarStored});
                    }
                })
            }
        }
    });
	
}


module.exports = {
    getFantasyCalendar,
    addFantasyCalendar
};
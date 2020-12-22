const mongoose = require("mongoose");
const app = require("./app");
const PORT_SERVER = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB, DB } = require("./config");

var options = {
    keepAlive: 300000, 
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
 };

//mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/${DB}?authSource=admin`, options, (err, res) => {
mongoose.connect(`mongodb+srv://ydb55lol:${PASS_DB}@sterni2k21.cczox.mongodb.net/${DB}?retryWrites=true&w=majority`, options, (err, res) => {
    if (err) { 
      throw err;
    } else {
      console.log('La conexión a la base de datos es correcta.');

      app.listen(PORT_SERVER, () => {
        console.log("###############################");
        console.log("######### API REST  ###########");
        console.log("###############################");
        //console.log(`http://${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}/`);
        console.log(`mongodb+srv://sterni2k21.cczox.mongodb.net/api/${API_VERSION}/`);
      });
    }
});
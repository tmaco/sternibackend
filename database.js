// database.js
const mongoose = require("mongoose");

var options = {
  keepAlive: 300000,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

// Tus dos URIs de Mongo Atlas independientes
const URI_PRINCIPAL = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.HOST_DB}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const URI_SECUNDARIA = `mongodb+srv://${process.env.USER_DB_2}:${process.env.PASS_DB_2}@${process.env.HOST_DB_2}/${process.env.DB_NAME_2}?retryWrites=true&w=majority`;

// Creamos las dos conexiones independientes
const dbPrincipal = mongoose.createConnection(URI_PRINCIPAL, options);
const dbSecundaria = mongoose.createConnection(URI_SECUNDARIA, options);

// Listeners para confirmar en consola que todo va bien
dbPrincipal.on("connected", () => console.log("-> Conectado a DB Principal (Atlas 1)"));
dbPrincipal.on("error", (err) => console.error("Error en DB Principal:", err));

dbSecundaria.on("connected", () => console.log("-> Conectado a DB Secundaria (Atlas 2)"));
dbSecundaria.on("error", (err) => console.error("Error en DB Secundaria:", err));

// Exportamos ambas conexiones
module.exports = {
  dbPrincipal,
  dbSecundaria
};
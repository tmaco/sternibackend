// index.js with 2 different database endpoints
require('dotenv').config(); 

require("./database"); // Esto inicializa las conexiones de forma inmediata al arrancar
const app = require("./app");
const PORT_SERVER = process.env.PORT || 3977;
const { API_VERSION } = require("./config");

app.listen(PORT_SERVER, () => {
  console.log("###############################");
  console.log("######### API REST  ###########");
  console.log("###############################");
  console.log(`Servidor único corriendo en el puerto ${PORT_SERVER}`);
  console.log(`Endpoint base: http://localhost:${PORT_SERVER}/api/${API_VERSION}/`);
});
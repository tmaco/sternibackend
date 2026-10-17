// Carga las variables del archivo .env
require('dotenv').config();

const API_VERSION = process.env.API_VERSION;
const IP_SERVER = process.env.IP_SERVER;
const PORT_DB = Number(process.env.PORT_DB); // El puerto suele ser mejor manejarlo como número
const DB = process.env.DB;
const SECRET_KEY = process.env.SECRET_KEY;
const UPLOADPATH = process.env.UPLOADPATH;
const S3_BUCKET = process.env.S3_BUCKET;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const API_KEY = process.env.API_KEY;
const PASSWORD =process.env.PASSWORD;

module.exports = {
    API_VERSION,
    IP_SERVER,
    PORT_DB,
    DB,
    SECRET_KEY,
    UPLOADPATH,
    S3_BUCKET,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    API_KEY,
    PASSWORD
}
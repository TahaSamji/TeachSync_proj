const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");

dotenv.config()

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const dbUrl = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

const configInit = async () => {
    try {
        await mongoose.connect(dbUrl)
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = { configInit }
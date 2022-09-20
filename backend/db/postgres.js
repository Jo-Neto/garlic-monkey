const {Pool} = require('pg')
require('dotenv').config();

const pool = new Pool({
    database: process.env.POSTGRES_DATABASE || 'garlic_monkeys',
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432
})

pool.connect();

module.exports = pool;
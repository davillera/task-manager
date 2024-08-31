const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: true,
});

sequelize.authenticate()
  .then(() => console.log('Conectado a la base de datos PostgreSQL'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

module.exports = sequelize;

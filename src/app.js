const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
const imageRoute = require('./routes/image')
const commentRoutes = require('./routes/comment')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*', // Acepta cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));


app.use(express.json());


// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use('/users', userRoutes);
app.use('/task', taskRoutes);
app.use('/comments', commentRoutes);
app.use('/image', imageRoute)

module.exports = app
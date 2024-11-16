const express = require('express');
const app = express();
const apiRoutes = require('./routes/api'); // Importando as rotas

// Middleware para JSON
app.use(express.json());

// Rota base
app.get('/', (req, res) => {
    res.send('Backend da aplicação funcionando!');
});

// Rota principal da API
app.use('/v1', apiRoutes);

module.exports = app;

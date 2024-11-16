const express = require('express');
const router = express.Router();
const listasController = require('../controllers/listasController');

// Rota para buscar dados do banco
router.get('/', (req, res) => {
    res.send('API de tarefas');
});

router.get('/lists', listasController.getData);

module.exports = router;

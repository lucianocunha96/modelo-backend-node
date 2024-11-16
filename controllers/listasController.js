const db = require('../db/dbConfig');

exports.getData = async (req, res) => {
    try {
        const [tasksResult, listsResult] = await Promise.all([
            db.query('SELECT * FROM tasks'),
            db.query('SELECT * FROM lists')
        ]);

        // Extrai apenas a primeira parte dos resultados, que são os dados reais
        const tasks = tasksResult[0];
        const lists = listsResult[0];

        

        // Retorna os dados como JSON, sem metadados
        res.json({ tasks, lists });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

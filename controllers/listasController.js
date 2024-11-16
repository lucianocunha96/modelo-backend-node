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

        // Organizando os dados das listas
        let resposta = []
        let tasksByList = []

        tasks.forEach(task => {
            if(!tasksByList[task.list_id]) {
                tasksByList[task.list_id] = [];
            }

            tasksByList[task.list_id].push(task);
        });

        console.log(tasksByList);

        lists.forEach(list => {
            resposta.push({
                id: list.id,
                title: list.title,
                color: list.color,
                tasks: tasksByList[list.id] ?? []
            });
        });

        // Retorna os dados como JSON, sem metadados
        res.json(resposta);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

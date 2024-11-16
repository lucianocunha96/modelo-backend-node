const db = require('../db/dbConfig');
const cripto = require('crypto');

exports.getData = async (req, res) => {
    try {

        // Recebendo parametro GET caso exista
        const { id } = req.params;
        let conditionLists = '';
        let conditionTasks = '';
        let conditionParams = [];

        if(id) {
            conditionLists = ` WHERE id = ?`;
            conditionTasks = ` WHERE list_id = ?`;

            conditionParams = [id];
        }

        // Executa as duas queries em paralelo
        const [tasksResult, listsResult] = await Promise.all([
            db.query('SELECT * FROM tasks' + conditionTasks, conditionParams),
            db.query('SELECT * FROM lists' + conditionLists, conditionParams)
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

        lists.forEach(list => {
            resposta.push({
                id: list.uid,
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

exports.createList = async (req, res) => {
    try {
        const { title, description, color } = req.body;

        if(!title) {
            return res.status(400).json({ error: 'Parâmetros inválidos' });
        }

        if(!color) {
            color = generateRandomHexColor();
        }

        const randomUUID = cripto.randomUUID();
        await db.query('INSERT INTO lists (uid, title, description, color) VALUES (?, ?, ?, ?)', [randomUUID, title, description, color]);

        res.json({ 
            "status": "ok",
            "message": "Lista adicionada com sucesso e os dados já estão salvos em nosso banco de dados.",
            "content": {
                "id": randomUUID,
            }
        });
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

exports.deleteList = async (req, res) => {
    try {
        const { uid } = req.params;

        if(!uid) {
            return res.status(400).json({ error: 'Parâmetros inválidos' });
        }

        const [queryResult] = await db.query('SELECT id FROM lists WHERE uid = ?', [uid]);

        if(queryResult.length > 0) {
            const id = queryResult[0].id;

            await Promise.all([
                db.query('DELETE FROM tasks WHERE list_id = ?', [id]),
                db.query('DELETE FROM lists WHERE id = ?', [id])
            ]);
            
            res.json({ 
                status: "ok",
                message: "Lista deletada com sucesso e os dados já estão removidos de nosso banco de dados."
            });

        } else {
            
            res.status(404).json({ error: 'Lista não encontrada' });
        }

    } catch (error) {
        console.error('Erro ao deletar lista:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};


function generateRandomHexColor() {
    // Gera um número aleatório entre 0x000000 e 0xFFFFFF
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    // Adiciona o símbolo # e garante que tenha 6 caracteres (preenchendo com zeros à esquerda, se necessário)
    return `#${randomColor.padStart(6, '0')}`;
}

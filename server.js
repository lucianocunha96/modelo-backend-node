const cluster = require('cluster');
const os = require('os');
const app = require('./app'); // Importando a configuração do Express

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Cria um worker para cada CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Reinicia um worker se ele falhar
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died, restarting...`);
        cluster.fork();
    });

} else {
    // Cada worker escuta na porta 3000
    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}

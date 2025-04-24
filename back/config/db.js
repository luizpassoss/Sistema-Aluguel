const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost', // Seu host (pode ser diferente se for um servidor externo)
    user: 'root', // Seu usuário do MySQL
    password: '1111', // Sua senha do MySQL (ou deixe vazio se não tiver)
    database: 'aluguel_carros' // Nome do seu banco de dados
});

module.exports = db;

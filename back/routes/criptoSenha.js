const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function atualizarSenha() {
  const db = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aluguel_carros'
  });

  const novaSenha = '123456';
  const hash = await bcrypt.hash(novaSenha, 10);

  try {
    await db.query('UPDATE administradores SET senha = ? WHERE email = ?', [hash, 'admin@email.com']);
    console.log('Senha criptografada e atualizada com sucesso!');
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
  }
}

atualizarSenha();

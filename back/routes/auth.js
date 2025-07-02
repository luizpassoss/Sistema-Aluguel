const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aluguel_carros'
});

const JWT_SECRET = 'secreto_aluguel'; 

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM administradores WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ mensagem: 'Administrador não encontrado' });
    }

    const admin = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, admin.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: admin.id, nome: admin.nome }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ 
  mensagem: 'Login bem-sucedido', 
  token, 
  admin: { id: admin.id, nome: admin.nome, email: admin.email }
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
});

module.exports = router;

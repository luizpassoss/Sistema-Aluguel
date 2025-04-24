const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Listar todos os clientes
router.get('/clientes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os clientes' });
    }
});

// Buscar um cliente por ID
router.get('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o cliente' });
    }
});

// Adicionar um novo cliente
router.post('/clientes', async (req, res) => {
    const { nome, email, telefone, endereco } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)',
            [nome, email, telefone, endereco]
        );
        res.status(201).json({ id_cliente: result.insertId, nome, email, telefone, endereco });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar o cliente' });
    }
});

// Atualizar um cliente
router.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, endereco } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE clientes SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id_cliente = ?',
            [nome, email, telefone, endereco, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json({ id_cliente: id, nome, email, telefone, endereco });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o cliente' });
    }
});

// Deletar um cliente
router.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json({ message: 'Cliente removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover o cliente' });
    }
});

module.exports = router;
 
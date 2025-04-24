const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Listar todos os aluguéis
router.get('/alugueis', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM alugueis');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os aluguéis' });
    }
});

// Buscar aluguel por ID
router.get('/alugueis/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM alugueis WHERE id_aluguel = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Aluguel não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o aluguel' });
    }
});

// Criar um novo aluguel (com cálculo automático de valor_total)
router.post('/alugueis', async (req, res) => {
    const { id_cliente, id_carro, data_inicio, data_fim } = req.body;

    try {
        // Buscar o preco_diario do carro
        const [carroRows] = await db.query('SELECT preco_diario FROM carros WHERE id_carro = ?', [id_carro]);
        if (carroRows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }

        const precoDiario = carroRows[0].preco_diario;

        // Calcular diferença de dias
        const inicio = new Date(data_inicio);
        const fim = new Date(data_fim);
        const diffTime = Math.abs(fim - inicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            return res.status(400).json({ error: 'Período inválido' });
        }

        // Calcular valor total
        const valor_total = diffDays * precoDiario;

        // Inserir aluguel no banco
        const [result] = await db.query(
            'INSERT INTO alugueis (id_cliente, id_carro, data_inicio, data_fim, valor_total) VALUES (?, ?, ?, ?, ?)',
            [id_cliente, id_carro, data_inicio, data_fim, valor_total]
        );

        res.status(201).json({
            id_aluguel: result.insertId,
            id_cliente,
            id_carro,
            data_inicio,
            data_fim,
            valor_total
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar o aluguel' });
    }
});


// Atualizar aluguel
router.put('/alugueis/:id', async (req, res) => {
    const { id } = req.params;
    const { id_cliente, id_carro, data_inicio, data_fim } = req.body;

    try {
        const [carroRows] = await db.query('SELECT preco_diario FROM carros WHERE id_carro = ?', [id_carro]);

        if (carroRows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }

        const precoDiario = carroRows[0].preco_diario;

        const inicio = new Date(data_inicio);
        const fim = new Date(data_fim);
        const diffTime = fim.getTime() - inicio.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
            return res.status(400).json({ error: 'Período inválido' });
        }

        const valor_total = diffDays * precoDiario;

        const [result] = await db.query(
            'UPDATE alugueis SET id_cliente = ?, id_carro = ?, data_inicio = ?, data_fim = ?, valor_total = ? WHERE id_aluguel = ?',
            [id_cliente, id_carro, data_inicio, data_fim, valor_total, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Aluguel não encontrado' });
        }

        res.json({ id_aluguel: id, id_cliente, id_carro, data_inicio, data_fim, valor_total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar o aluguel' });
    }
});


// Deletar aluguel
router.delete('/alugueis/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM alugueis WHERE id_aluguel = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Aluguel não encontrado' });
        }
        res.json({ message: 'Aluguel removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover o aluguel' });
    }
});

module.exports = router;

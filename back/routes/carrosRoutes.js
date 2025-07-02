const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome único do arquivo
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // até 5MB
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = /jpeg|jpg|png/;
        const extname = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
        const mimetype = tiposPermitidos.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Apenas imagens JPEG, JPG ou PNG são permitidas!'));
        }
    }
});

// GET todos os carros
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM carros');
    const carrosComImagens = rows.map(carro => ({
      ...carro,
      imagens: (() => {
        try {
          return JSON.parse(carro.imagem || '[]');
        } catch {
          return carro.imagem ? [carro.imagem] : [];
        }
      })()
    }));
    res.json(carrosComImagens);
  } catch (err) {
    console.error('Erro ao buscar carros:', err);
    res.status(500).json({ error: 'Erro ao buscar carros' });
  }
});


// GET carro por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM carros WHERE id_carro = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Carro não encontrado' });
    res.json(rows[0]);
});

// POST novo carro com imagem
router.post('/', upload.array('imagens', 5), async (req, res) => {

  const { modelo, marca, preco_diario, ano } = req.body;
const arquivos = req.files; // Array de arquivos

if (!arquivos || arquivos.length === 0) {
  return res.status(400).json({ error: 'Envie pelo menos uma imagem' });
}

// Extrai apenas os nomes dos arquivos
const nomesImagens = arquivos.map(file => file.filename);

// Converte array para JSON string (para salvar em uma única coluna)
const imagensString = JSON.stringify(nomesImagens);

try {
  const [result] = await db.query(
    'INSERT INTO carros (modelo, marca, preco_diario, ano, imagem) VALUES (?, ?, ?, ?, ?)',
    [modelo, marca, preco_diario, ano, imagensString]
  );
  res.status(201).json({ id_carro: result.insertId, modelo, marca, preco_diario, ano, imagens: nomesImagens });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Erro ao cadastrar o carro' });
}

});

// PUT atualizar carro
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { modelo, marca, ano, preco_diario } = req.body;
    const [result] = await db.query(
        'UPDATE carros SET modelo = ?, marca = ?, ano = ?, preco_diario = ? WHERE id_carro = ?',
        [modelo, marca, ano, preco_diario, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Carro não encontrado' });
    res.json({ id, modelo, marca, ano, preco_diario });
});

// DELETE carro
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM carros WHERE id_carro = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Carro não encontrado' });
    res.json({ message: 'Carro removido com sucesso' });
});

module.exports = router;

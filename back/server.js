require('dotenv').config();
const express = require('express');
const cors = require('cors');
const veiculosRoutes = require('./routes/carrosRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/veiculos', veiculosRoutes);

app.get('/', (req, res) => {
    res.send('API do Sistema de Aluguel de Carros está rodando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

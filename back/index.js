const express = require("express");
const cors = require("cors"); // Para evitar problemas de CORS caso precise
const carrosRoutes = require("./routes/carrosRoutes"); // Importa as rotas dos carros

const app = express();

// Middleware para permitir JSON
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Servidor rodando! 🚀");
});


app.use("/api", carrosRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const clientesRoutes = require("./routes/clientesRoutes");
app.use("/api", clientesRoutes);

const alugueisRoutes = require("./routes/alugueisRoutes");
app.use("/api", alugueisRoutes);

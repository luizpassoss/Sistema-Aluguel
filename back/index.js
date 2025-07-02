const express = require("express");
const cors = require("cors");

const carrosRoutes = require("./routes/carrosRoutes");
const authRoutes = require("./routes/auth");
const clientesRoutes = require("./routes/clientesRoutes");
const alugueisRoutes = require("./routes/alugueisRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Servidor rodando! 🚀");
});

// Rotas
app.use("/api/carros", carrosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/alugueis", alugueisRoutes);
app.use("/login", authRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

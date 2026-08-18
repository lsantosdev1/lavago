import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de Segurança e Parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rota de Healthcheck (Saúde da API)
app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    app: "LavaGo API",
    message: "Servidor rodando e seguro! 🚀",
  });
});

app.listen(PORT, () => {
  console.log(`⚡ [LavaGo API] Servidor rodando na porta ${PORT}`);
});

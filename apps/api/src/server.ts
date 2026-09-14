import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@lavago/database";
import { authMiddleware, AuthRequest } from "./middlewares/auth";

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "lavago_super_secret_key_2026";

app.use(cors());
app.use(express.json());

// Cadastrar um Lava-Jato (Requer Login de Parceiro)
app.post("/car-washes", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      tag,
      description,
      address,
      latitude,
      longitude,
      whatsapp,
      photos,
    } = req.body;

    if (!name || !address || !whatsapp) {
      return res
        .status(400)
        .json({ error: "Nome, endereço e WhatsApp são obrigatórios." });
    }

    const carWash = await prisma.carWash.create({
      data: {
        ownerId: req.user!.id,
        name,
        tag: tag || "Estética Automotiva",
        description,
        address,
        latitude: latitude ? parseFloat(latitude) : -22.9519,
        longitude: longitude ? parseFloat(longitude) : -43.1843,
        whatsapp,
        isOpen: true, // Já nasce como "Aberto Agora"
        photos: photos || [
          "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80",
        ],
        // Cria horários padrão de funcionamento
        schedules: {
          create: [
            {
              dayOfWeek: 1,
              openTime: "08:00",
              closeTime: "18:00",
              isOpen: true,
            },
            {
              dayOfWeek: 2,
              openTime: "08:00",
              closeTime: "18:00",
              isOpen: true,
            },
            {
              dayOfWeek: 3,
              openTime: "08:00",
              closeTime: "18:00",
              isOpen: true,
            },
            {
              dayOfWeek: 4,
              openTime: "08:00",
              closeTime: "18:00",
              isOpen: true,
            },
            {
              dayOfWeek: 5,
              openTime: "08:00",
              closeTime: "18:00",
              isOpen: true,
            },
            {
              dayOfWeek: 6,
              openTime: "08:00",
              closeTime: "14:00",
              isOpen: true,
            },
            {
              dayOfWeek: 0,
              openTime: "00:00",
              closeTime: "00:00",
              isOpen: false,
            },
          ],
        },
      },
    });

    return res.status(201).json(carWash);
  } catch (error) {
    console.error("Erro ao cadastrar lava-jato:", error);
    return res.status(500).json({ error: "Erro ao cadastrar lava-jato." });
  }
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// 1. Registro (Cadastro de Cliente ou Parceiro)
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios." });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role === "PARTNER" ? "PARTNER" : "CLIENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// 2. Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro ao realizar login" });
  }
});

// 3. Obter dados do usuário logado (Rota Protegida)
app.get("/auth/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        carWash: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar perfil." });
  }
});

// ==================== OUTRAS ROTAS ====================
// 1. Listar Lava-Jatos com Filtros
app.get("/car-washes", async (req, res) => {
  try {
    const { search, tag } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { address: { contains: String(search), mode: "insensitive" } },
      ];
    }

    if (tag && tag !== "Todos" && tag !== "Aberto Agora") {
      where.tag = String(tag);
    }

    const carWashes = await prisma.carWash.findMany({
      where,
      include: {
        services: { where: { active: true } },
        schedules: true,
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(carWashes);
  } catch (error) {
    console.error("Erro ao buscar lava-jatos:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// 2. Detalhes de um Lava-Jato Específico
app.get("/car-washes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const carWash = await prisma.carWash.findUnique({
      where: { id },
      include: {
        services: true,
        schedules: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!carWash) {
      return res.status(404).json({ error: "Lava-jato não encontrado" });
    }

    return res.json(carWash);
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// 3. Registrar Agendamento
app.post("/bookings", async (req, res) => {
  try {
    const {
      clientId,
      carWashId,
      vehicleType,
      services,
      totalPrice,
      date,
      time,
    } = req.body;

    const booking = await prisma.booking.create({
      data: {
        clientId,
        carWashId,
        vehicleType,
        services,
        totalPrice: parseFloat(totalPrice),
        date: new Date(date),
        time,
      },
    });

    return res.status(201).json(booking);
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return res.status(500).json({ error: "Erro ao processar agendamento" });
  }
});

app.listen(port, () => {
  console.log(`🚀 API LavaGo rodando na porta ${port}`);
});

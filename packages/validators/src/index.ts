import { z } from "zod";

// Esquema de Validação de Usuário (Registro/Login)
export const registerUserSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  phone: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

// Esquema de Validação de Lava-Jato
export const createCarWashSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do lava-jato deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  address: z.string().min(5, "O endereço é obrigatório"),
  city: z.string().min(2, "A cidade é obrigatória"),
  state: z
    .string()
    .length(2, "O estado deve ter a sigla de 2 letras (ex: RJ, SP)"),
  latitude: z.number().min(-90).max(90, "Latitude inválida"),
  longitude: z.number().min(-180).max(180, "Longitude inválida"),
  phone: z.string().optional(),
  openHours: z.string().optional(),
  priceRange: z.enum(["$", "$$", "$$$", "$$$$"]).optional(),
  coverImage: z.string().url("URL da imagem inválida").optional(),
});

// Esquema de Avaliação
export const createReviewSchema = z.object({
  carWashId: z.string().uuid("ID de lava-jato inválido"),
  rating: z
    .number()
    .int()
    .min(1, "A nota mínima é 1")
    .max(5, "A nota máxima é 5"),
  comment: z
    .string()
    .max(500, "O comentário deve ter no máximo 500 caracteres")
    .optional(),
});

// Tipos inferidos automaticamente do TypeScript
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type CreateCarWashInput = z.infer<typeof createCarWashSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

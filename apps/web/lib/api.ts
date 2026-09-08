const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getCarWashes(search?: string, tag?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (tag) params.append("tag", tag);

  const res = await fetch(`${API_URL}/car-washes?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao buscar lava-jatos");
  }

  return res.json();
}

export async function getCarWashById(id: string) {
  const res = await fetch(`${API_URL}/car-washes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Lava-jato não encontrado");
  }

  return res.json();
}

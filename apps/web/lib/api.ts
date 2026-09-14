const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function loginUser(credentials: any) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Falha ao realizar login");
  return data;
}

export async function registerUser(userData: any) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Falha ao realizar cadastro");
  return data;
}

export async function getCarWashes(search?: string, tag?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (tag) params.append("tag", tag);

  const res = await fetch(`${API_URL}/car-washes?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Falha ao buscar lava-jatos");
  return res.json();
}

export async function getCarWashById(id: string) {
  const res = await fetch(`${API_URL}/car-washes/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Lava-jato não encontrado");
  return res.json();
}
export async function createCarWash(data: any, token: string) {
  const res = await fetch(`${API_URL}/car-washes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();
  if (!res.ok)
    throw new Error(responseData.error || "Falha ao cadastrar lava-jato");
  return responseData;
}
export async function createBooking(bookingData: any, token: string) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Falha ao registrar agendamento.");
  return data;
}

export async function getPartnerBookings(token: string) {
  const res = await fetch(`${API_URL}/partner/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Falha ao buscar agendamentos.");
  return data;
}
export async function createService(serviceData: any, token: string) {
  const res = await fetch(`${API_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Falha ao cadastrar serviço.");
  return data;
}

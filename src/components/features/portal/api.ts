import axios from "axios";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthApiError = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export async function registerWithCredentials(payload: RegisterPayload) {
  const response = await axios.post("/api/auth/register", payload);
  return response.data as { message: string; userId: string };
}

import axios from "axios";

import { LoginData, RegisterData, AuthResponse } from "@/types/auth";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = async (data: RegisterData): Promise<void> => {
  await api.post("/users/register", data);
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const upgradePlan = async (userId: string, token: string) => {
  const response = await api.post(
    `/admin/users/${userId}/upgrade`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const downgradePlan = async (userId: string, token: string) => {
  const response = await api.post(
    `/admin/users/${userId}/downgrade`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const grantAdmin = async (userId: string, token: string) => {
  const response = await api.patch(
    `/admin/grant-admin`,
    {
      targetUserId: userId,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const revokeAdmin = async (userId: string, token: string) => {
  const response = await api.patch(
    `/admin/revoke-admin`,
    {
      targetUserId: userId,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteUser = async (userId: string, token: string) => {
  const response = await api.delete(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default api;

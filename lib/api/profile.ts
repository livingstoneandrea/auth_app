import { UserProfile } from "@/types/user";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllUsers = async (token: string): Promise<any> => {
  const response = await api.get<any>("/admin/view-users-with_emails", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default api;

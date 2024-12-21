import { AddGrouData, AddGroupResponse } from "@/types/groups";

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createGroup = async (
  token: string,
  data: AddGrouData
): Promise<AddGroupResponse> => {
  const response = await api.post<AddGroupResponse>("/groups/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default api;

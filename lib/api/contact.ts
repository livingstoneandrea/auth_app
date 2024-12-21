import axios from "axios";
import {
  AddContactResponse,
  AddContactData,
  AddContactToGroupData,
  AddContactToGroupResponse,
} from "@/types/contact";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const addContact = async (
  token: string,
  data: AddContactData
): Promise<AddContactResponse> => {
  const response = await api.post<AddContactResponse>("/contacts/add", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addContactToGroup = async (
  token: string,
  group_id: string,
  data: AddContactToGroupData
): Promise<AddContactToGroupResponse> => {
  const response = await api.post<AddContactToGroupResponse>(
    `/groups/${group_id}/add-contact`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const retryFailedEmail = async (
  emailId: string,
  userId: string,
  token: string
) => {
  const response = await api.patch(
    `/emails/retry `,
    {
      emailId,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const sendEmailToContact = async (
  to: string,
  subject: string,
  body: string,
  token: string
) => {
  const response = await api.post(
    `/emails/send `,
    {
      to,
      subject,
      body,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteEmail = async (email_id: string, token: string) => {
  const response = await api.delete(`/emails/${email_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default api;

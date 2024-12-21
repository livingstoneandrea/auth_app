// types/user.ts
export interface Email {
  _id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
}

export interface EmailStatus {
  sent: number;
  pending: number;
  failed: string[];
}

export interface Group {
  _id: string;
  groupName: string;
  owner: string;
  contacts: string[];
  email_status: EmailStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Contact {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  msisdn: string;
  role: string[];
  plan: string;
  emails: Email[];
  groups: Group[];
  contacts: Contact[];
}

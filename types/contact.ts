export interface AddContactData {
  email: string;
  name: string;
  phone: string;
}

export interface AddContactResponse {
  user_id: string;
  email: string;
  name: string;
  phone: string;
}

export interface AddContactToGroupData {
    contact_ids: string[]
}

export interface AddContactToGroupResponse {
    message: string
}

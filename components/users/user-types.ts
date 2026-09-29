export type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export type UserFormData = {
  name: string;
  email: string;
  password: string;
};

export const EMPTY_USER_FORM: UserFormData = {
  name: "",
  email: "",
  password: "",
};

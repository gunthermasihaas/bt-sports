export type UserRole = "ADMIN" | "EDITOR";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export const EMPTY_USER_FORM: UserFormData = {
  name: "",
  email: "",
  password: "",
  role: "EDITOR",
};

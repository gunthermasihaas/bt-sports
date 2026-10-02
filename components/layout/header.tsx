import HeaderAdmin from "./header-admin";
import HeaderPublic from "./header-public";

export type HeaderRole = "ADMIN" | "EDITOR" | null;

type Props = {
  role: HeaderRole;
};

export default function Header({ role }: Props) {
  if (role === "ADMIN" || role === "EDITOR") {
    return <HeaderAdmin role={role} />;
  }

  return <HeaderPublic />;
}

"use client";

import ConfirmModal from "@/components/ui/ConfirmModal";
import { User } from "./user-types";

type Props = {
  user: User | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteUserModal({
  user,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  if (!user) {
    return null;
  }

  return (
    <ConfirmModal
      open={Boolean(user)}
      title="Excluir usuário?"
      description={`O acesso de ${user.email} será removido. Esta ação não pode ser desfeita.`}
      confirmLabel="Sim, excluir"
      danger
      loading={loading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}

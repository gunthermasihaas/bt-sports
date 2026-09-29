"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import UsersHeader from "./UsersHeader";
import UsersToolbar from "./UsersToolbar";
import UsersTable from "./UsersTable";
import UserFormModal from "./UserFormModal";
import DeleteUserModal from "./DeleteUserModal";
import UsersSkeleton from "./UsersSkeleton";
import UsersEmptyState from "./UsersEmptyState";
import { EMPTY_USER_FORM, User, UserFormData } from "./user-types";

export default function UsersPageClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_USER_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadUsers() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar usuários");
      }

      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);

      const message =
        error instanceof Error ? error.message : "Erro ao carregar usuários";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) => {
      const name = user.name?.toLowerCase() ?? "";
      const email = user.email.toLowerCase();
      const role = user.role.toLowerCase();

      return (
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        role.includes(normalizedSearch)
      );
    });
  }, [users, search]);

  function openCreateModal() {
    setEditingUser(null);
    setFormData({
      ...EMPTY_USER_FORM,
    });
    setFormOpen(true);
  }

  function openEditModal(user: User) {
    setEditingUser(user);

    setFormData({
      name: user.name ?? "",
      email: user.email,
      password: "",
    });

    setFormOpen(true);
  }

  function closeFormModal() {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setEditingUser(null);
    setFormData({
      ...EMPTY_USER_FORM,
    });
  }

  async function handleSave() {
    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const editing = editingUser !== null;

      const payload = editing
        ? {
            name: formData.name.trim(),
            email: formData.email.trim(),
            ...(formData.password.trim()
              ? {
                  password: formData.password,
                }
              : {}),
          }
        : {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          };

      const url = editing
        ? `/api/admin/users/${editingUser.id}`
        : "/api/admin/users";

      const response = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar usuário");
      }

      toast.success(
        editing
          ? "Usuário atualizado com sucesso"
          : "Usuário criado com sucesso"
      );

      setFormOpen(false);
      setEditingUser(null);
      setFormData({
        ...EMPTY_USER_FORM,
      });

      await loadUsers();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);

      const message =
        error instanceof Error ? error.message : "Erro ao salvar usuário";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteUser || deleting) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao excluir usuário");
      }

      toast.success("Usuário excluído com sucesso");

      setDeleteUser(null);

      await loadUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);

      const message =
        error instanceof Error ? error.message : "Erro ao excluir usuário";

      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  function handleClearSearch() {
    setSearch("");
  }

  return (
    <div className="min-h-screen bg-admin">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
        <UsersHeader onCreate={openCreateModal} />

        <UsersToolbar
          search={search}
          onSearchChange={setSearch}
          total={users.length}
          filteredTotal={filteredUsers.length}
        />

        {loading ? (
          <UsersSkeleton />
        ) : filteredUsers.length === 0 ? (
          <UsersEmptyState
            hasSearch={Boolean(search.trim())}
            onClearSearch={handleClearSearch}
            onCreate={openCreateModal}
          />
        ) : (
          <UsersTable
            users={filteredUsers}
            onEdit={openEditModal}
            onDelete={setDeleteUser}
          />
        )}
      </div>

      <UserFormModal
        open={formOpen}
        user={editingUser}
        form={formData}
        saving={saving}
        onChange={setFormData}
        onClose={closeFormModal}
        onSubmit={handleSave}
      />

      <DeleteUserModal
        user={deleteUser}
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setDeleteUser(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

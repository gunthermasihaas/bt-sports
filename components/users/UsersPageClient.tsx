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

type ApiErrorResponse = {
  error?: string;
  details?: Record<string, string[]>;
};

async function parseApiResponse<T>(
  response: Response
): Promise<T | ApiErrorResponse> {
  const text = await response.text();

  if (!text.trim()) {
    if (!response.ok) {
      throw new Error(
        `Erro na API (${response.status} ${response.statusText})`
      );
    }

    return {} as T;
  }

  try {
    return JSON.parse(text) as T | ApiErrorResponse;
  } catch {
    if (!response.ok) {
      throw new Error(
        `Erro na API (${response.status} ${response.statusText})`
      );
    }

    throw new Error("A API retornou uma resposta inválida.");
  }
}

function getApiErrorMessage(data: ApiErrorResponse, fallback: string): string {
  if (data.error) {
    return data.error;
  }

  if (data.details) {
    const firstFieldError = Object.values(data.details).flat()[0];

    if (firstFieldError) {
      return firstFieldError;
    }
  }

  return fallback;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/admin/users", {
    method: "GET",
    cache: "no-store",
  });

  const data = await parseApiResponse<User[]>(response);

  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(data as ApiErrorResponse, "Erro ao carregar usuários")
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("Resposta inválida ao carregar usuários.");
  }

  return data;
}

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

      const data = await fetchUsers();

      setUsers(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar usuários";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    fetchUsers()
      .then((data) => {
        if (!active) {
          return;
        }

        setUsers(data);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Erro ao carregar usuários";

        toast.error(message);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.role.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [users, search]);

  function openCreateModal() {
    setEditingUser(null);

    setFormData({
      ...EMPTY_USER_FORM,
      role: "EDITOR",
    });

    setFormOpen(true);
  }

  function openEditModal(user: User) {
    setEditingUser(user);

    setFormData({
      name: user.name ?? "",
      email: user.email,
      password: "",
      role: user.role,
    });

    setFormOpen(true);
  }

  function closeFormModal() {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setEditingUser(null);
    setFormData(EMPTY_USER_FORM);
  }

  async function handleSave() {
    try {
      setSaving(true);

      if (editingUser) {
        const payload: {
          name: string;
          email: string;
          role: UserFormData["role"];
          password?: string;
        } = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };

        if (formData.password.trim()) {
          payload.password = formData.password;
        }

        const response = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await parseApiResponse<User>(response);

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              data as ApiErrorResponse,
              "Erro ao atualizar usuário"
            )
          );
        }

        toast.success("Usuário atualizado com sucesso");
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await parseApiResponse<User>(response);

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              data as ApiErrorResponse,
              "Erro ao criar usuário"
            )
          );
        }

        toast.success("Usuário criado com sucesso");
      }

      closeFormModal();
      await loadUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar usuário";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteUser) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: "DELETE",
      });

      const data = await parseApiResponse<{ success: boolean }>(response);

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            data as ApiErrorResponse,
            "Erro ao excluir usuário"
          )
        );
      }

      toast.success("Usuário excluído com sucesso");

      setDeleteUser(null);

      await loadUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao excluir usuário";

      toast.error(message);
    } finally {
      setDeleting(false);
    }
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
            onClearSearch={() => setSearch("")}
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

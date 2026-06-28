"use client";

import { useState } from "react";
import type { HouseholdMember } from "@/types/domain";

type MembersManagerProps = {
  members: HouseholdMember[];
  onCreate: (member: Omit<HouseholdMember, "id">) => void;
  onUpdate: (id: string, updates: Partial<Omit<HouseholdMember, "id">>) => void;
  onDelete: (id: string) => void;
};

type MemberFormValues = {
  name: string;
  role: string;
  avatar: string;
};

const emptyMember: MemberFormValues = {
  name: "",
  role: "",
  avatar: "",
};

export default function MembersManager({
  members,
  onCreate,
  onUpdate,
  onDelete,
}: MembersManagerProps) {
  const [formValues, setFormValues] = useState<MemberFormValues>(emptyMember);
  const [editingMemberId, setEditingMemberId] = useState<string | undefined>();
  const [error, setError] = useState("");

  function resetForm() {
    setFormValues(emptyMember);
    setEditingMemberId(undefined);
    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formValues.name.trim() || !formValues.role.trim()) {
      setError("Integrante debe tener nombre y rol");
      return;
    }

    const memberValues = {
      name: formValues.name,
      role: formValues.role,
      avatar: formValues.avatar || formValues.name.slice(0, 1).toUpperCase(),
    };

    if (editingMemberId) {
      onUpdate(editingMemberId, memberValues);
    } else {
      onCreate(memberValues);
    }

    resetForm();
  }

  function startEditing(member: HouseholdMember) {
    setEditingMemberId(member.id);
    setFormValues({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
    });
  }

  function handleDelete(id: string) {
    if (members.length <= 1) {
      setError("No puedes eliminar el último integrante");
      return;
    }

    onDelete(id);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-black">Integrantes</h2>

      <form onSubmit={handleSubmit} className="mt-5 rounded-3xl bg-white p-5 text-slate-950">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">Nombre</span>
            <input
              value={formValues.name}
              onChange={(event) =>
                setFormValues((currentValues) => ({
                  ...currentValues,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">Rol</span>
            <input
              value={formValues.role}
              onChange={(event) =>
                setFormValues((currentValues) => ({
                  ...currentValues,
                  role: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-600">Inicial</span>
            <input
              value={formValues.avatar}
              maxLength={2}
              onChange={(event) =>
                setFormValues((currentValues) => ({
                  ...currentValues,
                  avatar: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-violet-400"
            />
          </label>
        </div>

        {error ? <p className="mt-3 text-sm font-bold text-red-500">{error}</p> : null}

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white"
          >
            {editingMemberId ? "Guardar integrante" : "Agregar integrante"}
          </button>
          {editingMemberId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500 font-black">
                {member.avatar}
              </span>
              <div>
                <p className="font-black">{member.name}</p>
                <p className="text-sm text-white/50">{member.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEditing(member)}
                className="text-xs font-black text-violet-300"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(member.id)}
                className="text-xs font-black text-red-300"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

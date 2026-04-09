"use client";

import { create } from "zustand";

type AdminRole = "SUPER_ADMIN" | "MANAGER";

interface AuthState {
  adminId?: string;
  role?: AdminRole;
  setAdmin: (data?: { adminId: string; role: AdminRole }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  adminId: undefined,
  role: undefined,
  setAdmin: (data) => set({ adminId: data?.adminId, role: data?.role })
}));

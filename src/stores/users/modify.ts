import { defineStore } from "pinia";
import { userService } from "../../services/userService";
import type { ModifyUserForm } from "../../types/createUser";
import type { User } from "../../types/user";
import { AxiosError } from "axios";

interface Role {
  id: string;
  name: string;
}

type TouchedFields = 'name' | 'email' | 'role';

export const useModifyUserStore = defineStore("modifyUser", {
  state: () => ({
    form: {
      id: "",
      name: "",
      email: "",
      role_id: "",
      status: "active",
    } as ModifyUserForm,
    errors: {} as { [key: string]: string },
    touched: {
      name: false,
      email: false,
      role: false,
    },
    roles: [] as Role[],
    loadingRoles: false,
    loading: false,
    loadingDetail: false,
    error: null as string | null,
    user: null as User | null,
  }),
  getters: {
    validationErrors: (state) => {
      const errs: { [key: string]: string } = {};
      if (state.touched.name && !state.form.name.trim()) errs.name = "Full name is required.";
      if (state.touched.email) {
        if (!state.form.email.trim()) errs.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.form.email)) errs.email = "Invalid email format.";
      }
      if (state.touched.role && !state.form.role_id) errs.role = "Role is required.";
      return errs;
    },
    isFormValid: (state) => {
      if (!state.form.name.trim()) return false;
      if (!state.form.email.trim()) return false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.form.email)) return false;
      if (!state.form.role_id) return false;
      return true;
    }
  },

  actions: {
    validateForm() {
      this.errors = this.validationErrors;
      return this.isFormValid;
    },

    markAllFieldsTouched() {
      this.touched = {
        name: true,
        email: true,
        role: true,
      };
    },

    buildUserRequestData() {
      return {
        id: this.form.id,
        name: this.form.name,
        email: this.form.email,
        role_id: this.form.role_id,
        status: this.form.status ? 'active' : 'inactive',
      };
    },

    handleError(error: unknown) {
      if (error instanceof AxiosError) {
        this.error = error.response?.data?.message || "An error occurred.";
      } else {
        this.error = "An error occurred.";
      }
    },

    async fetchUserDetail(userId: string) {
      this.loadingDetail = true;
      this.error = null;

      try {
        const response = await userService.getUserDetail(userId);
        this.user = response.data;

        // Populate form  
        this.form.id = this.user.id;
        this.form.name = this.user.name;
        this.form.email = this.user.email;
        this.form.role_id = this.user.roles[0]?.id || "";
        this.form.status = this.user.status;
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loadingDetail = false;
      }
    },

    async updateUser(userId: string) {
      this.loading = true;
      this.error = null;

      try {
        await userService.updateUser(userId, this.buildUserRequestData());
        return { success: true };
      } catch (error) {
        this.handleError(error);
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.form = {
        id: "",
        name: "",
        email: "",
        role_id: "",
        status: "active",
      };
      this.errors = {};
      this.touched = {
        name: false,
        email: false,
        role: false,
      };
      this.error = null;
      this.user = null;
    },

    setTouched(field: TouchedFields) {
      this.touched[field] = true;
    },

    async searchRoles(keyword: string) {
      this.loadingRoles = true;
      try {
        const response = await userService.searchRoles(keyword);
        this.roles = response.data || [];
      } catch (error) {
        console.error("Failed to search roles:", error);
      } finally {
        this.loadingRoles = false;
      }
    },
  },
});
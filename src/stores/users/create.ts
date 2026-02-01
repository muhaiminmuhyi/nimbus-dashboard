import { defineStore } from "pinia";
import { userService } from "../../services/userService";
import type { CreateUserForm, StoreUserData } from "../../types/createUser";
import { AxiosError } from "axios";

interface Role {
  id: string;
  name: string;
}

type TouchedFields = 'fullName' | 'email' | 'password' | 'confirmPassword' | 'role';

export const useCreateUserStore = defineStore("createUser", {
  state: () => ({
    form: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      isActive: true,
    } as CreateUserForm,
    errors: {} as { [key: string]: string },
    touched: {
      fullName: false,
      email: false,
      password: false,
      confirmPassword: false,
      role: false,
    },
    roles: [] as Role[],
    loadingRoles: false,
    loading: false,
    error: null as string | null,
  }),
  getters: {
    validationErrors: (state) => {
      const errs: { [key: string]: string } = {};
      if (state.touched.fullName && !state.form.fullName.trim()) errs.fullName = "Full name is required.";
      if (state.touched.email) {
        if (!state.form.email.trim()) errs.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.form.email)) errs.email = "Invalid email format.";
      }
      if (state.touched.password) {
        if (!state.form.password) errs.password = "Password is required.";
        else if (state.form.password.length < 8) errs.password = "Password must be at least 8 characters.";
      }
      if (state.touched.confirmPassword) {
        if (!state.form.confirmPassword) errs.confirmPassword = "Confirm password is required.";
        else if (state.form.password !== state.form.confirmPassword) errs.confirmPassword = "Passwords do not match.";
      }
      if (state.touched.role && !state.form.role) errs.role = "Role is required.";
      return errs;
    },
    isFormValid: (state) => {
      if (!state.form.fullName.trim()) return false

      if (!state.form.email.trim()) return false
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.form.email)) return false

      if (!state.form.password) return false
      if (state.form.password.length < 8) return false

      if (!state.form.confirmPassword) return false
      if (state.form.password !== state.form.confirmPassword) return false

      if (!state.form.role) return false

      return true
    }
  },

  actions: {
    validateForm() {
      this.errors = this.validationErrors;
      return this.isFormValid;
    },

    markAllFieldsTouched() {
      this.touched = {
        fullName: true,
        email: true,
        password: true,
        confirmPassword: true,
        role: true,
      };
    },

    buildUserRequestData(): StoreUserData {
      return {
        name: this.form.fullName,
        email: this.form.email,
        role_id: this.form.role,
        password: this.form.password,
        status: this.form.isActive ? 'active' : 'inactive',
      };
    },

    handleCreateUserError(error: unknown) {
      if (error instanceof AxiosError) {
        this.error = error.response?.data?.message || "Failed to create user.";
      } else {
        this.error = "Failed to create user.";
      }
    },

    async createUser() {
      this.markAllFieldsTouched();

      if (!this.validateForm()) {
        return { success: false };
      }

      this.loading = true;
      this.error = null;

      try {
        const requestData = this.buildUserRequestData();
        await userService.createUser(requestData);
        return { success: true };
      } catch (error) {
        this.handleCreateUserError(error);
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.form = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        isActive: true,
      };
      this.errors = {};
      this.touched = {
        fullName: false,
        email: false,
        password: false,
        confirmPassword: false,
        role: false,
      };
      this.error = null;
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
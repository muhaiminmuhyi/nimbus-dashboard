import { defineStore } from "pinia";
import { userService } from "../../services/userService";
import type { CreateUserForm, CreateUserRequest } from "../../types/createUser";
import { AxiosError } from "axios";

export const useCreateUserStore = defineStore("createUser", {
  state: () => ({
    form: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
      isActive: true,
    } as CreateUserForm,
    errors: {} as { [key: string]: string },
    touched: {} as { [key: string]: boolean },
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
      if (state.touched.username && !state.form.username.trim()) errs.username = "Username is required.";
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
      let errorCount = 0;
      if (state.touched.fullName && !state.form.fullName.trim()) errorCount++;
      if (state.touched.email) {
        if (!state.form.email.trim()) errorCount++;
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.form.email)) errorCount++;
      }
      if (state.touched.username && !state.form.username.trim()) errorCount++;
      if (state.touched.password) {
        if (!state.form.password) errorCount++;
        else if (state.form.password.length < 8) errorCount++;
      }
      if (state.touched.confirmPassword) {
        if (!state.form.confirmPassword) errorCount++;
        else if (state.form.password !== state.form.confirmPassword) errorCount++;
      }
      if (state.touched.role && !state.form.role) errorCount++;
      return errorCount === 0;
    },
  },

  actions: {
    validateForm() {
      this.errors = this.validationErrors;
      console.log("Validation Errors:", this.errors);
      return this.isFormValid;
    },

    async createUser() {
      // Mark all fields as touched before validation
      this.touched = {
        fullName: true,
        email: true,
        username: true,
        password: true,
        confirmPassword: true,
        role: true,
      };
      if (!this.validateForm()) return { success: false };
      this.loading = true;
      this.error = null;
      try {
        const requestData = { ...this.form };
        delete (requestData as any).confirmPassword;
        await userService.createUser(requestData as CreateUserRequest);
        // Handle success, maybe redirect or show toast
        return { success: true };
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          this.error = error.response?.data?.message || "Failed to create user.";
        } else {
          this.error = "Failed to create user.";
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.form = {
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "",
        isActive: true,
      };
      this.errors = {};
      this.touched = {};
      this.error = null;
    },

    setTouched(field: string) {
      this.touched[field] = true;
    },
  },
});
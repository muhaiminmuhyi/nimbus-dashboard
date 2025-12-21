import { reactive } from 'vue'

export const roles = ['Admin', 'Manager', 'User'] as const

export const modules = [
  { key: 'users', label: 'Users' },
  { key: 'billing', label: 'Billing' },
  { key: 'settings', label: 'Settings' },
] as const

export type Role = typeof roles[number]
export type ModuleKey = typeof modules[number]['key']

export type PermissionMatrix = Record<Role, Record<ModuleKey, boolean>>

export function usePermissions() {
  const permissions = reactive<PermissionMatrix>({
    Admin: {
      users: true,
      billing: true,
      settings: true,
    },
    Manager: {
      users: true,
      billing: true,
      settings: false,
    },
    User: {
      users: false,
      billing: true,
      settings: false,
    },
  })

  /**
   * Example future extension:
   * - fetchPermissions()
   * - savePermissions()
   * - resetPermissions()
   */

  return {
    roles,
    modules,
    permissions,
  }
}

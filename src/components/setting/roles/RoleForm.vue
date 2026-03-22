<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { roleService } from "../../../services/roleService";
import Button from "../../ui/Button.vue";
import Input from "../../ui/Input.vue";
import type { Permission, RoleDetail } from "../../../types/role";
import { toast } from "vue-sonner";

const props = defineProps<{
  roleId?: string | null;
}>();

const emit = defineEmits(["success", "close"]);

const loading = ref(false);
const saving = ref(false);
const permissions = ref<Permission[]>([]);
const form = ref({
  name: "",
  description: "",
  permissions_id: [] as string[],
});

const isEdit = computed(() => !!props.roleId);

const fetchPermissions = async () => {
  try {
    const response = await roleService.searchPermissions("");
    permissions.value = response.data;
  } catch (error) {
    toast.error("Failed to fetch permissions");
  }
};

const fetchRoleDetail = async () => {
  if (!props.roleId) return;
  loading.value = true;
  try {
    const response = await roleService.getRoleDetail(props.roleId);
    const role = response.data;
    form.value = {
      name: role.name,
      description: role.description,
      permissions_id: role.permissions.map((p) => p.id),
    };
  } catch (error) {
    toast.error("Failed to fetch role details");
    emit("close");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchPermissions();
  if (props.roleId) {
    await fetchRoleDetail();
  }
});

const handleSubmit = async () => {
  if (!form.value.name) {
    toast.error("Name is required");
    return;
  }

  saving.value = true;
  try {
    if (isEdit.value && props.roleId) {
      await roleService.updateRole({
        role_id: props.roleId,
        ...form.value,
      });
      toast.success("Role updated successfully");
    } else {
      await roleService.createRole(form.value);
      toast.success("Role created successfully");
    }
    emit("success");
  } catch (error: any) {
    toast.error(error?.userFriendlyMessage || "Failed to save role");
  } finally {
    saving.value = false;
  }
};

const actionKeywords = [
  "read",
  "view",
  "index",
  "list",
  "show",
  "create",
  "add",
  "store",
  "update",
  "edit",
  "patch",
  "delete",
  "destroy",
  "remove",
  "manage",
  "all",
  "export",
  "import",
];

const getModuleAndAction = (name: string) => {
  const cleanName = name.toLowerCase().replace(/_/g, " ").replace(/-/g, " ");
  const parts = cleanName.split(/[\s.]+/);

  let action = "";
  let module = "";

  // Try to find an action keyword
  const actionIndex = parts.findIndex((p) => actionKeywords.includes(p));

  if (actionIndex !== -1) {
    action = parts[actionIndex] ?? "";
    // Module is everything else
    module = parts.filter((_, i) => i !== actionIndex).join(" ");
  } else {
    // Fallback: first word is action, rest is module or vice versa
    // Here we'll just use the first/last part
    module = parts.length > 1 ? parts.slice(1).join(" ") : "Other";
    action = parts[0] ?? "";
  }

  // Clean up module name
  if (!module) module = "Other";
  module = module.charAt(0).toUpperCase() + module.slice(1);

  return { module, action };
};

const groupedPermissions = computed(() => {
  const groups: Record<string, Permission[]> = {};
  permissions.value.forEach((p) => {
    const { module } = getModuleAndAction(p.name);
    if (!groups[module]) groups[module] = [];
    groups[module].push(p);
  });
  return groups;
});

const togglePermission = (id: string) => {
  const permission = permissions.value.find((p) => p.id === id);
  if (!permission) return;

  const isSelected = isPermissionSelected(id);
  const { module, action } = getModuleAndAction(permission.name);
  const isReadAction = ["read", "view", "index", "list", "show"].includes(
    action,
  );

  if (isSelected) {
    // Unselecting
    const index = form.value.permissions_id.indexOf(id);
    form.value.permissions_id.splice(index, 1);

    // If unselecting a 'read' action, unselect everything in that module
    if (isReadAction) {
      const moduleIds = permissions.value
        .filter((p) => getModuleAndAction(p.name).module === module)
        .map((p) => p.id);
      form.value.permissions_id = form.value.permissions_id.filter(
        (pid) => !moduleIds.includes(pid),
      );
    }
  } else {
    // Selecting
    form.value.permissions_id.push(id);

    // If selecting anything other than 'read', auto-select the 'read' permission for this module
    if (!isReadAction) {
      const readPerm = permissions.value.find((p) => {
        const info = getModuleAndAction(p.name);
        return (
          info.module === module &&
          ["read", "view", "index", "list", "show"].includes(info.action)
        );
      });
      if (readPerm && !isPermissionSelected(readPerm.id)) {
        form.value.permissions_id.push(readPerm.id);
      }
    }
  }
};

const isPermissionSelected = (id: string) => {
  return form.value.permissions_id.includes(id);
};

const toggleModule = (module: string) => {
  const modulePerms = groupedPermissions.value[module];
  if (!modulePerms) return;

  const allSelected = modulePerms.every((p) => isPermissionSelected(p.id));

  if (allSelected) {
    // Deselect all
    const ids = modulePerms.map((p) => p.id);
    form.value.permissions_id = form.value.permissions_id.filter(
      (id) => !ids.includes(id),
    );
  } else {
    // Select all
    modulePerms.forEach((p) => {
      if (!isPermissionSelected(p.id)) {
        form.value.permissions_id.push(p.id);
      }
    });
  }
};

const formatAction = (name: string) => {
  const { action } = getModuleAndAction(name);
  if (!action) return name;
  return action.charAt(0).toUpperCase() + action.slice(1).replace("_", " ");
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="loading" class="space-y-4">
      <div class="h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
      <div class="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
      <div class="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
    </div>

    <template v-else>
      <div class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Role Name
          </label>
          <Input
            v-model="form.name"
            placeholder="e.g. Content Manager"
            required
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="2"
            class="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe the responsibilities of this role..."
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Permissions
            </label>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ form.permissions_id.length }} permissions selected
            </span>
          </div>

          <div
            class="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar border border-gray-100 dark:border-gray-800 rounded-xl p-3 bg-gray-50/30 dark:bg-gray-900/50"
          >
            <div
              v-for="(modulePerms, module) in groupedPermissions"
              :key="module"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm"
            >
              <div
                class="bg-gray-50 dark:bg-gray-700/30 px-4 py-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50"
              >
                <span
                  class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
                >
                  {{ module }}
                </span>
                <button
                  type="button"
                  class="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline"
                  @click="toggleModule(module as string)"
                >
                  Toggle Module
                </button>
              </div>

              <div class="p-3">
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="perm in modulePerms"
                    :key="perm.id"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none"
                    :class="[
                      isPermissionSelected(perm.id)
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                        : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700',
                    ]"
                    @click="togglePermission(perm.id)"
                  >
                    <div
                      class="w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors"
                      :class="[
                        isPermissionSelected(perm.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700',
                      ]"
                    >
                      <svg
                        v-if="isPermissionSelected(perm.id)"
                        class="w-2 h-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <span class="text-xs font-semibold">
                      {{ formatAction(perm.name) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 mt-6 sticky bottom-0 bg-white dark:bg-gray-900 pb-2"
      >
        <Button variant="secondary" @click="emit('close')" :disabled="saving">
          Cancel
        </Button>
        <Button type="submit" :loading="saving">
          {{ isEdit ? "Update Role" : "Create Role" }}
        </Button>
      </div>
    </template>
  </form>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>

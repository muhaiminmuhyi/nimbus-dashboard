import {computed, ref} from "vue";

export type User = {
  id: number,
  name: string,
  email: string,
  role: string,
  active: boolean
};

export function useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // pagination
  const page = ref(1);
  const pageSize = ref(10);

  const paginatedUsers = computed(() => {
    const start = (page.value - 1) * pageSize.value;
    return users.value.slice(start, start + pageSize.value);
  })

  const totalPages = computed(() => 
    Math.ceil(users.value.length / pageSize.value)
  );

  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      // Simulate API
      await new Promise((r) => setTimeout(r, 1200))
      users.value = Array.from({length: 15230}).map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@nimbus.app`,
        role: i % 2 === 0 ? 'Admin' : 'User',
        active: i % 3 !== 0,
      }))
    } catch (e) {
      error.value = 'Failed to load users'
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    page,
    pageSize,
    paginatedUsers,
    totalPages,
    fetchUsers,
  }
}
import { computed, ref } from "vue";

type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export type Billing = {
  id: number;
  number: string;
  client: string;
  amount: string;
  status: InvoiceStatus;
};

export function useBilling() {
  const billings = ref<Billing[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // pagination
  const page = ref(1);
  const pageSize = ref(10);

  const paginatedBillings = computed(() => {
    const start = (page.value - 1) * pageSize.value;
    return billings.value.slice(start, start + pageSize.value);
  })

  const totalPages = computed(() => 
    Math.ceil(billings.value.length / pageSize.value)
  );

  const fetchBillings = async () => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise((r) => setTimeout(r, 1200));
      billings.value = Array.from({ length: 5347 }).map((_, i) => ({
        id: i + 1,
        number: `INV-${1000 + i + 1}`,
        client: `Client ${i + 1}`,
        amount: `$${(Math.random() * 5000 + 100).toFixed(2)}`,
        status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Overdue",
      }));
    } catch {
      error.value = "Failed to load billings";
    } finally {
      loading.value = false;
    }
  }

  return {
    billings,
    loading,
    error,
    page,
    pageSize,
    paginatedBillings,
    totalPages,
    fetchBillings,
  }
}

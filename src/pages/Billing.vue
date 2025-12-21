<script setup lang="ts">
import AppLayout from "../layouts/AppLayout.vue";
import Button from "../components/ui/Button.vue";
import Badge from "../components/ui/Badge.vue";
import { useBilling } from "../features/billing/useBillings";
import { onMounted } from "vue";
import TableSkeleton from "../components/ui/TableSkeleton.vue";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

const {
  loading,
  error,
  page,
  paginatedBillings,
  totalPages,
  fetchBillings,
} = useBilling();

onMounted(() => {
  fetchBillings();
});

const statusTone = (status: InvoiceStatus) => {
  if (status === "Paid") return "success";
  if (status === "Pending") return "warning";
  return "error";
};
</script>

<template>
  <AppLayout title="Billing">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">Invoices</h2>
          <p class="text-sm" :style="{ color: 'rgb(var(--color-muted))' }">
            Manage client invoices and payments
          </p>
        </div>
        <Button>Create Invoice</Button>
      </div>

      <!-- Loading -->
      <TableSkeleton v-if="loading" />

      <!-- Error -->
      <div v-else-if="error" class="p-10 text-center text-red-600">
        {{ error }}
      </div>

      <!-- Invoice Table -->
      <div
        v-else
        class="rounded-lg shadow-sm overflow-hidden"
        :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
      >
        <!-- Table -->
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left">Invoice</th>
              <th class="px-6 py-3 text-left">Client</th>
              <th class="px-6 py-3 text-left">Amount</th>
              <th class="px-6 py-3 text-left">Status</th>
              <th class="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              tabindex="0"
              aria-label="Billing row"
              v-for="invoice in paginatedBillings"
              :key="invoice.id"
              class="border-t dark:border-t-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <td scope="row" class="px-6 py-3 font-medium">
                {{ invoice.number }}
              </td>
              <td class="px-6 py-3">
                {{ invoice.client }}
              </td>
              <td class="px-6 py-3">
                {{ invoice.amount }}
              </td>
              <td class="px-6 py-3">
                <Badge :tone="statusTone(invoice.status)">
                  {{ invoice.status }}
                </Badge>
              </td>
              <td class="px-6 py-3 text-right space-x-2">
                <Button size="sm" variant="secondary">View</Button>
                <Button size="sm" variant="secondary">Download</Button>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          class="flex items-center justify-between px-6 py-4 border-t text-sm"
          aria-label="Pagination"
        >
          <span> Page {{ page }} of {{ totalPages }} </span>

          <div class="space-x-2">
            <Button
              size="sm"
              variant="secondary"
              :disabled="page === 1"
              @click="page--"
              aria-label="Previous Page"
            >
              Prev
            </Button>

            <Button
              size="sm"
              variant="secondary"
              :disabled="page === totalPages"
              @click="page++"
              aria-label="Next Page"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

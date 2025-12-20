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

      <!-- Invoice Table -->
      <div
        class="rounded-lg shadow-sm overflow-hidden"
        :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
      >
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th class="px-6 py-3 text-left">Invoice</th>
              <th class="px-6 py-3 text-left">Client</th>
              <th class="px-6 py-3 text-left">Amount</th>
              <th class="px-6 py-3 text-left">Status</th>
              <th class="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="invoice in invoices"
              :key="invoice.id"
              class="border-t dark:border-t-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <td class="px-6 py-3 font-medium">
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
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'

const invoices: {
  id: number
  number: string
  client: string
  amount: string
  status: InvoiceStatus
}[] = [
  {
    id: 1,
    number: 'INV-001',
    client: 'Acme Corp',
    amount: '$1,200',
    status: 'Paid',
  },
  {
    id: 2,
    number: 'INV-002',
    client: 'Nimbus Ltd',
    amount: '$850',
    status: 'Pending',
  },
  {
    id: 3,
    number: 'INV-003',
    client: 'Skyline Inc',
    amount: '$2,400',
    status: 'Overdue',
  },
]

const statusTone = (status: InvoiceStatus) => {
  if (status === 'Paid') return 'success'
  if (status === 'Pending') return 'warning'
  return 'error'
}
</script>

<template>
  <base-card>
    <DataTable
      :paginator="true"
      :rows="10"
      :value="transactions"
      showGridlines
      responsiveLayout="scroll"
      :filterLocale="'tr'"
    >
      <template #empty><h4>No Transaction Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="payment_method" header="Payment Method" />
      <Column field="transaction_id" header="Transaction ID" />
      <Column field="product_id" header="Product ID" />
      <Column header="Action">
        <template #body="{ data }">
          <Button
            class="p-button-outlined"
            icon="pi pi-ellipsis-v"
            label="Details"
            @click="detail(data)"
          />
        </template>
      </Column>
    </DataTable>
  </base-card>
</template>

<script>
export default {
  props: ['transactions'],
  emits: ['showDetailTapped'],
  methods: {
    detail(transaction) {
      this.$emit('showDetailTapped', transaction)
    }
  }
}
</script>

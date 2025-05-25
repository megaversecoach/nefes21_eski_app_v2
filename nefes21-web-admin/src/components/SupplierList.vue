<template>
  <base-card>
    <DataTable :value="suppliers" responsiveLayout="scroll" showGridlines>
      <template #header>
        <h3>{{ title }}</h3>
      </template>
      <template #empty><h4>No Suppliers Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="supplier_id" header="Supplier ID" />
      <Column field="supplier_label" header="Supplier Label" />
    </DataTable>
  </base-card>
</template>
<script>
export default {
  props: ['suppliers', 'title']
}
</script>

<template>
  <base-card>
    <DataTable :value="products" responsiveLayout="scroll" showGridlines>
      <template #header>
        <h3>{{ title }}</h3>
      </template>
      <template #empty><h4>No Products Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="product_id" header="Product ID" />
      <Column field="product_type" header="Product Type" />
      <Column field="product_group" header="Product Type" />
      <Column field="product_label" header="Product Label" />
      <Column field="subscription_plan" header="Subscription Plan" />
      <Column field="subscription_duration" header="Subscription Duration" />
      <Column field="program_id" header="Program ID" />
      <Column field="program_title" header="Program Title" />
      <Column field="environment" header="Environment" />
    </DataTable>
  </base-card>
</template>
<script>
export default {
  props: ['products', 'title']
}
</script>

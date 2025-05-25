<template>
  <base-card>
    <DataTable :value="prepaidCodes" responsiveLayout="scroll" showGridlines>
      <template #header>
        <h3>{{ title }}</h3>
      </template>
      <template #empty><h4>No Prepaid Codes Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="code_id" header="Code ID" />
      <Column field="product_id" header="Product ID" />
      <Column field="code_isValid" header="Validation" />
      <Column field="code_isRedeemed" header="Code Redemption" />
      <Column
        headerStyle="width: 8rem; text-align: center;"
        header="Actions"
        bodyStyle="text-align: center;"
      >
        <template #body="{ data }">
          <Button
            class="p-button-outlined"
            icon="pi pi-ellipsis-v"
            label="Details"
            @click="edit(data)"
          />
        </template>
      </Column>
    </DataTable>
  </base-card>
</template>
<script>
export default {
  props: ['prepaidCodes', 'title'],
  methods: {
    edit(model) {
      this.$router.push({
        name: 'PrepaidCodeDetail',
        params: {
          state: 'edit',
          codeId: model.code_id
        }
      })
    }
  }
}
</script>

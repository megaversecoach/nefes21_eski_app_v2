<template>
  <base-card>
    <DataTable :value="promoCodes" responsiveLayout="scroll" showGridlines>
      <template #header>
        <h3>{{ title }}</h3>
      </template>
      <template #empty><h4>No Promo Codes Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="code_id" header="Code ID" />
      <Column field="supplier_id" header="Supplier ID" />
      <Column header="Expire Date">
        <template #body="{ data }">
          {{ convertToDate(data.expiration_date).toLocaleString('tr-TR') }}
        </template>
      </Column>
      <Column field="code_isValid" header="Validation" />
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
  props: ['promoCodes', 'title'],
  methods: {
    edit(model) {
      this.$router.push({
        name: 'PromoCodeDetail',
        params: {
          state: 'edit',
          codeId: model.code_id
        }
      })
    },
    convertToDate(epoch) {
      let date = new Date(0)
      date.setUTCMilliseconds(epoch)
      return date
    }
  }
}
</script>

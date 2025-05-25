<template>
  <base-card>
    <DataTable :value="user" showGridlines :filterLocale="'tr'">
      <template #header> </template>
      <template #empty><h4>No Users Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="uuid" header="UUID" />
      <Column field="email" header="E-Mail" />
      <Column field="name" header="Name" />
      <Column field="referal_code" header="Referral Code" />
      <Column header="Action">
        <template #body="{ data }">
          <Button
            class="p-button-outlined"
            icon="pi pi-ellipsis-v"
            label="Detail"
            @click="detail(data.uuid)"
          />
        </template>
      </Column>
    </DataTable>
  </base-card>
</template>

<script>
export default {
  props: ['user'],
  methods: {
    detail(userId) {
      this.$router.push({
        name: 'UserDetail',
        params: {
          userId: userId
        }
      })
    }
  }
}
</script>

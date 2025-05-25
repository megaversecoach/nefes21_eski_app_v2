<template>
  <base-card>
    <DataTable
      :paginator="true"
      :rows="4"
      :value="session_tokens"
      responsiveLayout="scroll"
      showGridlines
    >
      <template #empty><h4>No Session Token Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="platform" header="Platform" />
      <Column field="login_method" header="Login Method" />
      <Column field="device_model" header="Device Model" />
      <Column field="session_status" header="Session Status" />
      <Column header="Creation Date">
        <template #body="{ data }">
          <p>{{ convertToDate(data.dateCreated) }}</p>
        </template>
      </Column>

      <Column header="Action">
        <template #body="{ data }">
          <Button
            class="p-button-outlined"
            icon="pi pi-ellipsis-v"
            label="Details"
            @click="showDetail(data)"
          />
        </template>
      </Column>
    </DataTable>
  </base-card>
</template>

<script>
export default {
  props: ['session_tokens'],
  emits: ['showDetailTapped'],
  methods: {
    showDetail(data) {
      this.$emit('showDetailTapped', data.session_token)
    }
  }
}
</script>

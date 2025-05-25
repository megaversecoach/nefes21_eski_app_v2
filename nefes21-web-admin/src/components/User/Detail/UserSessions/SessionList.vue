<template>
  <base-card>
    <DataTable
      :paginator="true"
      :key="session_token"
      @page="pageChanged"
      :rows="10"
      :value="sessions"
      :totalRecords="totalItems"
      :lazy="true"
      responsiveLayout="scroll"
      showGridlines
    >
      <template #empty><h4>No Sessions Found</h4></template>
      <template #loading>Loading ...</template>
      <Column field="session_id" header="ID" />
      <Column field="os_version" header="OS Version" />
      <Column field="app_version" header="App Version" />
      <Column field="ip_address" header="IP Address" />
      <Column field="timezone" header="Timezone" />
      <Column header="Date Started">
        <template #body="{ data }">
          <p>{{ convertToDate(data.dateStarted) }}</p>
        </template>
      </Column>
      <Column header="Date Ended">
        <template #body="{ data }">
          <p>{{ convertToDate(data.dateEnded) }}</p>
        </template>
      </Column>
      <Column field="session_duration" header="Duration" />
    </DataTable>
  </base-card>
</template>

<script>
export default {
  props: ['sessions', 'session_token', 'totalItems'],
  emits: ['loadNewPage'],
  methods: {
    pageChanged(event) {
      const nextPageIndex = event.page + 1
      this.$emit('loadNewPage', nextPageIndex)
    }
  },
  mounted() {}
}
</script>

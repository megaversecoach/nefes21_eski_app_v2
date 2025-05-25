<template>
  <DataTable
    :paginator="true"
    :rows="10"
    :value="purchaseEvents"
    responsiveLayout="scroll"
    showGridlines
  >
    <template #empty><h4>No Purchase Event Found</h4></template>
    <template #loading>Loading ...</template>
    <Column field="payment_method" header="Payment Method" />
    <Column field="transaction_id" header="Transaction ID" />
    <Column header="Creation Date">
      <template #body="{ data }">
        <p>{{ convertToDate(data.dateCreated) }}</p>
      </template>
    </Column>
    <Column field="notification_type" header="Notification Type" />
    <Column field="event_type" header="Event type" />
    <Column field="event_label" header="Event Label" />
    <Column header="Event State">
      <template #body="{ data }">
        <span :class="'event-' + data.event_state">
          {{ data.event_state.toUpperCase() }}
        </span>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['userId'],
  computed: {
    ...mapGetters({
      purchaseEvents: 'users/purchaseEvents'
    })
  },
  methods: {
    ...mapActions({
      getPurchaseEvents: 'users/getPurchaseEvents',
      clearPurchaseEvents: 'users/clearPurchaseEvents'
    })
  },
  async created() {
    await this.getPurchaseEvents({
      userId: this.userId
    })
  },
  beforeUnmount() {
    this.clearPurchaseEvents()
  }
}
</script>

<style scoped>
.event-handled {
  color: green;
}
.event-unhandled {
  color: #074ea0;
}
.event-error {
  color: red;
}
.event-unexpected {
  color: #7e41d0;
}
</style>

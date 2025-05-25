<template>
  <div class="p-grid">
    <div class="p-col-6">
      <base-card>
        <h2><b>Subscription</b></h2>
        <info-card :options="subscriptionOptions"></info-card>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card>
        <h2><b>Enrolled Programs</b></h2>
        <DataTable
          :value="user.enrolled_programs"
          responsiveLayout="scroll"
          showGridlines
        >
          <template #empty><h4>No Enrolled Programs</h4></template>
          <template #loading>Loading ...</template>
          <Column field="program_id" header="Program ID" />
          <Column header="Enrollment Date">
            <template #body="{ data }">
              <p>{{ convertToDate(data.enrollment_date) }}</p>
            </template>
          </Column>
          <Column field="transaction_id" header="Transaction ID" />
        </DataTable>
      </base-card>
    </div>
    <div class="p-col-6">
      <base-card>
        <h2><b>Offer</b></h2>
        <info-card :options="offerOptions"></info-card>
      </base-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user'],
  computed: {
    subscriptionOptions() {
      return [
        {
          name: 'Payment Method',
          key: 'payment_method',
          value: this.user.subscriptions.payment_method
        },
        {
          name: 'Subscription State',
          key: 'subscription_state',
          value: this.user.subscriptions.subscription_state
        },
        {
          name: 'Subscription Plan',
          key: 'subscription_plan',
          value: this.user.subscriptions.subscription_plan
        },
        {
          name: 'Expiration Date',
          key: 'expiration_date_ms',
          value: this.user.subscriptions.expiration_date_ms
            ? this.convertToDate(this.user.subscriptions.expiration_date_ms)
            : '0'
        },
        {
          name: 'Auto Renewing',
          key: 'isAutoRenewing',
          value: this.user.subscriptions.isAutoRenewing
        },
        {
          name: 'Pending Product ID',
          key: 'pending_product_id',
          value: this.user.subscriptions.pending_product_id
            ? this.user.subscriptions.pending_product_id.split('.')[4]
            : ''
        },
        {
          name: 'Offline Mode',
          key: 'offlinemode_isEnabled',
          value: this.user.subscriptions.offlinemode_isEnabled
        },
        {
          name: 'Transaction ID',
          key: 'transaction_id',
          value: this.user.subscriptions.transaction_id
        }
      ]
    },

    offerOptions() {
      return [
        {
          name: 'Offer ID',
          key: 'offer',
          value: this.user.offer
        },
        {
          name: 'Expiration Date',
          key: 'offer_expiration_date',
          value: this.user.offer_expiration_date
        }
      ]
    }
  }
}
</script>

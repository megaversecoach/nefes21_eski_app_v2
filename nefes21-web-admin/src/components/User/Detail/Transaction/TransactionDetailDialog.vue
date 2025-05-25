<template>
  <Dialog :closable="false">
    <h3>Transaction Details</h3>
    <h4><b>Product ID</b></h4>
    <p>{{ transaction.product_id }}</p>
    <div style="margin-top: 30px; margin-right: 300px">
      <info-card :options="options"> </info-card>
    </div>
    <template #footer>
      <Button
        class="p-button-secondary"
        label="Close"
        @click="discard"
      ></Button>
    </template>
  </Dialog>
</template>

<script>
import InfoCard from '../../../UI/ InfoCard'
export default {
  components: { InfoCard },
  props: ['transaction'],
  emits: ['discard'],
  computed: {
    options() {
      return [
        {
          name: 'Payment Method',
          key: 'payment_method',
          value: this.transaction.payment_method
        },
        {
          name: 'Code ID',
          key: 'code_id',
          value: this.transaction.code_id
        },
        {
          name: 'Platform',
          key: 'platform',
          value: this.transaction.platform
        },
        {
          name: 'Bundle ID',
          key: 'bundle_id',
          value: this.transaction.bundle_id
        },
        {
          name: 'App Version',
          key: 'app_version',
          value: this.transaction.app_version
        },
        {
          name: 'Purchase Date',
          key: 'purchase_date',
          value: this.convert(this.transaction.purchase_date)
        },
        {
          name: 'Expiration Date',
          key: 'expiration_date',
          value: this.convert(this.transaction.expiration_date)
        },
        {
          name: 'Introductory Period',
          key: 'isIntroductoryPeriod',
          value: this.transaction.isIntroductoryPeriod
        },
        {
          name: 'Trial Period',
          key: 'isTrialPeriod',
          value: this.transaction.isTrialPeriod
        },
        {
          name: 'Environment',
          key: 'environment',
          value: this.transaction.environment
        },
        {
          name: 'Is Refunded',
          key: 'isRefunded',
          value: this.transaction.isRefunded
        },
        {
          name: 'Original Transaction ID',
          key: 'original_transaction_id',
          value: this.transaction.original_transaction_id
        },
        {
          name: 'Original UUID',
          key: 'original_uuid',
          value: this.transaction.original_uuid
        },
        {
          name: 'Original Purchase Date',
          key: 'original_purchase_date',
          value: this.convert(this.transaction.original_purchase_date)
        }
      ]
    }
  },
  methods: {
    convert(epoch) {
      return this.convertToDate(epoch)
    },
    discard() {
      this.$emit('discard')
    }
  }
}
</script>

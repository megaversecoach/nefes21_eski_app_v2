<template>
  <h3>Transactions</h3>
  <transaction-list
    :transactions="transactions"
    @showDetailTapped="showDetailTapped"
  >
  </transaction-list>
  <transaction-detail-dialog
    :visible="selected_transaction !== null"
    :transaction="selected_transaction"
    :modal="true"
    @discard="closeDetail"
  />
</template>

<script>
import { mapActions } from 'vuex'
import TransactionList from './TransactionList'
import TransactionDetailDialog from './TransactionDetailDialog'

export default {
  components: { TransactionDetailDialog, TransactionList },
  props: ['userId'],
  data() {
    return {
      transactions: null,
      selected_transaction: null
    }
  },
  methods: {
    ...mapActions({
      getTransaction: 'users/searchTransaction'
    }),
    closeDetail() {
      this.selected_transaction = null
    },
    showDetailTapped(transaction) {
      this.selected_transaction = transaction
    }
  },
  async created() {
    await this.getTransaction({
      type: 'uuid',
      value: this.userId
    }).then((transactions) => {
      this.transactions = transactions
    })
  }
}
</script>

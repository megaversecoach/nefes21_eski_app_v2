<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <span class="p-input-icon-left" style="width: 50%">
          <i class="pi pi-search" />
          <InputText
            v-model="searchText"
            placeholder="Search Transaction"
            style="width: 100%"
            type="text"
            @keyup.enter="search"
          />
        </span>
        <Button
          class="p-button-raised"
          icon="pi pi-search"
          label="Search"
          style="margin-left: 10px"
          @click="search"
        />
      </base-card>
      <transaction-list
        :transactions="transactions"
        @showDetailTapped="showDetailTapped"
      />
      <transaction-detail-dialog
        :visible="selected_transaction !== null"
        :modal="true"
        :transaction="selected_transaction"
        @discard="closeDetail"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TransactionList from '../../../components/User/Detail/Transaction/TransactionList'
import TransactionDetailDialog from '../../../components/User/Detail/Transaction/TransactionDetailDialog'

export default {
  components: { TransactionDetailDialog, TransactionList },
  data() {
    return {
      transactions: null,
      searchText: null,
      selected_transaction: null
    }
  },
  methods: {
    ...mapActions({
      searchTransaction: 'users/searchTransaction'
    }),
    closeDetail() {
      this.selected_transaction = null
    },
    showDetailTapped(transaction) {
      this.selected_transaction = transaction
    },
    async search() {
      let textCondition =
        this.searchText !== null &&
        this.searchText !== '' &&
        this.searchText !== undefined
      if (textCondition) {
        this.searchTransaction({
          type: 'transactionID',
          value: this.searchText
        }).then((transactions) => {
          this.transactions = transactions
        })
      }
    }
  }
}
</script>

<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Prepaid Code"
            @click="addPrepaidCodeRoute"
          />
        </div>
      </base-card>
      <prepaid-code-list
        :prepaid-codes="prepaidCodes"
        :title="'Prepaid Codes'"
      />
    </div>
  </div>
</template>
<script>
import PrepaidCodeList from '@/components/PrepaidCodeList'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { PrepaidCodeList },
  computed: {
    ...mapGetters({
      prepaidCodes: 'products/getPrepaidCodes'
    })
  },
  methods: {
    ...mapActions({
      getPrepaidCodes: 'products/getPrepaidCodes'
    }),

    addPrepaidCodeRoute() {
      this.$router.push({
        name: 'PrepaidCodeEdit',
        params: {
          state: 'new'
        }
      })
    }
  },
  created() {
    this.getPrepaidCodes()
  }
}
</script>

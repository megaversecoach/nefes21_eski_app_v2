<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Promo Code"
            @click="addPromoCodeRoute"
          />
        </div>
      </base-card>
      <promo-code-list :promo-codes="promoCodes" :title="'Promo Codes'" />
    </div>
  </div>
</template>
<script>
import PromoCodeList from '@/components/PromoCodeList'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { PromoCodeList },
  computed: {
    ...mapGetters({
      promoCodes: 'products/getPromoCodes'
    })
  },
  methods: {
    ...mapActions({
      getPromoCodes: 'products/getPromoCodes'
    }),
    addPromoCodeRoute() {
      this.$router.push({
        name: 'PromoCodeEdit',
        params: {
          state: 'new'
        }
      })
    }
  },
  created() {
    this.getPromoCodes()
  }
}
</script>

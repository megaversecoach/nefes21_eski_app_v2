<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Supplier"
            disabled
          />
        </div>
      </base-card>
      <supplier-list :suppliers="suppliers" :title="'Suppliers'" />
    </div>
  </div>
</template>
<script>
import SupplierList from '@/components/SupplierList'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { SupplierList },
  computed: {
    ...mapGetters({
      suppliers: 'products/getSuppliers'
    })
  },
  methods: {
    ...mapActions({
      getSuppliers: 'products/getSuppliers'
    })
  },
  created() {
    this.getSuppliers()
  }
}
</script>

<template>
  <div class="p-grid">
    <div class="p-col-12">
      <base-card>
        <div class="p-d-flex">
          <Button
            class="align-right"
            icon="pi pi-plus-circle"
            label="Add Product"
            disabled
          />
        </div>
      </base-card>
      <product-list :products="products" :title="'Products'" />
    </div>
  </div>
</template>
<script>
import ProductList from '@/components/ProductList'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { ProductList },
  computed: {
    ...mapGetters({
      products: 'products/getProducts'
    })
  },
  methods: {
    ...mapActions({
      getProducts: 'products/getProducts'
    })
  },
  created() {
    this.getProducts()
  }
}
</script>
